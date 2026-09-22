import React, { useState, useEffect } from 'react';
import { CardView } from './CardView';
import { playCardFlip, playHoloSparkle } from '../utils/audio';
import { RARITY_THEMES } from '../utils/cardThemes';
import { Sparkles, X, BookOpen, Check, Star } from 'lucide-react';

export const CardRevealModal = ({
  card,
  collectedCard,
  isAlreadyOwned,
  onClose,
  onOpenBinder
}) => {
  const [isFlipped, setIsFlipped] = useState(true); // Start facedown
  const rarityTheme = RARITY_THEMES[card.rarity] || RARITY_THEMES.common;

  useEffect(() => {
    // Auto flip after 400ms for dramatic reveal
    const timer = setTimeout(() => {
      setIsFlipped(false);
      playCardFlip();
      if (rarityTheme.isHolo) {
        setTimeout(() => playHoloSparkle(), 350);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [card, rarityTheme]);

  const handleManualFlip = () => {
    setIsFlipped(!isFlipped);
    playCardFlip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      
      {/* Background glow burst */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className={`w-[500px] h-[500px] rounded-full blur-3xl opacity-25 animate-pulse ${
          rarityTheme.isSecret ? 'bg-amber-400' : rarityTheme.isHolo ? 'bg-purple-500' : 'bg-blue-500'
        }`} />
      </div>

      <div className="relative w-full max-w-lg bg-slate-950/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center space-y-5 shadow-2xl z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Reveal Badge Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nouveau Drop Débloqué !</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-['Rajdhani'] font-black uppercase text-white tracking-wide">
            {card.name}
          </h2>

          <div className="flex items-center justify-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded font-bold uppercase border ${rarityTheme.badgeBg}`}>
              {rarityTheme.label}
            </span>
            {collectedCard?.serialNumber && (
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-900 text-amber-400 border border-slate-700">
                Exemplaire #{collectedCard.serialNumber}
              </span>
            )}
            {isAlreadyOwned && (
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px]">
                (Déjà possédé x{collectedCard?.count || 1})
              </span>
            )}
          </div>
        </div>

        {/* Card Stage with 3D Flip */}
        <div className="py-2 transform transition-transform hover:scale-105">
          <CardView
            card={card}
            size="lg"
            isFlipped={isFlipped}
            isInteractive={true}
            serialNumber={collectedCard?.serialNumber}
            onClick={handleManualFlip}
          />
        </div>

        <p className="text-[11px] text-slate-400">
          Survole la carte pour explorer son reflet foil 3D ou clique dessus pour voir le dos.
        </p>

        {/* Bottom Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onOpenBinder}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Voir dans mon Classeur</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
