import React, { useState, useRef } from 'react';
import { CATEGORY_THEMES, RARITY_THEMES } from '../utils/cardThemes';
import { 
  Crown, 
  Film, 
  Zap, 
  Users, 
  Sparkles, 
  Flame, 
  Shield, 
  Star,
  Award
} from 'lucide-react';

const CATEGORY_ICONS = {
  streamer: Crown,
  moment_culte: Film,
  elite_gaming: Zap,
  communaute: Users,
  mascotte: Sparkles,
  event_special: Flame
};

export const CardView = ({
  card,
  size = 'md',
  isFlipped = false,
  isInteractive = true,
  isLocked = false,
  serialNumber = null,
  onClick = null
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const categoryTheme = CATEGORY_THEMES[card.category] || CATEGORY_THEMES.streamer;
  const rarityTheme = RARITY_THEMES[card.rarity] || RARITY_THEMES.common;
  const CategoryIcon = CATEGORY_ICONS[card.category] || Sparkles;

  // 3D tilt calculations on mouse move
  const handleMouseMove = (e) => {
    if (!isInteractive || isLocked || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.75
    });
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  // Dimensions
  const sizeClasses = {
    sm: 'w-[190px] h-[270px] text-[10px]',
    md: 'w-[260px] h-[375px] text-xs',
    lg: 'w-[320px] h-[465px] text-sm'
  }[size] || 'w-[260px] h-[375px] text-xs';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${sizeClasses} rounded-2xl perspective-1000 select-none cursor-pointer transition-transform duration-200 ease-out`}
      style={{
        transform: isInteractive 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isFlipped ? 'rotateY(180deg)' : ''}` 
          : undefined
      }}
    >
      {/* FLIPPABLE CONTAINER */}
      <div 
        className={`w-full h-full relative rounded-2xl transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        
        {/* ================= CARD FRONT ================= */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden overflow-hidden p-2.5 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 ${rarityTheme.frameBorder} ${
            rarityTheme.isSecret ? 'card-shadow-gold ring-1 ring-yellow-400/50' : rarityTheme.isHolo ? 'card-shadow-holo' : 'card-shadow'
          }`}
        >
          {/* Locked Silhouette Overlay */}
          {isLocked ? (
            <div className="w-full h-full rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Carte Non Débloquée</span>
              <p className="text-[10px] text-slate-500 mt-1">Saisis le code secret correspondant en direct du stream pour la révéler.</p>
              <span className="mt-3 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[9px]">
                {card.cardNumber}
              </span>
            </div>
          ) : (
            <>
              {/* Card Outer Border Shine Accent */}
              <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none bg-gradient-to-br ${categoryTheme.borderGradient}`} />
              
              {/* 1. TOP HEADER BAR */}
              <div className="relative z-10 flex items-center justify-between gap-1.5 pb-1 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <div className={`p-1 rounded-lg ${categoryTheme.badgeBg} shrink-0`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-['Rajdhani'] font-black uppercase tracking-wide text-white leading-tight truncate">
                      {card.name}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                      {categoryTheme.name}
                    </span>
                  </div>
                </div>

                {/* Score / Power Gem */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-amber-500/40 shrink-0">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-['Rajdhani'] font-black text-amber-300 text-xs tracking-wider">
                    {card.score || 500}
                  </span>
                </div>
              </div>

              {/* 2. CARD ARTWORK */}
              <div className="relative z-10 my-1 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 flex-1 flex flex-col justify-end group">
                <img
                  src={card.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'}
                  alt={card.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Bottom art gradient */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

                {/* Badges on Art: Serial & Rarity */}
                <div className="relative z-10 p-2 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md ${rarityTheme.badgeBg}`}>
                    {rarityTheme.label}
                  </span>

                  {serialNumber && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black bg-slate-950/85 text-amber-400 border border-amber-400/50 backdrop-blur-md">
                      Exemplaire #{serialNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. CARD TRAITS / ATTRIBUTES */}
              <div className="relative z-10 space-y-1 my-1">
                {(card.traits || []).slice(0, 2).map((trait, idx) => (
                  <div 
                    key={idx} 
                    className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[10px]"
                  >
                    <span className="font-bold text-slate-300 truncate max-w-[120px]">
                      {trait.label}
                    </span>
                    <span className="font-['Rajdhani'] font-black text-amber-300 tracking-wider text-xs">
                      {trait.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* 4. FLAVOR TEXT / LORE */}
              {card.lore && (
                <div className="relative z-10 px-2 py-1 rounded-md bg-slate-950/50 border-t border-slate-800/60">
                  <p className="text-[8.5px] italic text-slate-400 line-clamp-2 leading-relaxed">
                    « {card.lore} »
                  </p>
                </div>
              )}

              {/* 5. FOOTER METADATA */}
              <div className="relative z-10 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                <span className="truncate max-w-[100px]">{card.edition || 'Saison 1'}</span>
                <span className="text-amber-400 tracking-widest">{rarityTheme.stars}</span>
                <span>{card.cardNumber || '#001/050'}</span>
              </div>

              {/* 6. HOLOGRAPHIC FOIL OVERLAY */}
              {rarityTheme.isHolo && (
                <div 
                  className={`absolute inset-0 rounded-2xl pointer-events-none ${
                    rarityTheme.isSecret ? 'secret-gold-effect' : 'holo-effect'
                  }`}
                  style={{
                    opacity: glarePosition.opacity,
                    backgroundPosition: `${glarePosition.x}% ${glarePosition.y}%`
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* ================= CARD BACK ================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 p-3 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400/80 card-shadow flex flex-col items-center justify-between overflow-hidden"
        >
          {/* Geometric ornaments */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-amber-400 border-dashed animate-spin-slow" />
          </div>

          <div className="w-full flex justify-between items-center text-[9px] font-mono text-amber-400/70">
            <span>LIVE CARDS</span>
            <span>EDITION ORIGINALE</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center space-y-2 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <div className="font-['Rajdhani'] font-black text-lg text-white uppercase tracking-wider">
              Live<span className="text-amber-400">Cards</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Série Officielle Stream
            </span>
          </div>

          <div className="w-full text-center text-[8px] font-mono text-slate-500">
            Tous droits réservés • Live Drop System
          </div>
        </div>

      </div>
    </div>
  );
};
