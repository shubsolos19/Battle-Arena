// OpenRouter free models — from duelai-models.md recommended pool
// Rate limit: 200 req/day, 20 req/min. All IDs have :free suffix.
export const OPENROUTER_MODELS = [
  { id: 'google/gemma-4-31b-it:free', name: 'Gemma 4 31B' },
  { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron Super 120B' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder' },
];

// HuggingFace Unified Router Models
// Uses the OpenAI-compatible endpoint router.huggingface.co/v1/chat/completions
export const HUGGINGFACE_MODELS = [
  { id: "meta-llama/Llama-3.1-8B-Instruct", name: "Llama 3.1 8B" },
  { id: "Qwen/Qwen2.5-7B-Instruct", name: "Qwen2.5 7B" },
  { id: "Qwen/Qwen2.5-Coder-7B-Instruct", name: "Qwen2.5 Coder" },
  { id: "google/gemma-2-9b-it", name: "Gemma 2 9B" }
];
