import { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants/categories';
import { Sparkles, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const PLACEHOLDERS = [
  "Describe your vision, ask a complex question, or challenge the models...",
  "Write a savage but funny roast about your favorite tech stack...",
  "Write a short creative story about an AI taking over the world...",
  "Write a beautiful poem about the ocean and stars...",
  "Explain quantum computing like I am 5 years old..."
];

export default function PromptBox({ onSubmit, disabled }) {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]?.id || 'text');
  const [isFocused, setIsFocused] = useState(false);
  
  const [placeholderText, setPlaceholderText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentPhrase = PLACEHOLDERS[phraseIndex];
    
    if (isDeleting) {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPhrase.substring(0, placeholderText.length - 1));
        }, 20); // Fast backspace
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        timeout = setTimeout(() => {}, 300);
      }
    } else {
      if (placeholderText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPhrase.substring(0, placeholderText.length + 1));
        }, 60); // Typing speed
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500); // Pause before delete
      }
    }
    
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, phraseIndex]);

  const handleSubmit = () => {
    if (!prompt.trim() || disabled) return;
    const category = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
    onSubmit(prompt.trim(), category);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="prompt-container">
      {/* Greeting or sub-text above the box */}
      <motion.div 
        className="flex justify-center mb-6"
        animate={{ opacity: isFocused ? 0.3 : 1, y: isFocused ? -5 : 0 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium text-sky-100/80 tracking-wide">AI Models Ready for Battle</span>
        </div>
      </motion.div>

      <div className="glass-panel">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholderText}
          disabled={disabled}
          className="prompt-textarea"
        />

        <div className="prompt-actions">
          <div className="prompt-controls">
            <button type="button" className="glass-btn" title="AI Assistant">
              <Activity className="w-5 h-5 text-sky-300" />
            </button>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={disabled}
              className="glass-select outline-none appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white p-2">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || disabled}
            className="submit-btn"
            title="Start Battle"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
