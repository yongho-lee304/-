import React, { useState, useRef, useEffect } from 'react';
import { HwatuCard } from '../types/seotda';
import { sound } from '../utils/audio';
import { Eye, Check } from 'lucide-react';

interface SqueezeCardModalProps {
  isOpen: boolean;
  card: HwatuCard;
  firstCard?: HwatuCard;
  onConfirmReveal: () => void;
  onClose: () => void;
}

export const SqueezeCardModal: React.FC<SqueezeCardModalProps> = ({
  isOpen,
  card,
  firstCard,
  onConfirmReveal,
  onClose,
}) => {
  // Squeeze drag progress (0 ~ 100)
  const [progress, setProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const startProgressRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      sound.playHeartbeat();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startProgressRef.current = progress;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY; // drag up
    const newProgress = Math.min(100, Math.max(0, startProgressRef.current + (deltaY / 2.2)));
    setProgress(newProgress);
    sound.playSqueezeTick(newProgress / 100);

    if (newProgress >= 96) {
      sound.playCardSnap();
      setProgress(100);
      setIsDragging(false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (progress > 85) {
      setProgress(100);
      sound.playCardSnap();
    }
  };

  const handleStepPeek = (amount: number) => {
    const next = Math.min(100, Math.max(0, progress + amount));
    setProgress(next);
    sound.playSqueezeTick(next / 100);
    if (next >= 100) {
      sound.playCardSnap();
    }
  };

  const handleComplete = () => {
    sound.playCardSnap();
    onConfirmReveal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-900/60 shadow-2xl">
        {/* Title */}
        <div className="mb-4">
          <span className="text-xs text-amber-500 font-bold uppercase tracking-widest">
            Tazza Peek Mode
          </span>
          <h2 className="font-serif-kr text-xl md:text-2xl font-black text-amber-200 tracking-tight mt-0.5">
            손맛 쪼기 (패 개봉)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            카드를 천천히 위로 밀어올려 숨겨진 족보를 확인하세요!
          </p>
        </div>

        {/* Existing First Card Reference (small) */}
        {firstCard && (
          <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-stone-800 text-xs">
            <span className="text-stone-400">내 1구 패:</span>
            <span className="font-serif-kr font-bold text-amber-300">{firstCard.name}</span>
          </div>
        )}

        {/* Big Card Interactive Squeeze Canvas */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-52 h-80 rounded-xl cursor-grab active:cursor-grabbing select-none shadow-2xl overflow-hidden my-2 border-2 border-amber-900/40"
          style={{ touchAction: 'none' }}
        >
          {/* Card Front Layer (Underneath) */}
          <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-amber-50 to-stone-100 select-none">
            {/* Top Month Tag & Guang */}
            <div className="flex items-center justify-between z-10">
              <span className="font-serif-kr font-black text-amber-950 text-2xl tracking-wider">
                {card.month}월
              </span>
              {card.isGwang ? (
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-amber-300 font-serif-kr font-black text-lg border-2 border-amber-400 shadow-md">
                  光
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 rounded bg-stone-200 text-stone-800">
                  {card.type === 'yeol' ? '열끗' : '피'}
                </span>
              )}
            </div>

            {/* Center Motif Artwork */}
            <div className="my-auto flex flex-col items-center justify-center z-10">
              <div className="text-6xl filter drop-shadow">
                {card.month === 1 && '🌲'}
                {card.month === 2 && '🌸'}
                {card.month === 3 && '🌸'}
                {card.month === 4 && '🌿'}
                {card.month === 5 && '🪻'}
                {card.month === 6 && '🌺'}
                {card.month === 7 && '🍁'}
                {card.month === 8 && (card.isGwang ? '🌕' : '🦅')}
                {card.month === 9 && '🌼'}
                {card.month === 10 && '🍁'}
              </div>
              <div className="font-serif-kr font-bold text-stone-800 text-sm mt-2">
                {card.name}
              </div>
            </div>

            {/* Bottom Month Subname */}
            <div className="text-center z-10 border-t border-amber-900/15 pt-2">
              <span className="font-serif-kr text-sm font-bold text-amber-950/80">
                {card.monthName} ({card.subName})
              </span>
            </div>

            {/* Inner Border */}
            <div className="absolute inset-2 border border-amber-900/20 rounded pointer-events-none" />
          </div>

          {/* Peeling Lacquer Back Cover (Slides upward as progress increases) */}
          {progress < 100 && (
            <div
              className="absolute inset-0 bg-gradient-to-br from-red-900 via-rose-950 to-red-950 p-4 flex flex-col items-center justify-center select-none border-2 border-red-800 shadow-2xl transition-all"
              style={{
                transform: `translateY(${-progress * 0.9}%)`,
                boxShadow: progress > 0 ? '0 10px 25px rgba(0,0,0,0.8)' : 'none',
              }}
            >
              {/* Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#fbbf24 1.5px, transparent 1.5px)`,
                  backgroundSize: '14px 14px',
                }}
              />

              {/* Gold Emblem */}
              <div className="relative z-10 w-20 h-20 rounded-full border-2 border-amber-400/80 flex flex-col items-center justify-center bg-red-950/90 shadow-lg">
                <span className="font-serif-kr text-amber-400 font-black text-xl tracking-tighter">
                  화투
                </span>
                <span className="text-xs text-amber-300 font-mono tracking-widest">
                  花鬪
                </span>
              </div>

              {/* Squeeze guide arrows */}
              <div className="mt-8 flex flex-col items-center animate-bounce">
                <span className="text-amber-300/80 text-xs font-bold">▲ 위로 살살 밀어올리기 ▲</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress and quick buttons */}
        <div className="w-full mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => handleStepPeek(25)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-stone-300 text-xs font-bold transition-colors"
          >
            살짝 보기 (+25%)
          </button>
          <button
            onClick={() => handleStepPeek(50)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-stone-300 text-xs font-bold transition-colors"
          >
            반만 보기 (+50%)
          </button>
          <button
            onClick={() => setProgress(100)}
            className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            전부 까기
          </button>
        </div>

        {/* Confirm / Continue Button */}
        <div className="w-full mt-6 flex items-center justify-between gap-4 border-t border-neutral-800 pt-4">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-stone-400 hover:text-stone-200 text-xs transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 py-3 px-6 rounded-xl font-serif-kr font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>확인하고 판 이어가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
