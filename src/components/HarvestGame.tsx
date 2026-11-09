import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowLeft, RefreshCw, Volume2, Play, Pause, Clock, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface HarvestGameProps {
  onGoHome: () => void;
  onAddStar: () => void;
  onUnlockBadge?: (id: string) => void;
}

interface FallingFruit {
  id: number;
  x: number; // percentage 10% to 90%
  y: number; // percentage 0% to 100%
  speed: number;
  value: number; // the number on the basket
  label: string; // e.g. "6" or "2+2+2"
  isCorrect: boolean;
  type: 'uva' | 'manzana' | 'cereza';
}

type RoundPhase = 'READING_CONSIGNA' | 'FALLING' | 'ROUND_SUCCESS';

export const HarvestGame: React.FC<HarvestGameProps> = ({ onGoHome, onAddStar, onUnlockBadge }) => {
  const [basketX, setBasketX] = useState<number>(50); // percentage 10% to 90%
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [phase, setPhase] = useState<RoundPhase>('READING_CONSIGNA');
  const [countdown, setCountdown] = useState<number>(5);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  const [targetMath, setTargetMath] = useState<{
    prompt: string;
    multiplication: string;
    addition: string;
    groupCount: number;
    itemsPerGroup: number;
    targetValue: number;
    explanation: string;
  }>({
    prompt: '¡Atrapa la cosecha de: 3 × 2!',
    multiplication: '3 × 2',
    addition: '2 + 2 + 2',
    groupCount: 3,
    itemsPerGroup: 2,
    targetValue: 6,
    explanation: '3 veces 2 = 6',
  });

  const [fruits, setFruits] = useState<FallingFruit[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const fruitsRef = useRef<FallingFruit[]>([]);
  const basketXRef = useRef<number>(50);
  const roundRef = useRef<number>(1);
  const isEndingRoundRef = useRef<boolean>(false);

  // Sync refs with state
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  // Targets pool for tables 1 to 5 - Never display the answer in advance!
  const mathTargets = [
    { prompt: '¿Cuánto es: 2 × 2?', multiplication: '2 × 2', addition: '2 + 2', groupCount: 2, itemsPerGroup: 2, targetValue: 4, timesHint: '2 veces 2' },
    { prompt: '¿Cuánto es: 3 × 2?', multiplication: '3 × 2', addition: '2 + 2 + 2', groupCount: 3, itemsPerGroup: 2, targetValue: 6, timesHint: '3 veces 2' },
    { prompt: '¿Cuánto es: 2 × 3?', multiplication: '2 × 3', addition: '3 + 3', groupCount: 2, itemsPerGroup: 3, targetValue: 6, timesHint: '2 veces 3' },
    { prompt: '¿Cuánto es: 4 × 2?', multiplication: '4 × 2', addition: '2 + 2 + 2 + 2', groupCount: 4, itemsPerGroup: 2, targetValue: 8, timesHint: '4 veces 2' },
    { prompt: '¿Cuánto es: 3 × 3?', multiplication: '3 × 3', addition: '3 + 3 + 3', groupCount: 3, itemsPerGroup: 3, targetValue: 9, timesHint: '3 veces 3' },
    { prompt: '¿Cuánto es: 5 × 2?', multiplication: '5 × 2', addition: '2 + 2 + 2 + 2 + 2', groupCount: 5, itemsPerGroup: 2, targetValue: 10, timesHint: '5 veces 2' },
    { prompt: '¿Cuánto es: 4 × 3?', multiplication: '4 × 3', addition: '3 + 3 + 3 + 3', groupCount: 4, itemsPerGroup: 3, targetValue: 12, timesHint: '4 veces 3' },
    { prompt: '¿Cuánto es: 3 × 4?', multiplication: '3 × 4', addition: '4 + 4 + 4', groupCount: 3, itemsPerGroup: 4, targetValue: 12, timesHint: '3 veces 4' },
    { prompt: '¿Cuánto es: 3 × 5?', multiplication: '3 × 5', addition: '5 + 5 + 5', groupCount: 3, itemsPerGroup: 5, targetValue: 15, timesHint: '3 veces 5' },
    { prompt: '¿Cuánto es: 4 × 4?', multiplication: '4 × 4', addition: '4 + 4 + 4 + 4', groupCount: 4, itemsPerGroup: 4, targetValue: 16, timesHint: '4 veces 4' },
    { prompt: '¿Cuánto es: 5 × 4?', multiplication: '5 × 4', addition: '4 + 4 + 4 + 4 + 4', groupCount: 5, itemsPerGroup: 4, targetValue: 20, timesHint: '5 veces 4' },
    { prompt: '¿Cuánto es: 5 × 5?', multiplication: '5 × 5', addition: '5 + 5 + 5 + 5 + 5', groupCount: 5, itemsPerGroup: 5, targetValue: 25, timesHint: '5 veces 5' },
  ];

  const prepareNewRound = () => {
    const nextIdx = Math.floor(Math.random() * mathTargets.length);
    const chosen = mathTargets[nextIdx];
    setTargetMath({
      ...chosen,
      explanation: `${chosen.timesHint} = ?`,
    });

    // Switch to READING_CONSIGNA phase so kids have all the time to think!
    setPhase('READING_CONSIGNA');
    setCountdown(6);
    setIsTimerPaused(false);
    fruitsRef.current = [];
    isEndingRoundRef.current = false;
    setFruits([]);

    // Speak prompt clearly WITHOUT giving away the answer
    sound.speak(`¡Atención! La cuenta es: ${chosen.multiplication}. Pensá cuánto es la suma reiterada: ${chosen.addition}. Cuando sepas el resultado, ¡tocá soltar frutas!`);
  };

  const startDroppingFruits = () => {
    sound.playPop(600);
    setPhase('FALLING');

    const correctVal = targetMath.targetValue;
    const distractor1 = Math.max(1, correctVal + (Math.random() > 0.5 ? 2 : -2));
    const distractor2 = Math.max(1, correctVal + (Math.random() > 0.5 ? 4 : -3));

    const newFruits: FallingFruit[] = [
      {
        id: Date.now() + 1,
        x: 20 + Math.random() * 20,
        y: -10,
        speed: 0.32 + Math.random() * 0.12,
        value: correctVal,
        label: `${correctVal}`,
        isCorrect: true,
        type: 'uva',
      },
      {
        id: Date.now() + 2,
        x: 60 + Math.random() * 20,
        y: -25,
        speed: 0.32 + Math.random() * 0.12,
        value: distractor1,
        label: `${distractor1}`,
        isCorrect: false,
        type: 'manzana',
      },
      {
        id: Date.now() + 3,
        x: 40 + Math.random() * 20,
        y: -40,
        speed: 0.32 + Math.random() * 0.12,
        value: distractor2,
        label: `${distractor2}`,
        isCorrect: false,
        type: 'cereza',
      },
    ];

    fruitsRef.current = newFruits;
    isEndingRoundRef.current = false;
    setFruits(newFruits);
  };

  useEffect(() => {
    prepareNewRound();
  }, []);

  // Countdown timer during READING_CONSIGNA (optional auto-start if child doesn't click)
  useEffect(() => {
    if (phase !== 'READING_CONSIGNA' || isTimerPaused) return;

    if (countdown <= 0) {
      startDroppingFruits();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isTimerPaused, countdown]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX(prev => Math.max(10, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX(prev => Math.min(90, prev + 8));
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (phase === 'READING_CONSIGNA') {
          startDroppingFruits();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Game loop for falling fruits
  useEffect(() => {
    if (phase !== 'FALLING') return;

    let lastTime = performance.now();
    isEndingRoundRef.current = false;

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (isEndingRoundRef.current) return;

      const currentBasketX = basketXRef.current;
      const currentFruits = fruitsRef.current;
      const nextRemaining: FallingFruit[] = [];
      let caughtFruit: FallingFruit | null = null;

      for (const fruit of currentFruits) {
        const nextY = fruit.y + fruit.speed * 55 * dt;
        const hitBasket = nextY >= 78 && nextY <= 92 && Math.abs(fruit.x - currentBasketX) < 14;

        if (hitBasket) {
          caughtFruit = fruit;
        } else if (nextY < 105) {
          nextRemaining.push({
            ...fruit,
            y: nextY,
          });
        }
      }

      fruitsRef.current = nextRemaining;
      setFruits(nextRemaining);

      if (caughtFruit) {
        isEndingRoundRef.current = true;
        const cf = caughtFruit;
        if (cf.isCorrect) {
          sound.playCorrect();
          onAddStar();
          if (onUnlockBadge) onUnlockBadge('badge_atrapa_cosecha');
          setScore(s => s + 10);
          confetti({
            particleCount: 35,
            spread: 55,
            origin: { y: 0.8, x: currentBasketX / 100 },
          });
        } else {
          sound.playEncouraging();
        }

        setPhase('ROUND_SUCCESS');
        setTimeout(() => {
          const currentRound = roundRef.current;
          if (currentRound >= 5) {
            sound.playFanfare();
            setIsGameOver(true);
          } else {
            setRound(r => r + 1);
            prepareNewRound();
          }
        }, 800);
        return;
      }

      if (nextRemaining.length === 0 && currentFruits.length > 0) {
        isEndingRoundRef.current = true;
        sound.playEncouraging();
        setPhase('ROUND_SUCCESS');
        setTimeout(() => {
          const currentRound = roundRef.current;
          if (currentRound >= 5) {
            sound.playFanfare();
            setIsGameOver(true);
          } else {
            setRound(r => r + 1);
            prepareNewRound();
          }
        }, 800);
        return;
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [phase, onAddStar, onUnlockBadge]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, relativeX)));
  };

  const handleRestart = () => {
    setScore(0);
    setRound(1);
    setIsGameOver(false);
    prepareNewRound();
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Top Header */}
      <div className="bg-white/95 rounded-2xl p-3 border border-emerald-200 shadow-xs flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-emerald-950 flex items-center gap-1.5">
              <span>🧺</span>
              <span>Atrapa la Cosecha Mendocina</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-emerald-700">
              Leé con calma, pensá el número y atrápalas en tu canasto
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-amber-100 rounded-xl border border-amber-300 text-amber-900 text-xs font-bold">
            Puntos: <span className="tabular-nums font-black">{score}</span>
          </div>
          <button
            type="button"
            onClick={() => sound.speak(targetMath.prompt + '. ' + targetMath.explanation)}
            className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 cursor-pointer"
            title="Escuchar consigna"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target prompt Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white p-3 rounded-2xl text-center shadow-md mb-3 border-2 border-white">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-90 px-2">
          <span>Ronda {Math.min(round, 5)} de 5</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full">
            {phase === 'READING_CONSIGNA' ? '⏱️ Tiempo para pensar' : '🍇 ¡A atrapar!'}
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black drop-shadow-xs my-0.5">
          {targetMath.multiplication} = ?
        </div>
        <div className="text-xs sm:text-sm font-semibold opacity-95">
          Suma reiterada: {targetMath.addition}
        </div>
      </div>

      {/* Game Field Canvas Area */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 select-none cursor-crosshair touch-none"
      >
        {/* Background Scenery: Aconcagua & Vineyards */}
        <div className="absolute top-3 right-6 text-4xl animate-pulse-gentle">☀️</div>
        <div className="absolute bottom-16 inset-x-0 h-24 opacity-30 flex items-end justify-around pointer-events-none text-4xl">
          <span>🏔️</span>
          <span>🍇</span>
          <span>🏔️</span>
          <span>🍇</span>
        </div>

        {/* ======================================================== */}
        {/* PHASE 1: READING & THINKING MODAL OVERLAY (Tiempo para pensar) */}
        {/* ======================================================== */}
        {phase === 'READING_CONSIGNA' && (
          <div className="absolute inset-0 bg-white/92 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-6 text-center z-20 animate-pulse-gentle">
            {/* Mascot advice */}
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 max-w-md mb-4 shadow-sm">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-amber-400 shadow-xs">
                <img
                  src="/images/mascot_condorito_1794142177878.jpg"
                  alt="Condorito"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-amber-900 block">Condorito te aconseja:</span>
                <p className="text-xs text-slate-700 font-medium">
                  «¡Leé la cuenta con calma y calculá el resultado en tu cabeza! Cuando estés listo, tocá el botón para soltar las frutas.»
                </p>
              </div>
            </div>

            {/* The Math Concept Card - No answer revealed */}
            <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4 max-w-sm w-full mb-4 shadow-xs">
              <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wider block mb-1">
                Calcula en tu cabeza:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-sky-950 font-mono">
                {targetMath.multiplication} = ?
              </div>
              <div className="text-sm font-bold text-amber-700 mt-1">
                ¿Cuánto es {targetMath.groupCount} veces {targetMath.itemsPerGroup}?
              </div>
              <div className="text-xs text-slate-600 mt-1 font-mono">
                Suma: {targetMath.addition} = ?
              </div>

              {/* Visual Fruit Dots representation */}
              <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-sky-200">
                {Array.from({ length: targetMath.groupCount }).map((_, gIdx) => (
                  <div key={gIdx} className="bg-white px-2 py-1 rounded-lg border border-sky-200 flex items-center gap-0.5 text-base">
                    {Array.from({ length: targetMath.itemsPerGroup }).map((_, iIdx) => (
                      <span key={iIdx}>🍇</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button: Release Fruits */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={startDroppingFruits}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer border-2 border-white ring-4 ring-emerald-200"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>¡Ya lo pensé! ¡Soltar frutas! 🚀</span>
              </button>

              {/* Optional timer pause/play button */}
              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                title={isTimerPaused ? 'Reanudar temporizador' : 'Pausar para pensar más'}
              >
                {isTimerPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sin apuro</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Soltando en {countdown}s (Pausar)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Falling Fruit Baskets (Active during FALLING phase) */}
        {fruits.map(fruit => (
          <div
            key={fruit.id}
            style={{
              left: `${fruit.x}%`,
              top: `${fruit.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute flex flex-col items-center pointer-events-none transition-transform"
          >
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-white/95 border-3 border-amber-400 shadow-md flex flex-col items-center justify-center p-1">
              <span className="text-xl sm:text-2xl">
                {fruit.type === 'uva' ? '🍇' : fruit.type === 'manzana' ? '🍎' : '🍒'}
              </span>
              <span className="text-xs sm:text-base font-black text-amber-950 leading-none">
                {fruit.label}
              </span>
            </div>
          </div>
        ))}

        {/* Player's Basket Crate */}
        <div
          style={{
            left: `${basketX}%`,
            bottom: '12px',
            transform: 'translateX(-50%)',
          }}
          className="absolute flex flex-col items-center transition-all duration-75 pointer-events-none"
        >
          <span className="text-[10px] font-bold bg-amber-900 text-amber-100 px-2 py-0.5 rounded-full mb-1 shadow-xs whitespace-nowrap">
            Canasto de Mendoza
          </span>
          <div className="w-20 sm:w-24 h-12 sm:h-14 bg-amber-600 rounded-xl border-3 border-amber-800 shadow-lg flex items-center justify-center text-2xl relative overflow-hidden">
            <span className="drop-shadow-xs">🧺</span>
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-amber-900"></div>
          </div>
        </div>

        {/* Game Over / Finish Modal */}
        {isGameOver && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-sky-950">
              ¡Cosecha Mendocina Completada!
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-sm">
              ¡Increíble trabajo! Pensaste cada consigna y atrapaste los números correctos. Sumaste{' '}
              <strong className="text-amber-600 font-bold">{score} puntos</strong>.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Jugar Otra Vez</span>
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="px-5 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold rounded-xl cursor-pointer"
              >
                Volver al Menú
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch / Onscreen Controls for Mobile & Tablets */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setBasketX(prev => Math.max(10, prev - 12))}
          className="flex-1 py-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-2xl font-black text-amber-900 shadow-sm active:scale-95 cursor-pointer text-base flex items-center justify-center gap-1"
        >
          <span>⬅️</span>
          <span>Mover a la Izquierda</span>
        </button>

        <button
          type="button"
          onClick={() => setBasketX(prev => Math.min(90, prev + 12))}
          className="flex-1 py-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-2xl font-black text-amber-900 shadow-sm active:scale-95 cursor-pointer text-base flex items-center justify-center gap-1"
        >
          <span>Mover a la Derecha</span>
          <span>➡️</span>
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 mt-2">
        💡 Primero lees la cuenta para pensar el resultado, y luego mueves el canasto con las flechas o tu dedo.
      </p>
    </div>
  );
};
