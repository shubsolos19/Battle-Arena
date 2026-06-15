import { useState } from 'react';
import { CATEGORIES } from '../constants/categories';

export default function PromptBox({ onSubmit, disabled }) {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);

  const handleSubmit = () => {
    if (!prompt.trim() || disabled) return;
    const category = CATEGORIES.find((c) => c.id === selectedCategory);
    onSubmit(prompt.trim(), category);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="prompt-box">
      <div className="textarea-wrapper">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to create..."
          rows={4}
          disabled={disabled}
          className="prompt-textarea"
        />
        <button
          id="submit-button"
          onClick={handleSubmit}
          disabled={!prompt.trim() || disabled}
          className="submit-btn"
          aria-label="Generate"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <div className="category-pills-container">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              disabled={disabled}
            >
              <span className="pill-emoji">{cat.emoji}</span>
              <span className="pill-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
