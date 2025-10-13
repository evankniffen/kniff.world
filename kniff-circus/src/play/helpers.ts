// src/play/helpers.ts
// Business logic helpers for Moving-Cap Blackjack
// These are pure functions. Keep behavior identical to the specification.

// 1) RNG — uniform integer 1..10 using provided rng (seeded or Math.random fallback)
export function uniform1to10(rng: () => number): number {
  const v = 1 + Math.floor(rng() * 10);
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

// Create a high-quality seeded RNG
// Uses xoshiro128** algorithm for better randomness
export function createRng(seed?: string): () => number {
  // Generate a high-entropy seed if none provided
  if (!seed) {
    const entropy = [
      typeof performance !== 'undefined' ? performance.now() : Date.now(),
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000
    ];
    seed = entropy.map(n => Math.floor(n).toString(36)).join('');
  }

  // Use a high-quality hash function (sdbm)
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = char + (hash << 6) + (hash << 16) - hash;
    hash = hash & 0xFFFFFFFF; // Convert to 32-bit integer
  }

  // Initialize xoshiro128** state using the hash
  // We'll use a simple hash to derive 4 32-bit state values
  let s0 = hash = (hash + 0x9E3779B9) | 0;
  let s1 = hash = (hash + 0x9E3779B9) | 0;
  let s2 = hash = (hash + 0x9E3779B9) | 0;
  let s3 = hash = (hash + 0x9E3779B9) | 0;

  // Mix the state a bit
  for (let i = 0; i < 20; i++) {
    const t = s1 << 9;
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = (s3 << 11) | (s3 >>> 21);
  }

  // xoshiro128** PRNG
  return function() {
    const result = Math.imul((s1 * 5) >>> 0, 0x27D4EB2D) >>> 0;
    const t = s1 << 9;
    
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = (s3 << 11) | (s3 >>> 21);
    
    return result / 0x100000000; // Convert to [0, 1)
  };
}

// Uniform PMF stub (pluggable): 10 outcomes each with 0.1
export function uniformPMF10(): number[] {
  return Array.from({ length: 10 }, () => 0.1);
}
