import React from 'react';
import { Volume2, VolumeX, Sparkles, Home, Award, HelpCircle } from 'lucide-react';
import { GameScreen } from '../types/game';

interface GameHUDProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  starsCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  onOpenHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentScreen,
  onNavigate,
  starsCount,
  isMuted,
  onToggleMute,
  speechEnabled,
  onToggleSpeech,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs px-3 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand / Home */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'TITLE' && (
            <button
              type="button"
              onClick={() => onNavigate('TITLE')}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Volver al Inicio"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl" role="img" aria-label="Sol">☀️</span>
            <div className="flex flex-col">
              <span className="font-bold text-sky-900 text-sm sm:text-base leading-tight tracking-tight">
                Matemática Mendoza
              </span>
              <span className="text-[10px] sm:text-xs text-sky-600 font-medium">
                2° Grado Primaria
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick navigation tabs (on desktop/tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-sky-50/80 p-1 rounded-xl border border-sky-200">
          <button
            type="button"
            onClick={() => onNavigate('TUTORIAL_INTRO')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'TUTORIAL_INTRO'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            📚 Explicación Paso a Paso
          </button>
          <button
            type="button"
            onClick={() => onNavigate('AVENTURA')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'AVENTURA'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            Aventura
          </button>
          <button
            type="button"
            onClick={() => onNavigate('MAQUINA_MAGICA')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'MAQUINA_MAGICA'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            Máquina de Multiplicar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('COSECHA_RAPIDA')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'COSECHA_RAPIDA'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            Atrapa Cosecha
          </button>
          <button
            type="button"
            onClick={() => onNavigate('MODO_DESAFIO')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'MODO_DESAFIO'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xs'
                : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/60'
            }`}
          >
            ⚡ Desafío
          </button>
          <button
            type="button"
            onClick={() => onNavigate('MEMORIA_PAREJAS')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'MEMORIA_PAREJAS'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            Memoria
          </button>
          <button
            type="button"
            onClick={() => onNavigate('TABLA_PITAGORICA')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'TABLA_PITAGORICA'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            Tablas del 1 al 5
          </button>
          <button
            type="button"
            onClick={() => onNavigate('RECOMPENSAS')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentScreen === 'RECOMPENSAS'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            🏅 Medallas
          </button>
        </nav>

        {/* Right: Stars + Medallas + Audio Controls + Diploma */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Star counter & Medallas button */}
          <button
            type="button"
            onClick={() => onNavigate('RECOMPENSAS')}
            className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl shadow-2xs cursor-pointer active:scale-95 transition-colors"
            title="Ver mis Medallas y Nivel"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-bold text-amber-900 text-xs sm:text-sm tabular-nums">
              {starsCount}
            </span>
          </button>

          {/* Diploma button */}
          <button
            type="button"
            onClick={() => onNavigate('DIPLOMA')}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer active:scale-95 border border-emerald-300"
            title="Ver Diploma de Mendoza"
          >
            <Award className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Diploma</span>
          </button>

          {/* Text-to-speech toggle */}
          <button
            type="button"
            onClick={onToggleSpeech}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 active:scale-95 ${
              speechEnabled
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={speechEnabled ? 'Voz argentina clara y pausada activada (clic para silenciar)' : 'Voz desactivada (clic para activar)'}
          >
            <span className="text-sm">🗣️</span>
          </button>

          {/* Sound FX Mute toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer active:scale-95"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Pedagogical info for teachers and families */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-800 transition-colors cursor-pointer active:scale-95"
            title="Guía para la Maestra y Familia"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
