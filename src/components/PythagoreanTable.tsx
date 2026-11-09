import React, { useState } from 'react';
import { Grid3X3, ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface PythagoreanTableProps {
  onGoHome: () => void;
  onAddStar: () => void;
}

export const PythagoreanTable: React.FC<PythagoreanTableProps> = ({ onGoHome }) => {
  const [selectedRow, setSelectedRow] = useState<number>(3);
  const [selectedCol, setSelectedCol] = useState<number>(4);
  const [showMode, setShowMode] = useState<'NUMBERS' | 'EQUATIONS'>('NUMBERS');

  const rows = [1, 2, 3, 4, 5];
  const cols = [1, 2, 3, 4, 5];

  const currentResult = selectedRow * selectedCol;
  const additionTerms = Array(selectedRow).fill(selectedCol).join(' + ');

  const handleCellClick = (r: number, c: number) => {
    setSelectedRow(r);
    setSelectedCol(c);
    const result = r * c;
    sound.playPop(480 + result * 15);

    // Read out loud immediately: number and result
    sound.speak(`${r} por ${c} es igual a ${result}. ${r} veces ${c} son ${result}.`);
  };

  const handleSpeak = () => {
    sound.speak(
      `${selectedRow} por ${selectedCol} es igual a ${currentResult}. Son ${selectedRow} ${selectedRow === 1 ? 'vez' : 'veces'} ${selectedCol}. En suma reiterada: ${additionTerms} es igual a ${currentResult}.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Header Bar */}
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
              <Grid3X3 className="w-4 h-4 text-amber-600" />
              <span>Cuadro de las Tablas hasta el 5</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-700">
              Toca cualquier número para ver cómo se forma con sumas y uvas
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
          <button
            type="button"
            onClick={() => setShowMode('NUMBERS')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
              showMode === 'NUMBERS'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Números
          </button>
          <button
            type="button"
            onClick={() => setShowMode('EQUATIONS')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
              showMode === 'EQUATIONS'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Tablas (×)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white/95 p-4 rounded-3xl border-2 border-amber-200 shadow-md flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 mb-2">
            Columna: Frutas por canasto ➡️
          </div>

          <div className="overflow-x-auto w-full flex justify-center">
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {/* Corner */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center font-black text-amber-800 text-lg border border-amber-300">
                ×
              </div>

              {/* Column Headers 1..5 */}
              {cols.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCol(c);
                    sound.playPop(520);
                    sound.speak(`Columna ${c}. Cada canasto tiene ${c} frutas.`);
                  }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border transition-colors cursor-pointer active:scale-95 ${
                    selectedCol === c
                      ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                      : 'bg-sky-100 text-sky-900 border-sky-200 hover:bg-sky-200'
                  }`}
                  title={`Columna ${c}: ${c} frutas`}
                >
                  {c}
                </button>
              ))}

              {/* Rows */}
              {rows.map(r => (
                <React.Fragment key={r}>
                  {/* Row Header */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRow(r);
                      sound.playPop(520);
                      sound.speak(`Fila de la tabla del ${r}. Multiplicamos por ${r}.`);
                    }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border transition-colors cursor-pointer active:scale-95 ${
                      selectedRow === r
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200'
                    }`}
                    title={`Tabla del ${r}`}
                  >
                    {r}
                  </button>

                  {/* Row Cells */}
                  {cols.map(c => {
                    const isSelected = selectedRow === r && selectedCol === c;
                    const isHighlighted = selectedRow === r || selectedCol === c;
                    const product = r * c;

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => handleCellClick(r, c)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-black text-xs sm:text-sm transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer border flex items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-700 shadow-md ring-4 ring-purple-200 scale-105 z-10'
                            : isHighlighted
                            ? 'bg-amber-50 text-amber-950 border-amber-300'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {showMode === 'NUMBERS' ? product : `${r}×${c}`}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-3 text-center">
            ⬅️ Fila: Cantidad de veces / canastos
          </div>
        </div>

        {/* Right: Visual Fruit Matrix & Explanation (5 cols) */}
        <div className="lg:col-span-5 bg-white/95 p-4 rounded-3xl border-2 border-sky-200 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-sky-100 pb-2 mb-3">
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                Explicación Visual
              </span>
              <button
                type="button"
                onClick={handleSpeak}
                className="p-1 px-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Escuchar</span>
              </button>
            </div>

            {/* Formula Header */}
            <div className="text-center bg-gradient-to-r from-sky-50 to-indigo-50 p-3 rounded-2xl border border-sky-200 mb-3">
              <div className="text-2xl sm:text-3xl font-black text-sky-950">
                {selectedRow} × {selectedCol} = <span className="text-purple-600">{currentResult}</span>
              </div>
              <div className="text-xs font-bold text-amber-700 mt-1">
                {selectedRow === 1 ? 'Una vez' : `${selectedRow} veces`} {selectedCol}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                {additionTerms} = {currentResult}
              </div>
            </div>

            {/* Visual Grape Array (Rows × Cols) */}
            <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                {selectedRow} filas de {selectedCol} racimos de uvas:
              </span>

              {Array.from({ length: selectedRow }).map((_, rIdx) => (
                <div key={rIdx} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 w-4">
                    {rIdx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-200 shadow-2xs">
                    {Array.from({ length: selectedCol }).map((_, cIdx) => (
                      <span key={cIdx} className="text-xl sm:text-2xl hover:scale-120 transition-transform">
                        🍇
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-center text-xs text-purple-900 font-medium">
            💡 En 2° grado aprendemos que <strong>{selectedRow} × {selectedCol}</strong> da lo mismo que <strong>{selectedCol} × {selectedRow}</strong>: ¡la propiedad conmutativa!
          </div>
        </div>
      </div>
    </div>
  );
};
