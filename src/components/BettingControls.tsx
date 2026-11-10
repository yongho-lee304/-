import React from 'react';
import { BettingAction } from '../types/seotda';
import { sound } from '../utils/audio';

interface BettingControlsProps {
  isUserTurn: boolean;
  userChips: number;
  callAmount: number;
  currentPot: number;
  baseAnte: number;
  onBet: (action: BettingAction, amount: number) => void;
  canCheck: boolean;
  disabled?: boolean;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
  isUserTurn,
  userChips,
  callAmount,
  currentPot,
  baseAnte,
  onBet,
  canCheck,
  disabled = false,
}) => {
  // Calculate raise amounts according to traditional Korean Seotda betting
  // 따당: call amount + the opponent's previous raise amount (approx 2x difference)
  const ddadangRaise = Math.max(baseAnte * 2, callAmount * 2);
  const quarterRaise = Math.max(baseAnte, Math.floor(currentPot * 0.25));
  const halfRaise = Math.max(baseAnte * 2, Math.floor(currentPot * 0.5));
  const fullRaise = Math.max(baseAnte * 4, currentPot);

  const handleAction = (action: BettingAction, amount: number) => {
    if (disabled || !isUserTurn) return;
    const finalAmount = Math.min(amount, userChips);
    if (action === 'die') {
      sound.playLose();
    } else {
      sound.playChipSound();
    }
    onBet(action, finalAmount);
  };

  const isBbingAllowed = canCheck; // First bettor in round can Bbing

  return (
    <div className="w-full max-w-4xl mx-auto p-3 rounded-2xl bg-neutral-900/90 border border-amber-900/40 backdrop-blur-md shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Fold / Check / Call */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          {/* 다이 (Fold) */}
          <button
            onClick={() => handleAction('die', 0)}
            disabled={!isUserTurn || disabled}
            className="flex-1 py-3 px-4 rounded-xl font-serif-kr font-bold text-sm bg-neutral-800 hover:bg-neutral-700 text-stone-300 hover:text-white border border-neutral-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow"
          >
            다이 (포기)
          </button>

          {/* 체크 (Check) */}
          {canCheck ? (
            <button
              onClick={() => handleAction('check', 0)}
              disabled={!isUserTurn || disabled}
              className="flex-1 py-3 px-4 rounded-xl font-serif-kr font-bold text-sm bg-stone-700 hover:bg-stone-600 text-amber-200 border border-stone-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              체크
            </button>
          ) : (
            /* 콜 (Call) */
            <button
              onClick={() => handleAction('call', callAmount)}
              disabled={!isUserTurn || disabled}
              className="flex-1 py-3 px-4 rounded-xl font-serif-kr font-bold text-sm bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
            >
              <span>콜 </span>
              <span className="font-mono text-xs opacity-90 tabular-nums">
                ({callAmount >= userChips ? '올인' : `${callAmount.toLocaleString()}원`})
              </span>
            </button>
          )}
        </div>

        {/* Right: Raise Actions (삥, 따당, 쿼터, 하프, 풀) */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[320px] justify-end">
          {/* 삥 (Bbing) */}
          {isBbingAllowed && (
            <button
              onClick={() => handleAction('bbing', baseAnte)}
              disabled={!isUserTurn || disabled || userChips < baseAnte}
              className="py-2.5 px-3 rounded-lg font-serif-kr font-bold text-xs bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              삥 ({baseAnte.toLocaleString()})
            </button>
          )}

          {/* 따당 (Ddadang) */}
          {!canCheck && (
            <button
              onClick={() => handleAction('ddadang', ddadangRaise)}
              disabled={!isUserTurn || disabled || userChips <= callAmount}
              className="py-2.5 px-3 rounded-lg font-serif-kr font-bold text-xs bg-amber-700 hover:bg-amber-600 text-neutral-950 font-black border border-amber-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              따당 ({ddadangRaise >= userChips ? '올인' : `+${ddadangRaise.toLocaleString()}`})
            </button>
          )}

          {/* 쿼터 (Quarter) */}
          <button
            onClick={() => handleAction('quarter', callAmount + quarterRaise)}
            disabled={!isUserTurn || disabled || userChips <= callAmount}
            className="py-2.5 px-3 rounded-lg font-serif-kr font-bold text-xs bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            쿼터 ({quarterRaise.toLocaleString()})
          </button>

          {/* 하프 (Half) */}
          <button
            onClick={() => handleAction('half', callAmount + halfRaise)}
            disabled={!isUserTurn || disabled || userChips <= callAmount}
            className="py-2.5 px-4 rounded-lg font-serif-kr font-bold text-xs bg-amber-600 hover:bg-amber-500 text-neutral-950 font-black border border-amber-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-600/30 whitespace-nowrap"
          >
            하프 ({halfRaise.toLocaleString()})
          </button>

          {/* 풀 (Full) */}
          <button
            onClick={() => handleAction('full', callAmount + fullRaise)}
            disabled={!isUserTurn || disabled || userChips <= callAmount}
            className="py-2.5 px-4 rounded-lg font-serif-kr font-black text-xs bg-red-700 hover:bg-red-600 text-white border border-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-900/40 whitespace-nowrap"
          >
            풀 ({fullRaise.toLocaleString()})
          </button>
        </div>
      </div>
    </div>
  );
};
