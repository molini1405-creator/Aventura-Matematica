import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Brain, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface MemoryCard {
  id: string;
  pairId: number;
  type: 'addition' | 'multiplication';
  text: string;
  subtext: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  onGoHome: () => void;
  onAddStar: () => void;
  onUnlockBadge?: (id: string) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onGoHome, onAddStar, onUnlockBadge }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MemoryCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Available pairs bridging repeated addition and multiplication
  const rawPairs = [
    {
      pairId: 1,
      additionText: '2 + 2 + 2',
      additionSub: '3 canastos de 2',
      multText: '3 × 2 = 6',
      multSub: '3 veces 2',
    },
    {
      pairId: 2,
      additionText: '3 + 3',
      additionSub: '2 canastos de 3',
      multText: '2 × 3 = 6',
      multSub: '2 veces 3',
    },
    {
      pairId: 3,
      additionText: '4 + 4',
      additionSub: '2 canastos de 4',
      multText: '2 × 4 = 8',
      multSub: '2 veces 4',
    },
    {
      pairId: 4,
      additionText: '5 + 5 + 5',
      additionSub: '3 canastos de 5',
      multText: '3 × 5 = 15',
      multSub: '3 veces 5',
    },
  ];

  const initializeDeck = () => {
    const deck: MemoryCard[] = [];

    rawPairs.forEach(p => {
      deck.push({
        id: `add-${p.pairId}`,
        pairId: p.pairId,
        type: 'addition',
        text: p.additionText,
        subtext: p.additionSub,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: `mult-${p.pairId}`,
        pairId: p.pairId,
        type: 'multiplication',
        text: p.multText,
        subtext: p.multSub,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsVictory(false);
  };

  useEffect(() => {
    initializeDeck();
  }, []);

  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    sound.playPop(520);
    const updatedCards = cards.map(c => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newSelected;

      if (first.pairId === second.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          onAddStar();
          setCards(prev =>
            prev.map(c => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);
          setMatchedPairs(prevMp => {
            const nextMp = prevMp + 1;
            if (nextMp === rawPairs.length) {
              setTimeout(() => {
                sound.playFanfare();
                setIsVictory(true);
                if (onUnlockBadge) onUnlockBadge('badge_memoria_genio');
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }, 0);
            }
            return nextMp;
          });
        }, 500);
      } else {
        // Did not match
        setTimeout(() => {
          sound.playEncouraging();
          setCards(prev =>
            prev.map(c =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      {/* Header bar */}
      <div className="bg-white/95 rounded-2xl p-3 border border-sky-200 shadow-xs flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="p-1 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-sky-950 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-sky-600" />
              <span>Memoria de Parejas: Suma y Por (×)</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-sky-700">
              Encuentra la suma reiterada que corresponde a cada multiplicación
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-sky-100 rounded-xl text-sky-900 text-xs font-bold">
            Parejas: {matchedPairs}/{rawPairs.length}
          </div>
          <button
            type="button"
            onClick={initializeDeck}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Reiniciar cartas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4">
        {cards.map(card => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              type="button"
              disabled={card.isMatched}
              onClick={() => handleCardClick(card)}
              className={`h-36 sm:h-44 rounded-2xl p-3 transition-all duration-300 transform cursor-pointer border-3 flex flex-col items-center justify-between shadow-md active:scale-95 ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90'
                  : isRevealed
                  ? 'bg-white border-amber-400 scale-102 ring-4 ring-amber-100'
                  : 'bg-gradient-to-br from-sky-400 to-indigo-500 border-white hover:brightness-105'
              }`}
            >
              {isRevealed ? (
                <>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      card.type === 'addition'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {card.type === 'addition' ? '➕ Suma' : '✖️ Por'}
                  </span>

                  <div className="my-auto text-center">
                    <span className="text-xl sm:text-2xl font-black text-slate-800 block">
                      {card.text}
                    </span>
                    <span className="text-xs text-slate-500 font-medium block mt-1">
                      {card.subtext}
                    </span>
                  </div>

                  {card.isMatched ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ¡Emparejado!
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold">¡Buscando pareja!</span>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white text-center">
                  <span className="text-3xl mb-1 filter drop-shadow-sm">🍇</span>
                  <span className="text-xs font-black tracking-widest uppercase opacity-90">
                    Mendoza
                  </span>
                  <span className="text-[10px] opacity-75 mt-0.5">Toca para voltear</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory Announcement */}
      {isVictory && (
        <div className="bg-emerald-100 border-2 border-emerald-400 rounded-3xl p-5 text-center mt-4 shadow-lg animate-pulse-gentle">
          <div className="text-3xl mb-1">🎉</div>
          <h2 className="text-2xl font-black text-emerald-950">
            ¡Felicitaciones! ¡Memoria Brillante!
          </h2>
          <p className="text-sm text-emerald-800 mt-1">
            Encontraste todas las parejas de sumas reiteradas y multiplicaciones en {moves} intentos.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={initializeDeck}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jugar Otra Vez</span>
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold rounded-xl cursor-pointer"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
