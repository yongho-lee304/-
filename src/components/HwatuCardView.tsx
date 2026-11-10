import React, { useState, useRef, useEffect } from 'react';
import { HwatuCard } from '../types/seotda';
import { sound } from '../utils/audio';

interface HwatuCardViewProps {
  card?: HwatuCard;
  isFaceUp: boolean;
  isPeekable?: boolean; // Enable interactive squeezing/peeling
  onRevealed?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const HwatuCardView: React.FC<HwatuCardViewProps> = ({
  card,
  isFaceUp,
  isPeekable = false,
  onRevealed,
  size = 'md',
  className = '',
  selected = false,
  onClick,
}) => {
  // Squeeze/peek state (0 = fully covered, 100 = fully revealed)
  const [peekPercent, setPeekPercent] = useState<number>(isFaceUp ? 100 : 0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const currentPeekRef = useRef<number>(0);

  useEffect(() => {
    if (isFaceUp) {
      setPeekPercent(100);
    } else if (!isPeekable) {
      setPeekPercent(0);
    }
  }, [isFaceUp, isPeekable]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isPeekable || isFaceUp || peekPercent >= 100) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    currentPeekRef.current = peekPercent;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY; // dragging upwards reveals
    const newPercent = Math.min(100, Math.max(0, currentPeekRef.current + (deltaY / 1.5)));
    setPeekPercent(newPercent);
    sound.playSqueezeTick(newPercent / 100);

    if (newPercent >= 95 && onRevealed) {
      sound.playCardSnap();
      setPeekPercent(100);
      setIsDragging(false);
      onRevealed();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (peekPercent > 70) {
      setPeekPercent(100);
      sound.playCardSnap();
      if (onRevealed) onRevealed();
    }
  };

  // Dimensions
  const sizeClasses = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-24 h-36 text-sm',
    lg: 'w-32 h-48 text-base',
    xl: 'w-40 h-60 text-lg',
  }[size];

  // Card motif rendering
  const renderCardFrontMotif = (cardItem: HwatuCard) => {
    const { month, isGwang, type } = cardItem;

    return (
      <div className="relative w-full h-full flex flex-col justify-between p-2 overflow-hidden bg-gradient-to-b from-amber-50 to-stone-100 select-none">
        {/* Top Header: Month & Name */}
        <div className="flex items-center justify-between z-10">
          <span className="font-serif-kr font-black text-amber-950 tracking-wider">
            {month}월
          </span>
          {isGwang ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-amber-300 font-serif-kr font-black text-xs border border-amber-400 shadow-sm shadow-red-900/40">
              光
            </span>
          ) : (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${type === 'yeol' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-200 text-stone-700'}`}>
              {type === 'yeol' ? '열끗' : '피'}
            </span>
          )}
        </div>

        {/* Center Artwork Motif */}
        <div className="my-auto flex flex-col items-center justify-center z-10">
          {month === 1 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="absolute top-1 w-8 h-8 rounded-full bg-red-600 border border-red-700 shadow-sm" />
              <div className="absolute bottom-0 text-2xl font-serif-kr text-emerald-800">🌲</div>
              {isGwang && <div className="absolute top-2 text-base">🕊️</div>}
            </div>
          )}
          {month === 2 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl">🌸</div>
              {type === 'yeol' && <div className="absolute bottom-1 text-base">🐤</div>}
            </div>
          )}
          {month === 3 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl">🌸</div>
              <div className="absolute -top-1 w-12 h-3 bg-red-700 rounded-t-sm opacity-90 border-b border-amber-400" />
            </div>
          )}
          {month === 4 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl text-slate-800">🌿</div>
              {type === 'yeol' && <div className="absolute top-0 text-sm">🐦</div>}
            </div>
          )}
          {month === 5 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl text-purple-700">🪻</div>
              <div className="absolute bottom-0 w-10 h-1 bg-amber-800 rounded" />
            </div>
          )}
          {month === 6 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl text-rose-600">🌺</div>
              <div className="absolute top-1 text-sm">🦋</div>
            </div>
          )}
          {month === 7 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl text-red-600">🍁</div>
              {type === 'yeol' && <div className="absolute bottom-0 text-base">🐗</div>}
            </div>
          )}
          {month === 8 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-stone-900 border-2 border-amber-300 flex items-center justify-center shadow-inner">
                {isGwang ? (
                  <div className="w-9 h-9 rounded-full bg-amber-200 border border-amber-400 shadow-sm" />
                ) : (
                  <span className="text-sm">🦅</span>
                )}
              </div>
            </div>
          )}
          {month === 9 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl text-amber-500">🌼</div>
              {type === 'yeol' && <div className="absolute bottom-0 text-sm">🍶</div>}
            </div>
          )}
          {month === 10 && (
            <div className="relative w-14 h-16 flex items-center justify-center">
              <div className="text-3xl text-amber-700">🍁</div>
              {type === 'yeol' && <div className="absolute bottom-0 text-base">🦌</div>}
            </div>
          )}
        </div>

        {/* Bottom Label */}
        <div className="text-center z-10 border-t border-amber-900/10 pt-1">
          <span className="font-serif-kr text-[11px] font-bold text-amber-950/80">
            {cardItem.monthName}
          </span>
        </div>

        {/* Card bevel / border inlay */}
        <div className="absolute inset-1 border border-amber-900/20 rounded pointer-events-none" />
      </div>
    );
  };

  // Card back design: Traditional Korean lacquer red with gold embossed border & seal
  const renderCardBack = () => {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-900 via-rose-950 to-red-950 p-2 flex flex-col items-center justify-center relative overflow-hidden select-none border-2 border-red-800 shadow-inner">
        {/* Subtle patterned lattice */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#fbbf24 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
          }}
        />

        {/* Traditional Gold Emblem */}
        <div className="relative z-10 w-12 h-12 rounded-full border-2 border-amber-400/80 flex flex-col items-center justify-center bg-red-950/90 shadow-md">
          <span className="font-serif-kr text-amber-400 font-black text-xs tracking-tighter">
            화투
          </span>
          <span className="text-[9px] text-amber-300 font-mono tracking-widest -mt-0.5">
            花鬪
          </span>
        </div>

        {/* Decorative corner borders */}
        <div className="absolute inset-1.5 border border-amber-500/30 rounded pointer-events-none" />
        <div className="absolute inset-2 border border-amber-500/15 rounded pointer-events-none" />
      </div>
    );
  };

  const isRevealed = isFaceUp || peekPercent >= 100;

  return (
    <div
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative inline-block ${sizeClasses} rounded-lg cursor-pointer transition-transform duration-200 select-none shadow-md ${
        selected ? 'ring-4 ring-amber-400 -translate-y-2 shadow-amber-500/30' : 'hover:-translate-y-1'
      } ${className}`}
      style={{
        perspective: '1000px',
        touchAction: isPeekable ? 'none' : 'auto',
      }}
    >
      {/* Base Card Layer */}
      <div className="w-full h-full rounded-lg overflow-hidden border border-black/40 shadow-xl bg-neutral-900">
        {card && (isRevealed || isPeekable) ? (
          renderCardFrontMotif(card)
        ) : (
          renderCardBack()
        )}
      </div>

      {/* Squeezing / Peeking Overlay Cover (when isPeekable and not yet fully revealed) */}
      {isPeekable && card && peekPercent < 100 && (
        <div
          className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl border border-red-950 origin-bottom transition-all"
          style={{
            transform: `translateY(${-peekPercent * 0.75}%) rotateX(${peekPercent * 0.25}deg)`,
            opacity: 1 - (peekPercent / 120),
            pointerEvents: isDragging ? 'none' : 'auto',
          }}
        >
          {renderCardBack()}
          {/* Subtle light reflection on peeling card */}
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Interactive Squeeze Hint Indicator */}
      {isPeekable && peekPercent < 30 && (
        <div className="absolute -bottom-6 inset-x-0 flex items-center justify-center pointer-events-none animate-pulse">
          <span className="text-[11px] font-bold text-amber-300 drop-shadow-md whitespace-nowrap bg-black/60 px-2 py-0.5 rounded">
            패 쪼기 👆
          </span>
        </div>
      )}
    </div>
  );
};
