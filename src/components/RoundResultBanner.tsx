import React, { useEffect } from 'react';
import { RoundResult } from '../types/seotda';
import { Trophy, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

interface RoundResultBannerProps {
  result: RoundResult;
  onNextRound: () => void;
  isBankrupt: boolean;
  onRebuy: () => void;
}

export const RoundResultBanner: React.FC<RoundResultBannerProps> = ({
  result,
  onNextRound,
  isBankrupt,
  onRebuy,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isBankrupt) {
          onRebuy();
        } else {
          onNextRound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextRound, isBankrupt, onRebuy]);

  const isUserWinner = result.winner === 'user';
  const isRematch = result.winner === 'rematch';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`relative w-full max-w-lg p-6 rounded-2xl border text-center shadow-2xl overflow-hidden ${
        isUserWinner
          ? 'bg-neutral-900/95 border-amber-500/70 shadow-amber-500/20'
          : isRematch
          ? 'bg-neutral-900/95 border-purple-500/70 shadow-purple-500/20'
          : 'bg-neutral-900/95 border-red-900/70 shadow-red-900/20'
      }`}>
        {/* Glow backdrop */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isUserWinner ? 'bg-amber-400' : isRematch ? 'bg-purple-500' : 'bg-red-600'
        }`} />

        {/* Special Event Badge */}
        {result.specialEvent && (
          <div className="inline-block px-3 py-1 rounded-full bg-red-600 text-white font-serif-kr font-black text-xs uppercase tracking-wider mb-2 border border-amber-400 shadow animate-pulse">
            ★ {result.specialEvent} ★
          </div>
        )}

        {/* Big Outcome Header */}
        <div className="my-1">
          {isUserWinner ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
              </div>
              <h2 className="font-serif-kr text-2xl md:text-3xl font-black text-amber-300 tracking-tight">
                판돈 싹쓸이! 승리!
              </h2>
              <div className="text-xl md:text-2xl font-mono font-black text-emerald-400 mt-1 tabular-nums">
                +{result.potAmount.toLocaleString()}원
              </div>
            </div>
          ) : isRematch ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center mb-2">
                <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
              <h2 className="font-serif-kr text-2xl md:text-3xl font-black text-purple-300 tracking-tight">
                판돈 이월! 재경기!
              </h2>
              <p className="text-xs text-purple-200 mt-1">
                현재 판돈 <strong className="font-mono tabular-nums">{result.potAmount.toLocaleString()}원</strong>이 다음 판으로 그대로 넘어갑니다!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="font-serif-kr text-2xl md:text-3xl font-black text-red-400 tracking-tight">
                패배...
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                상대가 판돈을 가져갔습니다.
              </p>
            </div>
          )}
        </div>

        {/* Hand Comparison Table */}
        {result.userHand && result.aiHand && (
          <div className="my-5 p-3.5 rounded-xl bg-black/60 border border-neutral-800 flex items-center justify-around gap-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-stone-400">내 족보</span>
              <span className="font-serif-kr font-bold text-amber-300 text-sm mt-0.5">
                {result.userHand.jokboName}
              </span>
            </div>

            <span className="text-stone-600 font-bold">VS</span>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-stone-400">상대 족보</span>
              <span className="font-serif-kr font-bold text-stone-300 text-sm mt-0.5">
                {result.aiHand.jokboName}
              </span>
            </div>
          </div>
        )}

        {/* Reason text */}
        <p className="text-xs text-stone-300 italic mb-6">
          {result.reason}
        </p>

        {/* Action Button */}
        <div>
          {isBankrupt ? (
            <button
              onClick={onRebuy}
              className="w-full py-3.5 px-6 rounded-xl font-serif-kr font-black text-sm bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg transition-all"
            >
              밑천 충전하고 다시 도전하기 (+1,000,000원)
            </button>
          ) : (
            <button
              onClick={onNextRound}
              className="w-full py-3 px-6 rounded-xl font-serif-kr font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{isRematch ? '재경기 시작하기' : '다음 판 시작하기'}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="text-[10px] opacity-75 font-normal">(Space / Enter)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
