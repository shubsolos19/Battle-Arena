import OutputRenderer from './OutputRenderer';
import { Swords, Trophy, RefreshCw, ArrowLeft, Handshake, ThumbsDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
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

  const handleVote = (model) => {
    if (model.id !== 'tie' && model.id !== 'neither') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#c084fc', '#f472b6', '#ffffff'],
        ticks: 200,
      });
    }
    onVote(model);
  };

  return (
    <div className="battle-view">
      {/* Battle Header */}
      <div className="battle-header">
        <div className="battle-title">
          <span className="battle-swords"><Swords className="w-6 h-6 text-sky-400 inline-block" /></span>
          <span className="model-a-name">{winner ? modelA.name : 'Model A'}</span>
          <span className="battle-vs">vs</span>
          <span className="model-b-name">{winner ? modelB.name : 'Model B'}</span>
        </div>
        <p className="battle-prompt">"{prompt}"</p>
      </div>

      {/* Winner Banner */}
      <AnimatePresence>
        {winner && (
          <motion.div 
            className="winner-banner"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
          >
            <div className="winner-content">
              <span className="winner-trophy"><Trophy className="w-6 h-6 text-yellow-400 inline-block" /></span>
              <span className="winner-text">
                You picked <strong>{winner.name}</strong>!
              </span>
            </div>
            <button
              id="try-again-btn"
              onClick={onTryAgain}
              className="try-again-btn"
            >
              <span className="inline-flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Try Again</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Columns */}
      <div className="battle-columns">
        <motion.div 
          className={`battle-column column-a ${winner && winner.id === modelA.id ? 'winner-column' : ''} ${winner && winner.id !== modelA.id ? 'loser-column' : ''}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.3 }}
        >
          <div className="column-header">
            <span className="column-badge badge-a">A</span>
            <span className="column-model-name">{winner ? modelA.name : 'Model A'}</span>
            <span className="provider-tag">{winner ? PROVIDER_LABELS[modelA.provider] : '???'}</span>
          </div>
          <div className="column-output">
            <OutputRenderer
              output={outputA}
              renderType={renderType}
              isLoading={loadingA}
              error={errorA}
              modelName={winner ? modelA.name : 'Model A'}
            />
          </div>
        </motion.div>

        <div className="battle-divider">
          <div className="divider-line"></div>
          <span className="divider-vs">VS</span>
          <div className="divider-line"></div>
        </div>

        <motion.div 
          className={`battle-column column-b ${winner && winner.id === modelB.id ? 'winner-column' : ''} ${winner && winner.id !== modelB.id ? 'loser-column' : ''}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', bounce: 0.3 }}
        >
          <div className="column-header">
            <span className="column-badge badge-b">B</span>
            <span className="column-model-name">{winner ? modelB.name : 'Model B'}</span>
            <span className="provider-tag">{winner ? PROVIDER_LABELS[modelB.provider] : '???'}</span>
          </div>
          <div className="column-output">
            <OutputRenderer
              output={outputB}
              renderType={renderType}
              isLoading={loadingB}
              error={errorB}
              modelName={winner ? modelB.name : 'Model B'}
            />
          </div>
        </motion.div>
      </div>

      {/* Vote Buttons */}
      {bothDone && !winner && (outputA || outputB) && (
        <div className="vote-section">
          <p className="vote-prompt">Which output is better?</p>
          <div className="vote-buttons">
            <motion.button
              id="vote-a-btn"
              onClick={() => handleVote(modelA)}
              className="vote-btn vote-btn-a"
              disabled={!outputA}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="vote-arrow"><ArrowLeft className="w-4 h-4" /></span>
              <span className="vote-name">Model A</span>
            </motion.button>
            
            <motion.button
              id="vote-tie-btn"
              onClick={() => handleVote({ id: 'tie', name: 'Both are good' })}
              className="vote-btn vote-btn-tie"
              disabled={!outputA || !outputB}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="vote-name flex items-center justify-center gap-2">Both are good <Handshake className="w-4 h-4" /></span>
            </motion.button>

            <motion.button
              id="vote-neither-btn"
              onClick={() => handleVote({ id: 'neither', name: 'Both are bad' })}
              className="vote-btn vote-btn-neither"
              disabled={!outputA || !outputB}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="vote-name flex items-center justify-center gap-2">Both are bad <ThumbsDown className="w-4 h-4" /></span>
            </motion.button>

            <motion.button
              id="vote-b-btn"
              onClick={() => handleVote(modelB)}
              className="vote-btn vote-btn-b"
              disabled={!outputB}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="vote-name">Model B</span>
              <span className="vote-arrow"><ArrowRight className="w-4 h-4" /></span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
