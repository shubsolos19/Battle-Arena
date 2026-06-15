import { useMemo } from 'react';

/**
 * Strips markdown code fences from model output.
 * Handles ```html, ```svg, ```javascript, etc.
 */
function stripCodeFences(text) {
  if (!text) return '';
  // Remove opening fence: ```html, ```svg, ```css, ```js, ```javascript, etc.
  let cleaned = text.replace(/^```[\w-]*\s*\n?/gm, '');
  // Remove closing fence
  cleaned = cleaned.replace(/\n?```\s*$/gm, '');
  return cleaned.trim();
}

/**
 * Strips <think>...</think> blocks from model output (DeepSeek R1 etc.)
 */
function stripThinkBlocks(text) {
  if (!text) return '';
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function cleanOutput(text) {
  return stripCodeFences(stripThinkBlocks(text));
}

export default function OutputRenderer({ output, renderType, isLoading, error, modelName }) {
  const cleanedOutput = useMemo(() => cleanOutput(output), [output]);

  if (isLoading) {
    return (
      <div className="output-renderer loading-state">
        <div className="shimmer-container">
          <div className="shimmer-line shimmer-line-1"></div>
          <div className="shimmer-line shimmer-line-2"></div>
          <div className="shimmer-line shimmer-line-3"></div>
          <div className="shimmer-line shimmer-line-4"></div>
          <div className="shimmer-line shimmer-line-5"></div>
          <div className="shimmer-line shimmer-line-6"></div>
        </div>
        <p className="loading-text">
          <span className="loading-dot-container">
            <span className="loading-dot">⚡</span>
          </span>
          {modelName} is thinking...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="output-renderer error-state">
        <div className="error-icon">⚠️</div>
        <p className="error-title">Model failed to respond</p>
        <p className="error-message">{error}</p>
        <p className="error-hint">Try again with a different prompt</p>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="output-renderer empty-state">
        <p className="empty-text">Waiting for output...</p>
      </div>
    );
  }


  // SVG rendered directly
  if (renderType === 'svg') {
    return (
      <div className="output-renderer svg-container">
        <div
          className="svg-output"
          dangerouslySetInnerHTML={{ __html: cleanedOutput }}
        />
      </div>
    );
  }

  // Plain text / ASCII / TTS
  if (renderType === 'text') {
    return (
      <div className="output-renderer text-container">
        <pre className="text-output">{cleanedOutput}</pre>
      </div>
    );
  }

  return null;
}
