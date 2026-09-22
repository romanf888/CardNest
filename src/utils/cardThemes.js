/**
 * Thèmes visuels pour les cartes à collectionner
 * Catégories et Niveaux de Rareté
 */

export const CATEGORY_THEMES = {
  streamer: {
    id: 'streamer',
    name: 'Créateur / Streamer',
    shortName: 'Créateur',
    icon: 'Crown',
    borderGradient: 'from-amber-400 via-yellow-300 to-amber-500',
    headerBg: 'bg-amber-950/80',
    accentColor: '#f59e0b',
    textColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  moment_culte: {
    id: 'moment_culte',
    name: 'Moment Culte & Clip',
    shortName: 'Clip Culte',
    icon: 'Film',
    borderGradient: 'from-fuchsia-500 via-pink-400 to-rose-500',
    headerBg: 'bg-fuchsia-950/80',
    accentColor: '#d946ef',
    textColor: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    glowColor: 'rgba(217, 70, 239, 0.4)'
  },
  elite_gaming: {
    id: 'elite_gaming',
    name: 'Performance & Clutch',
    shortName: 'Gaming',
    icon: 'Zap',
    borderGradient: 'from-cyan-400 via-sky-300 to-blue-500',
    headerBg: 'bg-cyan-950/80',
    accentColor: '#06b6d4',
    textColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    glowColor: 'rgba(6, 182, 212, 0.4)'
  },
  communaute: {
    id: 'communaute',
    name: 'Communauté & Tchat',
    shortName: 'Communauté',
    icon: 'Users',
    borderGradient: 'from-emerald-400 via-teal-300 to-green-500',
    headerBg: 'bg-emerald-950/80',
    accentColor: '#10b981',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  mascotte: {
    id: 'mascotte',
    name: 'Mascotte & Totem',
    shortName: 'Mascotte',
    icon: 'Sparkles',
    borderGradient: 'from-orange-400 via-amber-300 to-amber-500',
    headerBg: 'bg-orange-950/80',
    accentColor: '#f97316',
    textColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    glowColor: 'rgba(249, 115, 22, 0.4)'
  },
  event_special: {
    id: 'event_special',
    name: 'Événement & Marathon',
    shortName: 'Event',
    icon: 'Flame',
    borderGradient: 'from-rose-500 via-red-400 to-amber-500',
    headerBg: 'bg-rose-950/80',
    accentColor: '#f43f5e',
    textColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    glowColor: 'rgba(244, 63, 94, 0.4)'
  }
};

export const RARITY_THEMES = {
  common: {
    id: 'common',
    label: 'Commune',
    stars: '★',
    color: 'text-slate-300',
    badgeBg: 'bg-slate-700/60 text-slate-200 border-slate-600',
    isHolo: false,
    isSecret: false,
    frameBorder: 'border-slate-700'
  },
  rare: {
    id: 'rare',
    label: 'Rare Holo',
    stars: '★★',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    isHolo: true,
    isSecret: false,
    frameBorder: 'border-sky-500/50'
  },
  epic: {
    id: 'epic',
    label: 'Épique Prismatique',
    stars: '★★★',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    isHolo: true,
    isSecret: false,
    frameBorder: 'border-purple-500/60'
  },
  legendary: {
    id: 'legendary',
    label: 'Légendaire',
    stars: '★★★★',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-500/25 text-amber-300 border-amber-400/50',
    isHolo: true,
    isSecret: false,
    frameBorder: 'border-amber-400'
  },
  mythic: {
    id: 'mythic',
    label: 'Secrète Mythique',
    stars: '★★★★★',
    color: 'text-yellow-200',
    badgeBg: 'bg-yellow-400/30 text-yellow-100 border-yellow-300 shadow-sm shadow-yellow-500/30',
    isHolo: true,
    isSecret: true,
    frameBorder: 'border-yellow-300'
  }
};
