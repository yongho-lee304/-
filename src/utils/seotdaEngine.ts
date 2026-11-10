import { HwatuCard, HandEvaluation, RoundResult } from '../types/seotda';

// 20-card deck for Seotda (Months 1 ~ 10, 2 cards per month)
export const SEOTDA_CARDS: HwatuCard[] = [
  // 1월 송학
  { id: 'c1_gwang', month: 1, type: 'gwang', name: '1월 송학 광', monthName: '송학', subName: '광', isGwang: true },
  { id: 'c1_pi', month: 1, type: 'pi', name: '1월 송학 피', monthName: '송학', subName: '피', isGwang: false },

  // 2월 매조
  { id: 'c2_yeol', month: 2, type: 'yeol', name: '2월 매조 열끗', monthName: '매조', subName: '열끗', isGwang: false },
  { id: 'c2_pi', month: 2, type: 'pi', name: '2월 매조 피', monthName: '매조', subName: '피', isGwang: false },

  // 3월 벚꽃
  { id: 'c3_gwang', month: 3, type: 'gwang', name: '3월 벚꽃 광', monthName: '벚꽃', subName: '광', isGwang: true },
  { id: 'c3_pi', month: 3, type: 'pi', name: '3월 벚꽃 피', monthName: '벚꽃', subName: '피', isGwang: false },

  // 4월 흑싸리
  { id: 'c4_yeol', month: 4, type: 'yeol', name: '4월 흑싸리 열끗', monthName: '흑싸리', subName: '열끗', isGwang: false, isSpecialYeol: true },
  { id: 'c4_pi', month: 4, type: 'pi', name: '4월 흑싸리 피', monthName: '흑싸리', subName: '피', isGwang: false },

  // 5월 난초
  { id: 'c5_yeol', month: 5, type: 'yeol', name: '5월 난초 열끗', monthName: '난초', subName: '열끗', isGwang: false },
  { id: 'c5_pi', month: 5, type: 'pi', name: '5월 난초 피', monthName: '난초', subName: '피', isGwang: false },

  // 6월 모란
  { id: 'c6_yeol', month: 6, type: 'yeol', name: '6월 모란 열끗', monthName: '모란', subName: '열끗', isGwang: false },
  { id: 'c6_pi', month: 6, type: 'pi', name: '6월 모란 피', monthName: '모란', subName: '피', isGwang: false },

  // 7월 홍싸리
  { id: 'c7_yeol', month: 7, type: 'yeol', name: '7월 홍싸리 열끗', monthName: '홍싸리', subName: '열끗', isGwang: false, isSpecialYeol: true },
  { id: 'c7_pi', month: 7, type: 'pi', name: '7월 홍싸리 피', monthName: '홍싸리', subName: '피', isGwang: false },

  // 8월 공산
  { id: 'c8_gwang', month: 8, type: 'gwang', name: '8월 공산 광', monthName: '공산', subName: '광', isGwang: true },
  { id: 'c8_yeol', month: 8, type: 'yeol', name: '8월 공산 열끗', monthName: '공산', subName: '열끗', isGwang: false },

  // 9월 국화
  { id: 'c9_yeol', month: 9, type: 'yeol', name: '9월 국화 열끗', monthName: '국화', subName: '열끗', isGwang: false, isSpecialYeol: true },
  { id: 'c9_pi', month: 9, type: 'pi', name: '9월 국화 피', monthName: '국화', subName: '피', isGwang: false },

  // 10월 단풍
  { id: 'c10_yeol', month: 10, type: 'yeol', name: '10월 단풍 열끗', monthName: '단풍', subName: '열끗', isGwang: false },
  { id: 'c10_pi', month: 10, type: 'pi', name: '10월 단풍 피', monthName: '단풍', subName: '피', isGwang: false },
];

/**
 * Shuffle deck using Fisher-Yates
 */
export function createShuffledDeck(): HwatuCard[] {
  const deck = [...SEOTDA_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Evaluates a 2-card hand in Seotda
 */
export function evaluateHand(c1: HwatuCard, c2: HwatuCard): HandEvaluation {
  // Sort so card with smaller month comes first
  const [first, second] = c1.month <= c2.month ? [c1, c2] : [c2, c1];
  const m1 = first.month;
  const m2 = second.month;

  // 1. 38광땡: 3월 광 + 8월 광 (절대 무적)
  if (m1 === 3 && m2 === 8 && first.isGwang && second.isGwang) {
    return {
      cards: [first, second],
      jokboName: '38광땡',
      category: 'gwang_ddaeng',
      score: 10000,
      description: '천하무적 38광땡! 그 어떤 족보도 이길 수 없는 최강의 패입니다.',
    };
  }

  // 2. 18광땡: 1월 광 + 8월 광
  if (m1 === 1 && m2 === 8 && first.isGwang && second.isGwang) {
    return {
      cards: [first, second],
      jokboName: '18광땡',
      category: 'gwang_ddaeng',
      score: 9500,
      description: '18광땡! 38광땡과 암행어사를 제외하고 모두를 꺾는 강력한 패.',
    };
  }

  // 3. 13광땡: 1월 광 + 3월 광
  if (m1 === 1 && m2 === 3 && first.isGwang && second.isGwang) {
    return {
      cards: [first, second],
      jokboName: '13광땡',
      category: 'gwang_ddaeng',
      score: 9400,
      description: '13광땡! 38광땡과 암행어사를 제외하고 모두를 꺾는 패입니다.',
    };
  }

  // Check special counter combinations
  // 암행어사: 4월 열끗 + 7월 열끗 (18/13광땡을 잡는 어사출도)
  const isSecretInspector = (m1 === 4 && m2 === 7 && first.isSpecialYeol && second.isSpecialYeol);

  // 땡잡이: 3월 + 7월 (1땡~9땡을 잡음)
  const isDdaengCatcher = (m1 === 3 && m2 === 7);

  // 멍텅구리 구사 (4월 열끗 + 9월 열끗)
  const isMeongGusa = (m1 === 4 && m2 === 9 && first.isSpecialYeol && second.isSpecialYeol);

  // 일반 구사 (4월 + 9월, 멍텅구리가 아님)
  const isGusa = (m1 === 4 && m2 === 9 && !isMeongGusa);

  // 4. 땡 (Same month pair)
  if (m1 === m2) {
    const ddaengNames: Record<number, string> = {
      10: '장땡',
      9: '9땡',
      8: '8땡',
      7: '7땡',
      6: '6땡',
      5: '5땡',
      4: '4땡',
      3: '3땡',
      2: '2땡',
      1: '1땡 (삥땡)',
    };
    const scoreBase = m1 === 10 ? 8000 : 7000 + m1 * 100;
    return {
      cards: [first, second],
      jokboName: ddaengNames[m1],
      category: 'ddaeng',
      score: scoreBase,
      description: m1 === 10 ? '장땡! 광땡 바로 다음의 최상위 땡입니다.' : `${m1}땡! 강력한 승부패입니다.`,
    };
  }

  // 5. 중간 족보 (알리, 독사, 구삥, 장삥, 장사, 세륙)
  if (m1 === 1 && m2 === 2) {
    return {
      cards: [first, second],
      jokboName: '알리',
      category: 'middle',
      score: 6000,
      description: '알리 (1·2월)! 중간 족보 중 가장 높은 강력한 족보입니다.',
    };
  }

  if (m1 === 1 && m2 === 4) {
    return {
      cards: [first, second],
      jokboName: '독사',
      category: 'middle',
      score: 5900,
      description: '독사 (1·4월)! 알리 바로 아래의 맹독 같은 족보.',
    };
  }

  if (m1 === 1 && m2 === 9) {
    return {
      cards: [first, second],
      jokboName: '구삥',
      category: 'middle',
      score: 5800,
      description: '구삥 (1·9월)! 쏠쏠한 상위 족보입니다.',
    };
  }

  if (m1 === 1 && m2 === 10) {
    return {
      cards: [first, second],
      jokboName: '장삥',
      category: 'middle',
      score: 5700,
      description: '장삥 (1·10월)! 알찬 승부패입니다.',
    };
  }

  if (m1 === 4 && m2 === 10) {
    return {
      cards: [first, second],
      jokboName: '장사',
      category: 'middle',
      score: 5600,
      description: '장사 (4·10월)! 묵직한 장사 족보입니다.',
    };
  }

  if (m1 === 4 && m2 === 6) {
    return {
      cards: [first, second],
      jokboName: '세륙',
      category: 'middle',
      score: 5500,
      description: '세륙 (4·6월)! 끗패들을 모두 제압하는 기본 족보입니다.',
    };
  }

  // Special counter tags before normal kket evaluation
  if (isMeongGusa) {
    return {
      cards: [first, second],
      jokboName: '멍텅구리 구사',
      category: 'special',
      score: 430, // 4+9 = 13 -> 3끗 기본
      isMeongGusa: true,
      description: '멍텅구리 구사 (4열끗·9열끗)! 9땡 이하의 상대와 맞붙으면 판돈 이월 재경기!',
    };
  }

  if (isGusa) {
    return {
      cards: [first, second],
      jokboName: '구사',
      category: 'special',
      score: 430, // 3끗 기본
      isGusa: true,
      description: '구사 (4월·9월)! 상대가 알리 미만이면 재경기를 만듭니다.',
    };
  }

  if (isSecretInspector) {
    return {
      cards: [first, second],
      jokboName: '암행어사',
      category: 'special',
      score: 410, // 4+7 = 11 -> 1끗 기본
      isSecretInspectorCandidate: true,
      description: '암행어사 (4열끗·7열끗)! 상대의 18/13광땡을 응징하는 비밀 병기. 평소엔 1끗.',
    };
  }

  if (isDdaengCatcher) {
    return {
      cards: [first, second],
      jokboName: '땡잡이',
      category: 'special',
      score: 400, // 3+7 = 10 -> 망통 (0끗) 기본
      isDdaengCatcherCandidate: true,
      description: '땡잡이 (3월·7월)! 1땡부터 9땡까지 잡아내는 사냥꾼. 땡이 없으면 망통(0끗).',
    };
  }

  // 6. 끗 (Sum % 10)
  const sumMod = (m1 + m2) % 10;
  if (sumMod === 9) {
    return {
      cards: [first, second],
      jokboName: '갑오 (9끗)',
      category: 'kket',
      score: 490,
      description: '갑오 (9끗)! 끗 중에서 가장 높은 패입니다.',
    };
  }

  if (sumMod === 0) {
    return {
      cards: [first, second],
      jokboName: '망통 (0끗)',
      category: 'kket',
      score: 400,
      description: '망통 (0끗)... 운이 다했군요. 가장 낮은 패입니다.',
    };
  }

  return {
    cards: [first, second],
    jokboName: `${sumMod}끗`,
    category: 'kket',
    score: 400 + sumMod * 10,
    description: `${sumMod}끗! 두 장의 합(${m1 + m2})의 끝자리입니다.`,
  };
}

/**
 * Resolves a showdown matchup between user and AI taking all special counters into account.
 */
export function resolveMatchup(
  userHand: HandEvaluation,
  aiHand: HandEvaluation,
  currentPot: number
): RoundResult {
  // Check 1: 멍텅구리 구사 (4열+9열)
  // Opponents with 9땡 or lower (including all middle jokbos, kket, etc.) trigger rematch!
  // Only 38광땡, 18/13광땡, 장땡 beat 멍구사.
  if (userHand.isMeongGusa || aiHand.isMeongGusa) {
    const gusaPlayer = userHand.isMeongGusa ? 'user' : 'ai';
    const opponentHand = userHand.isMeongGusa ? aiHand : userHand;

    // Does opponent have 장땡 (8000) or 광땡 (9400+)?
    if (opponentHand.score >= 8000) {
      const winner = gusaPlayer === 'user' ? 'ai' : 'user';
      return {
        winner,
        userHand,
        aiHand,
        potAmount: currentPot,
        reason: `${opponentHand.jokboName}이(가) 멍텅구리 구사를 꺾었습니다!`,
        isRematch: false,
      };
    } else {
      return {
        winner: 'rematch',
        userHand,
        aiHand,
        potAmount: currentPot,
        reason: '멍텅구리 구사 발동! 판돈이 이월되고 재경기가 시작됩니다.',
        isRematch: true,
        specialEvent: '멍텅구리 구사 재경기!',
      };
    }
  }

  // Check 2: 일반 구사 (4+9)
  // Rematch if opponent is below 알리 (score < 6000)
  if (userHand.isGusa || aiHand.isGusa) {
    const gusaPlayer = userHand.isGusa ? 'user' : 'ai';
    const opponentHand = userHand.isGusa ? aiHand : userHand;

    if (opponentHand.score >= 6000) {
      // Opponent has 알리 (6000) or higher -> Opponent wins!
      const winner = gusaPlayer === 'user' ? 'ai' : 'user';
      return {
        winner,
        userHand,
        aiHand,
        potAmount: currentPot,
        reason: `상대(${opponentHand.jokboName})가 알리 이상이므로 구사가 무효화되었습니다.`,
        isRematch: false,
      };
    } else {
      return {
        winner: 'rematch',
        userHand,
        aiHand,
        potAmount: currentPot,
        reason: '구사 발동! 상대가 알리 미만이므로 판돈 이월 재경기가 진행됩니다.',
        isRematch: true,
        specialEvent: '구사 재경기!',
      };
    }
  }

  // Check 3: 암행어사 (4열+7열) vs 18광땡 / 13광땡
  if (userHand.isSecretInspectorCandidate && (aiHand.jokboName === '18광땡' || aiHand.jokboName === '13광땡')) {
    return {
      winner: 'user',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `암행어사 출도야! 상대의 ${aiHand.jokboName}을 잡았습니다!`,
      isRematch: false,
      specialEvent: '암행어사 출도!',
    };
  }
  if (aiHand.isSecretInspectorCandidate && (userHand.jokboName === '18광땡' || userHand.jokboName === '13광땡')) {
    return {
      winner: 'ai',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `상대방 암행어사 출도! 나의 ${userHand.jokboName}이 잡혔습니다.`,
      isRematch: false,
      specialEvent: '상대 암행어사 적중!',
    };
  }

  // Check 4: 땡잡이 (3+7) vs 1땡~9땡 (score between 7100 and 7900)
  const isAiNormalDdaeng = aiHand.score >= 7100 && aiHand.score <= 7900;
  if (userHand.isDdaengCatcherCandidate && isAiNormalDdaeng) {
    return {
      winner: 'user',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `땡잡이 성공! 상대의 ${aiHand.jokboName}을 사냥했습니다!`,
      isRematch: false,
      specialEvent: '땡잡이 성공!',
    };
  }

  const isUserNormalDdaeng = userHand.score >= 7100 && userHand.score <= 7900;
  if (aiHand.isDdaengCatcherCandidate && isUserNormalDdaeng) {
    return {
      winner: 'ai',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `상대의 땡잡이 발동! 나의 ${userHand.jokboName}이 사냥당했습니다.`,
      isRematch: false,
      specialEvent: '상대 땡잡이 적중!',
    };
  }

  // Standard Score Comparison
  if (userHand.score > aiHand.score) {
    return {
      winner: 'user',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `내 패(${userHand.jokboName})가 상대(${aiHand.jokboName})를 이겼습니다!`,
      isRematch: false,
    };
  } else if (aiHand.score > userHand.score) {
    return {
      winner: 'ai',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `상대의 패(${aiHand.jokboName})가 내 패(${userHand.jokboName})를 앞섰습니다.`,
      isRematch: false,
    };
  } else {
    // Tie (Same Jokbo)
    return {
      winner: 'rematch',
      userHand,
      aiHand,
      potAmount: currentPot,
      reason: `동점(${userHand.jokboName})! 판돈을 그대로 남기고 재경기를 치릅니다.`,
      isRematch: true,
      specialEvent: '동점 재경기!',
    };
  }
}

/**
 * 3-Card Seotda evaluation helper: finds the best 2 cards out of 3.
 */
export function findBestPairOfThree(cards: [HwatuCard, HwatuCard, HwatuCard]): {
  bestHand: HandEvaluation;
  bestPair: [HwatuCard, HwatuCard];
  discarded: HwatuCard;
} {
  const pairs: Array<{ pair: [HwatuCard, HwatuCard]; discarded: HwatuCard; eval: HandEvaluation }> = [
    { pair: [cards[0], cards[1]], discarded: cards[2], eval: evaluateHand(cards[0], cards[1]) },
    { pair: [cards[0], cards[2]], discarded: cards[1], eval: evaluateHand(cards[0], cards[2]) },
    { pair: [cards[1], cards[2]], discarded: cards[0], eval: evaluateHand(cards[1], cards[2]) },
  ];

  pairs.sort((a, b) => b.eval.score - a.eval.score);
  return {
    bestHand: pairs[0].eval,
    bestPair: pairs[0].pair,
    discarded: pairs[0].discarded,
  };
}

/**
 * AI Opponents configuration with unique playstyles and personalities
 */
export const AI_OPPONENTS: Record<string, import('../types/seotda').AIPersonality> = {
  goni: {
    id: 'goni',
    name: '고니 (Gon-i)',
    title: '신중한 승부사',
    avatar: '/src/assets/images/ai_tazza_opponent_1794288302550.jpg',
    aggression: 0.55,
    bluffRate: 0.25,
    description: '판의 흐름을 냉철하게 읽으며 필요할 때만 묵직한 한 방을 던지는 정통 타짜.',
    quotes: {
      start: ['판이 깔렸으니 패나 한번 쪼아볼까.', '싸늘하다... 가슴에 비수가 날아와 꽂힌다.', '늑대 새끼가 양 가죽을 썼는지 확인해 봐야지.'],
      betHigh: ['겁나면 지금 죽어, 안 말린다.', '따당! 묻고 더블로 가!', '쫄리면 뒈지시던가.'],
      call: ['받고, 어디 한 번 까보자.', '콜. 거기까지는 봐주지.', '따라가지. 손목 걸 준비나 해.'],
      bluff: ['판돈이 달달하네, 다 내 거다.', '어디 도망갈 구멍이 있나 보시게.'],
      win: ['화투판엔 영원한 친구도 원수도 없는 법이야.', '그러게 왜 끝까지 따라왔어?', '이게 바로 기술이라는 거다.'],
      lose: ['패가 안 붙었군. 인정한다.', '제법이네. 다음 판엔 국물도 없다.', '한 판 줬다고 판이 끝난 건 아니지.'],
      die: ['아쉽지만 이번엔 접는다.', '다이. 다음 판에 승부 보지.', '무리할 거 없지. 패 버린다.'],
    },
  },
  agwi: {
    id: 'agwi',
    name: '아귀 (Agwi)',
    title: '지옥의 맹수',
    avatar: '/src/assets/images/ai_tazza_opponent_1794288302550.jpg',
    aggression: 0.85,
    bluffRate: 0.45,
    description: '맹렬한 올인과 거침없는 블러핑으로 상대를 벼랑 끝으로 몰아넣는 난폭한 타짜.',
    quotes: {
      start: ['동작 그만! 밑장빼기냐?', '오냐, 오늘 여기서 누구 하나 피 보는 거다.', '패 돌려라. 화끈하게 피바다 만들어보자고.'],
      betHigh: ['풀! 있는 돈 탈탈 털어 넣으쇼!', '하프 치고 더 간다! 감당 되겠어?!', '손목 가지 날아갈 준비나 해라!'],
      call: ['콜! 숨통을 끊어주마.', '얼마나 센 패길래 기세가 등등해? 까봐!', '받았어. 어디 한 번 들이대 봐라!'],
      bluff: ['패가 예술이구만! 넌 오늘 죽었어.', '기어서 나갈 생각 마라!'],
      win: ['봤냐? 이게 바로 아귀의 눈이다!', '거 봐, 손목 단단히 붙들어 매라 그랬지!', '내 손에 걸리면 누구든 끝장이야!'],
      lose: ['큭... 운이 좋았군, 애송이.', '내가 졌다고? 다음 판에 네 밑천 다 털어주마!', '두고 봐라, 피눈물 흘리게 해 줄 테니.'],
      die: ['쳇, 똥 밟았네. 다이다, 다이!', '더러워서 이번 판은 던져준다.', '기다려라, 방심할 때 목을 딸 테니.'],
    },
  },
  jeong: {
    id: 'jeong',
    name: '정마담 (Madam Jeong)',
    title: '도도한 설계자',
    avatar: '/src/assets/images/seotda_tazza_madam_1794288303636.jpg',
    aggression: 0.65,
    bluffRate: 0.35,
    description: '부드러운 미소 뒤에 독을 품고 심리전을 유도하여 밑천을 거두어들이는 하우스의 안주인.',
    quotes: {
      start: ['어서 오세요. 오늘 밤은 꽤 길 것 같네요.', '패에 너무 욕심내면 다치는 법이랍니다.', '재미있는 승부가 되겠군요.'],
      betHigh: ['어머, 조금 더 판을 키워볼까요? 쿼터!', '긴장하셨나 봐요? 하프로 올려드리죠.', '자신 있으면 따라와 보시겠어요?'],
      call: ['흥미진진하네요, 콜.', '조금 더 지켜보겠어요.', '확인해보는 값 치곤 괜찮네요.'],
      bluff: ['호호, 제 눈빛에 흔들리시는 건가요?', '이번 판은 제게 조금 기울었네요.'],
      win: ['어머, 판돈 감사히 잘 거둘게요.', '제가 말씀드렸잖아요. 욕심은 금물이라고.', '또 한 분의 손님이 빈손으로 가시겠네.'],
      lose: ['어머나, 제 계산을 벗어나셨군요.', '제법 날카로우시네요. 다음엔 안 봐드려요.', '오늘 밤은 댁의 날인가 봐요.'],
      die: ['아쉽지만 쉬어가야겠어요.', '다이. 물러설 줄 아는 게 진정한 승자죠.', '다음 판을 기약하겠어요.'],
    },
  },
};
