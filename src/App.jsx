import { useState, useCallback } from 'react';
import PromptBox from './components/PromptBox';
import KeyModal from './components/KeyModal';
import BattleView from './components/BattleView';
import { hasKeys, getKeys } from './utils/storage';
import { pickRandomModels } from './utils/modelPicker';
import { callModel } from './utils/api';
import { OPENROUTER_MODELS, HUGGINGFACE_MODELS } from './constants/models';
import { supabase } from './utils/supabaseClient';
import Leaderboard from './components/Leaderboard';

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
  const [phase, setPhase] = useState('landing');
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
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1
            className="app-logo"
            onClick={handleTryAgain}
            style={{ cursor: 'pointer' }}
            title="Go to main page"
          >
            <span className="logo-icon">⚔️</span>
            <span className="logo-text">Modelfight</span>
          </h1>
          {phase === 'landing' && (
            <p className="app-subtitle"></p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhase('leaderboard')}
            className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            🏆 Leaderboard
          </button>
          <button
            id="update-keys-btn"
            onClick={() => setShowKeyModal(true)}
            className="update-keys-btn"
            title="Update API Keys"
          >
            🔑 <span className="keys-btn-text">Keys</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {phase === 'landing' && (
          <div className="landing-container">
            <div className="landing-hero">
              <h2 className="hero-title">
                The AI Arena
              </h2>
              <p className="hero-desc">
                Two models, One prompt
                <br />
                You decide
              </p>
            </div>
            <PromptBox onSubmit={handleSubmit} disabled={false} />
          </div>
        )}

        {phase === 'battle' && modelA && modelB && (
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
            onNewPrompt={handleSubmit}
          />
        )}

        {phase === 'leaderboard' && (
          <Leaderboard onBack={handleTryAgain} />
        )}
      </main>

      {/* Key Modal */}
      <KeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={handleKeysSaved}
      />

      {/* Footer glow */}
      <div className="glow-effect glow-top-left"></div>
      <div className="glow-effect glow-bottom-right"></div>
    </div>
  );
}
