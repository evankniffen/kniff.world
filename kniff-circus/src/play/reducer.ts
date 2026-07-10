// src/play/reducer.ts
import type { Action, GameState, HandOutcome } from './types';
import { clampStake, createRng, dealerMin, nextTarget, sum, uniform1to10 } from './helpers';

const DEFAULT_BANKROLL = 100;
const DEFAULT_STAKE = 5;
const DEFAULT_T = 21;

function generateRandomSeed(): string {
  // Use crypto.getRandomValues if available (browsers)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('00000000' + dec.toString(36)).substr(-8)).join('');
  }
  // Fallback for environments without crypto
  return `seed-${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}`;
}

export function createInitialState(seed?: string): GameState {
  const url = new URL(window.location.href);
  const qsSeed = url.searchParams.get('seed');
  // Use provided seed, then query param seed, or generate a new random seed
  const finalSeed = seed ?? qsSeed ?? generateRandomSeed();
  const rng = createRng(finalSeed);
  return {
    seed: finalSeed,
    rng,
    phase: 'betting',
    bankroll: DEFAULT_BANKROLL,
    stake: DEFAULT_STAKE,
    T: DEFAULT_T,
    k: 0,
    playerDraws: [],
    dealerDraws: [],
    dealerVisible: [],
    outcome: undefined,
    lastPayout: 0,
    nextTPreview: undefined,
  };
}

function computeOutcome(T: number, playerTotal: number, dealerTotal: number): HandOutcome {
  if (playerTotal > T) return 'playerBust';
  if (dealerTotal > T) return 'dealerBust';
  if (playerTotal > dealerTotal) return 'playerWin';
  if (playerTotal < dealerTotal) return 'dealerWin';
  return 'push';
}

// Integer payout calculation with exact-target bonus handled via integer math only.
// Base: win +stake, loss -stake, push 0.
// Bonus: if player total equals T and outcome is not a loss, add floor(0.5 * stake).
// Note: For odd stakes, half stake rounds down to keep integer-only math as required.
function computePayoutInt(stake: number, outcome: HandOutcome, playerHitExactT: boolean): number {
  let base = 0;
  if (outcome === 'dealerBust' || outcome === 'playerWin') base = stake;
  else if (outcome === 'dealerWin' || outcome === 'playerBust') base = -stake;
  else base = 0; // push
  const bonus = playerHitExactT && outcome !== 'playerBust' && outcome !== 'dealerWin' ? Math.floor(stake / 2) : 0;
  return base + bonus; // integer
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'init': {
      return createInitialState(action.seed);
    }
    case 'setStake': {
      if (state.phase !== 'betting') return state;
      return { ...state, stake: clampStake(action.value, state.bankroll) };
    }
    case 'deal': {
      if (state.phase !== 'betting') return state;
      if (state.bankroll <= 0) return state;
      const nextT = state.nextTPreview ?? state.T;
      // Deal two initial cards to the player (do not increment k; k tracks explicit HIT actions only)
      const c1 = uniform1to10(state.rng);
      const c2 = uniform1to10(state.rng);
      const initialDraws = [c1, c2];
      const initialTotal = sum(initialDraws);
      if (initialTotal > nextT) {
        // Immediate bust on deal - still deal dealer cards so player can see them
        const dealerCard1 = uniform1to10(state.rng);
        const dealerCard2 = uniform1to10(state.rng);
        const outcome = 'playerBust';
        const payout = computePayoutInt(state.stake, outcome, false);
        return {
          ...state,
          T: nextT,
          phase: 'betting',
          playerDraws: initialDraws,
          dealerDraws: [dealerCard1, dealerCard2],
          dealerVisible: [true, true], // Both cards visible since hand is over
          outcome,
          lastPayout: payout,
          bankroll: state.bankroll + payout,
          nextTPreview: nextTarget(nextT, state.k),
          stake: clampStake(state.stake, state.bankroll + payout),
        };
      }
      // Deal two cards to dealer: first is hole card (hidden), second is visible
      const dealerCard1 = uniform1to10(state.rng);
      const dealerCard2 = uniform1to10(state.rng);
      return {
        ...state,
        T: nextT,
        phase: 'player',
        playerDraws: initialDraws,
        dealerDraws: [dealerCard1, dealerCard2],
        dealerVisible: [false, true], // First card hidden (hole card), second visible
        outcome: undefined,
        lastPayout: 0,
        nextTPreview: undefined,
        stake: clampStake(state.stake, state.bankroll),
      };
    }
    case 'hit': {
      if (state.phase !== 'player') return state;
      const x = uniform1to10(state.rng);
      const playerDraws = [...state.playerDraws, x];
      const playerTotal = sum(playerDraws);
      const k = state.k + 1; // cumulative hits increases on every HIT
      if (playerTotal > state.T) {
        const outcome = 'playerBust';
        const payout = computePayoutInt(state.stake, outcome, false);
        return {
          ...state,
          k,
          playerDraws,
          dealerVisible: state.dealerDraws.map(() => true), // Reveal all dealer cards on player bust
          outcome,
          lastPayout: payout,
          bankroll: state.bankroll + payout,
          nextTPreview: nextTarget(state.T, k),
          phase: 'betting',
        };
      }
      return { ...state, k, playerDraws };
    }
    case 'stand': {
      if (state.phase !== 'player') return state;
      // Start dealer phase - dealer already has cards from deal, just change phase
      return { ...state, phase: 'dealer' };
    }
    case 'dealerTick': {
      if (state.phase !== 'dealer') return state;

      // If hole card is still hidden, reveal it first
      if (state.dealerDraws.length > 0 && !state.dealerVisible[0]) {
        const dealerVisible = [...state.dealerVisible];
        dealerVisible[0] = true; // Reveal the hole card
        return { ...state, dealerVisible };
      }

      const d = uniform1to10(state.rng);
      const dealerDraws = [...state.dealerDraws, d];
      const dealerVisible = [...state.dealerVisible, true]; // New cards are always visible
      const dealerTotal = sum(dealerDraws);
      const playerTotal = sum(state.playerDraws);
      const threshold = dealerMin(state.T);
      // If dealer busts or reaches threshold, settle
      if (dealerTotal > state.T || dealerTotal >= threshold) {
        const outcome = computeOutcome(state.T, playerTotal, dealerTotal);
        const payout = computePayoutInt(state.stake, outcome, playerTotal === state.T);
        return { 
          ...state, 
          dealerDraws,
          dealerVisible,
          outcome, 
          lastPayout: payout,
          bankroll: state.bankroll + payout,
          nextTPreview: nextTarget(state.T, state.k),
          phase: 'betting' 
        };
      }
      return { ...state, dealerDraws, dealerVisible };
    }
    case 'settle': {
      if (state.phase !== 'settle') return state;
      const playerTotal = sum(state.playerDraws);
      const dealerTotal = sum(state.dealerDraws);
      const outcome = state.outcome ?? computeOutcome(state.T, playerTotal, dealerTotal);
      const payout = computePayoutInt(state.stake, outcome, playerTotal === state.T);
      const bankroll = state.bankroll + payout;
      const nextTPreview = nextTarget(state.T, state.k);
      return {
        ...state,
        bankroll,
        lastPayout: payout,
        nextTPreview,
        phase: 'betting',
      };
    }
    case 'nextHand': {
      if (state.phase !== 'betting' || state.bankroll <= 0) return state;
      
      // Get the next target (use the preview if available)
      const nextT = state.nextTPreview ?? state.T;
      
      // Deal two initial cards to the player
      const c1 = uniform1to10(state.rng);
      const c2 = uniform1to10(state.rng);
      const initialDraws = [c1, c2];
      const initialTotal = sum(initialDraws);
      
      if (initialTotal > nextT) {
        const outcome = 'playerBust';
        const payout = computePayoutInt(state.stake, outcome, false);
        // Deal dealer cards even on immediate bust so player can see them
        const dealerCard1 = uniform1to10(state.rng);
        const dealerCard2 = uniform1to10(state.rng);
        return {
          ...state,
          T: nextT,
          phase: 'betting',
          playerDraws: initialDraws,
          dealerDraws: [dealerCard1, dealerCard2],
          dealerVisible: [true, true], // Both cards visible since hand is over
          outcome,
          lastPayout: payout,
          bankroll: state.bankroll + payout,
          nextTPreview: nextTarget(nextT, state.k),
          stake: clampStake(state.stake, state.bankroll + payout),
        };
      }
      
      // Deal two cards to dealer: first is hole card (hidden), second is visible
      const dealerCard1 = uniform1to10(state.rng);
      const dealerCard2 = uniform1to10(state.rng);
      
      // No immediate bust, start player's turn
      return {
        ...state,
        T: nextT,
        phase: 'player',
        playerDraws: initialDraws,
        dealerDraws: [dealerCard1, dealerCard2],
        dealerVisible: [false, true], // First card hidden (hole card), second visible
        outcome: undefined,
        lastPayout: undefined,
        nextTPreview: undefined,
        stake: clampStake(state.stake, state.bankroll),
      };
    }
    case 'reload': {
      return createInitialState(state.seed || undefined);
    }
    default:
      return state;
  }
}
