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
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`HuggingFace API error (${response.status}): ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function callModel(provider, apiKey, modelId, systemPrompt, userPrompt) {
  if (provider === 'openrouter') {
    return callOpenRouter(apiKey, modelId, systemPrompt, userPrompt);
  }
  return callHuggingFace(apiKey, modelId, systemPrompt, userPrompt);
}
