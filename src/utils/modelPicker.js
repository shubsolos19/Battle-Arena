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
export function pickRandomModels() {
  const available = getAvailableProviders();

  let model1, model2;

  if (available.length >= 2) {
    // Cross-provider battle: one from each
    const shuffled = available.sort(() => Math.random() - 0.5);
    const pool1 = ALL_POOLS[shuffled[0]];
    const pool2 = ALL_POOLS[shuffled[1]];

    model1 = { ...pickRandom(pool1), provider: shuffled[0] };
    model2 = { ...pickRandom(pool2), provider: shuffled[1] };
  } else {
    // Single-provider battle: two different models from the same pool
    const provider = available[0];
    const pool = ALL_POOLS[provider];
    const [m1, m2] = pickTwoDistinct(pool);

    model1 = { ...m1, provider };
    model2 = { ...m2, provider };
  }

  // Randomly assign sides
  const coinFlip = Math.random() > 0.5;
  return {
    modelA: coinFlip ? model1 : model2,
    modelB: coinFlip ? model2 : model1,
  };
}
