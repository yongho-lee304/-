import React, { useState } from 'react';
import { X, Award, Shield, AlertTriangle, HelpCircle } from 'lucide-react';

interface JokboModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JokboModal: React.FC<JokboModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ranks' | 'special' | 'rules'>('ranks');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-neutral-900 border border-amber-900/50 shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎴</span>
            <h2 className="font-serif-kr text-lg md:text-xl font-bold text-amber-200">
              섯다 족보 도감 (족보표)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-neutral-950/50 border-b border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('ranks')}
            className={`px-4 py-1.5 rounded-lg font-serif-kr font-bold transition-all ${
              activeTab === 'ranks'
                ? 'bg-amber-600 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            전체 족보 순위
          </button>
          <button
            onClick={() => setActiveTab('special')}
            className={`px-4 py-1.5 rounded-lg font-serif-kr font-bold transition-all ${
              activeTab === 'special'
                ? 'bg-amber-600 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            특수 역전패 (암행어사/땡잡이/구사)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 rounded-lg font-serif-kr font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-amber-600 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            베팅 및 게임 규칙
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'ranks' && (
            <div className="space-y-4">
              {/* 1. 광땡 Tier */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-neutral-900 border border-red-900/40">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-serif-kr font-bold text-amber-300 text-sm">
                    최상위 족보: 광땡 (光)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-red-500/40">
                    <div className="font-serif-kr font-bold text-amber-200 text-sm flex items-center justify-between">
                      <span>38광땡</span>
                      <span className="text-[10px] text-red-400 font-normal">절대 무적</span>
                    </div>
                    <p className="text-stone-400 mt-1">3월 광 + 8월 광</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">그 어떤 패로도 꺾을 수 없는 최강의 패.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800">
                    <div className="font-serif-kr font-bold text-amber-200 text-sm">18광땡</div>
                    <p className="text-stone-400 mt-1">1월 광 + 8월 광</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">38광땡 다음의 패 (암행어사에게 패배 가능).</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800">
                    <div className="font-serif-kr font-bold text-amber-200 text-sm">13광땡</div>
                    <p className="text-stone-400 mt-1">1월 광 + 3월 광</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">강력한 광땡 (암행어사에게 패배 가능).</p>
                  </div>
                </div>
              </div>

              {/* 2. 땡 Tier */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-amber-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-bold">●</span>
                  <span className="font-serif-kr font-bold text-amber-300 text-sm">
                    상위 족보: 땡 (같은 월 2장)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2 rounded bg-neutral-950/60 border border-amber-700/40">
                    <div className="font-bold text-amber-300">장땡 (10월+10월)</div>
                    <span className="text-stone-400 text-[11px]">땡 중 최강 (땡잡이 불가)</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">9땡 (9월+9월)</div>
                    <span className="text-stone-400 text-[11px]">땡잡이 사냥 대상</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">8땡 (8월+8월)</div>
                    <span className="text-stone-400 text-[11px]">땡잡이 사냥 대상</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">7땡 (7월+7월)</div>
                    <span className="text-stone-400 text-[11px]">땡잡이 사냥 대상</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">6땡 ~ 1땡(삥땡)</div>
                    <span className="text-stone-400 text-[11px]">월 수가 높을수록 승리</span>
                  </div>
                </div>
              </div>

              {/* 3. 중간 족보 */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-bold">●</span>
                  <span className="font-serif-kr font-bold text-amber-300 text-sm">
                    중간 족보 (알리 / 독사 / 구삥 / 장삥 / 장사 / 세륙)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-amber-200">알리 (1월 + 2월)</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">중간 족보 중 1위. 구사를 무효화함.</p>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">독사 (1월 + 4월)</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">알리 다음의 2위 족보.</p>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">구삥 (1월 + 9월)</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">독사 다음의 3위 족보.</p>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">장삥 (1월 + 10월)</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">구삥 다음의 4위 족보.</p>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">장사 (4월 + 10월)</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">장삥 다음의 5위 족보.</p>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-stone-200">세륙 (4월 + 6월)</div>
                    <p className="text-stone-400 text-[11px] mt-0.5">중간 족보 마지막. 끗패 전원 승리.</p>
                  </div>
                </div>
              </div>

              {/* 4. 끗 계열 */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-bold">●</span>
                  <span className="font-serif-kr font-bold text-amber-300 text-sm">
                    끗 계열 (두 장의 월 합의 1의 자리)
                  </span>
                </div>
                <div className="text-xs text-stone-300 space-y-1 leading-relaxed">
                  <p><strong className="text-amber-200">갑오 (9끗):</strong> 끝자리가 9인 가장 높은 끗패 (예: 1+8, 2+7, 3+6, 4+5 등)</p>
                  <p><strong className="text-stone-200">8끗 ~ 1끗:</strong> 끝자리 숫자가 클수록 상위 패</p>
                  <p><strong className="text-red-400">망통 (0끗):</strong> 끝자리가 0인 최하위 패 (예: 2+8, 3+7 단 땡잡이가 아닐 때 등)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'special' && (
            <div className="space-y-4">
              {/* 특수패 설명 */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif-kr font-bold text-amber-200 text-base">
                    암행어사 (4월 열끗 + 7월 열끗)
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  상대방이 <strong>18광땡</strong> 또는 <strong>13광땡</strong>을 쥐고 있을 때, 암행어사가 출도하여 승리를 가로챕니다! (단, 38광땡은 암행어사도 잡을 수 없습니다.)
                </p>
                <p className="text-[11px] text-amber-400/80 mt-1.5">
                  ※ 상대가 18/13광땡이 아니라면 일반 1끗(4+7=11)으로 처리됩니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-600/40">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="font-serif-kr font-bold text-red-300 text-base">
                    땡잡이 (3월 + 7월)
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  상대방이 <strong>1땡부터 9땡</strong>을 쥐고 있을 때, 땡을 사냥하여 승리합니다!
                </p>
                <p className="text-[11px] text-red-400/80 mt-1.5">
                  ※ 상대가 장땡(10땡)이나 광땡, 또는 일반 족보/끗패라면 잡지 못하고 망통(0끗)이 됩니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-600/40">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <h3 className="font-serif-kr font-bold text-purple-200 text-base">
                    멍텅구리 구사 (4월 열끗 + 9월 열끗)
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  상대방이 <strong>9땡 이하(알리, 끗, 1~9땡 등)</strong>인 경우, 판을 뒤엎고 <strong>판돈 이월 재경기</strong>를 발동합니다! 오직 장땡과 광땡만이 멍텅구리 구사를 이길 수 있습니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-serif-kr font-bold text-stone-200 text-base">
                    일반 구사 (4월 + 9월)
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  상대방의 패가 <strong>알리 미만(독사, 구삥, 장삥, 세륙, 끗)</strong>일 때 <strong>판돈 이월 재경기</strong>를 만듭니다. 상대가 알리 이상이면 상대가 승리합니다.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="font-serif-kr font-bold text-amber-300 text-sm mb-2">
                  1. 진행 방식
                </h3>
                <ul className="list-disc list-inside space-y-1 text-stone-400">
                  <li><strong>2장 섯다 (기본):</strong> 각자 1장씩 받고 1차 베팅 → 2번째 카드를 받고 2차 베팅(패 쪼기) → 쇼다운(패 공개)!</li>
                  <li><strong>3장 섯다:</strong> 각자 2장씩 받고 1차 베팅 → 3번째 카드를 받은 후 3장 중 최선의 2장을 선택 → 2차 베팅 → 쇼다운!</li>
                  <li>모든 판의 시작에는 참가자 모두 기본 판돈(학교)을 냅니다.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="font-serif-kr font-bold text-amber-300 text-sm mb-2">
                  2. 베팅 액션 용어
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-400">
                  <p><strong className="text-stone-200">체크:</strong> 베팅 금액을 올리지 않고 상대에게 턴을 넘깁니다.</p>
                  <p><strong className="text-stone-200">콜:</strong> 상대방이 올린 금액만큼 맞춰서 냅니다.</p>
                  <p><strong className="text-stone-200">삥:</strong> 첫 턴에 기본 판돈(학교)만큼 베팅합니다.</p>
                  <p><strong className="text-stone-200">따당:</strong> 상대가 올린 금액의 2배로 레이즈합니다.</p>
                  <p><strong className="text-stone-200">쿼터:</strong> 현재 쌓인 판돈의 25%를 추가 베팅합니다.</p>
                  <p><strong className="text-stone-200">하프:</strong> 현재 쌓인 판돈의 50%를 추가 베팅합니다.</p>
                  <p><strong className="text-stone-200">풀:</strong> 현재 쌓인 전체 판돈만큼 추가 베팅합니다.</p>
                  <p><strong className="text-stone-200">다이:</strong> 현재 판을 포기하고 지금까지 베팅한 판돈을 넘깁니다.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="font-serif-kr font-bold text-amber-300 text-sm mb-2">
                  3. 패 쪼기 (손맛의 묘미)
                </h3>
                <p className="text-stone-400">
                  2번째 카드를 받을 때, 카드를 위로 살살 밀어올리거나 '쪼기' 버튼을 클릭하여 슬로우 모션으로 카드를 확인할 수 있습니다. 심장 박동 소리와 함께 실감 나는 긴장감을 느껴보세요!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-serif-kr font-bold text-xs bg-amber-600 hover:bg-amber-500 text-neutral-950 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
