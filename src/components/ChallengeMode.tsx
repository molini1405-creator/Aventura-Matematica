import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Zap,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Volume2,
  Trophy,
  CheckCircle2,
  XCircle,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ChallengeModeProps {
  onGoHome: () => void;
  onAddStar: () => void;
  onUnlockBadge?: (id: string) => void;
  starsCount?: number;
}

interface ChallengeProblem {
  id: number;
  factorA: number; // e.g. 3 (number of groups / times)
  factorB: number; // e.g. 4 (items per group)
  multiplication: string; // "3 × 4"
  addition: string; // "4 + 4 + 4"
  timesExplanation: string; // "3 veces 4"
  correctAnswer: number; // 12
  options: number[]; // 4 shuffled options
  itemType: 'uva' | 'manzana' | 'cereza' | 'sol';
  itemName: string;
}

const CHECKPOINTS = [
  { name: 'Viñedos de Maipú', icon: '🍇', bg: 'from-purple-500 to-indigo-600' },
  { name: 'Cerezales de Tunuyán', icon: '🍒', bg: 'from-rose-500 to-red-600' },
  { name: 'Embalse Potrerillos', icon: '🌊', bg: 'from-sky-500 to-blue-600' },
  { name: 'Puente del Inca', icon: '🌉', bg: 'from-amber-500 to-orange-600' },
  { name: 'Cumbre del Aconcagua', icon: '🏔️', bg: 'from-emerald-500 to-teal-700' },
];

const ITEM_CONFIG: Record<
  'uva' | 'manzana' | 'cereza' | 'sol',
  { emoji: string; nameSingular: string; namePlural: string; color: string }
> = {
  uva: { emoji: '🍇', nameSingular: 'uva', namePlural: 'uvas', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  cereza: { emoji: '🍒', nameSingular: 'cereza', namePlural: 'cerezas', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  manzana: { emoji: '🍎', nameSingular: 'manzana', namePlural: 'manzanas', color: 'bg-red-100 text-red-700 border-red-200' },
  sol: { emoji: '☀️', nameSingular: 'sol', namePlural: 'soles', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const TOTAL_RACE_SECONDS = 50;

/**
 * Generate 5 distinct, high-quality multiplication problems for 2nd grade (tables 1 to 5)
 */
function generateChallengeProblems(): ChallengeProblem[] {
  // Pool of candidate factor pairs (a in 1..5, b in 1..10)
  const candidatePool: Array<{ a: number; b: number; item: 'uva' | 'manzana' | 'cereza' | 'sol' }> = [
    { a: 2, b: 2, item: 'uva' },
    { a: 2, b: 3, item: 'cereza' },
    { a: 3, b: 2, item: 'manzana' },
    { a: 2, b: 4, item: 'uva' },
    { a: 4, b: 2, item: 'sol' },
    { a: 3, b: 3, item: 'cereza' },
    { a: 2, b: 5, item: 'uva' },
    { a: 5, b: 2, item: 'sol' },
    { a: 3, b: 4, item: 'cereza' },
    { a: 4, b: 3, item: 'manzana' },
    { a: 3, b: 5, item: 'uva' },
    { a: 5, b: 3, item: 'cereza' },
    { a: 4, b: 4, item: 'uva' },
    { a: 4, b: 5, item: 'sol' },
    { a: 5, b: 4, item: 'manzana' },
    { a: 5, b: 5, item: 'uva' },
    { a: 2, b: 6, item: 'cereza' },
    { a: 2, b: 8, item: 'sol' },
    { a: 3, b: 6, item: 'uva' },
    { a: 5, b: 1, item: 'sol' },
    { a: 4, b: 1, item: 'uva' },
  ];

  // Shuffle pool and select 5
  const shuffledPool = [...candidatePool].sort(() => Math.random() - 0.5).slice(0, 5);

  return shuffledPool.map((item, index) => {
    const a = item.a;
    const b = item.b;
    const correct = a * b;

    // Build addition string: "b + b + ... a times"
    const additionParts = Array.from({ length: a }, () => b.toString());
    const addition = additionParts.join(' + ');

    // Generate 3 clever distractors appropriate for children
    const distractorSet = new Set<number>();
    distractorSet.add(correct);

    const candidates = [
      correct + b,
      correct - b > 0 ? correct - b : correct + 1,
      correct + 1,
      correct - 1 > 0 ? correct - 1 : correct + 2,
      correct + 2,
      correct - 2 > 0 ? correct - 2 : correct + 3,
      a + b, // common addition confusion
      (a + 1) * b,
    ].filter(n => n > 0 && n !== correct);

    // Shuffle candidate distractors
    const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);
    for (const c of shuffledCandidates) {
      if (distractorSet.size >= 4) break;
      distractorSet.add(c);
    }

    // Fill with fallback if needed
    let delta = 1;
    while (distractorSet.size < 4) {
      if (correct - delta > 0) distractorSet.add(correct - delta);
      distractorSet.add(correct + delta);
      delta++;
    }

    const options = Array.from(distractorSet).slice(0, 4).sort(() => Math.random() - 0.5);

    return {
      id: index + 1,
      factorA: a,
      factorB: b,
      multiplication: `${a} × ${b}`,
      addition,
      timesExplanation: `${a} veces ${b}`,
      correctAnswer: correct,
      options,
      itemType: item.item,
      itemName: ITEM_CONFIG[item.item].namePlural,
    };
  });
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
  onGoHome,
  onAddStar,
  onUnlockBadge,
  starsCount = 0,
}) => {
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'FEEDBACK' | 'SUMMARY'>('READY');
  const [problems, setProblems] = useState<ChallengeProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_RACE_SECONDS);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [totalStarsAwarded, setTotalStarsAwarded] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [personalBest, setPersonalBest] = useState<{ score: number; timeLeft: number } | null>(() => {
    try {
      const saved = localStorage.getItem('mendoza_math_challenge_best');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef<number | null>(null);

  // Initialize a new game session
  const startNewRace = () => {
    sound.playMagic();
    const newProblems = generateChallengeProblems();
    setProblems(newProblems);
    setCurrentIndex(0);
    setTimeLeft(TOTAL_RACE_SECONDS);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setCorrectAnswersCount(0);
    setTotalStarsAwarded(0);
    setTimeTaken(0);
    setGameState('PLAYING');

    // Announce first problem
    const first = newProblems[0];
    sound.speak(`¡Arranca la carrera! Primer desafío: ¿Cuánto es ${first.multiplication}?`);
  };

  // Timer loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimeout(() => {
              handleTimeExpired();
            }, 0);
            return 0;
          }
          if (prev === 11) {
            sound.playPop(300);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIndex, problems]);

  // When time runs out completely
  const handleTimeExpired = () => {
    sound.playEncouraging();
    sound.speak('¡Tiempo cumplido! Vamos a contar tus estrellas ganadas.');
    finishGame(correctAnswersCount, 0);
  };

  // Handle user selecting an option
  const handleSelectOption = (option: number) => {
    if (gameState !== 'PLAYING' || selectedOption !== null) return;

    setSelectedOption(option);
    const currentProblem = problems[currentIndex];
    const correct = option === currentProblem.correctAnswer;
    setIsAnswerCorrect(correct);
    setGameState('FEEDBACK');

    const nextCorrectCount = correct ? correctAnswersCount + 1 : correctAnswersCount;

    if (correct) {
      sound.playCorrect();
      setCorrectAnswersCount(nextCorrectCount);
    } else {
      sound.playEncouraging();
    }

    // Move to next problem or finish after a brief pleasant pause
    setTimeout(() => {
      if (currentIndex + 1 < problems.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerCorrect(null);
        setGameState('PLAYING');

        const nextProb = problems[currentIndex + 1];
        sound.speak(`Desafío ${currentIndex + 2}: ¿Cuánto es ${nextProb.multiplication}?`);
      } else {
        // Finished all 5 questions!
        finishGame(nextCorrectCount, timeLeft);
      }
    }, 1300);
  };

  // Compute stars, rewards, and finish
  const finishGame = (finalCorrect: number, remainingSeconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = TOTAL_RACE_SECONDS - remainingSeconds;
    setTimeTaken(elapsed);

    // Star calculation breakdown:
    // 1 base star per correct answer (up to 5)
    // Speed bonus:
    //   > 25s left: +3 extra stars
    //   > 12s left: +2 extra stars
    //   > 0s left: +1 extra star
    // Streak bonus:
    //   5/5 correct: +2 extra stars
    let speedBonus = 0;
    if (remainingSeconds >= 25 && finalCorrect >= 3) {
      speedBonus = 3;
    } else if (remainingSeconds >= 12 && finalCorrect >= 2) {
      speedBonus = 2;
    } else if (remainingSeconds > 0 && finalCorrect >= 1) {
      speedBonus = 1;
    }

    const perfectBonus = finalCorrect === 5 ? 2 : 0;
    const totalExtra = finalCorrect + speedBonus + perfectBonus;

    setTotalStarsAwarded(totalExtra);
    setGameState('SUMMARY');

    // Deliver stars to global state
    for (let i = 0; i < totalExtra; i++) {
      setTimeout(() => {
        onAddStar();
        sound.playPop(500 + i * 40);
      }, i * 180);
    }

    // Fanfare and confetti
    setTimeout(() => {
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.4 },
      });
    }, 400);

    // Unlock badge if qualified
    if (onUnlockBadge && (finalCorrect >= 3 || totalExtra >= 4)) {
      onUnlockBadge('badge_desafio_veloz');
    }

    // Save personal best
    try {
      const currentBest = personalBest;
      const isNewBest =
        !currentBest ||
        finalCorrect > currentBest.score ||
        (finalCorrect === currentBest.score && remainingSeconds > currentBest.timeLeft);

      if (isNewBest) {
        const newRecord = { score: finalCorrect, timeLeft: remainingSeconds };
        setPersonalBest(newRecord);
        localStorage.setItem('mendoza_math_challenge_best', JSON.stringify(newRecord));
      }
    } catch {
      // localStorage fallback
    }

    sound.speak(
      `¡Excelente carrera! Acertaste ${finalCorrect} de 5 problemas y ganaste ${totalExtra} estrellas extra para tu aventura.`
    );
  };

  const currentProblem = problems[currentIndex];
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / TOTAL_RACE_SECONDS) * 100));
  const isTimeCritical = timeLeft <= 10;

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-3 sm:p-6 bg-gradient-to-b from-amber-50 via-sky-50 to-orange-50 relative overflow-hidden">
      {/* Background Mendoza Mountain Silhouette */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <img
          src="/images/mendoza_landscape_kids_1794141402284.jpg"
          alt="Paisaje de Mendoza"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-2 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-amber-200 shadow-xs mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoHome}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </span>
              <div>
                <h1 className="text-sm sm:text-base font-black text-amber-950 leading-tight">
                  Modo Desafío Relámpago ⚡
                </h1>
                <span className="text-[11px] text-amber-700 font-semibold block">
                  Carrera contra el tiempo · 5 problemas de multiplicación
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stars Pill */}
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-black text-amber-950">
                {starsCount} ⭐
              </span>
            </div>

            {/* Quick Restart if in game */}
            {gameState !== 'READY' && (
              <button
                type="button"
                onClick={startNewRace}
                className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                title="Reiniciar Desafío"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: READY / INTRO SCREEN */}
        {/* ========================================================================= */}
        {gameState === 'READY' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 bg-white/95 rounded-3xl border-2 border-amber-300 shadow-xl max-w-xl mx-auto my-auto animate-fade-in">
            {/* Animated Trophy / Mascot Badge */}
            <div className="relative mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-lg flex items-center justify-center mx-auto">
                <div className="w-full h-full bg-white rounded-[22px] flex flex-col items-center justify-center p-2">
                  <span className="text-4xl sm:text-5xl animate-bounce">⚡</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-red-500 text-white font-black text-[10px] uppercase rounded-full shadow-xs border-2 border-white">
                50 Segundos
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              ¡Carrera Contra el Reloj!
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-md">
              Resuelve <strong className="text-amber-600 font-bold">5 multiplicaciones</strong> lo más rápido que puedas por los viñedos y montañas de Mendoza para ganar{' '}
              <strong className="text-sky-700 font-bold">estrellas extra</strong>.
            </p>

            {/* Rules / Rewards Cards */}
            <div className="grid grid-cols-3 gap-2 w-full my-5 text-center">
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-lg">🎯</div>
                <div className="text-xs font-black text-amber-950 mt-1">5 Preguntas</div>
                <div className="text-[10px] text-amber-800">Tablas hasta el 5</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200">
                <div className="text-lg">⏱️</div>
                <div className="text-xs font-black text-orange-950 mt-1">50 Segundos</div>
                <div className="text-[10px] text-orange-800">¡Sé veloz!</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-lg">⭐</div>
                <div className="text-xs font-black text-emerald-950 mt-1">¡Hasta 10 ⭐!</div>
                <div className="text-[10px] text-emerald-800">Bonus por tiempo</div>
              </div>
            </div>

            {/* Personal best info if exists */}
            {personalBest && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-yellow-50 border border-yellow-300 rounded-xl text-yellow-900 text-xs font-bold mb-4 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Tu récord anterior: {personalBest.score}/5 aciertos ({TOTAL_RACE_SECONDS - personalBest.timeLeft}s)
                </span>
              </div>
            )}

            {/* Start Button */}
            <button
              type="button"
              onClick={startNewRace}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-white ring-4 ring-amber-300/50"
            >
              <Zap className="w-6 h-6 fill-white" />
              <span>¡Comenzar Desafío!</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2 & 3: PLAYING & FEEDBACK (The Race) */}
        {/* ========================================================================= */}
        {(gameState === 'PLAYING' || gameState === 'FEEDBACK') && currentProblem && (
          <div className="flex-1 flex flex-col gap-3">
            {/* Header Track: 5 checkpoints along Mendoza */}
            <div className="bg-white/95 rounded-2xl p-3 border border-amber-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5 px-1">
                <span>Ruta Mendocina: Estación {currentIndex + 1} de 5</span>
                <span className="text-amber-800">
                  {CHECKPOINTS[currentIndex]?.name} {CHECKPOINTS[currentIndex]?.icon}
                </span>
              </div>

              {/* Checkpoints Bar */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {CHECKPOINTS.map((cp, idx) => {
                  const isDone = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={cp.name}
                      className={`relative flex items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-2xs font-bold'
                          : isCurrent
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md ring-2 ring-amber-300 font-black scale-102'
                          : 'bg-slate-100 text-slate-400 font-medium'
                      }`}
                    >
                      <span className="text-sm mr-1">{cp.icon}</span>
                      <span className="text-[11px] sm:text-xs">
                        {isDone ? '✓' : `#${idx + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Race Countdown Timer Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Timer
                      className={`w-4 h-4 ${
                        isTimeCritical ? 'text-red-500 animate-spin' : 'text-amber-600'
                      }`}
                    />
                    <span>Tiempo de Carrera:</span>
                  </div>
                  <span
                    className={`font-black text-sm tabular-nums px-2 py-0.5 rounded-lg ${
                      isTimeCritical
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-950'
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      timeLeft > 25
                        ? 'bg-emerald-500'
                        : timeLeft > 10
                        ? 'bg-amber-500'
                        : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${timerPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Problem Card */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-lg flex-1 flex flex-col justify-between">
              {/* Question Banner & Voice Listen */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🦊</span>
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                      Zorrito Culpeo pregunta:
                    </span>
                    <span className="text-xs text-slate-500">
                      ¿Cuántos frutos hay en total?
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    sound.speak(
                      `¿Cuánto es ${currentProblem.multiplication}? Es decir, ${currentProblem.timesExplanation}. ${currentProblem.addition}.`
                    )
                  }
                  className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer transition-colors shadow-2xs flex items-center gap-1 text-xs font-bold"
                  title="Escuchar problema"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Escuchar</span>
                </button>
              </div>

              {/* Big Math Prompt */}
              <div className="my-auto py-3 text-center">
                <div className="inline-block bg-amber-50 border-2 border-amber-300 rounded-3xl px-6 py-3 shadow-inner">
                  <span className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight">
                    {currentProblem.multiplication} = ?
                  </span>
                </div>

                {/* Repeated addition bridge helper */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-semibold">
                  <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-xl border border-sky-200">
                    💡 {currentProblem.timesExplanation}
                  </span>
                  <span className="text-slate-400">=</span>
                  <span className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-xl border border-indigo-200">
                    {currentProblem.addition}
                  </span>
                </div>

                {/* Visual Groups representation */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                  {Array.from({ length: currentProblem.factorA }).map((_, gIdx) => (
                    <div
                      key={`grp-${gIdx}`}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-2xl border-2 ${
                        ITEM_CONFIG[currentProblem.itemType].color
                      } shadow-2xs`}
                    >
                      <span className="text-[11px] font-bold opacity-75">
                        Canasto {gIdx + 1}:
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: currentProblem.factorB }).map((_, iIdx) => (
                          <span
                            key={`item-${gIdx}-${iIdx}`}
                            className="text-base sm:text-lg animate-float-slow"
                          >
                            {ITEM_CONFIG[currentProblem.itemType].emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Alert if selected */}
              {gameState === 'FEEDBACK' && (
                <div
                  className={`p-3 rounded-2xl text-center mb-3 font-bold text-sm flex items-center justify-center gap-2 animate-bounce ${
                    isAnswerCorrect
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-rose-100 text-rose-950 border border-rose-300'
                  }`}
                >
                  {isAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>
                        ¡CORRECTO! {currentProblem.multiplication} = {currentProblem.correctAnswer} 🎉
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>
                        ¡Casi! Era {currentProblem.correctAnswer} ({currentProblem.addition})
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* 4 Clickable Options */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2">
                {currentProblem.options.map((option, oIdx) => {
                  let btnStyle =
                    'bg-slate-50 hover:bg-amber-100 border-2 border-slate-200 hover:border-amber-400 text-slate-800';

                  if (gameState === 'FEEDBACK') {
                    if (option === currentProblem.correctAnswer) {
                      btnStyle = 'bg-emerald-500 border-emerald-600 text-white scale-102 shadow-lg';
                    } else if (option === selectedOption) {
                      btnStyle = 'bg-rose-500 border-rose-600 text-white';
                    } else {
                      btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={`opt-${oIdx}-${option}`}
                      type="button"
                      disabled={gameState === 'FEEDBACK'}
                      onClick={() => handleSelectOption(option)}
                      className={`py-4 sm:py-5 px-4 rounded-2xl font-black text-2xl sm:text-3xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: SUMMARY & CELEBRATION SCREEN */}
        {/* ========================================================================= */}
        {gameState === 'SUMMARY' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 bg-white/95 rounded-3xl border-2 border-amber-300 shadow-2xl max-w-xl mx-auto my-auto animate-fade-in">
            {/* Header Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-4xl sm:text-5xl">
                {correctAnswersCount >= 4 ? '🏆' : correctAnswersCount >= 2 ? '🎖️' : '🌟'}
              </div>
            </div>

            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs uppercase tracking-wider mb-2">
              ¡CARRERA FINALIZADA!
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {correctAnswersCount === 5
                ? '¡Velocidad Total Perfecta!'
                : correctAnswersCount >= 3
                ? '¡Gran Desempeño Andino!'
                : '¡Buen Intento! Sigue Entrenando'}
            </h2>

            <p className="mt-1 text-slate-600 text-sm">
              Completaste los 5 desafíos en{' '}
              <strong className="text-slate-900 font-bold">{timeTaken} segundos</strong>.
            </p>

            {/* Stars Won Big Highlight */}
            <div className="my-5 p-4 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 w-full shadow-lg border-2 border-white">
              <div className="text-xs font-black uppercase tracking-wider text-amber-900">
                ¡ESTRELLAS EXTRA GANADAS!
              </div>
              <div className="text-4xl sm:text-5xl font-black my-1 flex items-center justify-center gap-2">
                <span>+{totalStarsAwarded}</span>
                <span className="text-yellow-100">⭐</span>
              </div>
              <div className="text-xs font-bold text-amber-900/90">
                {correctAnswersCount} por aciertos + {totalStarsAwarded - correctAnswersCount} por velocidad y racha
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Aciertos Correctos</div>
                <div className="text-xl font-black text-emerald-600 mt-0.5">
                  {correctAnswersCount} / 5
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Tiempo Sobrante</div>
                <div className="text-xl font-black text-sky-600 mt-0.5">
                  {timeLeft} segundos
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={startNewRace}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>¡Correr Otra Carrera!</span>
              </button>

              <button
                type="button"
                onClick={onGoHome}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl transition-colors cursor-pointer"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 text-center py-2 text-[11px] text-slate-400 mt-2">
        <span>Matemática Escuelas de Mendoza · Práctica veloz de tablas del 1 al 5</span>
      </footer>
    </div>
  );
};
