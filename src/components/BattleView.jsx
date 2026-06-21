import OutputRenderer from './OutputRenderer';

const PROVIDER_LABELS = {
  openrouter: 'OpenRouter',
  huggingface: 'Hugging Face',
};

export default function BattleView({
  modelA,
  modelB,
  outputA,
  outputB,
  errorA,
  errorB,
  loadingA,
  loadingB,
  renderType,
  onVote,
  winner,
  prompt,
  onTryAgain,
}) {
  const bothDone = !loadingA && !loadingB;

  return (
    <div className="battle-view">
      {/* Battle Header */}
      <div className="battle-header">
        <div className="battle-title">
          <span className="battle-swords">⚔️</span>
          <span className="model-a-name">{modelA.name}</span>
          <span className="battle-vs">vs</span>
          <span className="model-b-name">{modelB.name}</span>
        </div>
        <p className="battle-prompt">"{prompt}"</p>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="winner-banner">
          <div className="winner-content">
            <span className="winner-trophy">🏆</span>
            <span className="winner-text">
              You picked <strong>{winner.name}</strong>!
            </span>
          </div>
          <button
            id="try-again-btn"
            onClick={onTryAgain}
            className="try-again-btn"
          >
            <span>↺</span> Try Again
          </button>
        </div>
      )}

      {/* Output Columns */}
      <div className="battle-columns">
        <div className={`battle-column column-a ${winner && winner.id === modelA.id ? 'winner-column' : ''} ${winner && winner.id !== modelA.id ? 'loser-column' : ''}`}>
          <div className="column-header">
            <span className="column-badge badge-a">A</span>
            <span className="column-model-name">{modelA.name}</span>
            <span className="provider-tag">{PROVIDER_LABELS[modelA.provider]}</span>
          </div>
          <div className="column-output">
            <OutputRenderer
              output={outputA}
              renderType={renderType}
              isLoading={loadingA}
              error={errorA}
              modelName={modelA.name}
            />
          </div>
        </div>

        <div className="battle-divider">
          <div className="divider-line"></div>
          <span className="divider-vs">VS</span>
          <div className="divider-line"></div>
        </div>

        <div className={`battle-column column-b ${winner && winner.id === modelB.id ? 'winner-column' : ''} ${winner && winner.id !== modelB.id ? 'loser-column' : ''}`}>
          <div className="column-header">
            <span className="column-badge badge-b">B</span>
            <span className="column-model-name">{modelB.name}</span>
            <span className="provider-tag">{PROVIDER_LABELS[modelB.provider]}</span>
          </div>
          <div className="column-output">
            <OutputRenderer
              output={outputB}
              renderType={renderType}
              isLoading={loadingB}
              error={errorB}
              modelName={modelB.name}
            />
          </div>
        </div>
      </div>

      {/* Vote Buttons */}
      {bothDone && !winner && (outputA || outputB) && (
        <div className="vote-section">
          <p className="vote-prompt">Which output is better?</p>
          <div className="vote-buttons">
            <button
              id="vote-a-btn"
              onClick={() => onVote(modelA)}
              className="vote-btn vote-btn-a"
              disabled={!outputA}
            >
              <span className="vote-arrow">👈</span>
              <span className="vote-name">{modelA.name}</span>
            </button>
            
            <button
              id="vote-tie-btn"
              onClick={() => onVote({ id: 'tie', name: 'Both are good' })}
              className="vote-btn vote-btn-tie"
              disabled={!outputA || !outputB}
            >
              <span className="vote-name">Both are good 🤝</span>
            </button>

            <button
              id="vote-neither-btn"
              onClick={() => onVote({ id: 'neither', name: 'Both are bad' })}
              className="vote-btn vote-btn-neither"
              disabled={!outputA || !outputB}
            >
              <span className="vote-name">Both are bad 👎</span>
            </button>

            <button
              id="vote-b-btn"
              onClick={() => onVote(modelB)}
              className="vote-btn vote-btn-b"
              disabled={!outputB}
            >
              <span className="vote-name">{modelB.name}</span>
              <span className="vote-arrow">👉</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
