import { useState, useEffect } from 'react';
import { getKeys, saveKeys } from '../utils/storage';
import { Key, Zap } from 'lucide-react';

export default function KeyModal({ isOpen, onClose, onSave }) {
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [huggingFaceKey, setHuggingFaceKey] = useState('');

  // Re-sync from localStorage every time the modal opens
  useEffect(() => {
    if (isOpen) {
      const existing = getKeys();
      setOpenRouterKey(existing.openRouterKey);
      setHuggingFaceKey(existing.huggingFaceKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filledCount = [openRouterKey.trim(), huggingFaceKey.trim()].filter(k => k.length > 0).length;

  const handleSave = () => {
    if (filledCount < 2) return;
    saveKeys(openRouterKey.trim(), huggingFaceKey.trim());
    onSave();
  };

  const canSave = filledCount === 2;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon"><Key className="w-10 h-10 text-sky-400 mx-auto" /></div>
          <h2 className="modal-title">API Keys</h2>
          <p className="modal-subtitle">
            Your keys are stored locally in your browser.
          </p>
          <p className="modal-hint">
            Both keys are required.
          </p>
        </div>

        <div className="modal-body">
          <div className="input-group">
            <label htmlFor="openrouter-key" className="input-label">
              <span className="label-dot openrouter-dot"></span>
              OpenRouter API Key
            </label>
            <input
              id="openrouter-key"
              type="password"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              placeholder="sk-or-..."
              className="key-input"
              autoComplete="off"
            />
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="key-link"
            >
              Get a free key →
            </a>
          </div>

          <div className="input-group">
            <label htmlFor="huggingface-key" className="input-label">
              <span className="label-dot huggingface-dot"></span>
              Hugging Face API Token
            </label>
            <div className="warning-box">
              <strong style={{ color: '#f59e0b' }}>Important:</strong> When creating your token, make sure to tick the option <strong style={{ color: '#f59e0b' }}>"Make calls to Inference Providers"</strong> so the key can work.
            </div>
            <input
              id="huggingface-key"
              type="password"
              value={huggingFaceKey}
              onChange={(e) => setHuggingFaceKey(e.target.value)}
              placeholder="hf_..."
              className="key-input"
              autoComplete="off"
            />
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="key-link"
            >
              Get a free token →
            </a>
          </div>
        </div>

        <div className="modal-footer">
          <button
            id="save-keys-btn"
            onClick={handleSave}
            disabled={!canSave}
            className="save-btn"
          >
            Save & Generate <Zap className="w-4 h-4 inline-block ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
