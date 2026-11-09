import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Wand2, Plus, Minus, Volume2, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { FruitGroupDisplay } from './FruitGroupDisplay';
import { sound } from '../utils/audio';

interface MagicFactoryProps {
  onGoHome: () => void;
  onAddStar: () => void;
  onUnlockBadge?: (id: string) => void;
}

export const MagicFactory: React.FC<MagicFactoryProps> = ({ onGoHome, onAddStar, onUnlockBadge }) => {
  const [baskets, setBaskets] = useState<number>(3);
  const [itemsPerBasket, setItemsPerBasket] = useState<number>(2);
  const [fruitType, setFruitType] = useState<'uva' | 'manzana' | 'cereza' | 'sol' | 'estrella'>('uva');
  const [isTransformed, setIsTransformed] = useState<boolean>(false);

  const total = baskets * itemsPerBasket;

  // Build repeated addition string: e.g. "2 + 2 + 2"
  const additionTerms = Array(baskets).fill(itemsPerBasket).join(' + ');

  const handleTransform = () => {
    setIsTransformed(true);
    sound.playMagic();
    onAddStar();
    if (onUnlockBadge) onUnlockBadge('badge_salto_por');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#fbbf24', '#38bdf8', '#ec4899']
    });

    sound.speak(
      `¡Transformación mágica! Tenemos ${baskets} canastos con ${itemsPerBasket} frutas cada uno. Sumamos: ${additionTerms} es igual a ${total}. ¡Decimos ${baskets} veces ${itemsPerBasket}! Y en multiplicación escribimos: ${baskets} por ${itemsPerBasket} igual a ${total}.`
    );
  };

  const handleBasketChange = (delta: number) => {
    const nextVal = Math.min(5, Math.max(1, baskets + delta));
    setBaskets(nextVal);
    setIsTransformed(false);
    sound.playPop(450 + nextVal * 40);
  };

  const handleItemChange = (delta: number) => {
    const nextVal = Math.min(5, Math.max(1, itemsPerBasket + delta));
    setItemsPerBasket(nextVal);
    setIsTransformed(false);
    sound.playPop(500 + nextVal * 40);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Header bar */}
      <div className="bg-white/95 rounded-2xl p-3 border border-purple-200 shadow-xs flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="p-1 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
            title="Volver al menú"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-purple-950 flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-purple-600" />
              <span>La Máquina Mágica de Multiplicar</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-purple-600">
              Laboratorio interactivo para explorar sumas y tablas
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.speak(
              'En la Máquina Mágica puedes cambiar cuántos canastos quieres y cuántas frutas poner en cada uno. ¡Luego presiona el botón morado para ver la magia de la multiplicación!'
            );
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold rounded-lg cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Explicación</span>
        </button>
      </div>

      {/* Control Deck for 2nd grade hands */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Control 1: Cantidad de Canastos */}
        <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center">
          <span className="text-xs font-bold text-amber-900 mb-1">
            1. ¿Cuántos canastos?
          </span>
          <div className="flex items-center gap-3 my-1">
            <button
              type="button"
              onClick={() => handleBasketChange(-1)}
              disabled={baskets <= 1}
              className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer shadow-xs active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-black text-amber-600 tabular-nums w-8 text-center">
              {baskets}
            </span>
            <button
              type="button"
              onClick={() => handleBasketChange(1)}
              disabled={baskets >= 5}
              className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-500">Hasta 5 canastos</span>
        </div>

        {/* Control 2: Frutas en cada canasto */}
        <div className="bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-xs flex flex-col items-center">
          <span className="text-xs font-bold text-sky-900 mb-1">
            2. ¿Cuántas frutas en cada uno?
          </span>
          <div className="flex items-center gap-3 my-1">
            <button
              type="button"
              onClick={() => handleItemChange(-1)}
              disabled={itemsPerBasket <= 1}
              className="w-8 h-8 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer shadow-xs active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-black text-sky-600 tabular-nums w-8 text-center">
              {itemsPerBasket}
            </span>
            <button
              type="button"
              onClick={() => handleItemChange(1)}
              disabled={itemsPerBasket >= 5}
              className="w-8 h-8 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-500">Hasta 5 frutas por canasto</span>
        </div>

        {/* Control 3: Tipo de Fruta */}
        <div className="bg-white p-3 rounded-2xl border-2 border-purple-200 shadow-xs flex flex-col items-center justify-between">
          <span className="text-xs font-bold text-purple-900 mb-1">
            3. Elige qué cosechar:
          </span>
          <div className="flex items-center gap-1.5 my-1">
            {[
              { type: 'uva', icon: '🍇' },
              { type: 'manzana', icon: '🍎' },
              { type: 'cereza', icon: '🍒' },
              { type: 'sol', icon: '☀️' },
              { type: 'estrella', icon: '⭐' },
            ].map(f => (
              <button
                key={f.type}
                type="button"
                onClick={() => {
                  setFruitType(f.type as any);
                  sound.playPop();
                }}
                className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                  fruitType === f.type
                    ? 'bg-purple-200 ring-2 ring-purple-500 scale-110 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 opacity-70'
                }`}
              >
                {f.icon}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500">¡Frutas de Mendoza!</span>
        </div>
      </div>

      {/* Quick Sum Practice Presets */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
          <span>➕</span>
          <span>Práctica de Sumas reiteradas:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: '2 + 2', b: 2, i: 2 },
            { label: '2 + 2 + 2', b: 3, i: 2 },
            { label: '2 + 2 + 2 + 2', b: 4, i: 2 },
            { label: '3 + 3', b: 2, i: 3 },
            { label: '3 + 3 + 3', b: 3, i: 3 },
            { label: '4 + 4', b: 2, i: 4 },
            { label: '4 + 4 + 4', b: 3, i: 4 },
            { label: '5 + 5', b: 2, i: 5 },
            { label: '5 + 5 + 5', b: 3, i: 5 },
          ].map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setBaskets(p.b);
                setItemsPerBasket(p.i);
                setIsTransformed(false);
                sound.playPop(520);
                sound.speak(`Practicando la suma: ${p.label}`);
              }}
              className={`px-2 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition-all active:scale-95 border ${
                baskets === p.b && itemsPerBasket === p.i
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs scale-105'
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Display Area */}
      <div className="bg-white/95 rounded-3xl border-2 border-purple-200 p-4 sm:p-6 shadow-md mb-4 text-center">
        <FruitGroupDisplay
          groupCount={baskets}
          itemsPerGroup={itemsPerBasket}
          itemType={fruitType}
          interactive={true}
        />

        {/* The Magic Transformation Button */}
        <div className="my-5">
          <button
            type="button"
            onClick={handleTransform}
            className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-102 active:scale-98 transition-all flex items-center gap-2.5 mx-auto cursor-pointer border-2 border-white ring-4 ring-purple-200"
          >
            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>¡Transformar Suma en Multiplicación!</span>
            <Wand2 className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Transformation Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          {/* Step 1 */}
          <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-200">
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
              Paso 1: Suma reiterada
            </span>
            <div className="text-lg font-extrabold text-sky-950 font-mono tracking-wide">
              {additionTerms} = <span className="text-sky-600">{total}</span>
            </div>
            <p className="text-xs text-sky-700 mt-1">
              Sumamos {itemsPerBasket} tantas veces como canastos hay ({baskets} canastos).
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-3 rounded-2xl border-2 transition-all ${
              isTransformed
                ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Paso 2: Descubrimos «Veces»
            </span>
            <div className="text-lg font-extrabold text-amber-950">
              {baskets} veces {itemsPerBasket} = <span className="text-amber-600">{total}</span>
            </div>
            <p className="text-xs text-amber-800 mt-1">
              Contamos cuántos canastos hay: ¡El {itemsPerBasket} se repite {baskets} veces!
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-3 rounded-2xl border-2 transition-all ${
              isTransformed
                ? 'bg-purple-100 border-purple-500 ring-4 ring-purple-300 shadow-md scale-102'
                : 'bg-purple-50/70 border-purple-200'
            }`}
          >
            <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block mb-1 flex items-center justify-between">
              <span>Paso 3: Multiplicación</span>
              {isTransformed && <span className="text-xs">✨ ¡MÁGICO!</span>}
            </span>
            <div className="text-xl font-black text-purple-950 font-mono">
              {baskets} × {itemsPerBasket} ={' '}
              <span className={isTransformed ? 'text-purple-600' : 'text-slate-400'}>
                {isTransformed ? total : '?'}
              </span>
            </div>
            <p className="text-xs text-purple-800 mt-1">
              Reemplazamos «veces» por el signo «×» (por). ¡Multiplicar es sumar más rápido!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
