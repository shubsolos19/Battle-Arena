import { useState, useCallback } from 'react';
import PromptBox from './components/PromptBox';
import KeyModal from './components/KeyModal';
import BattleView from './components/BattleView';
import { hasKeys, getKeys } from './utils/storage';
import { pickRandomModels } from './utils/modelPicker';
import { callModel } from './utils/api';

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
  const [renderType, setRenderType] = useState('iframe');
  const [winner, setWinner] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');

  // Pending submission (saved when keys need to be entered)
  const [pendingSubmit, setPendingSubmit] = useState(null);

  const startGeneration = useCallback(async (prompt, category) => {
    const keys = getKeys();
    const { modelA: pickedA, modelB: pickedB } = pickRandomModels();

    // Set up state
    setModelA(pickedA);
    setModelB(pickedB);
    setOutputA('');
    setOutputB('');
    setErrorA(null);
    setErrorB(null);
    setLoadingA(true);
    setLoadingB(true);
    setRenderType(category.renderType);
    setWinner(null);
    setCurrentPrompt(prompt);
    setPhase('battle');

    const systemPrompt = category.systemPrompt.replace('{prompt}', prompt);

    // Get the right key for each model
    const keyForModel = (model) =>
      model.provider === 'openrouter' ? keys.openRouterKey : keys.huggingFaceKey;

    // Fire both calls in parallel
    const callA = callModel(pickedA.provider, keyForModel(pickedA), pickedA.id, systemPrompt, prompt)
      .then((result) => {
        setOutputA(result);
        setLoadingA(false);
      })
      .catch((err) => {
        setErrorA(err.message || 'Unknown error');
        setLoadingA(false);
      });

    const callB = callModel(pickedB.provider, keyForModel(pickedB), pickedB.id, systemPrompt, prompt)
      .then((result) => {
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
  }, []);

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
          <h1 className="app-logo">
            <span className="logo-icon">⚔️</span>
            <span className="logo-text">DuelAI</span>
          </h1>
          {phase === 'landing' && (
            <p className="app-subtitle">Two models. One prompt. You decide.</p>
          )}
        </div>
        <button
          id="update-keys-btn"
          onClick={() => setShowKeyModal(true)}
          className="update-keys-btn"
          title="Update API Keys"
        >
          🔑 <span className="keys-btn-text">Keys</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {phase === 'landing' && (
          <div className="landing-container">
            <div className="landing-hero">
              <h2 className="hero-title">
                Pit two AI models against each other
              </h2>
              <p className="hero-desc">
                Type a prompt, pick a category, and watch two AI models compete.
                <br />
                You decide who wins.
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
          />
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
