import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  Lock,
  ArrowLeft,
  Volume2,
  Star,
  CheckCircle2,
  Compass,
  Check,
  ChevronRight,
  Zap,
  Lightbulb,
  X,
  ExternalLink,
} from 'lucide-react';
import { GameScreen } from '../types/game';
import { ALL_BADGES, getPlayerRank, PLAYER_RANKS } from '../data/badgesData';
import { sound } from '../utils/audio';

interface RewardCabinetProps {
  unlockedBadgeIds: string[];
  starsCount: number;
  playerName: string;
  onGoHome: () => void;
  onOpenDiploma: () => void;
  onUnlockBadge?: (id: string) => void;
  onAddStar?: () => void;
  onNavigate?: (screen: GameScreen) => void;
}

interface LearningTableItem {
  tableNum: number;
  badgeId: string;
  title: string;
  subtitle: string;
  icon: string;
  colorGradient: string;
  borderBadge: string;
  themeMendoza: string;
  pedagogicalSecret: string;
  sampleSequence: number[];
  fullTable: Array<{ mult: string; add: string; result: number }>;
}

const LEARNING_TABLES: LearningTableItem[] = [
  {
    tableNum: 1,
    badgeId: 'badge_tabla_1',
    title: 'Tabla del 1',
    subtitle: 'El Sol Mendocino',
    icon: '☀️',
    colorGradient: 'from-amber-400 to-yellow-500',
    borderBadge: 'border-amber-300 text-amber-900 bg-amber-50',
    themeMendoza: 'El sol radiante de Mendoza ilumina cada racimo por igual.',
    pedagogicalSecret: '1 vez cualquier número da ese mismo número (1 × 4 = 4). ¡Es como mirarse en un espejo!',
    sampleSequence: [1, 2, 3, 4, 5],
    fullTable: [
      { mult: '1 × 1', add: '1 vez 1', result: 1 },
      { mult: '1 × 2', add: '1 vez 2', result: 2 },
      { mult: '1 × 3', add: '1 vez 3', result: 3 },
      { mult: '1 × 4', add: '1 vez 4', result: 4 },
      { mult: '1 × 5', add: '1 vez 5', result: 5 },
    ],
  },
  {
    tableNum: 2,
    badgeId: 'badge_tabla_2',
    title: 'Tabla del 2',
    subtitle: 'Paso del Guanaco',
    icon: '🦙',
    colorGradient: 'from-sky-400 to-blue-600',
    borderBadge: 'border-sky-300 text-sky-900 bg-sky-50',
    themeMendoza: 'Guani el Guanaco salta por la cordillera dando pasos dobles.',
    pedagogicalSecret: '¡El Doble! Sumas el mismo número dos veces (ej: 2 × 4 es 4 + 4 = 8). Saltas de 2 en 2.',
    sampleSequence: [2, 4, 6, 8, 10],
    fullTable: [
      { mult: '2 × 1', add: '1 + 1', result: 2 },
      { mult: '2 × 2', add: '2 + 2', result: 4 },
      { mult: '2 × 3', add: '3 + 3', result: 6 },
      { mult: '2 × 4', add: '4 + 4', result: 8 },
      { mult: '2 × 5', add: '5 + 5', result: 10 },
    ],
  },
  {
    tableNum: 3,
    badgeId: 'badge_tabla_3',
    title: 'Tabla del 3',
    subtitle: 'Cerezas de Tunuyán',
    icon: '🍒',
    colorGradient: 'from-rose-400 to-red-600',
    borderBadge: 'border-rose-300 text-rose-900 bg-rose-50',
    themeMendoza: 'Las dulces cerezas de Tunuyán crecen en ramitas de a 3.',
    pedagogicalSecret: '¡El Triple! Cuentas 3 grupitos iguales (ej: 3 × 3 es 3 + 3 + 3 = 9). Saltas de 3 en 3.',
    sampleSequence: [3, 6, 9, 12, 15],
    fullTable: [
      { mult: '3 × 1', add: '1 + 1 + 1', result: 3 },
      { mult: '3 × 2', add: '2 + 2 + 2', result: 6 },
      { mult: '3 × 3', add: '3 + 3 + 3', result: 9 },
      { mult: '3 × 4', add: '4 + 4 + 4', result: 12 },
      { mult: '3 × 5', add: '5 + 5 + 5', result: 15 },
    ],
  },
  {
    tableNum: 4,
    badgeId: 'badge_tabla_4',
    title: 'Tabla del 4',
    subtitle: 'Astucia del Zorro',
    icon: '🦊',
    colorGradient: 'from-orange-400 to-amber-600',
    borderBadge: 'border-orange-300 text-orange-900 bg-orange-50',
    themeMendoza: 'El Zorro Culpeo corre veloz con sus 4 patitas ágiles entre viñedos.',
    pedagogicalSecret: '¡El Doble del Doble! Calculas el doble de un número y vuelves a doblarlo (4 × 3: el doble de 3 es 6, y el doble de 6 es 12).',
    sampleSequence: [4, 8, 12, 16, 20],
    fullTable: [
      { mult: '4 × 1', add: '1 + 1 + 1 + 1', result: 4 },
      { mult: '4 × 2', add: '2 + 2 + 2 + 2', result: 8 },
      { mult: '4 × 3', add: '3 + 3 + 3 + 3', result: 12 },
      { mult: '4 × 4', add: '4 + 4 + 4 + 4', result: 16 },
      { mult: '4 × 5', add: '5 + 5 + 5 + 5', result: 20 },
    ],
  },
  {
    tableNum: 5,
    badgeId: 'badge_tabla_5',
    title: 'Tabla del 5',
    subtitle: 'Manos Cosechadoras',
    icon: '🖐️',
    colorGradient: 'from-teal-400 to-emerald-600',
    borderBadge: 'border-emerald-300 text-emerald-900 bg-emerald-50',
    themeMendoza: 'En la Vendimia cosechamos con nuestras dos manos de 5 dedos.',
    pedagogicalSecret: '¡El truco infalible: todos sus resultados terminan siempre en 0 o en 5! (5, 10, 15, 20, 25...).',
    sampleSequence: [5, 10, 15, 20, 25],
    fullTable: [
      { mult: '5 × 1', add: '1 + 1 + 1 + 1 + 1', result: 5 },
      { mult: '5 × 2', add: '2 + 2 + 2 + 2 + 2', result: 10 },
      { mult: '5 × 3', add: '3 + 3 + 3 + 3 + 3', result: 15 },
      { mult: '5 × 4', add: '4 + 4 + 4 + 4 + 4', result: 20 },
      { mult: '5 × 5', add: '5 + 5 + 5 + 5 + 5', result: 25 },
    ],
  },
];

export const RewardCabinet: React.FC<RewardCabinetProps> = ({
  unlockedBadgeIds,
  starsCount,
  playerName,
  onGoHome,
  onOpenDiploma,
  onUnlockBadge,
  onAddStar,
  onNavigate,
}) => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [activeTableModal, setActiveTableModal] = useState<LearningTableItem | null>(null);
  const [routeFilter, setRouteFilter] = useState<'ALL' | 'MASTERED' | 'PENDING'>('ALL');

  // Mini quiz state inside the modal for tables
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [isQuizOptionCorrect, setIsQuizOptionCorrect] = useState<boolean | null>(null);

  const currentRank = getPlayerRank(starsCount);
  const nextRank = PLAYER_RANKS.find(r => r.level === currentRank.level + 1);

  const unlockedCount = unlockedBadgeIds.length;
  const totalBadges = ALL_BADGES.length;

  // Mastered tables calculation
  const masteredTablesCount = LEARNING_TABLES.filter(t => unlockedBadgeIds.includes(t.badgeId)).length;
  const pendingTablesCount = LEARNING_TABLES.length - masteredTablesCount;
  const routePercentage = Math.round((masteredTablesCount / LEARNING_TABLES.length) * 100);

  const handleBadgeClick = (badge: typeof ALL_BADGES[0], isUnlocked: boolean) => {
    setSelectedBadgeId(badge.id);

    if (isUnlocked) {
      sound.playFanfare();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
      sound.speak(`¡Insignia ${badge.title}! ${badge.description}`);
    } else {
      sound.playEncouraging();
      sound.speak(`Para ganar la insignia ${badge.title}: ${badge.howToEarn}`);
    }
  };

  const handleOpenTableDetail = (tableItem: LearningTableItem) => {
    setActiveTableModal(tableItem);
    setIsQuizActive(false);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizSelectedOption(null);
    setIsQuizOptionCorrect(null);

    const isMastered = unlockedBadgeIds.includes(tableItem.badgeId);
    sound.playPop(520);
    sound.speak(
      `${tableItem.title}, ${tableItem.subtitle}. ${
        isMastered
          ? '¡Ya está dominada! Felicitaciones.'
          : 'Falta por dominar. ¡Puedes practicarla aquí!'
      } ${tableItem.pedagogicalSecret}`
    );
  };

  // Generate 3 friendly practice questions for tableItem
  const getQuizQuestionsForTable = (tableNum: number) => {
    const multipliers = [2, 3, 4];
    return multipliers.map(m => {
      const correct = tableNum * m;
      const distractor1 = correct + tableNum;
      const distractor2 = correct - tableNum > 0 ? correct - tableNum : correct + 1;
      const distractor3 = tableNum + m;
      const optionsSet = new Set<number>([correct, distractor1, distractor2, distractor3]);
      let delta = 1;
      while (optionsSet.size < 4) {
        optionsSet.add(correct + delta);
        delta++;
      }
      return {
        prompt: `¿Cuánto es ${tableNum} × ${m}?`,
        hint: `${tableNum} veces ${m}`,
        correct,
        options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
      };
    });
  };

  const handleAnswerQuizOption = (option: number, correctVal: number) => {
    if (quizSelectedOption !== null) return;

    setQuizSelectedOption(option);
    const correct = option === correctVal;
    setIsQuizOptionCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setQuizScore(prev => prev + 1);
    } else {
      sound.playEncouraging();
    }

    setTimeout(() => {
      if (quizIndex + 1 < 3) {
        setQuizIndex(prev => prev + 1);
        setQuizSelectedOption(null);
        setIsQuizOptionCorrect(null);
      } else {
        // Quiz completed
        const finalScore = correct ? quizScore + 1 : quizScore;
        if (finalScore >= 2 && activeTableModal) {
          // Master table!
          if (onUnlockBadge) {
            onUnlockBadge(activeTableModal.badgeId);
          }
          if (onAddStar) {
            onAddStar();
            onAddStar();
          }
          sound.playFanfare();
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.5 },
          });
          sound.speak(`¡Genial! Has dominado la ${activeTableModal.title}. ¡Ganaste tu medalla y 2 estrellas extra!`);
        } else {
          sound.speak('¡Buen intento! Repasa la tabla y vuelve a probar.');
        }
        setIsQuizActive(false);
      }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Header bar */}
      <div className="bg-white/95 rounded-2xl p-3 border border-amber-200 shadow-xs flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="p-1 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Gabinete de Recompensas y Ruta de Aprendizaje</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-700">
              Mendoza · Tablas del 1 al 5 · Medallas e Insignias
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDiploma}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Award className="w-4 h-4" />
          <span>Ver Diploma</span>
        </button>
      </div>

      {/* Rank & Level Progress Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-4 sm:p-6 text-white shadow-lg border-2 border-white mb-6 relative overflow-hidden">
        {/* Decorative Mascot illustration */}
        <div className="absolute -right-4 -bottom-6 w-32 h-32 sm:w-40 sm:h-40 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/mascot_condorito_1794142177878.jpg"
            alt="Condorito"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-xs border-2 border-white/50 flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-inner">
              {currentRank.icon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-yellow-200" />
                <span>Nivel {currentRank.level} · {playerName || 'Estudiante'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black drop-shadow-xs">
                {currentRank.title}
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                {currentRank.motto}
              </p>
            </div>
          </div>

          {/* Stars tally */}
          <div className="bg-white/20 backdrop-blur-xs border border-white/40 px-4 py-2 rounded-2xl text-center shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-100">
              Estrellas Cosechadas
            </span>
            <div className="text-2xl sm:text-3xl font-black flex items-center justify-center gap-1 text-yellow-200">
              <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              <span>{starsCount}</span>
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        {nextRank && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Siguiente rango: {nextRank.title} {nextRank.icon}</span>
              <span>{starsCount} / {nextRank.minStars} estrellas</span>
            </div>
            <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, (starsCount / nextRank.minStars) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION: MI RUTA DE APRENDIZAJE (Tablas del 1 al 5) */}
      {/* ========================================================================= */}
      <section className="bg-white/95 rounded-3xl border-2 border-sky-200 p-4 sm:p-6 shadow-md mb-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-sky-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Sendero Matemático de Mendoza</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-850 flex items-center gap-2">
              <span>🗺️ Mi Ruta de Aprendizaje</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                (Tablas del 1 al 5)
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Observa qué tablas ya dominas y cuáles te faltan conquistar. ¡Toca cualquiera para explorarla o practicar!
            </p>
          </div>

          {/* Quick Route Status Pill */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-200 text-right">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Progreso de Ruta
              </div>
              <div className="text-sm font-black text-sky-900 flex items-center gap-1.5 justify-end">
                <span>{masteredTablesCount} de 5 dominadas</span>
                <span className="text-xs text-amber-600">({routePercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Trail Progress Bar */}
        <div className="mb-5 bg-sky-50/80 p-3 rounded-2xl border border-sky-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600 flex items-center gap-1">
              <span>🍇 Viñedos</span>
              <span className="text-slate-400">➔</span>
              <span>🦙 Cordillera</span>
              <span className="text-slate-400">➔</span>
              <span>🏔️ Cumbre Aconcagua</span>
            </span>
            <span className="text-slate-700 font-extrabold">
              {masteredTablesCount === 5 ? '¡Ruta Completada! 🎉' : `${pendingTablesCount} por dominar`}
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(5, routePercentage)}%` }}
            />
          </div>

          {/* Mascot encouraging quote */}
          <div className="mt-2 text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span className="text-base">🦊</span>
            <span>
              {masteredTablesCount === 5
                ? '«¡Extraordinario! Dominas todas las tablas del 1 al 5. ¡Eres un orgullo de Mendoza!»'
                : masteredTablesCount >= 3
                ? '«¡Vas muy bien! Te faltan muy poquitas tablas para completar toda la ruta.»'
                : '«¡Paso a paso! Cada tabla es un atajo para no sumar tantas veces. ¡Toca las pendientes para aprenderlas!»'}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-4">
          <button
            type="button"
            onClick={() => setRouteFilter('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              routeFilter === 'ALL'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas las Tablas (5)
          </button>
          <button
            type="button"
            onClick={() => setRouteFilter('MASTERED')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              routeFilter === 'MASTERED'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dominadas ({masteredTablesCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setRouteFilter('PENDING')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              routeFilter === 'PENDING'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Por Dominar ({pendingTablesCount})</span>
          </button>
        </div>

        {/* 5 Tables Route Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {LEARNING_TABLES.filter(t => {
            const isMastered = unlockedBadgeIds.includes(t.badgeId);
            if (routeFilter === 'MASTERED') return isMastered;
            if (routeFilter === 'PENDING') return !isMastered;
            return true;
          }).map(tableItem => {
            const isMastered = unlockedBadgeIds.includes(tableItem.badgeId);

            return (
              <button
                key={`route-table-${tableItem.tableNum}`}
                type="button"
                onClick={() => handleOpenTableDetail(tableItem)}
                className={`p-3.5 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer relative group active:scale-98 ${
                  isMastered
                    ? 'bg-gradient-to-b from-emerald-50/60 via-white to-amber-50/40 border-emerald-400 hover:border-emerald-500 shadow-xs hover:shadow-md'
                    : 'bg-gradient-to-b from-amber-50/40 to-slate-50 border-amber-300 hover:border-amber-400 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Top Badge: Number and Status */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-105 ${
                      isMastered
                        ? `bg-gradient-to-tr ${tableItem.colorGradient} text-white ring-2 ring-white`
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tableItem.icon}
                  </div>

                  {/* Status Indicator */}
                  {isMastered ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                      <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                      <span>¡Dominada!</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      <span>⏳ Por Dominar</span>
                    </span>
                  )}
                </div>

                {/* Table Title and Subtitle */}
                <div className="mb-2">
                  <div className="text-base font-black text-slate-900 leading-tight">
                    {tableItem.title}
                  </div>
                  <div className="text-[11px] font-bold text-amber-800 leading-tight">
                    {tableItem.subtitle}
                  </div>
                </div>

                {/* Numerical Sequence Pills */}
                <div className="my-1.5 flex flex-wrap items-center gap-1">
                  {tableItem.sampleSequence.map(val => (
                    <span
                      key={`seq-${tableItem.tableNum}-${val}`}
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isMastered
                          ? 'bg-emerald-100/80 text-emerald-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>

                {/* Pedagogical Hook preview */}
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 mb-2 leading-snug">
                  {tableItem.pedagogicalSecret}
                </p>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold w-full">
                  <span
                    className={
                      isMastered ? 'text-emerald-700' : 'text-amber-700'
                    }
                  >
                    {isMastered ? 'Ver detalles 🔍' : '¡Toca para entrenar! 🎯'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: TUS MEDALLAS DE SEGUNDO GRADO */}
      {/* ========================================================================= */}
      <div className="bg-white/95 rounded-3xl border-2 border-amber-200 p-4 sm:p-6 shadow-md mb-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
              <span>🏅</span>
              <span>Tus Medallas de Segundo Grado</span>
            </h3>
            <span className="text-xs text-amber-700">
              Has desbloqueado {unlockedCount} de {totalBadges} medallas
            </span>
          </div>

          <div className="text-xs font-bold px-3 py-1 bg-amber-100 rounded-full text-amber-900 border border-amber-300">
            {Math.round((unlockedCount / totalBadges) * 100)}% Completado
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            const isSelected = selectedBadgeId === badge.id;

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => handleBadgeClick(badge, isUnlocked)}
                className={`p-3 rounded-2xl border-2 transition-all duration-200 text-center flex flex-col items-center justify-between cursor-pointer relative active:scale-95 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white to-amber-50 border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/70 border-slate-200 opacity-60 hover:opacity-80'
                } ${isSelected ? 'ring-4 ring-amber-300 scale-102' : ''}`}
              >
                {/* Badge Icon in circle */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-xs transition-transform transform group-hover:scale-110 ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.colorGradient} text-white ring-2 ring-white`
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Badge title */}
                <span className="text-xs font-extrabold text-slate-800 leading-tight line-clamp-1 mb-1">
                  {badge.title}
                </span>

                {/* Status tag */}
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>¡Ganada!</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Bloqueada</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Badge Detail Box */}
      {selectedBadgeId && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs animate-pulse-gentle mb-6">
          {(() => {
            const badge = ALL_BADGES.find(b => b.id === selectedBadgeId);
            if (!badge) return null;
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div className="flex items-start gap-3 w-full">
                <span className="text-3xl p-2 bg-white rounded-xl border border-amber-200 shadow-2xs">
                  {badge.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.2 rounded-full">
                        ¡Completada!
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.2 rounded-full">
                        Por conseguir
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1">
                    {badge.description}
                  </p>
                  <p className="text-xs text-amber-800 font-semibold mt-1">
                    🎯 <strong>¿Cómo ganarla?:</strong> {badge.howToEarn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => sound.speak(`${badge.title}: ${badge.description}. ${badge.howToEarn}`)}
                  className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 cursor-pointer shrink-0"
                  title="Escuchar detalle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TABLE DETAIL & MINI-CHALLENGE INSPECTOR */}
      {/* ========================================================================= */}
      {activeTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border-2 border-sky-300 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white bg-gradient-to-tr ${activeTableModal.colorGradient} shadow-xs`}
                >
                  {activeTableModal.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {activeTableModal.title}
                    </h3>
                    {unlockedBadgeIds.includes(activeTableModal.badgeId) ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ ¡Dominada!
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        ⏳ Por Dominar
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-amber-800">
                    {activeTableModal.subtitle} · {activeTableModal.themeMendoza}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTableModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pedagogical Clue Card */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>El Secreto de la Seño y los Amiguitos:</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    sound.speak(
                      `${activeTableModal.title}. ${activeTableModal.pedagogicalSecret}`
                    )
                  }
                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer flex items-center gap-1"
                  title="Escuchar secreto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Escuchar</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {activeTableModal.pedagogicalSecret}
              </p>
            </div>

            {/* Table Equations Grid */}
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Operaciones de la {activeTableModal.title}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeTableModal.fullTable.map(item => (
                  <div
                    key={item.mult}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{item.mult}</span>
                      <span className="text-[11px] text-slate-500 font-medium">({item.add})</span>
                    </div>
                    <span className="font-black text-base text-amber-700">= {item.result}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Challenge Section */}
            {!isQuizActive ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm text-sky-950 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>¿Quieres demostrar tu maestría?</span>
                  </div>
                  <span className="text-xs text-sky-700">
                    Responde 3 preguntas rápidas de esta tabla para ganar medalla y 2 estrellas extra.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuizActive(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer shrink-0"
                >
                  ¡Iniciar Mini Reto! ⚡
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300">
                {(() => {
                  const questions = getQuizQuestionsForTable(activeTableModal.tableNum);
                  const q = questions[quizIndex];
                  if (!q) return null;

                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                          Pregunta {quizIndex + 1} de 3
                        </span>
                        <span className="text-xs font-bold text-amber-700">
                          {q.hint}
                        </span>
                      </div>

                      <div className="text-center my-3">
                        <span className="text-2xl sm:text-3xl font-black text-slate-850">
                          {q.prompt}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {q.options.map(opt => {
                          let optStyle = 'bg-white hover:bg-amber-100 text-slate-850 border-amber-200';
                          if (quizSelectedOption !== null) {
                            if (opt === q.correct) {
                              optStyle = 'bg-emerald-500 text-white border-emerald-600';
                            } else if (opt === quizSelectedOption) {
                              optStyle = 'bg-rose-500 text-white border-rose-600';
                            } else {
                              optStyle = 'bg-slate-100 text-slate-400 opacity-50';
                            }
                          }
                          return (
                            <button
                              key={`quiz-opt-${opt}`}
                              type="button"
                              disabled={quizSelectedOption !== null}
                              onClick={() => handleAnswerQuizOption(opt, q.correct)}
                              className={`py-3 px-2 rounded-xl border-2 font-black text-xl transition-all cursor-pointer shadow-xs active:scale-95 ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Quick Navigation to Cuadro Pitagórico */}
            {onNavigate && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTableModal(null);
                    onNavigate('TABLA_PITAGORICA');
                  }}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Explorar en el Cuadro de las Tablas (Pitagórico)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTableModal(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
