import React from 'react';
import { AIPersonality, HwatuCard, HandEvaluation } from '../types/seotda';
import { HwatuCardView } from './HwatuCardView';

interface TazzaAIPlayerProps {
  personality: AIPersonality;
  chips: number;
  currentBet: number;
  cards: HwatuCard[];
  isRevealed: boolean;
  handEval?: HandEvaluation;
  speechText: string;
  isThinking: boolean;
  isCurrentTurn: boolean;
  statusAction?: string;
  onSelectPersonality?: (id: 'goni' | 'agwi' | 'jeong') => void;
  availablePersonalities: AIPersonality[];
}

export const TazzaAIPlayer: React.FC<TazzaAIPlayerProps> = ({
  personality,
  chips,
  currentBet,
  cards,
  isRevealed,
  handEval,
  speechText,
  isThinking,
  isCurrentTurn,
  statusAction,
  onSelectPersonality,
  availablePersonalities,
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/80 border border-amber-900/30 backdrop-blur-md shadow-2xl">
      {/* Left: AI Avatar & Info */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all ${
            isCurrentTurn ? 'border-amber-400 ring-4 ring-amber-500/40 shadow-lg shadow-amber-500/20' : 'border-stone-700'
          }`}>
            <img
              src={personality.avatar}
              alt={personality.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Thinking spinner indicator */}
          {isThinking && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow">
              <span className="w-3 h-3 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {statusAction && (
            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded bg-red-700 text-white font-bold text-[10px] tracking-wider uppercase border border-red-500 shadow-sm animate-bounce">
              {statusAction}
            </div>
          )}
        </div>

        {/* Name and Opponent Switcher */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif-kr text-base md:text-lg font-bold text-amber-200">
              {personality.name}
            </h3>
            <span className="text-[11px] text-amber-400/80 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
              {personality.title}
            </span>
          </div>

          {/* Chip Counter */}
          <div className="flex items-center gap-3 mt-1 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <span>🪙</span>
              <span className="tabular-nums font-mono text-sm">{chips.toLocaleString()}원</span>
            </div>
            {currentBet > 0 && (
              <span className="text-stone-400 tabular-nums font-mono">
                베팅: {currentBet.toLocaleString()}원
              </span>
            )}
          </div>

          {/* Opponent Selector buttons */}
          {onSelectPersonality && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] text-stone-500 mr-1">상대 변경:</span>
              {availablePersonalities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPersonality(p.id)}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors whitespace-nowrap ${
                    p.id === personality.id
                      ? 'bg-amber-600 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Dynamic Speech Bubble */}
      <div className="flex-1 max-w-md w-full relative">
        <div className="relative p-3 rounded-xl bg-stone-950/90 border border-stone-700/60 shadow-inner">
          {/* Speech bubble pointer */}
          <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-stone-700/60 border-b-6 border-b-transparent" />
          <p className="font-serif-kr text-xs md:text-sm text-stone-300 italic tracking-wide">
            "{speechText}"
          </p>
        </div>
      </div>

      {/* Right: AI's Hand of Cards */}
      <div className="flex items-center gap-2 shrink-0">
        {cards.length === 0 ? (
          <div className="w-20 h-28 border border-dashed border-stone-700 rounded-lg flex items-center justify-center text-xs text-stone-500">
            대기 중
          </div>
        ) : (
          cards.map((c, idx) => (
            <HwatuCardView
              key={c.id || idx}
              card={c}
              isFaceUp={isRevealed}
              size="md"
            />
          ))
        )}
      </div>

      {/* Jokbo result banner at showdown */}
      {isRevealed && handEval && (
        <div className="absolute -bottom-4 right-6 bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 font-serif-kr font-black text-xs md:text-sm px-3 py-1 rounded-full border border-amber-400 shadow-lg animate-pulse">
          {handEval.jokboName}
        </div>
      )}
    </div>
  );
};
