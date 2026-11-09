import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameScreen } from './types/game';
import { sound } from './utils/audio';
import { ALL_BADGES } from './data/badgesData';
import { GameHUD } from './components/GameHUD';
import { TitleScreen } from './components/TitleScreen';
import { AdventureMode } from './components/AdventureMode';
import { MagicFactory } from './components/MagicFactory';
import { HarvestGame } from './components/HarvestGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { PythagoreanTable } from './components/PythagoreanTable';
import { RewardCabinet } from './components/RewardCabinet';
import { DiplomaModal } from './components/DiplomaModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { StepByStepIntro } from './components/StepByStepIntro';
import { ChallengeMode } from './components/ChallengeMode';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('TITLE');
  const [currentStationNum, setCurrentStationNum] = useState<number>(() => {
    const saved = localStorage.getItem('mendoza_math_station');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('mendoza_math_stars');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('mendoza_math_player') || 'Estudiante';
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mendoza_math_badges');
    return saved ? JSON.parse(saved) : ['badge_primera_suma'];
  });

  const [toastBadge, setToastBadge] = useState<{
    title: string;
    icon: string;
    description: string;
  } | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mendoza_math_station', currentStationNum.toString());
  }, [currentStationNum]);

  useEffect(() => {
    localStorage.setItem('mendoza_math_stars', starsCount.toString());
  }, [starsCount]);

  useEffect(() => {
    localStorage.setItem('mendoza_math_player', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('mendoza_math_badges', JSON.stringify(unlockedBadgeIds));
  }, [unlockedBadgeIds]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const handleToggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    sound.speechEnabled = next;
    if (!next) sound.stopSpeaking();
  };

  const handleAddStar = () => {
    setStarsCount(prev => prev + 1);
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadgeIds.includes(badgeId)) {
      setUnlockedBadgeIds(prev => [...prev, badgeId]);

      const badgeObj = ALL_BADGES.find(b => b.id === badgeId);
      if (badgeObj) {
        setToastBadge({
          title: badgeObj.title,
          icon: badgeObj.icon,
          description: badgeObj.description,
        });

        sound.playFanfare();
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.2 },
        });

        // Hide toast after 4.5 seconds
        setTimeout(() => {
          setToastBadge(null);
        }, 4500);
      }
    }
  };

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
  };

  const handleUpdateStation = (num: number) => {
    setCurrentStationNum(num);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/60 text-slate-800 relative">
      {/* HUD Header */}
      <GameHUD
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        starsCount={starsCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        speechEnabled={speechEnabled}
        onToggleSpeech={handleToggleSpeech}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Floating Badge Unlock Celebration Notification */}
      {toastBadge && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-bounce duration-500">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3">
            <span className="text-3xl p-1 bg-white/70 rounded-xl shadow-xs">
              {toastBadge.icon}
            </span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                ¡NUEVA MEDALLA DESBLOQUEADA! 🎉
              </div>
              <div className="text-sm font-black text-amber-950">
                {toastBadge.title}
              </div>
              <div className="text-[11px] text-amber-900 font-medium">
                {toastBadge.description}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentScreen('RECOMPENSAS')}
              className="ml-2 px-2.5 py-1 bg-amber-900 text-white rounded-lg text-xs font-bold hover:bg-black cursor-pointer"
            >
              Ver
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Viewport */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'TITLE' && (
          <TitleScreen
            onStartAdventure={() => setCurrentScreen('AVENTURA')}
            onNavigate={setCurrentScreen}
            playerName={playerName}
            onUpdatePlayerName={handleUpdatePlayerName}
          />
        )}

        {currentScreen === 'TUTORIAL_INTRO' && (
          <StepByStepIntro
            onStartGame={() => setCurrentScreen('AVENTURA')}
            onGoHome={() => setCurrentScreen('TITLE')}
            onAddStar={handleAddStar}
          />
        )}

        {currentScreen === 'AVENTURA' && (
          <AdventureMode
            currentStationNum={currentStationNum}
            onUpdateStation={handleUpdateStation}
            starsCount={starsCount}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
            onGoHome={() => setCurrentScreen('TITLE')}
            onOpenDiploma={() => setCurrentScreen('DIPLOMA')}
          />
        )}

        {currentScreen === 'MAQUINA_MAGICA' && (
          <MagicFactory
            onGoHome={() => setCurrentScreen('TITLE')}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentScreen === 'COSECHA_RAPIDA' && (
          <HarvestGame
            onGoHome={() => setCurrentScreen('TITLE')}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentScreen === 'MEMORIA_PAREJAS' && (
          <MemoryMatchGame
            onGoHome={() => setCurrentScreen('TITLE')}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentScreen === 'TABLA_PITAGORICA' && (
          <PythagoreanTable
            onGoHome={() => setCurrentScreen('TITLE')}
            onAddStar={handleAddStar}
          />
        )}

        {currentScreen === 'MODO_DESAFIO' && (
          <ChallengeMode
            onGoHome={() => setCurrentScreen('TITLE')}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
            starsCount={starsCount}
          />
        )}

        {currentScreen === 'RECOMPENSAS' && (
          <RewardCabinet
            unlockedBadgeIds={unlockedBadgeIds}
            starsCount={starsCount}
            playerName={playerName}
            onGoHome={() => setCurrentScreen('TITLE')}
            onOpenDiploma={() => setCurrentScreen('DIPLOMA')}
            onUnlockBadge={handleUnlockBadge}
            onAddStar={handleAddStar}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'DIPLOMA' && (
          <DiplomaModal
            playerName={playerName}
            onUpdatePlayerName={handleUpdatePlayerName}
            starsCount={starsCount}
            onGoHome={() => setCurrentScreen('TITLE')}
          />
        )}
      </main>

      {/* Teacher & Family Pedagogical Modal */}
      <TeacherGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
