export type CardType = 'gwang' | 'yeol' | 'pi';

export interface HwatuCard {
  id: string;
  month: number; // 1 ~ 10
  type: CardType;
  name: string; // e.g. "1월 송학 (광)"
  monthName: string; // e.g. "송학", "매조", "벚꽃", ...
  subName: string; // e.g. "광", "열끗", "피"
  isGwang: boolean;
  isSpecialYeol?: boolean; // 4월 열끗, 7월 열끗, 9월 열끗 (암행어사/멍텅구리 구사)
}

export type JokboCategory = 
  | 'gwang_ddaeng' // 38광땡, 18광땡, 13광땡
  | 'ddaeng'       // 장땡 ~ 1땡
  | 'middle'       // 알리 ~ 세륙
  | 'kket'         // 갑오(9끗) ~ 망통(0끗)
  | 'special';     // 암행어사, 땡잡이, 구사, 멍구사 (평상시 또는 카운터)

export interface HandEvaluation {
  cards: [HwatuCard, HwatuCard];
  jokboName: string;
  category: JokboCategory;
  score: number; // Numeric score for primary ranking: 38광땡 = 1000, 18/13광땡 = 900, 장땡 = 800, 9땡 = 790, ..., 알리 = 600, ..., 갑오 = 490, ..., 망통 = 400
  isSecretInspectorCandidate?: boolean; // 4열 + 7열 (암행어사)
  isDdaengCatcherCandidate?: boolean;   // 3광/피 + 7 (땡잡이 - 3, 7조합)
  isGusa?: boolean;                     // 4 + 9 일반 (구사)
  isMeongGusa?: boolean;                // 4열 + 9열 (멍텅구리 구사)
  description: string;
}

export type BettingAction = 
  | 'check'
  | 'call'
  | 'bbing'
  | 'ddadang'
  | 'quarter'
  | 'half'
  | 'full'
  | 'die';

export type GameRoundStage = 
  | 'ROUND_START'
  | 'FIRST_BETTING'
  | 'SECOND_DEAL'
  | 'SECOND_BETTING'
  | 'SHOWDOWN'
  | 'ROUND_RESULT'
  | 'GAME_OVER';

export type GameMode = 'TWO_CARD' | 'THREE_CARD';

export interface AIPersonality {
  id: 'goni' | 'agwi' | 'jeong';
  name: string;
  title: string;
  avatar: string;
  aggression: number; // 0 to 1
  bluffRate: number;  // 0 to 1
  description: string;
  quotes: {
    start: string[];
    betHigh: string[];
    call: string[];
    bluff: string[];
    win: string[];
    lose: string[];
    die: string[];
  };
}

export interface RoundResult {
  winner: 'user' | 'ai' | 'rematch';
  userHand?: HandEvaluation;
  aiHand?: HandEvaluation;
  potAmount: number;
  reason: string;
  isRematch: boolean;
  specialEvent?: string; // "암행어사 출도!", "땡잡이 적중!", "멍텅구리 구사로 판돈 이월!"
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  rematches: number;
  winRate: number;
  highestJokbo: string;
  highestPotWon: number;
  totalEarnings: number;
}
