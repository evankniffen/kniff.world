// src/play/PlayPage.tsx
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { reducer, createInitialState } from './reducer';
import { sum, nextTarget } from './helpers';
import { FiRefreshCcw, FiHelpCircle } from 'react-icons/fi';

// Minimalist dark theme palette
const colors = {
  bg: '#0b0f0b',
  panel: 'rgba(10, 20, 10, 0.6)',
  border: 'rgba(0, 255, 128, 0.2)',
  text: '#e6ffe6',
  subtext: 'rgba(230, 255, 230, 0.7)',
  safe: '#14b8a6', // teal
  danger: '#f59e0b', // orange
  accent: '#22c55e', // green
  accentDim: 'rgba(34, 197, 94, 0.3)'
};

const winPulse = keyframes`
  0% { background-color: rgba(34, 197, 94, 0.1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { background-color: rgba(34, 197, 94, 0.2); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.2); }
  100% { background-color: rgba(34, 197, 94, 0.1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
`;

const lossPulse = keyframes`
  0% { background-color: rgba(239, 68, 68, 0.1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { background-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.2); }
  100% { background-color: rgba(239, 68, 68, 0.1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Page = styled.div`
  width: 100%;
  height: 100vh;
  background: ${colors.bg};
  color: ${colors.text};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(0deg, rgba(0,0,0,0), rgba(0,0,0,0.35));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid ${colors.border};
`;

const Brand = styled.a`
  justify-self: start;
  color: ${colors.text};
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  &:hover { text-shadow: 0 0 6px rgba(34,197,94,0.4); }
`;

const Chip = styled.div<{ $pulse?: boolean; $shouldPop?: boolean }>`
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: ${colors.text};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  /* Removed the pulse animation to prevent glowing during results */
  ${p => p.$shouldPop && css`animation: ${pop} 0.3s ease;`}
`;

const RightInfo = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-variant-numeric: tabular-nums;
`;

const Main = styled.main`
  flex: 1;
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: ${colors.border} transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.border};
    border-radius: 3px;
  }
`;

const Panel = styled.section`
  background: ${colors.panel};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  padding: 0.75rem;
`;

const TotalsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Row = styled.div<{ $isWinner?: boolean; $isLoser?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    margin: -0.5rem;
    ${p => p.$isWinner && css`
      animation: ${winPulse} 1s ease 0.5s 3;
    `}
    ${p => p.$isLoser && css`
      animation: ${lossPulse} 1s ease 0.5s 3;
    `}
  }
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.subtext};
  
  @media (min-width: 769px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const Draws = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const DrawChip = styled.div`
  min-width: 32px;
  height: 32px;
  padding: 0 0.4rem;
  border-radius: 6px;
  border: 1px solid ${colors.border};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  animation: ${pop} 180ms ease;
  font-variant-numeric: tabular-nums;
`;

const SumBadge = styled.div`
  padding: 0.25rem 0.6rem;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  
  @media (max-width: 768px) {
    margin-left: auto;
    font-size: 0.95em;
    padding: 0.2rem 0.5rem;
  }
`;

// MiddleGrid removed as it's not used

const GraphContainer = styled.div`
  height: 200px;
  position: relative;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const GraphTitle = styled.div`
  color: ${colors.subtext};
  margin-bottom: 0.5rem;
`;

const Graph = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
`;

const GraphLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: ${colors.border};
  
  &:nth-child(1) { top: 25%; }
  &:nth-child(2) { top: 50%; }
  &:nth-child(3) { top: 75%; }
`;

const GraphPath = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr auto;
  gap: 0.5rem;
  align-items: end;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  color: ${colors.subtext};
  font-size: 0.9rem;
`;

const StakeInputRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.35rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  appearance: none;
  border: 1px solid ${colors.border};
  background: ${p => (p.$primary ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)')};
  color: ${colors.text};
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  transition: background 120ms ease, transform 60ms ease;
  &:hover { background: ${p => (p.$primary ? 'rgba(34,197,94,0.28)' : 'rgba(255,255,255,0.1)')}; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: 1px solid ${colors.border};
  background: rgba(0,0,0,0.35);
  color: ${colors.text};
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  min-height: 44px;
`;

const Banner = styled.div<{ $win?: boolean; $loss?: boolean }>`
  padding: 1.25rem 1.5rem;
  border: 1px solid ${p => (p.$win ? 'rgba(34,197,94,0.3)' : p.$loss ? 'rgba(239,68,68,0.3)' : colors.border)};
  border-radius: 12px;
  background: ${p => (p.$win ? 'rgba(34,197,94,0.08)' : p.$loss ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)')};
  color: ${p => (p.$win ? '#d1fae5' : p.$loss ? '#fee2e2' : colors.text)};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const BannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
`;

const HandSummary = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  text-align: center;
  margin: 0.5rem 0;
`;

const HandTotal = styled.div<{ $highlight?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${p => p.$highlight ? colors.accent : 'inherit'};
`;

const BannerFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${colors.border};
`;

const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 90;
`;
const ModalBody = styled.div`
  width: min(860px, calc(100% - 2rem));
  max-height: 85vh; overflow: auto;
  background: ${colors.panel};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  padding: 1rem;
`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.75);
  z-index: 100;
`;

// Generate SVG path for T_{n+1} visualization
// Shows 2 full periods (4π) of the target function, with the current k at 75% of the viewport
function generatePath(currentT: number, height: number, currentK: number, viewportWidth: number = 400): string {
  const points: Array<[number, number]> = [];
  const viewportStart = currentK - 3 * Math.PI; // Show 1.5 periods before current k
  
  // Calculate min/max values for scaling
  let minY = Infinity;
  let maxY = -Infinity;
  const samplePoints: number[] = [];
  
  // First pass: find min/max for scaling
  for (let x = 0; x <= viewportWidth; x++) {
    const k = viewportStart + (x / viewportWidth) * (4 * Math.PI);
    const value = nextTarget(currentT, k);
    samplePoints.push(value);
    minY = Math.min(minY, value);
    maxY = Math.max(maxY, value);
  }
  
  // Add some padding to the range
  const padding = Math.max(1, (maxY - minY) * 0.1);
  minY -= padding;
  maxY += padding;
  const range = maxY - minY;
  
  // Second pass: generate points with proper scaling
  for (let x = 0; x <= viewportWidth; x++) {
    const k = viewportStart + (x / viewportWidth) * (4 * Math.PI);
    const value = nextTarget(currentT, k);
    const y = height - ((value - minY) / range) * height;
    points.push([x, y]);
  }
  
  return points.map(([x, y], i) => 
    `${i === 0 ? 'M' : 'L'} ${x},${y}`
  ).join(' ');
}

function useActionDebounce(ms = 220) {
  const ref = useRef(false);
  const lock = () => {
    ref.current = true;
    setTimeout(() => (ref.current = false), ms);
  };
  return { isLocked: () => ref.current, lock };
}

export default function PlayPage() {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const initialState = createInitialState('100');
    return {
      ...initialState,
      playerTotal: 0,
      dealerTotal: 0,
      playerDraws: [],
      dealerDraws: [],
      T: 21,
      k: 0,
      stake: 10,
      bankroll: 100,
      phase: 'betting' as const,
      lastPayout: undefined as number | undefined,
      nextTPreview: undefined as number | undefined,
    };
  });
  const { isLocked, lock } = useActionDebounce();
  const [howToOpen, setHowToOpen] = useState(false);
  const [shouldPop, setShouldPop] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);
  const shouldPopRef = useRef(false);
  
  // Handle deal action
  const handleDeal = () => {
    if (isLocked()) return; 
    lock();
    if (state.phase !== 'betting') return;
    if (state.bankroll <= 0) return;
    
    // Set the pop animation flag and clear it after animation completes
    shouldPopRef.current = true;
    setShouldPop(true);
    setTimeout(() => {
      shouldPopRef.current = false;
      setShouldPop(false);
    }, 300);
    
    dispatch({ type: 'deal' });
  };

  // Handle dealer's turn
  useEffect(() => {
    if (state.phase === 'dealer') {
      const dealerTurn = setInterval(() => {
        if (state.phase === 'dealer') {
          dispatch({ type: 'dealerTick' });
        }
      }, 800); // Slight delay between dealer actions for better UX
      
      return () => clearInterval(dealerTurn);
    }
  }, [state.phase]);

  // Event Handlers
  const handleHit = () => {
    if (isLocked()) return; 
    lock();
    if (state.phase !== 'player') return;
    dispatch({ type: 'hit' });
  };

  const handleStand = () => {
    if (isLocked()) return; 
    lock();
    if (state.phase !== 'player') return;
    dispatch({ type: 'stand' });
  };

  const onStakeChange = (value: number) => {
    if (state.phase !== 'betting') return;
    dispatch({ type: 'setStake', value });
  };

  const outcomeText = useMemo(() => {
    if (state.phase !== 'betting' || state.lastPayout == null) return '';
    if (state.lastPayout > 0) return `Win +${state.lastPayout}`;
    if (state.lastPayout < 0) return `Loss ${state.lastPayout}`;
    return 'Push 0';
  }, [state.phase, state.lastPayout]);

  const playerTotal = useMemo(() => sum(state.playerDraws), [state.playerDraws]);
  const dealerTotal = useMemo(() => sum(state.dealerDraws), [state.dealerDraws]);

  // ... (rest of the code remains the same)

  const stakeError = state.stake < 1 || state.stake > state.bankroll;

  return (
    <Page>
      <Header>
        <Brand href="/">kniff.world</Brand>
        <Chip 
          aria-live="polite" 
          aria-label={`Current target ${Math.floor(state.T)}`} 
          $pulse={!!state.nextTPreview}
          $shouldPop={shouldPop}
        >
          <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.floor(state.T)}</strong>
        </Chip>
        <RightInfo>
          <Button aria-label="How to play" onClick={() => setHowToOpen(true)} title="How to play">
            <FiHelpCircle aria-hidden />
          </Button>
        </RightInfo>
      </Header>

      <Main>
        {/* Top: Totals */}
        <Panel>
          <TotalsGrid>
            <Row 
              $isWinner={state.phase === 'betting' && state.lastPayout != null && state.lastPayout > 0}
              $isLoser={state.phase === 'betting' && state.lastPayout != null && state.lastPayout < 0}
            >
              <RowHeader>
                <div>Player</div>
                <SumBadge aria-label={`Player total ${playerTotal}`}>
                  {playerTotal}
                  {state.phase === 'betting' && state.lastPayout != null && (
                    <span style={{ 
                      fontSize: '0.8em',
                      marginLeft: '0.3em',
                      color: state.lastPayout > 0 ? colors.safe : state.lastPayout < 0 ? colors.danger : 'inherit'
                    }}>
                      {state.lastPayout > 0 ? `+${state.lastPayout}` : state.lastPayout}
                    </span>
                  )}
                </SumBadge>
              </RowHeader>
              <Draws aria-label="Player draws">
                {state.playerDraws.map((n, i) => (
                  <DrawChip key={`p-${i}`} aria-label={`draw ${i + 1} value ${n}`}>{n}</DrawChip>
                ))}
              </Draws>
            </Row>
            <Row>
              <RowHeader>
                <div>Dealer</div>
                <SumBadge aria-label={`Dealer total ${dealerTotal}`}>
                  {dealerTotal}
                  {state.phase === 'betting' && state.lastPayout != null && (
                    <span style={{ 
                      fontSize: '0.8em',
                      marginLeft: '0.3em',
                      color: state.lastPayout < 0 ? colors.safe : state.lastPayout > 0 ? colors.danger : 'inherit',
                      opacity: 0.8
                    }}>
                      {state.lastPayout < 0 ? `+${Math.abs(state.lastPayout)}` : state.lastPayout > 0 ? `-${state.lastPayout}` : ''}
                    </span>
                  )}
                </SumBadge>
              </RowHeader>
              <Draws aria-label="Dealer draws">
                {state.dealerDraws.map((n, i) => (
                  <DrawChip key={`d-${i}`}>{n}</DrawChip>
                ))}
              </Draws>
            </Row>
          </TotalsGrid>
        </Panel>

        {/* Middle: T_{n+1} Visualization */}
        <Panel>
          <GraphContainer>
            <GraphTitle>Next Target = {Math.floor(nextTarget(state.T, state.k))}</GraphTitle>
            <Graph>
              <GraphLine />
              <GraphLine />
              <GraphLine />
              <GraphPath viewBox="0 0 400 150" preserveAspectRatio="none">
                <path 
                  d={generatePath(state.T, 150, state.k, 400)}
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {(() => {
                  // Calculate min/max values for scaling, same as in generatePath
                  const viewportStart = state.k - 3 * Math.PI;
                  const viewportWidth = 400;
                  
                  // Sample points to find min/max
                  let minY = Infinity;
                  let maxY = -Infinity;
                  for (let x = 0; x <= viewportWidth; x++) {
                    const k = viewportStart + (x / viewportWidth) * (4 * Math.PI);
                    const value = nextTarget(state.T, k);
                    minY = Math.min(minY, value);
                    maxY = Math.max(maxY, value);
                  }
                  
                  // Add padding
                  const padding = Math.max(1, (maxY - minY) * 0.1);
                  minY -= padding;
                  maxY += padding;
                  const range = maxY - minY;
                  
                  // Calculate y position
                  const currentValue = nextTarget(state.T, state.k);
                  const y = 150 - ((currentValue - minY) / range) * 150;
                  
                  return (
                    <circle 
                      cx={300} // Fixed at 75% of viewport width
                      cy={y}
                      r="4"
                      fill={colors.accent}
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  );
                })()}
              </GraphPath>
            </Graph>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              color: colors.subtext,
              fontSize: '0.8rem',
              marginTop: '0.5rem'
            }}>
              <div>k = {state.k}</div>
              <div>T<sub>n+1</sub> = {nextTarget(state.T, state.k)}</div>
            </div>
          </GraphContainer>
        </Panel>

        {/* Bottom: Controls and Banners */}
        <Panel>
          <ControlsGrid>
            <Field>
              <Label htmlFor="stake">Bet Size</Label>
              <StakeInputRow>
                <Button aria-label="Decrease stake" onClick={() => onStakeChange(state.stake - 1)} disabled={state.phase !== 'betting' || state.bankroll <= 0}>−</Button>
                <Input
                  id="stake"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={state.bankroll}
                  value={state.stake}
                  onChange={(e) => onStakeChange(parseInt(e.target.value || '0', 10))}
                  aria-invalid={stakeError}
                  aria-describedby="stake-help"
                  disabled={state.phase !== 'betting' || state.bankroll <= 0}
                />
                <Button aria-label="Increase stake" onClick={() => onStakeChange(state.stake + 1)} disabled={state.phase !== 'betting' || state.bankroll <= 0}>+</Button>
              </StakeInputRow>
              <div id="stake-help" style={{ color: stakeError ? '#fecaca' : colors.subtext, minHeight: 18 }}>
                {stakeError ? 'Stake must be between 1 and bankroll.' : `Bankroll: ${state.bankroll}`}
              </div>
            </Field>

            <Button $primary onClick={handleDeal} disabled={state.phase !== 'betting' || state.bankroll <= 0} aria-label="Deal">Deal</Button>
            <Button onClick={handleHit} disabled={state.phase !== 'player' || sum(state.playerDraws) >= state.T} aria-label="Hit (H)">HIT</Button>
            <Button onClick={handleStand} disabled={state.phase !== 'player'} aria-label="Stand (S)">STAND</Button>
            <Button onClick={() => window.location.reload()} title="Reload Session" aria-label="Reload session">
              <FiRefreshCcw aria-hidden />
            </Button>
          </ControlsGrid>

          {/* Settle Banner */}
          {state.phase === 'betting' && state.lastPayout !== undefined && (
            <div style={{ marginTop: '1rem' }}>
              <Banner $win={state.lastPayout > 0} $loss={state.lastPayout < 0} role="status">
                <BannerHeader>
                  <div>
                    {state.lastPayout > 0 ? '🎉 You Win!' : state.lastPayout < 0 ? '😢 You Lose' : '🤝 Push'}
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 'normal' }}>
                      {outcomeText} • Bankroll: {state.bankroll - state.lastPayout} → {state.bankroll}
                    </div>
                  </div>
                  <Chip $pulse={!!state.nextTPreview}>
                    Next Target: {Math.floor(state.nextTPreview ?? state.T)}
                  </Chip>
                </BannerHeader>

                <HandSummary>
                  <div>
                    <div>Player</div>
                    <HandTotal $highlight={state.lastPayout >= 0}>
                      {sum(state.playerDraws)}
                    </HandTotal>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                      {state.playerDraws.join(' + ')}
                    </div>
                  </div>
                  <div>vs</div>
                  <div>
                    <div>Dealer</div>
                    <HandTotal $highlight={state.lastPayout <= 0 && state.lastPayout !== 0}>
                      {sum(state.dealerDraws)}
                    </HandTotal>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                      {state.dealerDraws.join(' + ')}
                    </div>
                  </div>
                </HandSummary>

                <BannerFooter>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Target was <strong>{Math.floor(state.T)}</strong>
                  </div>
                  <Button 
                    $primary 
                    onClick={() => dispatch({ type: 'nextHand' })} 
                    aria-label="Next hand"
                    style={{ minWidth: '140px', justifyContent: 'center' }}
                  >
                    Next Hand
                  </Button>
                </BannerFooter>
              </Banner>
            </div>
          )}
        </Panel>
      </Main>

      {/* Out of funds overlay */}
      {state.bankroll <= 0 && (
        <Overlay role="dialog" aria-modal="true" aria-label="Out of KniffBucks">
          <ModalBody>
            <h2>Out of KniffBucks</h2>
            <p style={{ color: colors.subtext, marginTop: 8 }}>Reload the session to reset bankroll=100, k=0, T=21.</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 12 }}>
              <Button $primary onClick={() => window.location.reload()}>Reload Session</Button>
            </div>
          </ModalBody>
        </Overlay>
      )}

      {/* How to Play modal */}
      {howToOpen && (
        <ModalOverlay onClick={() => setHowToOpen(false)} role="dialog" aria-modal="true" aria-label="How to Play">
          <ModalBody onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '0.5rem' }}>How to Play</h2>
            <ul style={{ lineHeight: 1.5, color: colors.subtext, paddingLeft: '1rem' }}>
              <li>Goal: Reach but do not exceed the Target T each hand. T changes across hands.</li>
              <li>Actions: Press Deal to receive two initial cards. HIT adds a random number 1–10; STAND locks your total.</li>
              <li>Dealer: After you stand, dealer hits to min(17, ceil(0.8*T)) and can bust over T.</li>
              <li>Payouts: Win +stake, Loss −stake, Push 0. Exact T pays x1.5 on a non-loss.</li>
              <li>Moving Target: Next hand's cap uses T<sub>n+1</sub> = 21 + ceil(0.5 * T<sub>n</sub> * sin(k) + 1); k is total HITs this session.</li>
              <li>Dealer Target: Dealer shares the same target T as the player.</li>
              <li>Session Hits k: k only increases when you HIT (not on the initial two Deal cards).</li>
              <li>Bankroll: Start with 100 Kniff Bucks. If you hit 0, reload the session to reset.</li>
            </ul>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <Button onClick={() => setHowToOpen(false)}>Close</Button>
            </div>
          </ModalBody>
        </ModalOverlay>
      )}

      {/* ARIA live region for outcomes */}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }} ref={liveRef} />
    </Page>
  );
}
