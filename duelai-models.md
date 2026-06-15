# DuelAI — Free AI Models List

## OpenRouter Free Models

> Rate limit: 200 req/day, 20 req/min. Append `:free` to all IDs.
> API base: `https://openrouter.ai/api/v1/chat/completions`

| Model Name | Model ID | Best For |
|---|---|---|
| Google Gemma 4 31B | `google/gemma-4-31b-it:free` | General, Vision |
| NVIDIA Nemotron 3 Super 120B | `nvidia/nemotron-3-super-120b-a12b:free` | General, large |
| OpenAI GPT-OSS 120B | `openai/gpt-oss-120b:free` | General |
| Qwen3 Coder | `qwen/qwen3-coder:free` | Code gen |
| OpenAI GPT-OSS 20B | `openai/gpt-oss-20b:free` | Fast + lightweight |
| NVIDIA Nemotron 3 Nano 30B | `nvidia/nemotron-3-nano-30b-a3b:free` | General |
| Meta Llama 3.3 70B | `meta-llama/llama-3.3-70b-instruct:free` | General |
| Nous Hermes 3 Llama 405B | `nousresearch/hermes-3-llama-3.1-405b:free` | General |
| Qwen3 Next 80B | `qwen/qwen3-next-80b-a3b-instruct:free` | General |
| DeepSeek R1 | `deepseek/deepseek-r1:free` | Reasoning |

---

## HuggingFace Serverless Inference (Free)

> Truly free. HF handles GPU. Rate limits vary by model load.
> API base: `https://api-inference.huggingface.co/models/{model_id}`
> Header: `Authorization: Bearer {HF_TOKEN}`

| Model Name | Model ID | Best For |
|---|---|---|
| Llama 3.1 8B Instruct | `meta-llama/Meta-Llama-3.1-8B-Instruct` | General, fast |
| Llama 3.2 11B Vision | `meta-llama/Llama-3.2-11B-Vision-Instruct` | Vision too |
| Llama 4 Scout | `meta-llama/Llama-4-Scout-17B-16E-Instruct` | Long context |
| Mistral 7B Instruct | `mistralai/Mistral-7B-Instruct-v0.3` | Fast general |
| Qwen2.5 7B Instruct | `Qwen/Qwen2.5-7B-Instruct` | Coding + general |
| Qwen2.5 Coder 7B | `Qwen/Qwen2.5-Coder-7B-Instruct` | Code |
| Phi-3.5 Mini Instruct | `microsoft/Phi-3.5-mini-instruct` | Lightweight |
| Gemma 2 9B | `google/gemma-2-9b-it` | General |

> ⚠️ Cold start warning: first request can take 10-30s. Handle 503 errors in code.

---

## Recommended Pool for Arena

Pick 1 random from each side per battle.

**OpenRouter side:**
- `google/gemma-4-31b-it:free`
- `openai/gpt-oss-120b:free`
- `meta-llama/llama-3.3-70b-instruct:free`
- `nvidia/nemotron-3-super-120b-a12b:free`
- `qwen/qwen3-coder:free`

**HuggingFace side:**
- `meta-llama/Meta-Llama-3.1-8B-Instruct`
- `Qwen/Qwen2.5-7B-Instruct`
- `mistralai/Mistral-7B-Instruct-v0.3`
- `google/gemma-2-9b-it`
- `microsoft/Phi-3.5-mini-instruct`

---

## API Call Examples

### OpenRouter
```js
const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://duelai.vercel.app"
  },
  body: JSON.stringify({
    model: "google/gemma-4-31b-it:free",
    messages: [{ role: "user", content: "your prompt" }],
    max_tokens: 4000
  })
});
const data = await res.json();
const output = data.choices[0].message.content;
```

### HuggingFace
```js
const res = await fetch(
  "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: "your prompt",
      parameters: { max_new_tokens: 1000 }
    })
  }
);
const data = await res.json();
const output = data[0].generated_text;
```
