import React from 'react';
import { PlayerStats } from '../types/seotda';
import { X, Trophy, RefreshCw, BarChart2, TrendingUp } from 'lucide-react';

interface GameStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onResetStats: () => void;
  onRefillChips: () => void;
}

export const GameStatsModal: React.FC<GameStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
  onRefillChips,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-amber-900/50 shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif-kr text-lg font-bold text-amber-200">
              타짜 전적 및 통계
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Score Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[11px] text-stone-400">총 판수</span>
              <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
                {stats.gamesPlayed}판
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[11px] text-stone-400">승률</span>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {stats.gamesPlayed > 0 ? `${stats.winRate.toFixed(1)}%` : '0%'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[11px] text-stone-400">승 / 패</span>
              <div className="text-xl font-bold font-mono tabular-nums text-amber-300 mt-1">
                {stats.wins} <span className="text-xs text-stone-500 font-normal">/</span> {stats.losses}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <span className="text-[11px] text-stone-400">재경기(구사)</span>
              <div className="text-xl font-bold font-mono tabular-nums text-purple-400 mt-1">
                {stats.rematches}회
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-stone-300">달성한 최고 족보</span>
              </div>
              <span className="font-serif-kr font-bold text-amber-300 text-sm">
                {stats.highestJokbo || '기록 없음'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-stone-300">최대 승리 판돈</span>
              </div>
              <span className="font-mono font-bold text-emerald-300 text-sm tabular-nums">
                {stats.highestPotWon > 0 ? `${stats.highestPotWon.toLocaleString()}원` : '0원'}
              </span>
            </div>
          </div>

          {/* Chip Refill & Reset */}
          <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-2 justify-between">
            <button
              onClick={() => {
                onRefillChips();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-serif-kr font-bold text-xs transition-colors shadow-md"
            >
              🪙 판돈 무료 충전 (+100만 원)
            </button>

            <button
              onClick={onResetStats}
              className="w-full sm:w-auto px-3 py-2 text-stone-400 hover:text-red-400 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              전적 초기화
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-serif-kr font-bold text-xs bg-neutral-800 hover:bg-neutral-700 text-stone-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
