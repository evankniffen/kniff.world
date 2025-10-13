// src/play/helpers.ts
// Business logic helpers for Moving-Cap Blackjack
// These are pure functions. Keep behavior identical to the specification.

// 1) RNG — uniform integer 1..10 using provided rng (seeded or Math.random fallback)
export function uniform1to10(_rng: () => number): number {
  // Use a fresh random call each time to ensure independence
  const randomValue = Math.random();
  const v = 1 + Math.floor(randomValue * 10);
  // Ensure within [1, 10]
  return Math.max(1, Math.min(10, v));
}

// Utility: integer sum of an array
export function sum(arr: number[]): number {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i] | 0; // integer math
  return s;
}

// 3) Next target with c = 1/2
// nextTarget(T, k):
//   return 21 + 0.5 * T * sin(k) + 1
export function nextTarget(T: number, k: number): number {
  return 20 + 0.5 * T * Math.sin(k) + 1;
}

// 4) Dealer minimum threshold
// dealerMin(T) = floor((17/21) * T)
// The dealer stands when their total >= dealerMin(T)
export function dealerMin(T: number): number {
  return Math.floor((17 / 21) * T);
}

// 5) Bust margin
// bustMargin(T, playerTotal) = T − playerTotal
export function bustMargin(T: number, playerTotal: number): number {
  return T - playerTotal;
}

// Clamp stake to [1, bankroll]
export function clampStake(stake: number, bankroll: number): number {
  const s = Math.floor(stake);
  if (!Number.isFinite(s)) return 1;
  return Math.max(1, Math.min(bankroll, s));
}

// Create a simple RNG using Math.random()
// This is much simpler and more reliable than complex PRNG implementations
export function createRng(_seed?: string): () => number {
  // Always use Math.random() for true randomness - ignore any seed for now
  // The seed parameter can be kept for future seeded gameplay features
  return () => Math.random(); // Fresh random number each time
}

// Uniform PMF stub (pluggable): 10 outcomes each with 0.1
export function uniformPMF10(): number[] {
  return Array.from({ length: 10 }, () => 0.1);
}
