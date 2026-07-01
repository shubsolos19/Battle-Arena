import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PromptBox from './components/PromptBox';
import KeyModal from './components/KeyModal';
import VariableProximity from './components/VariableProximity';
import BattleView from './components/BattleView';
import { hasKeys, getKeys } from './utils/storage';
import { pickRandomModels } from './utils/modelPicker';
import { callModel } from './utils/api';
import { OPENROUTER_MODELS, HUGGINGFACE_MODELS } from './constants/models';
import { supabase } from './utils/supabaseClient';
import Leaderboard from './components/Leaderboard';
import { Swords, Trophy, Key } from 'lucide-react';
import ClickSpark from './components/ClickSpark';

async function generateWithModelFallback(initialModel, allModels, callFn, provider, apiKey, systemPrompt, userPrompt) {
  const otherModels = allModels.filter(m => m.id !== initialModel.id).sort(() => Math.random() - 0.5);
  const attempts = [initialModel, ...otherModels].slice(0, 3);
  
  for (const model of attempts) {
    try {
      const result = await callFn(provider, apiKey, model.id, systemPrompt, userPrompt);
      return { result, model: { ...model, provider } }; 
    } catch (err) {
      console.warn(`Model ${model.name || model.id} failed, trying fallback...`, err);
      await new Promise(r => setTimeout(r, 3000));
      continue; 
    }
  }
  throw new Error("All 3 models failed to respond.");
}

// States: landing | loading | battle | result
export default function App() {
  const [phase, setPhase] = useState(() => {
    return window.location.hash === '#leaderboard' ? 'leaderboard' : 'landing';
  });
  
  const containerRef = useRef(null);

  // Sync phase to URL hash
  useEffect(() => {
    if (phase === 'leaderboard') {
      window.location.hash = 'leaderboard';
    } else if (window.location.hash === '#leaderboard') {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [phase]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#leaderboard') {
        setPhase('leaderboard');
      } else if (window.location.hash === '' || window.location.hash === '#') {
        // If we are in battle, don't immediately kill it on hash change unless it's explicitly to landing.
        // Actually, easiest is just to go to landing if hash is empty and we were on leaderboard
        setPhase(prev => prev === 'leaderboard' ? 'landing' : prev);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Battle state
  const [modelA, setModelA] = useState(null);
  const [modelB, setModelB] = useState(null);
  const [outputA, setOutputA] = useState('');
  const [outputB, setOutputB] = useState('');
  const [errorA, setErrorA] = useState(null);
  const [errorB, setErrorB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [renderType, setRenderType] = useState('text');
  const [winner, setWinner] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentCategory, setCurrentCategory] = useState(null);

  // Pending submission (saved when keys need to be entered)
  const [pendingSubmit, setPendingSubmit] = useState(null);

  const startGeneration = useCallback(async (prompt, category) => {
    const keys = getKeys();
    const { modelA: pickedA, modelB: pickedB } = pickRandomModels(category.id);

    // Set up state
    setModelA(pickedA);
    setModelB(pickedB);
    setOutputA('');
    setOutputB('');
    setErrorA(null);
    setErrorB(null);
    setLoadingA(true);
    setLoadingB(true);
    setPhase('battle');
    setWinner(null);
    setCurrentPrompt(prompt);
    setCurrentCategory(category);
    setRenderType(category.renderType);

    const systemPrompt = category.systemPrompt.replace('{prompt}', prompt);

    // Get the right key for each model
    const keyForModel = (model) =>
      model.provider === 'openrouter' ? keys.openRouterKey : keys.huggingFaceKey;

    // Fire both calls in parallel
    const callA = generateWithModelFallback(pickedA, OPENROUTER_MODELS, callModel, pickedA.provider, keyForModel(pickedA), systemPrompt, prompt)
      .then(({ result, model }) => {
        setModelA(model);
        setOutputA(result);
        setLoadingA(false);
      })
      .catch((err) => {
        setErrorA(err.message || 'Unknown error');
        setLoadingA(false);
      });

    const callB = generateWithModelFallback(pickedB, HUGGINGFACE_MODELS, callModel, pickedB.provider, keyForModel(pickedB), systemPrompt, prompt)
      .then(({ result, model }) => {
        setModelB(model);
        setOutputB(result);
        setLoadingB(false);
      })
      .catch((err) => {
        setErrorB(err.message || 'Unknown error');
        setLoadingB(false);
      });

    await Promise.all([callA, callB]);
  }, []);

  const handleSubmit = useCallback((prompt, category) => {
    if (!hasKeys()) {
      setPendingSubmit({ prompt, category });
      setShowKeyModal(true);
      return;
    }
    startGeneration(prompt, category);
  }, [startGeneration]);

  const handleKeysSaved = useCallback(() => {
    setShowKeyModal(false);
    if (pendingSubmit) {
      startGeneration(pendingSubmit.prompt, pendingSubmit.category);
      setPendingSubmit(null);
    }
  }, [pendingSubmit, startGeneration]);

  const handleVote = useCallback((model) => {
    setWinner(model);
    
    // Asynchronously record vote to Supabase (fire-and-forget)
    if (modelA && modelB && currentCategory) {
      let voteResult;
      if (model.id === modelA.id) voteResult = 'a';
      else if (model.id === modelB.id) voteResult = 'b';
      else if (model.id === 'tie') voteResult = 'tie';
      else voteResult = 'both_bad';

      (async () => {
        try {
          const { error } = await supabase.from('votes').insert({
            category: currentCategory.id || currentCategory,
            model_a_id: modelA.id,
            model_a_provider: modelA.provider,
            model_b_id: modelB.id,
            model_b_provider: modelB.provider,
            winner: voteResult
          });
          if (error) console.error("Supabase insert error:", error);
        } catch (err) {
          console.error("Failed to record vote:", err);
        }
      })();
    }
  }, [modelA, modelB, currentCategory]);

  const handleTryAgain = useCallback(() => {
    setPhase('landing');
    setModelA(null);
    setModelB(null);
    setOutputA('');
    setOutputB('');
    setErrorA(null);
    setErrorB(null);
    setLoadingA(false);
    setLoadingB(false);
    setWinner(null);
    setCurrentPrompt('');
    setCurrentCategory(null);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showKeyModal) setShowKeyModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showKeyModal]);

  return (
    <div className="app">
      <ClickSpark sparkColor='#38bdf8' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        {/* Ambient background orbs */}
      <div className="ambient-orbs">
        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1
            className="app-logo"
            onClick={handleTryAgain}
            style={{ cursor: 'pointer' }}
            title="Go to main page"
          >
            <Swords className="w-6 h-6 text-sky-400" />
            <span className="logo-text">Modelfight</span>
          </h1>
        </div>
        <div className="header-nav">
          <button
            onClick={() => setPhase('leaderboard')}
            className="update-keys-btn"
            title="View Leaderboard"
          >
            <Trophy className="w-4 h-4" /> <span>Leaderboard</span>
          </button>
          <button
            id="update-keys-btn"
            onClick={() => setShowKeyModal(true)}
            className="update-keys-btn"
            title="Update API Keys"
          >
            <Key className="w-4 h-4" /> <span>Keys</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div
              key="landing"
              className="landing-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="landing-hero" ref={containerRef} style={{ position: 'relative' }}>
                <h2 className="hero-title">
                  {"Battle of the Titans".split(" ").map((word, index) => (
                    <motion.span
                      key={index}
                      className="hero-word"
                      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      style={{ display: 'inline-block', marginRight: '0.2em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h2>
                <div className="hero-desc flex justify-center w-full">
                  <VariableProximity
                    label={"Two elite AI models face off in real-time. Give them a prompt and decide which one reigns supreme."}
                    className={'variable-proximity-demo'}
                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                    toFontVariationSettings="'wght' 1000, 'opsz' 40"
                    containerRef={containerRef}
                    radius={80}
                    falloff='linear'
                  />
                </div>
              </div>
              <PromptBox onSubmit={handleSubmit} disabled={false} />
            </motion.div>
          )}

          {phase === 'battle' && modelA && modelB && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <BattleView
                modelA={modelA}
                modelB={modelB}
                outputA={outputA}
                outputB={outputB}
                errorA={errorA}
                errorB={errorB}
                loadingA={loadingA}
                loadingB={loadingB}
                renderType={renderType}
                onVote={handleVote}
                winner={winner}
                prompt={currentPrompt}
                onTryAgain={handleTryAgain}
              />
            </motion.div>
          )}

          {phase === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <Leaderboard onBack={handleTryAgain} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Key Modal */}
      <KeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={handleKeysSaved}
      />
      </ClickSpark>
    </div>
  );
}
