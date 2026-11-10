/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  HwatuCard,
  HandEvaluation,
  BettingAction,
  GameRoundStage,
  GameMode,
  AIPersonality,
  RoundResult,
  PlayerStats,
} from './types/seotda';
import {
  createShuffledDeck,
  evaluateHand,
  resolveMatchup,
  findBestPairOfThree,
  AI_OPPONENTS,
} from './utils/seotdaEngine';
import { sound } from './utils/audio';
import { HwatuCardView } from './components/HwatuCardView';
import { TazzaAIPlayer } from './components/TazzaAIPlayer';
import { BettingControls } from './components/BettingControls';
import { JokboModal } from './components/JokboModal';
import { SqueezeCardModal } from './components/SqueezeCardModal';
import { GameStatsModal } from './components/GameStatsModal';
import { RoundResultBanner } from './components/RoundResultBanner';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Trophy,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

const INITIAL_CHIPS = 1000000; // 1,000,000 KRW
const BASE_ANTE = 10000; // 학교 / 판돈 10,000 KRW

export default function App() {
  // Opponent and Mode
  const [personality, setPersonality] = useState<AIPersonality>(AI_OPPONENTS.goni);
  const [gameMode, setGameMode] = useState<GameMode>('TWO_CARD');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Chips & Pot
  const [userChips, setUserChips] = useState<number>(INITIAL_CHIPS);
  const [aiChips, setAiChips] = useState<number>(INITIAL_CHIPS);
  const [currentPot, setCurrentPot] = useState<number>(0);
  const [carryOverPot, setCarryOverPot] = useState<number>(0); // Carried over from 구사 rematch

  // Bets in the current round
  const [userBetThisRound, setUserBetThisRound] = useState<number>(0);
  const [aiBetThisRound, setAiBetThisRound] = useState<number>(0);
  const [minCallAmount, setMinCallAmount] = useState<number>(0);

  // Game flow state
  const [roundStage, setRoundStage] = useState<GameRoundStage>('ROUND_START');
  const [deck, setDeck] = useState<HwatuCard[]>([]);
  const [userCards, setUserCards] = useState<HwatuCard[]>([]);
  const [aiCards, setAiCards] = useState<HwatuCard[]>([]);
  const [selectedThreeCardIndices, setSelectedThreeCardIndices] = useState<number[]>([0, 1]);

  // Turn tracking
  const [isUserTurn, setIsUserTurn] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [aiSpeech, setAiSpeech] = useState<string>('패가 착착 감기네. 한 판 붙어보자고.');
  const [aiStatusAction, setAiStatusAction] = useState<string | undefined>(undefined);
  const [lastBettor, setLastBettor] = useState<'user' | 'ai' | null>(null);

  // Card reveal & Peeking
  const [isSecondCardRevealed, setIsSecondCardRevealed] = useState<boolean>(false);
  const [isSqueezeModalOpen, setIsSqueezeModalOpen] = useState<boolean>(false);

  // Modals
  const [isJokboOpen, setIsJokboOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  // Round Result
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  // Stats
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('tazza_seotda_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      rematches: 0,
      winRate: 0,
      highestJokbo: '',
      highestPotWon: 0,
      totalEarnings: 0,
    };
  });

  const aiThinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync audio mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Helper to pick random quote from AI
  const getAiQuote = useCallback(
    (type: keyof AIPersonality['quotes']) => {
      const list = personality.quotes[type];
      return list[Math.floor(Math.random() * list.length)];
    },
    [personality]
  );

  // Evaluate current user hand
  const currentUserHand: HandEvaluation | undefined = React.useMemo(() => {
    if (gameMode === 'TWO_CARD') {
      if (userCards.length >= 2) {
        return evaluateHand(userCards[0], userCards[1]);
      }
    } else {
      if (userCards.length === 3) {
        const c1 = userCards[selectedThreeCardIndices[0]];
        const c2 = userCards[selectedThreeCardIndices[1]];
        if (c1 && c2) return evaluateHand(c1, c2);
      }
    }
    return undefined;
  }, [userCards, selectedThreeCardIndices, gameMode]);

  // Evaluate AI hand
  const currentAiHand: HandEvaluation | undefined = React.useMemo(() => {
    if (gameMode === 'TWO_CARD') {
      if (aiCards.length >= 2) {
        return evaluateHand(aiCards[0], aiCards[1]);
      }
    } else {
      if (aiCards.length === 3) {
        const res = findBestPairOfThree([aiCards[0], aiCards[1], aiCards[2]]);
        return res.bestHand;
      }
    }
    return undefined;
  }, [aiCards, gameMode]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('tazza_seotda_stats', JSON.stringify(stats));
  }, [stats]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current);
    };
  }, []);

  // Update minCallAmount whenever bets change
  useEffect(() => {
    const diff = aiBetThisRound - userBetThisRound;
    setMinCallAmount(Math.max(0, diff));
  }, [userBetThisRound, aiBetThisRound]);

  /**
   * Start a brand new round
   */
  const startNewRound = useCallback(() => {
    if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current);

    // Check bankroll
    if (userChips < BASE_ANTE) {
      alert('판돈이 부족합니다! 판돈을 충전해 주세요.');
      return;
    }
    if (aiChips < BASE_ANTE) {
      setAiChips(INITIAL_CHIPS);
      setAiSpeech('내가 밑천을 털리다니... 다시 채워왔다!');
    }

    const shuffled = createShuffledDeck();
    setRoundResult(null);
    setIsSecondCardRevealed(false);
    setAiStatusAction(undefined);

    // Initial Ante
    const initialPot = carryOverPot + BASE_ANTE * 2;
    setUserChips((prev) => prev - BASE_ANTE);
    setAiChips((prev) => prev - BASE_ANTE);
    setCurrentPot(initialPot);
    setCarryOverPot(0);

    setUserBetThisRound(BASE_ANTE);
    setAiBetThisRound(BASE_ANTE);

    sound.playChipSound();
    sound.playCardSnap();

    if (gameMode === 'TWO_CARD') {
      // 2장 섯다: Deal 1 card to each
      const uCard1 = shuffled[0];
      const aiCard1 = shuffled[1];
      const remaining = shuffled.slice(2);

      setUserCards([uCard1]);
      setAiCards([aiCard1]);
      setDeck(remaining);
      setRoundStage('FIRST_BETTING');

      // User acts first in first betting round
      setIsUserTurn(true);
      setLastBettor(null);
      setAiSpeech(getAiQuote('start'));
    } else {
      // 3장 섯다: Deal 2 cards to each first
      const u1 = shuffled[0];
      const u2 = shuffled[1];
      const a1 = shuffled[2];
      const a2 = shuffled[3];
      const remaining = shuffled.slice(4);

      setUserCards([u1, u2]);
      setAiCards([a1, a2]);
      setDeck(remaining);
      setRoundStage('FIRST_BETTING');
      setIsUserTurn(true);
      setLastBettor(null);
      setAiSpeech(getAiQuote('start'));
    }
  }, [userChips, aiChips, carryOverPot, gameMode, getAiQuote]);

  // Auto start first round on mount
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Move from 1st betting round to 2nd card deal
   */
  const dealSecondPhase = useCallback(() => {
    sound.playCardSnap();
    if (gameMode === 'TWO_CARD') {
      // Deal 2nd card
      const u2 = deck[0];
      const a2 = deck[1];
      const remaining = deck.slice(2);

      setUserCards((prev) => [...prev, u2]);
      setAiCards((prev) => [...prev, a2]);
      setDeck(remaining);
      setRoundStage('SECOND_BETTING');
      setIsSecondCardRevealed(false);

      // Play suspense heartbeat for card reveal
      sound.playHeartbeat();
      setIsUserTurn(true);
      setLastBettor(null);
    } else {
      // 3-Card Seotda: Deal 3rd card
      const u3 = deck[0];
      const a3 = deck[1];
      const remaining = deck.slice(2);

      const newUCards = [...userCards, u3];
      const newACards = [...aiCards, a3];

      setUserCards(newUCards);
      setAiCards(newACards);
      setDeck(remaining);

      // Auto pick best 2 of 3 for AI
      const best = findBestPairOfThree([newUCards[0], newUCards[1], newUCards[2]]);
      // Select the best 2 cards indices by default
      const idx1 = newUCards.findIndex((c) => c.id === best.bestPair[0].id);
      const idx2 = newUCards.findIndex((c) => c.id === best.bestPair[1].id);
      setSelectedThreeCardIndices([idx1, idx2]);

      setRoundStage('SECOND_BETTING');
      setIsUserTurn(true);
      setLastBettor(null);
    }
  }, [deck, gameMode, userCards, aiCards]);

  /**
   * Showdown (패 공개 및 승부 판정)
   */
  const performShowdown = useCallback(() => {
    setRoundStage('SHOWDOWN');
    setIsUserTurn(false);
    setIsSecondCardRevealed(true);

    if (!currentUserHand || !currentAiHand) return;

    const result = resolveMatchup(currentUserHand, currentAiHand, currentPot);
    setRoundResult(result);

    // Audio cues and chip distribution
    if (result.winner === 'user') {
      sound.playWin();
      setUserChips((prev) => prev + currentPot);
      setAiSpeech(getAiQuote('lose'));

      setStats((prev) => {
        const newWins = prev.wins + 1;
        const total = prev.gamesPlayed + 1;
        return {
          ...prev,
          gamesPlayed: total,
          wins: newWins,
          winRate: (newWins / total) * 100,
          highestJokbo: prev.highestJokbo
            ? (currentUserHand.score > 5000 ? currentUserHand.jokboName : prev.highestJokbo)
            : currentUserHand.jokboName,
          highestPotWon: Math.max(prev.highestPotWon, currentPot),
          totalEarnings: prev.totalEarnings + (currentPot - userBetThisRound),
        };
      });
    } else if (result.winner === 'ai') {
      sound.playLose();
      setAiChips((prev) => prev + currentPot);
      setAiSpeech(getAiQuote('win'));

      setStats((prev) => {
        const total = prev.gamesPlayed + 1;
        return {
          ...prev,
          gamesPlayed: total,
          losses: prev.losses + 1,
          winRate: (prev.wins / total) * 100,
          totalEarnings: prev.totalEarnings - userBetThisRound,
        };
      });
    } else {
      // Rematch / 판돈 이월 (구사, 멍구사, 동점)
      sound.playGusa();
      setCarryOverPot(currentPot);
      setAiSpeech('동점이거나 구사로군! 판돈 그대로 묻고 다음 판으로 간다!');

      setStats((prev) => {
        const total = prev.gamesPlayed + 1;
        return {
          ...prev,
          gamesPlayed: total,
          rematches: prev.rematches + 1,
          winRate: (prev.wins / total) * 100,
        };
      });
    }
  }, [
    currentUserHand,
    currentAiHand,
    currentPot,
    userBetThisRound,
    getAiQuote,
  ]);

  /**
   * Handle Fold (다이) by user or AI
   */
  const handleFold = useCallback(
    (folder: 'user' | 'ai') => {
      setRoundStage('ROUND_RESULT');
      setIsUserTurn(false);
      setIsSecondCardRevealed(true);

      if (folder === 'user') {
        sound.playLose();
        setAiChips((prev) => prev + currentPot);
        setAiSpeech(getAiQuote('win'));

        const res: RoundResult = {
          winner: 'ai',
          potAmount: currentPot,
          reason: '내가 다이(포기)하여 상대가 판돈을 차지했습니다.',
          isRematch: false,
        };
        setRoundResult(res);

        setStats((prev) => {
          const total = prev.gamesPlayed + 1;
          return {
            ...prev,
            gamesPlayed: total,
            losses: prev.losses + 1,
            winRate: (prev.wins / total) * 100,
            totalEarnings: prev.totalEarnings - userBetThisRound,
          };
        });
      } else {
        // AI folds
        sound.playWin();
        setUserChips((prev) => prev + currentPot);
        setAiSpeech(getAiQuote('die'));

        const res: RoundResult = {
          winner: 'user',
          potAmount: currentPot,
          reason: '상대방이 다이(포기)하여 판돈을 획득했습니다!',
          isRematch: false,
        };
        setRoundResult(res);

        setStats((prev) => {
          const total = prev.gamesPlayed + 1;
          const newWins = prev.wins + 1;
          return {
            ...prev,
            gamesPlayed: total,
            wins: newWins,
            winRate: (newWins / total) * 100,
            highestPotWon: Math.max(prev.highestPotWon, currentPot),
            totalEarnings: prev.totalEarnings + (currentPot - userBetThisRound),
          };
        });
      }
    },
    [currentPot, getAiQuote, userBetThisRound]
  );

  /**
   * AI Betting Decision Engine
   */
  const runAiTurn = useCallback(() => {
    setIsAiThinking(true);

    const delay = 700 + Math.random() * 800;
    aiThinkingTimerRef.current = setTimeout(() => {
      setIsAiThinking(false);

      const diff = userBetThisRound - aiBetThisRound; // how much AI needs to call
      const handScore = currentAiHand ? currentAiHand.score : 450;
      const isBluffing = Math.random() < personality.bluffRate;
      const aggression = personality.aggression;

      // If user checked (diff === 0)
      if (diff === 0) {
        // AI can check or raise
        if (handScore >= 7000 || (isBluffing && Math.random() > 0.4)) {
          // Raise
          const raise = Math.min(BASE_ANTE * 2, aiChips);
          setAiChips((prev) => prev - raise);
          setAiBetThisRound((prev) => prev + raise);
          setCurrentPot((prev) => prev + raise);
          setAiStatusAction('따당');
          setAiSpeech(getAiQuote('betHigh'));
          sound.playChipSound();
          setLastBettor('ai');
          setIsUserTurn(true);
        } else {
          // Check
          setAiStatusAction('체크');
          setAiSpeech(getAiQuote('call'));
          // Both checked! Progress to next phase or showdown
          if (roundStage === 'FIRST_BETTING') {
            dealSecondPhase();
          } else {
            performShowdown();
          }
        }
        return;
      }

      // If user bet/raised (diff > 0)
      // Decide: Fold, Call, or Re-raise (따당 / 하프)
      const potOdds = diff / (currentPot + diff);
      const isHighHand = handScore >= 6000; // 알리 이상
      const isDdaeng = handScore >= 7100;

      // Fold criteria
      if (handScore < 450 && diff > BASE_ANTE * 2 && !isBluffing && Math.random() > aggression) {
        setAiStatusAction('다이');
        handleFold('ai');
        return;
      }

      // Raise (따당 / 하프) criteria
      if ((isDdaeng || (isBluffing && aggression > 0.6)) && lastBettor !== 'ai' && aiChips > diff * 2) {
        const extraRaise = Math.min(diff * 2, aiChips - diff);
        const totalAiBet = diff + extraRaise;

        setAiChips((prev) => prev - totalAiBet);
        setAiBetThisRound((prev) => prev + totalAiBet);
        setCurrentPot((prev) => prev + totalAiBet);
        setAiStatusAction('따당');
        setAiSpeech(isBluffing ? getAiQuote('bluff') : getAiQuote('betHigh'));
        sound.playChipSound();
        setLastBettor('ai');
        setIsUserTurn(true);
      } else {
        // Call
        const callAmount = Math.min(diff, aiChips);
        setAiChips((prev) => prev - callAmount);
        setAiBetThisRound((prev) => prev + callAmount);
        setCurrentPot((prev) => prev + callAmount);
        setAiStatusAction('콜');
        setAiSpeech(getAiQuote('call'));
        sound.playChipSound();

        // Round of betting settled!
        if (roundStage === 'FIRST_BETTING') {
          dealSecondPhase();
        } else {
          performShowdown();
        }
      }
    }, delay);
  }, [
    userBetThisRound,
    aiBetThisRound,
    currentAiHand,
    personality,
    roundStage,
    currentPot,
    lastBettor,
    aiChips,
    getAiQuote,
    dealSecondPhase,
    performShowdown,
    handleFold,
  ]);

  /**
   * User Betting Action Handler
   */
  const handleUserBet = (action: BettingAction, amount: number) => {
    if (!isUserTurn) return;

    if (action === 'die') {
      handleFold('user');
      return;
    }

    if (action === 'check') {
      // If AI hasn't bet yet in this stage
      if (lastBettor === null) {
        setIsUserTurn(false);
        setLastBettor('user');
        runAiTurn();
      } else {
        // Both checked
        if (roundStage === 'FIRST_BETTING') {
          dealSecondPhase();
        } else {
          performShowdown();
        }
      }
      return;
    }

    if (action === 'call') {
      const callVal = Math.min(amount, userChips);
      setUserChips((prev) => prev - callVal);
      setUserBetThisRound((prev) => prev + callVal);
      setCurrentPot((prev) => prev + callVal);

      // Call matches the bet, so betting round finishes!
      setIsUserTurn(false);
      if (roundStage === 'FIRST_BETTING') {
        dealSecondPhase();
      } else {
        performShowdown();
      }
      return;
    }

    // Raise actions: 삥, 따당, 쿼터, 하프, 풀
    const betVal = Math.min(amount, userChips);
    setUserChips((prev) => prev - betVal);
    setUserBetThisRound((prev) => prev + betVal);
    setCurrentPot((prev) => prev + betVal);

    setIsUserTurn(false);
    setLastBettor('user');
    runAiTurn();
  };

  /**
   * Toggle 3-card selection
   */
  const toggleSelectCard = (index: number) => {
    if (gameMode !== 'THREE_CARD' || userCards.length < 3) return;
    if (selectedThreeCardIndices.includes(index)) {
      if (selectedThreeCardIndices.length > 1) {
        setSelectedThreeCardIndices((prev) => prev.filter((i) => i !== index));
      }
    } else {
      if (selectedThreeCardIndices.length >= 2) {
        setSelectedThreeCardIndices([selectedThreeCardIndices[1], index]);
      } else {
        setSelectedThreeCardIndices((prev) => [...prev, index]);
      }
    }
  };

  // Rebuy chips
  const handleRebuy = () => {
    setUserChips((prev) => prev + INITIAL_CHIPS);
    startNewRound();
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      {/* Background table texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 bg-cover bg-center filter contrast-125"
        style={{
          backgroundImage: `url('/src/assets/images/seotda_table_felt_1794288303379.jpg')`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

      {/* Top Bar Contract (Zone 1: Brand wordmark | Zone 2: Links/Tools | Zone 3: Primary CTA) */}
      <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-amber-900/30 bg-neutral-950/90 backdrop-blur-md">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="font-serif-kr text-xl font-black text-amber-400 tracking-wider">
            타짜 섯다
          </span>
          <span className="text-xs text-stone-400 font-serif-kr">AI 대전</span>
        </div>

        {/* Zone 2: Navigation / Info Controls */}
        <nav className="flex items-center gap-4 text-xs font-medium text-stone-300">
          {/* Mode Switcher */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => {
                setGameMode('TWO_CARD');
                startNewRound();
              }}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                gameMode === 'TWO_CARD'
                  ? 'bg-amber-600 text-neutral-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              2장 섯다
            </button>
            <button
              onClick={() => {
                setGameMode('THREE_CARD');
                startNewRound();
              }}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                gameMode === 'THREE_CARD'
                  ? 'bg-amber-600 text-neutral-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              3장 섯다
            </button>
          </div>

          <button
            onClick={() => setIsJokboOpen(true)}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>족보 도감</span>
          </button>

          <button
            onClick={() => setIsStatsOpen(true)}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>전적실</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Sound Mute */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-stone-300 hover:text-amber-400 transition-colors"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={startNewRound}
            className="px-4 py-2 text-xs font-bold font-serif-kr text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            새 판 시작
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="relative z-10 flex-1 flex flex-col justify-between p-4 md:p-6 max-w-6xl w-full mx-auto">
        {/* Top: AI Opponent Section */}
        <section className="w-full">
          <TazzaAIPlayer
            personality={personality}
            chips={aiChips}
            currentBet={aiBetThisRound}
            cards={aiCards}
            isRevealed={isSecondCardRevealed}
            handEval={currentAiHand}
            speechText={aiSpeech}
            isThinking={isAiThinking}
            isCurrentTurn={!isUserTurn && roundStage !== 'SHOWDOWN' && roundStage !== 'ROUND_RESULT'}
            statusAction={aiStatusAction}
            onSelectPersonality={(id) => {
              setPersonality(AI_OPPONENTS[id]);
              setAiSpeech(AI_OPPONENTS[id].quotes.start[0]);
            }}
            availablePersonalities={Object.values(AI_OPPONENTS)}
          />
        </section>

        {/* Center: Pot & Chip Table Centerpiece */}
        <section className="my-auto py-4 flex flex-col items-center justify-center relative select-none">
          {/* Circular Felt Table Inlay */}
          <div className="relative p-6 rounded-full border-4 border-amber-900/40 bg-gradient-to-b from-emerald-950/70 to-neutral-950/90 shadow-2xl flex flex-col items-center justify-center min-w-[200px] min-h-[140px]">
            <span className="text-[11px] font-serif-kr font-bold text-amber-500/90 tracking-widest uppercase">
              총 판돈 (POT)
            </span>

            {/* Glowing gold pot counter */}
            <div className="flex items-center gap-1 text-2xl md:text-3xl font-black font-mono text-amber-300 drop-shadow tabular-nums mt-1">
              <span>🪙</span>
              <span>{currentPot.toLocaleString()}원</span>
            </div>

            {carryOverPot > 0 && (
              <span className="text-[10px] text-purple-300 mt-1 font-bold animate-pulse">
                이월 판돈: {carryOverPot.toLocaleString()}원 포함
              </span>
            )}

            {/* Round Stage Badge */}
            <div className="mt-2 text-[11px] text-stone-400">
              {roundStage === 'FIRST_BETTING' && '1구 베팅 진행 중'}
              {roundStage === 'SECOND_BETTING' && '2구 승부 베팅 (패 쪼기)'}
              {roundStage === 'SHOWDOWN' && '쇼다운 (결과 확인)'}
              {roundStage === 'ROUND_RESULT' && '판 종료'}
            </div>
          </div>
        </section>

        {/* Bottom: Player Section & Hands */}
        <section className="w-full flex flex-col items-center gap-3">
          {/* User Hand Display */}
          <div className="relative flex flex-col items-center p-4 rounded-2xl bg-neutral-900/80 border border-amber-900/30 backdrop-blur-md shadow-2xl w-full max-w-4xl">
            {/* User Info Bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-neutral-950 font-serif-kr">
                  나
                </div>
                <div>
                  <span className="font-serif-kr font-bold text-stone-200 text-sm">타짜 (나)</span>
                  <div className="flex items-center gap-1 text-amber-300 font-mono text-xs tabular-nums font-bold">
                    <span>🪙 {userChips.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* Hand Evaluation Result Pill */}
              {currentUserHand && (
                <div className="flex items-center gap-2 bg-neutral-950/80 px-3 py-1.5 rounded-xl border border-amber-500/40">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-serif-kr font-black text-amber-300 text-sm">
                    {currentUserHand.jokboName}
                  </span>
                  <span className="text-[11px] text-stone-400 hidden sm:inline">
                    ({currentUserHand.description})
                  </span>
                </div>
              )}

              {/* Squeeze card button (패 쪼기 모드) for 2nd card */}
              {gameMode === 'TWO_CARD' && userCards.length === 2 && !isSecondCardRevealed && (
                <button
                  onClick={() => setIsSqueezeModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-serif-kr font-black text-xs border border-amber-400 shadow-md transition-all flex items-center gap-1 animate-pulse"
                >
                  <span>손맛 쪼기 모드</span>
                  <span>👆</span>
                </button>
              )}
            </div>

            {/* User Cards in Hand */}
            <div className="pt-3 pb-1 flex items-center justify-center gap-4">
              {userCards.map((card, idx) => {
                // In 2-card mode: 1st card is face up, 2nd card is peekable until revealed
                const isPeekTarget = gameMode === 'TWO_CARD' && idx === 1;
                const isFaceUp =
                  gameMode === 'THREE_CARD'
                    ? true
                    : idx === 0
                    ? true
                    : isSecondCardRevealed;

                const isSelected =
                  gameMode === 'THREE_CARD' && selectedThreeCardIndices.includes(idx);

                return (
                  <div key={card.id || idx} className="flex flex-col items-center">
                    <HwatuCardView
                      card={card}
                      isFaceUp={isFaceUp}
                      isPeekable={isPeekTarget && !isSecondCardRevealed}
                      onRevealed={() => setIsSecondCardRevealed(true)}
                      size="lg"
                      selected={isSelected}
                      onClick={() => {
                        if (gameMode === 'THREE_CARD') {
                          toggleSelectCard(idx);
                        } else if (isPeekTarget && !isSecondCardRevealed) {
                          setIsSqueezeModalOpen(true);
                        }
                      }}
                    />
                    {gameMode === 'THREE_CARD' && (
                      <span className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                        {isSelected ? '선택된 패' : '클릭하여 교체'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {gameMode === 'THREE_CARD' && userCards.length === 3 && (
              <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                3장의 카드 중 가장 유리한 2장을 클릭하여 선택할 수 있습니다.
              </p>
            )}
          </div>

          {/* Betting Action Controls */}
          <div className="w-full">
            <BettingControls
              isUserTurn={isUserTurn && roundStage !== 'SHOWDOWN' && roundStage !== 'ROUND_RESULT'}
              userChips={userChips}
              callAmount={minCallAmount}
              currentPot={currentPot}
              baseAnte={BASE_ANTE}
              canCheck={minCallAmount === 0}
              onBet={handleUserBet}
            />
          </div>
        </section>
      </main>

      {/* Squeeze Card Interactive Modal */}
      {userCards.length >= 2 && (
        <SqueezeCardModal
          isOpen={isSqueezeModalOpen}
          card={userCards[1]}
          firstCard={userCards[0]}
          onConfirmReveal={() => {
            setIsSecondCardRevealed(true);
            setIsSqueezeModalOpen(false);
          }}
          onClose={() => setIsSqueezeModalOpen(false)}
        />
      )}

      {/* Round Result Banner */}
      {roundResult && (
        <RoundResultBanner
          result={roundResult}
          onNextRound={startNewRound}
          isBankrupt={userChips < BASE_ANTE}
          onRebuy={handleRebuy}
        />
      )}

      {/* Jokbo Reference Modal */}
      <JokboModal isOpen={isJokboOpen} onClose={() => setIsJokboOpen(false)} />

      {/* Game Stats Modal */}
      <GameStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={() => {
          const reset: PlayerStats = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            rematches: 0,
            winRate: 0,
            highestJokbo: '',
            highestPotWon: 0,
            totalEarnings: 0,
          };
          setStats(reset);
          localStorage.removeItem('tazza_seotda_stats');
        }}
        onRefillChips={() => {
          setUserChips((prev) => prev + INITIAL_CHIPS);
          sound.playChipSound();
        }}
      />
    </div>
  );
}
