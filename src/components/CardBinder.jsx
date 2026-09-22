import React, { useState, useMemo } from 'react';
import { CardView } from './CardView';
import { CATEGORY_THEMES, RARITY_THEMES } from '../utils/cardThemes';
import { signInWithGoogle } from '../firebase';
import { 
  BookOpen, 
  Grid, 
  Layers, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  X,
  Star,
  Cloud,
  ArrowRight
} from 'lucide-react';

export const CardBinder = ({
  allCards,
  collection,
  onSelectCodeMode,
  currentUser
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'binder'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [binderPageIndex, setBinderPageIndex] = useState(0);
  const [inspectCard, setInspectCard] = useState(null);

  // Map of collected cards by ID
  const collectedMap = useMemo(() => {
    const map = new Map();
    collection.forEach(item => {
      map.set(item.cardId, item);
    });
    return map;
  }, [collection]);

  // Filtered cards list
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      if (selectedCategory !== 'all' && card.category !== selectedCategory) {
        return false;
      }
      if (selectedRarity !== 'all' && card.rarity !== selectedRarity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesLore = (card.lore || '').toLowerCase().includes(q);
        if (!matchesName && !matchesLore) return false;
      }
      return true;
    });
  }, [allCards, selectedCategory, selectedRarity, searchQuery]);

  // Total completion calculation
  const totalCardsCount = allCards.length;
  const uniqueCollectedCount = collection.length;
  const completionPercentage = totalCardsCount > 0 
    ? Math.round((uniqueCollectedCount / totalCardsCount) * 100) 
    : 0;

  // Binder Pages (6 cards per 2-page spread)
  const CARDS_PER_SPREAD = 6;
  const totalSpreads = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_SPREAD));
  const currentSpreadCards = filteredCards.slice(
    binderPageIndex * CARDS_PER_SPREAD,
    (binderPageIndex + 1) * CARDS_PER_SPREAD
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Binder Header & Stats */}
      <div className="bg-[#0D121F]/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Classeur Virtuel Stream</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-['Rajdhani'] font-black uppercase text-white tracking-wide">
            Mes Cartes de Collection
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Consulte toutes les cartes débloquées pendant les streams avec leur numéro d'exemplaire authentique.
          </p>
        </div>

        {/* Completion Bar */}
        <div className="w-full md:w-80 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Complétion du Master Set :</span>
            <span className="font-mono font-bold text-amber-400">
              {uniqueCollectedCount} / {totalCardsCount} ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 shadow-sm shadow-amber-500/50"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cloud Sync Status Notification / Prompt */}
      {!currentUser ? (
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <span>
              <strong className="text-white font-semibold">Sauvegarde Cloud :</strong> Connecte-toi avec Google pour synchroniser ton classeur sur tous tes appareils (mobile & PC).
            </span>
          </div>
          <button
            onClick={() => signInWithGoogle()}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition flex items-center gap-1.5"
          >
            <span>Connexion Google</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span>Classeur synchronisé en temps réel sur le compte <strong className="text-white">{currentUser.email}</strong></span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">● En ligne</span>
        </div>
      )}

      {/* Control Bar: Filters, Search & View Modes */}
      <div className="bg-[#0D121F]/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          
          {/* Search input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une carte, citation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold focus:border-amber-400 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes les Catégories</option>
            {Object.keys(CATEGORY_THEMES).map(catKey => (
              <option key={catKey} value={catKey}>
                {CATEGORY_THEMES[catKey].name}
              </option>
            ))}
          </select>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold focus:border-amber-400 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes les Raretés</option>
            {Object.keys(RARITY_THEMES).map(rarKey => (
              <option key={rarKey} value={rarKey}>
                {RARITY_THEMES[rarKey].label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end lg:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grille Complète</span>
          </button>

          <button
            onClick={() => setViewMode('binder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'binder'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pochettes ({binderPageIndex + 1}/{totalSpreads})</span>
          </button>
        </div>

      </div>

      {/* VIEW MODE: BINDER SPREAD */}
      {viewMode === 'binder' && (
        <div className="space-y-4">
          <div className="relative rounded-3xl p-6 md:p-8 bg-[#0A0E17] border-2 border-slate-800 shadow-2xl">
            
            {/* Binder Spine in center on larger screens */}
            <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-x border-slate-800/80 shadow-inner z-20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center relative z-10">
              {currentSpreadCards.map((card) => {
                const collectedInfo = collectedMap.get(card.id);
                const isLocked = !collectedInfo;

                return (
                  <div key={card.id} className="relative group">
                    <CardView
                      card={card}
                      size="md"
                      isLocked={isLocked}
                      serialNumber={collectedInfo?.serialNumber}
                      onClick={() => setInspectCard({ card, collectedInfo })}
                    />
                    {collectedInfo && collectedInfo.count > 1 && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full shadow-md z-30">
                        x{collectedInfo.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800/80 relative z-30">
              <button
                disabled={binderPageIndex === 0}
                onClick={() => setBinderPageIndex(p => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-white font-bold flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Page Précédente</span>
              </button>

              <span className="text-xs font-mono font-bold text-slate-400">
                Page {binderPageIndex + 1} sur {totalSpreads}
              </span>

              <button
                disabled={binderPageIndex >= totalSpreads - 1}
                onClick={() => setBinderPageIndex(p => Math.min(totalSpreads - 1, p + 1))}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-white font-bold flex items-center gap-1.5 transition"
              >
                <span>Page Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: COMPLETE GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {filteredCards.map((card) => {
            const collectedInfo = collectedMap.get(card.id);
            const isLocked = !collectedInfo;

            return (
              <div key={card.id} className="relative group">
                <CardView
                  card={card}
                  size="md"
                  isLocked={isLocked}
                  serialNumber={collectedInfo?.serialNumber}
                  onClick={() => setInspectCard({ card, collectedInfo })}
                />
                {collectedInfo && collectedInfo.count > 1 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full shadow-md z-30">
                    x{collectedInfo.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">Aucune carte ne correspond à tes filtres de recherche.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedRarity('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Inspect Modal on click */}
      {inspectCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center space-y-4 shadow-2xl">
            <button
              onClick={() => setInspectCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <CardView
              card={inspectCard.card}
              size="lg"
              isLocked={!inspectCard.collectedInfo}
              serialNumber={inspectCard.collectedInfo?.serialNumber}
            />

            <div className="w-full text-center space-y-1">
              <h4 className="font-['Rajdhani'] font-black uppercase text-xl text-white">
                {inspectCard.card.name}
              </h4>
              <p className="text-xs text-slate-400">
                {inspectCard.collectedInfo 
                  ? `Obtenue le ${new Date(inspectCard.collectedInfo.obtainedAt).toLocaleDateString()} (Possédée en ${inspectCard.collectedInfo.count} exemplaire(s))`
                  : 'Carte verrouillée : à débloquer avec son code de stream.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
