// src/play/types.ts

export type Phase = 'betting' | 'player' | 'dealer' | 'settle';
export type HandOutcome = 'playerBust' | 'dealerBust' | 'playerWin' | 'dealerWin' | 'push';

export interface GameState {
  seed: string;
  rng: () => number;
  phase: Phase;
  bankroll: number;      // integer KniffBucks
  stake: number;         // integer, default 5
  T: number;             // current target cap
  k: number;             // cumulative HITs across this session
  playerDraws: number[];
  dealerDraws: number[];
  outcome?: HandOutcome;
  lastPayout?: number;   // signed integer delta to bankroll
  nextTPreview?: number; // computed at settle; used on next Deal
}

export type Action =
  | { type: 'init'; seed?: string }
  | { type: 'setStake'; value: number }
  | { type: 'deal' }
  | { type: 'hit' }
  | { type: 'stand' }
  | { type: 'dealerTick' }
  | { type: 'settle' }
  | { type: 'nextHand' }
  | { type: 'reload' };
