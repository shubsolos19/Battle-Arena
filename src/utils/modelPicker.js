import { OPENROUTER_MODELS, HUGGINGFACE_MODELS } from '../constants/models';
import { getAvailableProviders } from './storage';

const ALL_POOLS = {
  openrouter: OPENROUTER_MODELS,
  huggingface: HUGGINGFACE_MODELS,
};

/**
 * Pick a random item from an array.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Pick two distinct random items from an array.
 */
function pickTwoDistinct(arr) {
  const first = pickRandom(arr);
  const remaining = arr.filter((m) => m.id !== first.id);
  const second = remaining.length > 0 ? pickRandom(remaining) : first;
  return [first, second];
}

/**
 * Picks two random models for a battle.
 * - If 2 providers have keys → pick one model from each (cross-provider)
 * - If 1 provider has a key → pick two different models from that provider
 * Sides are randomly shuffled so users can't predict position.
 */
export function pickRandomModels(category) {
  const modelA = { ...pickRandom(ALL_POOLS.openrouter), provider: 'openrouter' };
  const modelB = { ...pickRandom(ALL_POOLS.huggingface), provider: 'huggingface' };

  return { modelA, modelB };
}
