import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { MENDOZA_STATIONS } from '../data/mendozaAdventure';
import { FruitGroupDisplay } from './FruitGroupDisplay';
import { sound } from '../utils/audio';

interface AdventureModeProps {
  currentStationNum: number;
  onUpdateStation: (num: number) => void;
  starsCount: number;
  onAddStar: () => void;
  onUnlockBadge?: (id: string) => void;
  onGoHome: () => void;
  onOpenDiploma: () => void;
}

export const AdventureMode: React.FC<AdventureModeProps> = ({
  currentStationNum,
  onUpdateStation,
  onAddStar,
  onUnlockBadge,
  onGoHome,
  onOpenDiploma,
}) => {
  const stationIndex = Math.max(0, Math.min(MENDOZA_STATIONS.length - 1, currentStationNum - 1));
  const currentStation = MENDOZA_STATIONS[stationIndex];

  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showMagicTransform, setShowMagicTransform] = useState(false);

  const currentQuestion = currentStation.questions[questionIdx] || currentStation.questions[0];

  const handleSpeak = () => {
    sound.speak(`${currentQuestion.speechText}. ${currentQuestion.mascotMessage}`);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered && isCorrect) return;

    setSelectedOption(optionIndex);
    const correct = optionIndex === currentQuestion.correctOptionIndex;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      onAddStar();

      // Check and award badges
      if (onUnlockBadge) {
        if (currentStationNum === 1) onUnlockBadge('badge_primera_suma');
        if (currentStationNum === 2) onUnlockBadge('badge_palabra_veces');
        if (currentStationNum === 3) onUnlockBadge('badge_salto_por');
        if (currentQuestion.id === 'q4_1') onUnlockBadge('badge_tabla_1');
        if (currentQuestion.id === 'q4_2') onUnlockBadge('badge_tabla_2');
        if (currentQuestion.id === 'q4_3') onUnlockBadge('badge_tabla_3');
        if (currentQuestion.id === 'q4_4') onUnlockBadge('badge_tabla_4');
        if (currentQuestion.id === 'q4_5') onUnlockBadge('badge_tabla_5');
        if (currentStationNum === 5) onUnlockBadge('badge_cumbre_aconcagua');
      }

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#f43f5e']
      });

      if (currentQuestion.stageType === 'SALTO_MULTIPLICACION') {
        setShowMagicTransform(true);
        sound.playMagic();
      }
    } else {
      sound.playEncouraging();
      setShowHint(true);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowMagicTransform(false);

    if (questionIdx + 1 < currentStation.questions.length) {
      setQuestionIdx(prev => prev + 1);
    } else {
      // Station completed!
      sound.playFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (currentStationNum < MENDOZA_STATIONS.length) {
        onUpdateStation(currentStationNum + 1);
        setQuestionIdx(0);
      } else {
        // Reached end of adventure!
        onOpenDiploma();
      }
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const mascotAvatar = currentQuestion.mascot === 'zorrito'
    ? '/src/assets/images/mascot_zorro_1794141415282.jpg'
    : '/src/assets/images/mascot_guanaco_1794141415197.jpg';

  const mascotName = currentQuestion.mascot === 'zorrito' ? 'Zorrito Culpeo' : 'Guani el Guanaco';

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Top Station Stepper */}
      <div className="mb-4 bg-white/95 rounded-2xl p-3 border border-sky-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoHome}
              className="p-1 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-100 cursor-pointer"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
              {currentStation.name}
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Pregunta {questionIdx + 1} de {currentStation.questions.length}
          </span>
        </div>

        {/* Station Navigation Pills */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {MENDOZA_STATIONS.map(st => {
            const isActive = st.number === currentStationNum;
            const isCompleted = st.number < currentStationNum;

            return (
              <button
                key={st.number}
                type="button"
                onClick={() => {
                  onUpdateStation(st.number);
                  setQuestionIdx(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setIsCorrect(false);
                  setShowHint(false);
                }}
                className={`py-1.5 px-1 sm:px-2 rounded-xl text-center transition-all cursor-pointer border text-xs flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-amber-400 border-amber-500 text-amber-950 font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <span>{st.number}</span>
                  )}
                </div>
                <span className="truncate w-full text-[10px] sm:text-xs">
                  {st.number === 1 && 'Parque'}
                  {st.number === 2 && 'Viñedos'}
                  {st.number === 3 && 'Valle Uco'}
                  {st.number === 4 && 'Cordillera'}
                  {st.number === 5 && 'Aconcagua'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Learning Card */}
      <div className="bg-white/95 rounded-3xl border-2 border-sky-200 shadow-md p-4 sm:p-6 relative overflow-hidden">
        {/* Stage Type Tag */}
        <div className="flex items-center justify-between gap-2 border-b border-sky-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {currentQuestion.stageType === 'SUMA_REPETIDA' && '➕'}
              {currentQuestion.stageType === 'DESCUBRE_VECES' && '🔄'}
              {currentQuestion.stageType === 'SALTO_MULTIPLICACION' && '✨'}
              {currentQuestion.stageType === 'TABLA_ENTRENAMIENTO' && '🏆'}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-sky-950">
                {currentQuestion.title}
              </h2>
              <span className="text-xs text-sky-600 font-medium">
                {currentStation.theme}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-purple-200 active:scale-95"
            title="Escuchar lo que dice Zorrito o Guani"
          >
            <Volume2 className="w-4 h-4 text-purple-700" />
            <span>Escuchar</span>
          </button>
        </div>

        {/* Mascot Dialogue Bubble */}
        <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-amber-300 shadow-xs">
            <img
              src={mascotAvatar}
              alt={mascotName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">{mascotName}</span>
              <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded-full">
                Mendoza
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
              {currentQuestion.mascotMessage}
            </p>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="text-center my-3">
          <p className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
            {currentQuestion.prompt}
          </p>
        </div>

        {/* Concrete / Visual Manipulatives (Canastos con Frutas) */}
        <FruitGroupDisplay
          groupCount={currentQuestion.groupCount}
          itemsPerGroup={currentQuestion.itemsPerGroup}
          itemType={currentQuestion.itemType}
          interactive={true}
        />

        {/* The 3 Conceptual Bridges: Suma Repetitiva -> Veces -> Multiplicación (No revelan la respuesta antes) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-4 bg-sky-50/70 p-3 rounded-2xl border border-sky-200">
          {/* Card 1: Suma Repetitiva */}
          <div className="bg-white p-2.5 rounded-xl border border-sky-200 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block mb-1">
              1. Suma Repetitiva
            </span>
            <div className="font-extrabold text-sm sm:text-base text-sky-900 font-mono">
              {currentQuestion.additionEquation}{' '}
              <span className={isAnswered && isCorrect ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                = {isAnswered && isCorrect ? currentQuestion.correctResult : '?'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Sumamos cada canasto</span>
          </div>

          {/* Card 2: Explicación con "VECES" */}
          <div
            className={`bg-white p-2.5 rounded-xl border text-center shadow-xs transition-all ${
              currentQuestion.stageType === 'DESCUBRE_VECES'
                ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-300'
                : 'border-sky-200'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
              2. Palabra Clave
            </span>
            <div className="font-extrabold text-sm sm:text-base text-amber-900">
              {currentQuestion.timesExplanation}{' '}
              <span className={isAnswered && isCorrect ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                = {isAnswered && isCorrect ? currentQuestion.correctResult : '?'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">¿Cuántas veces está el número?</span>
          </div>

          {/* Card 3: Multiplicación Mágica */}
          <div
            className={`p-2.5 rounded-xl border text-center shadow-xs transition-all ${
              showMagicTransform || currentQuestion.stageType === 'SALTO_MULTIPLICACION' || currentQuestion.stageType === 'TABLA_ENTRENAMIENTO'
                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-300'
                : 'bg-white border-sky-200'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
              3. ¡Multiplicación (×)!
            </span>
            <div className="font-extrabold text-sm sm:text-base text-purple-900 font-mono">
              {currentQuestion.multiplicationEquation}{' '}
              <span className={isAnswered && isCorrect ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                = {isAnswered && isCorrect ? currentQuestion.correctResult : '?'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Cambiamos «veces» por «×»</span>
          </div>
        </div>

        {/* Options / Choice buttons */}
        <div className="my-5">
          <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Elige la respuesta correcta:
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isThisSelected = selectedOption === idx;
              let btnClass = 'bg-white hover:bg-sky-50 text-sky-950 border-2 border-sky-300 hover:border-sky-400';

              if (isAnswered) {
                if (idx === currentQuestion.correctOptionIndex) {
                  btnClass = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md ring-4 ring-emerald-200';
                } else if (isThisSelected && !isCorrect) {
                  btnClass = 'bg-rose-100 text-rose-800 border-2 border-rose-300';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered && isCorrect}
                  onClick={() => handleSelectOption(idx)}
                  className={`min-w-[90px] sm:min-w-[130px] py-3 px-4 rounded-2xl font-extrabold text-lg sm:text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {isAnswered && (
          <div className="mt-4">
            {isCorrect ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 text-center flex flex-col items-center gap-1.5 animate-pulse-gentle">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Excelente trabajo! ¡Qué bien sumas y multiplicas! 🎉</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-700">
                  {currentQuestion.additionEquation} es igual a{' '}
                  <strong className="underline">{currentQuestion.correctResult}</strong>. ¡Es lo mismo que{' '}
                  {currentQuestion.timesExplanation} y {currentQuestion.multiplicationEquation}!
                </p>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95 text-sm sm:text-base"
                >
                  <span>
                    {questionIdx + 1 < currentStation.questions.length
                      ? 'Siguiente Desafío'
                      : currentStationNum < MENDOZA_STATIONS.length
                      ? '¡Viajar a la Próxima Estación!'
                      : '¡Ver Mi Diploma del Aconcagua!'}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center flex flex-col items-center gap-1">
                <span className="text-amber-800 font-bold text-sm">
                  ¡Casi casi! ¡Ánimo que podés!
                </span>
                <p className="text-xs text-amber-700">{currentQuestion.hint}</p>
                <button
                  type="button"
                  onClick={handleRetryQuestion}
                  className="mt-1 px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a intentar</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hint toggle if stuck */}
        {!isAnswered && !showHint && (
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => {
                setShowHint(true);
                sound.playPop();
              }}
              className="text-xs text-sky-600 hover:text-sky-800 font-semibold underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Necesitas una pista?</span>
            </button>
          </div>
        )}

        {showHint && !isAnswered && (
          <div className="mt-3 p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-center text-xs text-sky-800 font-medium">
            💡 <strong>Pista de Zorrito:</strong> {currentQuestion.hint}
          </div>
        )}
      </div>
    </div>
  );
};
