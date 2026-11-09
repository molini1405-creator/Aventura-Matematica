import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface DiplomaModalProps {
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  starsCount: number;
  onGoHome: () => void;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  playerName,
  onUpdatePlayerName,
  starsCount,
  onGoHome,
}) => {
  const [name, setName] = useState(playerName || 'Amiguito/a');
  const [school, setSchool] = useState('Escuela de Mendoza');
  const [dateStr] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  const handlePrint = () => {
    sound.playFanfare();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
    });
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Top action bar */}
      <div className="no-print bg-white/95 rounded-2xl p-3 border border-emerald-200 shadow-xs flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onGoHome}
          className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Juego</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Diploma</span>
          </button>
        </div>
      </div>

      {/* Diploma Certificate Card */}
      <div
        id="diploma-to-print"
        className="relative bg-gradient-to-b from-amber-50 via-white to-amber-50 p-6 sm:p-10 rounded-3xl border-8 border-amber-400 shadow-2xl text-center overflow-hidden"
      >
        {/* Ornate corner ornaments */}
        <div className="absolute top-3 left-3 text-2xl opacity-60">🍇</div>
        <div className="absolute top-3 right-3 text-2xl opacity-60">☀️</div>
        <div className="absolute bottom-3 left-3 text-2xl opacity-60">🏔️</div>
        <div className="absolute bottom-3 right-3 text-2xl opacity-60">🍷</div>

        {/* Header Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-100 rounded-full border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
          <span>Provincia de Mendoza · Educación Primaria</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-amber-900 tracking-tight">
          DIPLOMA DE HONOR
        </h1>
        <p className="text-sm sm:text-base font-bold text-amber-700 uppercase tracking-widest mt-1">
          Gran Maestro/a de las Tablas hasta el 5
        </p>

        {/* Decorative divider */}
        <div className="w-40 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4"></div>

        <p className="text-sm sm:text-base text-slate-700">
          Se otorga con orgullo y alegría a:
        </p>

        {/* Editable Name Field */}
        <div className="my-3">
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              onUpdatePlayerName(e.target.value);
            }}
            className="text-2xl sm:text-4xl font-extrabold text-sky-900 text-center border-b-2 border-dashed border-amber-400 bg-transparent px-3 py-1 focus:outline-hidden focus:border-amber-600 max-w-md w-full placeholder-slate-400"
            placeholder="Escribe tu nombre aquí"
          />
        </div>

        <div className="my-2">
          <span className="text-xs text-slate-500 mr-2">De la escuela:</span>
          <input
            type="text"
            value={school}
            onChange={e => setSchool(e.target.value)}
            className="text-sm sm:text-base font-bold text-slate-700 text-center border-b border-amber-300 bg-transparent px-2 py-0.5 focus:outline-hidden max-w-xs"
            placeholder="Nombre de la escuela"
          />
        </div>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto my-4 leading-relaxed">
          Por haber comprendido la magia de las sumas reiteradas, descubierto el poder de la palabra{' '}
          <strong>«veces»</strong> y dominado las multiplicaciones del <strong>1, 2, 3, 4 y 5</strong> en
          los hermosos paisajes de la provincia de Mendoza.
        </p>

        {/* Signatures & Badges Strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-4 border-t border-amber-200 items-end">
          {/* Mascot Zorrito */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">🦊</span>
            <div className="w-24 border-b border-slate-400 my-1"></div>
            <span className="text-xs font-bold text-slate-700">Zorrito Mendocino</span>
            <span className="text-[10px] text-slate-400">Guía de Viñedos</span>
          </div>

          {/* Golden Seal */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-500 shadow-lg flex flex-col items-center justify-center p-1">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-900" />
              <span className="text-[9px] font-black text-amber-950 uppercase">2° GRADO</span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 mt-1">{dateStr}</span>
          </div>

          {/* Mascot Guani */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">🦙</span>
            <div className="w-24 border-b border-slate-400 my-1"></div>
            <span className="text-xs font-bold text-slate-700">Guani el Guanaco</span>
            <span className="text-[10px] text-slate-400">Guía del Aconcagua</span>
          </div>
        </div>

        <div className="mt-6 text-[11px] text-slate-400">
          ⭐ Estrellas ganadas en la aventura: <strong className="text-amber-600">{starsCount}</strong>
        </div>
      </div>
    </div>
  );
};
