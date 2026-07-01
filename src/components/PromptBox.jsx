import { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants/categories';
import { Sparkles, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDER_LINES = [
  "Write a short creative story about an AI...",
  "Describe your vision or ask a complex question...",
  "Or write a savage but funny roast about your tech stack..."
];

const TypewriterLines = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentLine = PLACEHOLDER_LINES[lineIndex];

  return (
    <div className="absolute inset-0 pointer-events-none p-3 px-6 pt-[14px] flex items-start z-0 overflow-hidden">
      <div className="flex items-center whitespace-nowrap">
        <motion.div
          className="overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: isDeleting ? "0%" : "fit-content" }}
          transition={{
            duration: isDeleting ? 2 : 4.5, // Reduced speeds (longer duration), backspace still faster than typing
            ease: "linear"
          }}
          onAnimationComplete={() => {
            if (!isDeleting) {
              setTimeout(() => setIsDeleting(true), 2500); // Pause before deleting
            } else {
              setLineIndex((prev) => (prev + 1) % PLACEHOLDER_LINES.length);
              setTimeout(() => setIsDeleting(false), 300); // Pause before typing next
            }
          }}
        >
          <span className="text-slate-400/80 font-inter text-[1.1rem]">
            {currentLine}
          </span>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-5 bg-sky-400 ml-[2px]"
        />
      </div>
    </div>
  );
};

export default function PromptBox({ onSubmit, disabled }) {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]?.id || 'text');
  const [isFocused, setIsFocused] = useState(false);

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
        <div className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-sky-500 hover:border-sky-500 cursor-default">
          <Sparkles className="w-4 h-4 text-sky-400 group-hover:text-white transition-all duration-300 group-hover:animate-pulse group-hover:scale-125 group-hover:rotate-12" />
          <span className="text-sm font-medium text-sky-100/80 tracking-wide group-hover:text-white transition-colors duration-300">AI Models Ready for Battle</span>
        </div>
      </motion.div>

      <div className="glass-panel relative">
        <AnimatePresence>
          {!prompt && !isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <TypewriterLines />
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="prompt-textarea relative z-10 bg-transparent"
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
