const OPENROUTER_KEY = 'openrouter_key';
const HUGGINGFACE_KEY = 'huggingface_key';

export function getKeys() {
  return {
    openRouterKey: localStorage.getItem(OPENROUTER_KEY) || '',
    huggingFaceKey: localStorage.getItem(HUGGINGFACE_KEY) || '',
  };
}

export function saveKeys(openRouterKey, huggingFaceKey) {
  localStorage.setItem(OPENROUTER_KEY, openRouterKey);
  localStorage.setItem(HUGGINGFACE_KEY, huggingFaceKey);
}

/**
 * Returns true if both keys are configured.
 * Both are required now that Model A is always OpenRouter and Model B is HuggingFace.
 */
export function hasKeys() {
  const { openRouterKey, huggingFaceKey } = getKeys();
  return openRouterKey.length > 0 && huggingFaceKey.length > 0;
}

/**
 * Returns the providers that have keys configured.
 */
export function getAvailableProviders() {
  const { openRouterKey, huggingFaceKey } = getKeys();
  const providers = [];
  if (openRouterKey) providers.push('openrouter');
  if (huggingFaceKey) providers.push('huggingface');
  return providers;
}
