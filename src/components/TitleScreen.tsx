import React, { useState } from 'react';
import { Play, Sparkles, Wand2, Gamepad2, Brain, Grid3X3, Award, Volume2, BookOpen, Zap, Timer } from 'lucide-react';
import { GameScreen } from '../types/game';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  onStartAdventure: () => void;
  onNavigate: (screen: GameScreen) => void;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartAdventure,
  onNavigate,
  playerName,
  onUpdatePlayerName,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName || 'Amiguito/a');
  const [activeMascotQuote, setActiveMascotQuote] = useState<{
    name: string;
    text: string;
    icon: string;
  }>({
    name: 'Zorrito Culpeo',
    text: '«¡Sumar 2+2+2 es lo mismo que 3 veces 2!» 🍇',
    icon: '🦊',
  });

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlayerName(tempName.trim() || 'Amiguito/a');
    setEditingName(false);
    sound.playPop();
  };

  const handleWelcomeSpeech = () => {
    sound.speak(
      `¡Hola ${playerName || 'amiguito'}! Te damos la bienvenida a la escuela y los viñedos de Mendoza. Zorrito, Guani y Condorito te enseñarán a sumar grupitos y multiplicar jugando. ¡Vamos a ganar medallas y estrellas!`
    );
  };

  const handleMascotSelect = (mascot: 'zorrito' | 'guani' | 'condorito') => {
    sound.playPop(520);
    if (mascot === 'zorrito') {
      setActiveMascotQuote({
        name: 'Zorrito Culpeo',
        text: '«¡Sumar 2+2+2 es lo mismo que 3 veces 2!» 🍇',
        icon: '🦊',
      });
      sound.speak('¡Hola! Soy Zorrito. En los viñedos de Mendoza juntamos uvas en canastos iguales. ¡Sumar repetido es genial!');
    } else if (mascot === 'guani') {
      setActiveMascotQuote({
        name: 'Guani el Guanaco',
        text: '«¡En la cordillera saltamos de 2 en 2, 3 en 3 y 5 en 5!» 🦙',
        icon: '🦙',
      });
      sound.speak('¡Hola! Soy Guani el Guanaco. Camino por los senderos del Aconcagua y te ayudo a dar saltos numéricos.');
    } else {
      setActiveMascotQuote({
        name: 'Condorito Andino',
        text: '«¡Volamos alto para ganar todas las medallas de 2° grado!» 🦅',
        icon: '🦅',
      });
      sound.speak('¡Hola! Soy Condorito. Te acompaño en Atrapa la Cosecha para que pienses la consigna con calma antes de jugar.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-3 sm:p-6 relative overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50">
      {/* Background Illustrated Classroom & Mendoza View */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <img
          src="/src/assets/images/escenario_escuela_mendoza_1794142179445.jpg"
          alt="Aula de Mendoza con vista a viñedos y Aconcagua"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center mt-2 sm:mt-5">
        {/* Banner with Mendoza identity */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100/95 border border-amber-300 rounded-full text-amber-900 text-xs sm:text-sm font-bold mb-3 shadow-xs">
          <span>🍇</span>
          <span>Escuela Primaria de Mendoza · 2° Grado</span>
          <span>☀️</span>
        </div>

        {/* Big Playful Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-sky-900 tracking-tight leading-tight max-w-2xl drop-shadow-xs">
          Aventura Matemática <br />
          <span className="text-amber-500 underline decoration-amber-300 decoration-wavy">
            De la Suma al Por (×)
          </span>
        </h1>

        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl font-medium">
          Aprende las tablas hasta el 5 sumando racimos de uvas, descubriendo la palabra{' '}
          <strong className="text-amber-600 font-bold">«veces»</strong> y ganando{' '}
          <strong className="text-sky-700 font-bold">medallas y estrellas</strong>.
        </p>

        {/* Player Name Tag & Greeting */}
        <div className="mt-3.5 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-2xl border border-sky-200 shadow-xs">
          <span className="text-lg">👋</span>
          {editingName ? (
            <form onSubmit={handleNameSave} className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                maxLength={20}
                className="px-2 py-1 text-sm rounded-lg border border-sky-300 font-bold text-sky-900 focus:outline-hidden focus:ring-2 focus:ring-sky-400"
                placeholder="Tu nombre..."
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600 cursor-pointer"
              >
                Listo
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-sky-900">
                ¡Hola, <span className="text-amber-600">{playerName || 'Amiguito/a'}</span>!
              </span>
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="text-[11px] text-sky-600 hover:text-sky-800 underline cursor-pointer"
              >
                (Cambiar)
              </button>
              <button
                type="button"
                onClick={handleWelcomeSpeech}
                className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer ml-1"
                title="Escuchar bienvenida"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CHARACTER TRIO INTERACTIVE SHOWCASE */}
        {/* ======================================================== */}
        <div className="mt-5 flex flex-col items-center">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Tus Amiguitos Guías de Mendoza (¡Toca para saludarlos!):
          </span>

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* Mascot 1: Zorrito */}
            <button
              type="button"
              onClick={() => handleMascotSelect('zorrito')}
              className={`flex flex-col items-center p-2 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                activeMascotQuote.name === 'Zorrito Culpeo'
                  ? 'border-amber-400 ring-4 ring-amber-200 scale-105'
                  : 'border-slate-200 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-xs mb-1">
                <img
                  src="/src/assets/images/mascot_zorro_1794141415282.jpg"
                  alt="Zorrito"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-amber-900">Zorrito</span>
              <span className="text-[10px] text-slate-500">Viñedos 🍇</span>
            </button>

            {/* Mascot 2: Guani el Guanaco */}
            <button
              type="button"
              onClick={() => handleMascotSelect('guani')}
              className={`flex flex-col items-center p-2 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                activeMascotQuote.name === 'Guani el Guanaco'
                  ? 'border-sky-400 ring-4 ring-sky-200 scale-105'
                  : 'border-slate-200 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-xs mb-1">
                <img
                  src="/src/assets/images/mascot_guanaco_1794141415197.jpg"
                  alt="Guani"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-sky-900">Guani</span>
              <span className="text-[10px] text-slate-500">Cordillera 🦙</span>
            </button>

            {/* Mascot 3: Condorito */}
            <button
              type="button"
              onClick={() => handleMascotSelect('condorito')}
              className={`flex flex-col items-center p-2 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                activeMascotQuote.name === 'Condorito Andino'
                  ? 'border-purple-400 ring-4 ring-purple-200 scale-105'
                  : 'border-slate-200 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-xs mb-1">
                <img
                  src="/src/assets/images/mascot_condorito_1794142177878.jpg"
                  alt="Condorito"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-purple-900">Condorito</span>
              <span className="text-[10px] text-slate-500">Cielo Andino 🦅</span>
            </button>
          </div>

          {/* Active Mascot Speech Quote Bubble */}
          <div className="mt-3 bg-white/95 rounded-2xl p-3 shadow-md border-2 border-amber-300 max-w-md text-center transform hover:scale-102 transition-transform">
            <span className="text-xs font-bold text-amber-800 block">
              {activeMascotQuote.icon} {activeMascotQuote.name} dice:
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5">
              {activeMascotQuote.text}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-2xl">
            {/* Step by Step tutorial CTA */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('TUTORIAL_INTRO');
              }}
              className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-white ring-4 ring-indigo-200"
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Paso a Paso</span>
            </button>

            {/* Adventure CTA */}
            <button
              type="button"
              onClick={() => {
                sound.playCorrect();
                onStartAdventure();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-white ring-4 ring-amber-300/40"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>¡La Gran Aventura!</span>
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Modo Desafío CTA */}
            <button
              type="button"
              onClick={() => {
                sound.playMagic();
                onNavigate('MODO_DESAFIO');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-white ring-4 ring-orange-300/60 animate-pulse-gentle"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>⚡ Modo Desafío</span>
              <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                +Estrellas
              </span>
            </button>
          </div>
        </div>

        {/* Game Modes Grid */}
        <div className="w-full mt-6 sm:mt-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Elige qué quieres explorar hoy
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Mode: Modo Desafío (Carrera contra el tiempo) */}
            <button
              type="button"
              onClick={() => {
                sound.playMagic();
                onNavigate('MODO_DESAFIO');
              }}
              className="p-3.5 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 hover:bg-white rounded-2xl border-2 border-amber-300 hover:border-orange-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden ring-2 ring-orange-100"
            >
              <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                ¡Estrellas Extra! ⭐
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white group-hover:scale-110 transition-transform shadow-xs">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-900">Modo Desafío ⚡</span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Carrera contra el reloj</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                5 problemas aleatorios de multiplicación a toda velocidad para ganar estrellas extra.
              </p>
            </button>

            {/* Mode 0: Explicación Paso a Paso */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('TUTORIAL_INTRO');
              }}
              className="p-3.5 bg-gradient-to-br from-indigo-50 via-white to-purple-50 hover:bg-white rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-indigo-950">Explicación Paso a Paso</span>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">¡Comienza aquí!</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Descubre cómo pasar de una suma repetitiva al atajo del «por» (×).
              </p>
            </button>

            {/* Mode 1: La Máquina Mágica */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('MAQUINA_MAGICA');
              }}
              className="p-3.5 bg-white/90 hover:bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-purple-950">Máquina Mágica</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Pon canastas iguales y transforma sumas en multiplicaciones.
              </p>
            </button>

            {/* Mode 2: Atrapa la Cosecha */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('COSECHA_RAPIDA');
              }}
              className="p-3.5 bg-white/90 hover:bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-emerald-950">Atrapa la Cosecha</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Con tiempo para pensar y calcular antes de soltar las frutas.
              </p>
            </button>

            {/* Mode 3: Memoria de Parejas */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('MEMORIA_PAREJAS');
              }}
              className="p-3.5 bg-white/90 hover:bg-white rounded-2xl border-2 border-sky-200 hover:border-sky-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-sky-950">Memoria de Parejas</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Empareja sumas repetitivas con su multiplicación correcta.
              </p>
            </button>

            {/* Mode 4: Tablas del 1 al 5 */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('TABLA_PITAGORICA');
              }}
              className="p-3.5 bg-white/90 hover:bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-amber-950">Tablas 1 al 5</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Toca cualquier número para escucharlo en voz alta y ver sus uvas.
              </p>
            </button>

            {/* Mode 5: Álbum de Medallas */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNavigate('RECOMPENSAS');
              }}
              className="p-3.5 bg-white/90 hover:bg-white rounded-2xl border-2 border-yellow-300 hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group bg-gradient-to-b from-yellow-50 to-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-yellow-100 text-amber-800 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-amber-950">Álbum de Medallas</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Mira tus estrellas ganadas, trofeos e imprime tu diploma.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 text-center py-4 text-xs text-slate-400 border-t border-sky-100 mt-6">
        <span>Diseñado con cariño para las escuelas primarias de Mendoza, Argentina 🇦🇷</span>
      </footer>
    </div>
  );
};
