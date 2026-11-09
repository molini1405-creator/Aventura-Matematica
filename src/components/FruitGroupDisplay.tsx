import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface FruitGroupDisplayProps {
  groupCount: number;
  itemsPerGroup: number;
  itemType: 'uva' | 'manzana' | 'cereza' | 'sol' | 'rueda' | 'estrella';
  interactive?: boolean;
  highlightAddition?: boolean;
  highlightMultiplication?: boolean;
}

export const FruitGroupDisplay: React.FC<FruitGroupDisplayProps> = ({
  groupCount,
  itemsPerGroup,
  itemType,
  interactive = true,
}) => {
  const [clickedItems, setClickedItems] = useState<Record<string, boolean>>({});

  const handleItemClick = (key: string, overallIdx: number) => {
    if (!interactive) return;
    const isNowActive = !clickedItems[key];
    setClickedItems(prev => ({ ...prev, [key]: isNowActive }));
    sound.playPop(480 + overallIdx * 30);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'uva':
        return (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform transform group-hover:scale-110">
            🍇
          </span>
        );
      case 'manzana':
        return (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform transform group-hover:scale-110">
            🍎
          </span>
        );
      case 'cereza':
        return (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform transform group-hover:scale-110">
            🍒
          </span>
        );
      case 'sol':
        return (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform transform group-hover:scale-110">
            ☀️
          </span>
        );
      case 'rueda':
        return (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform transform group-hover:scale-110">
            🚜
          </span>
        );
      case 'estrella':
        return (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform transform group-hover:scale-110">
            ⭐
          </span>
        );
      default:
        return <span className="text-2xl">🍇</span>;
    }
  };

  let globalCounter = 0;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-3">
        {Array.from({ length: groupCount }).map((_, groupIdx) => (
          <div
            key={groupIdx}
            className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white/95 border-2 border-amber-200 shadow-md transition-all hover:border-amber-400 hover:shadow-lg relative min-w-[100px] sm:min-w-[125px]"
          >
            {/* Group Label */}
            <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full mb-2 border border-amber-300">
              Canasto {groupIdx + 1}
            </span>

            {/* Visual Basket & Items Container */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 bg-gradient-to-b from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 min-h-[64px] min-w-[70px]">
              {Array.from({ length: itemsPerGroup }).map((_, itemIdx) => {
                globalCounter += 1;
                const currentNum = globalCounter;
                const itemKey = `${groupIdx}-${itemIdx}`;
                const isClicked = !!clickedItems[itemKey];

                return (
                  <button
                    key={itemIdx}
                    type="button"
                    onClick={() => handleItemClick(itemKey, currentNum)}
                    className={`cursor-pointer transition-all duration-150 transform hover:scale-115 active:scale-95 relative p-1 rounded-lg ${
                      isClicked ? 'bg-amber-200 ring-2 ring-amber-400 scale-105' : 'hover:bg-amber-100/60'
                    }`}
                    title={`Elemento ${currentNum}. ¡Toca para contar!`}
                  >
                    {renderIcon(itemType)}
                    <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {currentNum}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Items count in this basket */}
            <div className="mt-2 text-xs font-semibold text-slate-600 flex items-center gap-1">
              <span>Tiene:</span>
              <span className="font-bold text-sky-600 bg-sky-100 px-1.5 py-0.2 rounded text-sm">
                {itemsPerGroup}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500 font-medium">
        💡 <span className="font-semibold text-slate-700">Pista para 2° grado:</span> ¡Puedes tocar cada fruta para contarla con sonido!
      </p>
    </div>
  );
};
