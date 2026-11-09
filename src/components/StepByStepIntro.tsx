import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronRight, ChevronLeft, Sparkles, CheckCircle2, ArrowRight, Play, Wand2, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface StepByStepIntroProps {
  onStartGame: () => void;
  onGoHome: () => void;
  onAddStar: () => void;
}

export const StepByStepIntro: React.FC<StepByStepIntroProps> = ({
  onStartGame,
  onGoHome,
  onAddStar,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // State for Step 5 interactive practice
  const [interactiveSelectedTimes, setInteractiveSelectedTimes] = useState<string | null>(null);
  const [interactiveTransformed, setInteractiveTransformed] = useState<boolean>(false);

  const stepDetails = [
    {
      step: 1,
      title: 'Paso 1: El problema de las sumas reiteradas',
      mascot: 'zorrito',
      mascotName: 'Zorrito Culpeo',
      mascotAvatar: '/images/mascot_zorro_1794141415282.jpg',
      dialogue: '«¡Uf, qué cansador! En la finca de Mendoza cosechamos muchas uvas. Si tengo que sumar 2 + 2 + 2 + 2 + 2... ¡se me cansa la patita de tanto escribir!»',
      speechText: 'Paso 1: El problema de las sumas reiteradas. Imagina que en la cosecha sumamos: dos más dos más dos más dos más dos. ¡Qué cansador escribir una suma tan reiterada!',
    },
    {
      step: 2,
      title: 'Paso 2: La regla de oro: ¡Grupos Iguales!',
      mascot: 'guani',
      mascotName: 'Guani el Guanaco',
      mascotAvatar: '/images/mascot_guanaco_1794141415197.jpg',
      dialogue: '«¡Fijate bien! Para poder hacer el truco de multiplicar, todos los canastos deben tener la MISMA cantidad de frutas. Si cada canasto tiene dos racimos de uvas, el número dos es el que se repite.»',
      speechText: 'Paso 2: La regla de oro. Todos los canastos deben tener la misma cantidad. Si cada canasto tiene dos racimos de uvas, el número dos es el que se repite.',
    },
    {
      step: 3,
      title: 'Paso 3: La palabra mágica: «VECES»',
      mascot: 'guani',
      mascotName: 'Guani el Guanaco',
      mascotAvatar: '/images/mascot_guanaco_1794141415197.jpg',
      dialogue: '«Contemos cuántos canastos hay: 1, 2, 3 canastos. ¿Cuántas veces sumamos el número 2? ¡3 veces! Decimos con palabras: 3 veces 2.»',
      speechText: 'Paso 3: La palabra mágica veces. Contamos cuántos canastos hay: tres canastos. El dos se repite tres veces. Decimos: tres veces dos.',
    },
    {
      step: 4,
      title: 'Paso 4: El atajo genial: El signo «×» (POR)',
      mascot: 'condorito',
      mascotName: 'Condorito Andino',
      mascotAvatar: '/images/mascot_condorito_1794142177878.jpg',
      dialogue: '«¡Los matemáticos inventaron un atajo brillante! Cambiaron la palabra VECES por el signo × (que se lee POR). 3 veces 2 se escribe 3 × 2 = 6. ¡Multiplicar es una suma reiterada!»',
      speechText: 'Paso 4: El atajo genial. Cambiamos la palabra veces por el signo por. Tres veces dos se escribe tres por dos igual a seis. ¡Multiplicar es una suma reiterada!',
    },
    {
      step: 5,
      title: 'Paso 5: ¡Probalo vos! Tu primer gran salto',
      mascot: 'zorrito',
      mascotName: 'Zorrito y sus amigos',
      mascotAvatar: '/images/mascot_zorro_1794141415282.jpg',
      dialogue: '«¡Ahora te toca a vos demostrar que ya sos un experto! Mirá estos 4 canastos con 3 manzanas: 3 + 3 + 3 + 3. ¿Cómo lo transformamos en multiplicación?»',
      speechText: 'Paso 5: ¡Ahora te toca a vos! Mirá estos cuatro canastos con tres manzanas. Tres más tres más tres más tres. ¿Cómo se transforma en multiplicación?',
    },
  ];

  const currentStepData = stepDetails[currentStep - 1];

  const handleSpeakCurrentStep = () => {
    sound.speak(`${currentStepData.speechText} ${currentStepData.dialogue}`);
  };

  useEffect(() => {
    sound.playPop(480 + currentStep * 30);
    handleSpeakCurrentStep();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(s => s + 1);
    } else {
      sound.playFanfare();
      onStartGame();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handlePracticeTimesSelect = (val: string) => {
    setInteractiveSelectedTimes(val);
    sound.playPop(550);
  };

  const handlePracticeTransform = () => {
    if (interactiveSelectedTimes === '4 veces 3') {
      setInteractiveTransformed(true);
      sound.playMagic();
      onAddStar();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#fbbf24', '#38bdf8', '#34d399']
      });
      sound.speak('¡Excelente! Cuatro canastos con tres manzanas son cuatro veces tres, que en multiplicación se escribe cuatro por tres igual a doce. ¡Sos un genio!');
    } else {
      sound.playEncouraging();
      sound.speak('Contá cuántos canastos hay: hay 1, 2, 3 y 4 canastos. El 3 se repite 4 veces.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Top Header */}
      <div className="bg-white/95 rounded-2xl p-3 border border-sky-200 shadow-xs flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onGoHome}
          className="p-1 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <Home className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
            Tutorial Paso a Paso
          </span>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
            {currentStep} / {totalSteps}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSpeakCurrentStep}
          className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
          title="Escuchar explicación"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Escuchar</span>
        </button>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-4">
        {stepDetails.map(st => {
          const isCurrent = st.step === currentStep;
          const isPassed = st.step < currentStep;

          return (
            <button
              key={st.step}
              type="button"
              onClick={() => setCurrentStep(st.step)}
              className={`py-2 px-1 rounded-xl text-center text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                isCurrent
                  ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-300'
                  : isPassed
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-400 hover:bg-sky-50'
              }`}
            >
              <span>Paso {st.step}</span>
              <span className="hidden sm:inline text-[10px] font-medium truncate w-full mt-0.5">
                {st.step === 1 && 'Suma reiterada'}
                {st.step === 2 && 'Grupos'}
                {st.step === 3 && 'Veces'}
                {st.step === 4 && 'Signo (×)'}
                {st.step === 5 && '¡Tu Turno!'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Explanation Card */}
      <div className="bg-white/95 rounded-3xl border-3 border-sky-300 shadow-xl p-4 sm:p-7 relative overflow-hidden">
        {/* Step Title */}
        <div className="flex items-center gap-2 border-b border-sky-100 pb-3 mb-4">
          <span className="text-2xl">
            {currentStep === 1 && '✍️'}
            {currentStep === 2 && '🧺'}
            {currentStep === 3 && '🔄'}
            {currentStep === 4 && '✨'}
            {currentStep === 5 && '🎯'}
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-sky-950">
            {currentStepData.title}
          </h2>
        </div>

        {/* Mascot Speech Dialogue */}
        <div className="flex items-start gap-3 bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-3.5 mb-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400 shadow-xs">
            <img
              src={currentStepData.mascotAvatar}
              alt={currentStepData.mascotName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900">{currentStepData.mascotName}</span>
              <span className="text-[10px] text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full font-bold">
                Mendoza
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1 leading-snug">
              {currentStepData.dialogue}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP-SPECIFIC INTERACTIVE VISUAL DEMONSTRATION */}
        {/* ======================================================== */}

        {/* STEP 1: The fatigue of long sums */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Mirá cómo crece una suma reiterada:
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 bg-rose-50 rounded-2xl border-2 border-rose-200 shadow-xs max-w-xl">
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <div key={num} className="flex items-center gap-1.5">
                  <div className="p-2 bg-white rounded-xl border border-rose-300 flex flex-col items-center shadow-2xs">
                    <span className="text-xl">🍇</span>
                    <span className="text-xs font-black text-rose-900">2</span>
                  </div>
                  {num < 7 && <span className="text-rose-500 font-black text-lg">+</span>}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-300 max-w-lg text-xs sm:text-sm text-amber-950 font-medium">
              💡 <strong>¿Te imaginas sumar 10 canastos así?</strong> <br />
              <span className="font-mono text-slate-600 block my-1">
                2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 ...
              </span>
              ¡Sería larguísimo! Por eso necesitamos un <strong>atajo matemático</strong>.
            </div>
          </div>
        )}

        {/* STEP 2: Equal groups rule */}
        {currentStep === 2 && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Condición fundamental: ¡Todos los canastos tienen que tener la MISMA cantidad!
            </div>

            <div className="grid grid-cols-3 gap-3 my-2">
              {[1, 2, 3].map(c => (
                <div key={c} className="p-3 bg-sky-50 rounded-2xl border-2 border-sky-300 shadow-xs flex flex-col items-center">
                  <span className="text-xs font-bold text-sky-800 mb-1">Canasto {c}</span>
                  <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-sky-200">
                    <img
                      src="/images/grapes_basket_1794141415022.jpg"
                      alt="Racimo de uvas en un canasto"
                      className="w-14 h-14 object-contain rounded-lg"
                    />
                  </div>
                  <span className="text-xs font-black text-sky-600 mt-1">Tiene dos racimos de uvas</span>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-sky-950 font-bold mt-2">
              ✅ Todos tienen dos racimos de uvas. ¡El número que se repite es el <span className="underline text-sky-700">2</span>!
            </p>
          </div>
        )}

        {/* STEP 3: The magic word VECES */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Contamos cuántos canastos hay:
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-6 my-2">
              {[1, 2, 3].map(c => (
                <div key={c} className="flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-xs mb-1">
                    {c}
                  </span>
                  <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col items-center">
                    <img
                      src="/images/grapes_basket_1794141415022.jpg"
                      alt="Canasto con racimos de uvas"
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <span className="text-xs font-bold text-amber-900 mt-1">dos racimos de uvas</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl border-2 border-amber-400 shadow-sm max-w-md">
              <span className="text-xs font-bold text-amber-900 block mb-1">
                La gran frase del descubrimiento:
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-950">
                «Hay 3 canastos con dos racimos de uvas»
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-purple-800 mt-1">
                👉 ¡Decimos: <strong>3 VECES 2</strong>!
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: The transformation to multiplication */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Observá la transformación mágica:
            </div>

            <div className="w-full max-w-xl space-y-3 my-2">
              {/* Box A */}
              <div className="p-3 bg-sky-50 rounded-2xl border-2 border-sky-300 flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800">1. Suma reiterada:</span>
                <span className="text-lg font-mono font-black text-sky-950">2 + 2 + 2 = 6</span>
              </div>

              {/* Box B */}
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">2. Con Palabras:</span>
                <span className="text-lg font-bold text-amber-950">3 veces 2 = 6</span>
              </div>

              {/* Arrow */}
              <div className="text-purple-600 text-xs font-extrabold flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 fill-purple-400" />
                <span>Cambiamos la palabra «veces» por el signo «×» (por)</span>
                <Sparkles className="w-4 h-4 fill-purple-400" />
              </div>

              {/* Box C */}
              <div className="p-4 bg-purple-100 rounded-2xl border-3 border-purple-500 shadow-md flex items-center justify-between ring-4 ring-purple-200">
                <span className="text-xs font-black uppercase text-purple-900">3. ¡Multiplicación!:</span>
                <span className="text-2xl font-mono font-black text-purple-950">3 × 2 = 6</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-md font-medium">
              ¡Eso es todo el secreto! <strong>Multiplicar es una suma reiterada</strong> que escribimos de forma más cortita y elegante.
            </p>
          </div>
        )}

        {/* STEP 5: Interactive test for the child */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="text-xs font-black text-purple-700 uppercase tracking-wider mb-1">
              Desafío de prueba:
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mb-3">
              Tenemos 4 canastos y cada uno tiene 3 manzanas: 3 + 3 + 3 + 3
            </h3>

            {/* 4 baskets of 3 apples */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
              {[1, 2, 3, 4].map(b => (
                <div key={b} className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col items-center">
                  <span className="text-xs font-bold text-amber-900 mb-1">Canasto {b}</span>
                  <div className="flex items-center gap-1 text-xl">
                    <span>🍎</span>
                    <span>🍎</span>
                    <span>🍎</span>
                  </div>
                  <span className="text-xs font-black text-amber-700 mt-1">3 manzanas</span>
                </div>
              ))}
            </div>

            {/* Question 1: How many times? */}
            <div className="my-3">
              <span className="text-xs font-bold text-slate-600 block mb-2">
                1. ¿Cómo decimos esta suma con la palabra «veces»?
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['3 veces 4', '4 veces 3', '5 veces 3'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handlePracticeTimesSelect(opt)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer border-2 transition-all ${
                      interactiveSelectedTimes === opt
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md scale-105'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Transform button */}
            {interactiveSelectedTimes && (
              <div className="my-3 animate-pulse-gentle">
                <button
                  type="button"
                  onClick={handlePracticeTransform}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
                >
                  <Wand2 className="w-5 h-5 text-amber-300" />
                  <span>¡Transformar en Multiplicación!</span>
                </button>
              </div>
            )}

            {/* Result celebration */}
            {interactiveTransformed && (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 mt-3 max-w-md text-center shadow-md animate-bounce">
                <div className="text-emerald-800 font-black text-base sm:text-lg flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡PERFECTO! ¡Ya sos un Mago de las Tablas! 🎉</span>
                </div>
                <div className="text-2xl font-mono font-black text-emerald-950 my-1">
                  4 × 3 = 12
                </div>
                <p className="text-xs text-emerald-700">
                  4 veces 3 es igual a 12. ¡Aprendiste la magia de pasar de la suma a la multiplicación!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Next / Prev buttons */}
        <div className="mt-6 pt-4 border-t border-sky-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Paso Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>
              {currentStep < totalSteps ? 'Siguiente Paso' : '¡Comenzar la Aventura!'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
