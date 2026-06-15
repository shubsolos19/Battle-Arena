export async function callOpenRouter(apiKey, modelId, systemPrompt, userPrompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://duelai.vercel.app',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function callHuggingFace(apiKey, modelId, systemPrompt, userPrompt) {
  // HuggingFace Serverless Inference API
  // Uses the /models/{id} endpoint with { inputs } body format
  const url = `https://api-inference.huggingface.co/models/${modelId}`;

  // Combine system prompt and user prompt into a single input
  const fullPrompt = systemPrompt
    ? `${systemPrompt}\n\nUser: ${userPrompt}\nAssistant:`
    : userPrompt;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 1000,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Handle 503 cold-start errors with a friendlier message
    if (response.status === 503) {
      throw new Error('Model is loading (cold start). Please try again in 20-30 seconds.');
    }
    throw new Error(`HuggingFace API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // HF serverless returns an array: [{ generated_text: "..." }]
  if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
    return data[0].generated_text;
  }

  throw new Error('Unexpected HuggingFace response format');
}

export async function callModel(provider, apiKey, modelId, systemPrompt, userPrompt) {
  if (provider === 'openrouter') {
    return callOpenRouter(apiKey, modelId, systemPrompt, userPrompt);
  }
  return callHuggingFace(apiKey, modelId, systemPrompt, userPrompt);
}
