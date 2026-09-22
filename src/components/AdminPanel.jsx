import React, { useState } from 'react';
import { CardView } from './CardView';
import { CATEGORY_THEMES, RARITY_THEMES } from '../utils/cardThemes';
import { playSuccessChime } from '../utils/audio';
import { getStoredAdminPin, setStoredAdminPin, DEFAULT_ADMIN_PIN } from '../utils/storage';
import { 
  ShieldAlert, 
  PlusCircle, 
  Key, 
  Radio, 
  Trash2, 
  Copy, 
  Check, 
  Upload, 
  Save, 
  Eye, 
  Sparkles, 
  Activity, 
  RotateCcw,
  Sliders,
  Award,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const AdminPanel = ({
  cards,
  codes,
  history,
  onAddCard,
  onDeleteCard,
  onAddCode,
  onToggleCodeActive,
  onDeleteCode,
  onResetData,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'codes' | 'obs' | 'history'

  // Admin PIN settings
  const [customPinInput, setCustomPinInput] = useState(getStoredAdminPin());
  const [pinSavedFeedback, setPinSavedFeedback] = useState(false);

  // Card Form State
  const [cardName, setCardName] = useState('Le Micro Sacré');
  const [cardCategory, setCardCategory] = useState('streamer');
  const [cardRarity, setCardRarity] = useState('legendary');
  const [cardScore, setCardScore] = useState(890);
  const [cardImageUrl, setCardImageUrl] = useState('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80');
  const [cardEdition, setCardEdition] = useState('Saison 1 - Live Drops');
  const [cardCreator, setCardCreator] = useState('Admin Studio');
  const [cardLore, setCardLore] = useState('Forgé dans les studios du live stream. Il capture chaque rire et chaque hurlement de victoire.');
  
  // Traits
  const [trait1Label, setTrait1Label] = useState('Gain Audio');
  const [trait1Value, setTrait1Value] = useState('+48 dB Max');
  const [trait2Label, setTrait2Label] = useState('Filtre Anti-Bruit');
  const [trait2Value, setTrait2Value] = useState('100% Crisp');

  // Code Form State
  const [newCodeName, setNewCodeName] = useState('LIVE-' + Math.floor(1000 + Math.random() * 9000));
  const [selectedCardIdForCode, setSelectedCardIdForCode] = useState(cards[0]?.id || '');
  const [codeTitle, setCodeTitle] = useState('Drop Spécial Live du Jour');
  const [codeMaxUses, setCodeMaxUses] = useState(50);
  const [isUnlimitedUses, setIsUnlimitedUses] = useState(false);

  // OBS Overlay selection
  const [selectedObsCodeId, setSelectedObsCodeId] = useState(codes[0]?.id || '');
  const [copiedCode, setCopiedCode] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Live preview card object
  const previewCard = {
    id: 'preview_card',
    name: cardName || 'Nouvelle Carte',
    category: cardCategory,
    rarity: cardRarity,
    score: Number(cardScore) || 500,
    imageUrl: cardImageUrl || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: trait1Label || 'Attribut 1', value: trait1Value || '+100' },
      { label: trait2Label || 'Attribut 2', value: trait2Value || '+200' }
    ],
    lore: cardLore,
    creator: cardCreator || 'Admin',
    cardNumber: `#0${cards.length + 1}/050`,
    edition: cardEdition || 'Saison 1',
    createdAt: new Date().toISOString()
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    const newCard = {
      ...previewCard,
      id: 'card_' + Date.now(),
      cardNumber: `#${String(cards.length + 1).padStart(3, '0')}/050`
    };

    onAddCard(newCard);
    setSelectedCardIdForCode(newCard.id);
    playSuccessChime();

    setFeedbackMsg(`La carte "${newCard.name}" a été créée et ajoutée au catalogue !`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCreateCode = (e) => {
    e.preventDefault();
    if (!newCodeName.trim()) return;

    const newCode = {
      id: 'code_' + Date.now(),
      code: newCodeName.trim().toUpperCase(),
      cardId: selectedCardIdForCode || cards[0]?.id,
      title: codeTitle || 'Drop Spécial Stream',
      description: 'Code créé depuis le Panel Admin.',
      maxUses: isUnlimitedUses ? -1 : Number(codeMaxUses),
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    onAddCode(newCode);
    setSelectedObsCodeId(newCode.id);
    playSuccessChime();
    setNewCodeName('LIVE-' + Math.floor(1000 + Math.random() * 9000));

    setFeedbackMsg(`Code "${newCode.code}" activé avec succès ! Tes abonnés peuvent dès maintenant l'utiliser.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCardImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const selectedObsCode = codes.find(c => c.id === selectedObsCodeId) || codes[0];
  const selectedObsCard = cards.find(c => c.id === selectedObsCode?.cardId) || cards[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
                Espace Régie / Streamer
              </span>
              {onExitAdmin && (
                <button
                  onClick={onExitAdmin}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Quitter le Panel Admin</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-['Rajdhani'] font-black uppercase text-white tracking-wide">
              Panel Admin & Gestion des Cartes
            </h2>
            <p className="text-xs text-slate-400">
              Ajoute de nouvelles cartes à collectionner, configure des codes de live stream et pilote ton overlay OBS.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Gestion des Cartes ({cards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'codes'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Gestion des Codes ({codes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('obs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'obs'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Overlay OBS</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activité</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ================= TAB 1: GESTION DES CARTES ================= */}
      {activeTab === 'cards' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-purple-300 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-purple-400" />
                  Créer & Ajouter une Nouvelle Carte
                </h3>
                <span className="text-[11px] text-slate-400">Catalogue actuel : {cards.length} cartes</span>
              </div>

              <form onSubmit={handleSaveCard} className="space-y-4 text-xs">
                
                {/* Name & Score */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-bold mb-1">Nom de la Carte</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      placeholder="Ex: Trophée du Top 1"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Score / Puissance</label>
                    <input
                      type="number"
                      value={cardScore}
                      onChange={(e) => setCardScore(Number(e.target.value))}
                      min={100}
                      max={999}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono font-bold focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Rarity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Catégorie Thématique</label>
                    <select
                      value={cardCategory}
                      onChange={(e) => setCardCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:border-purple-400 focus:outline-none"
                    >
                      {Object.keys(CATEGORY_THEMES).map(catKey => (
                        <option key={catKey} value={catKey}>
                          {CATEGORY_THEMES[catKey].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Niveau de Rareté</label>
                    <select
                      value={cardRarity}
                      onChange={(e) => setCardRarity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:border-purple-400 focus:outline-none"
                    >
                      {Object.keys(RARITY_THEMES).map(rarKey => (
                        <option key={rarKey} value={rarKey}>
                          {RARITY_THEMES[rarKey].label} ({RARITY_THEMES[rarKey].stars})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL & Upload */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Illustration / Image de la Carte</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={cardImageUrl}
                      onChange={(e) => setCardImageUrl(e.target.value)}
                      placeholder="URL de l'image (https://...)"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-purple-400 focus:outline-none"
                    />
                    <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer flex items-center gap-1.5 transition">
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] text-slate-500">Exemples rapides :</span>
                    <button
                      type="button"
                      onClick={() => setCardImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80')}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Setup Gaming
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardImageUrl('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80')}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Scène Concert/Live
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardImageUrl('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80')}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Mascotte Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardImageUrl('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80')}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Néon Abstrait
                    </button>
                  </div>
                </div>

                {/* Traits / Attributes */}
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                  <span className="font-bold text-slate-300 block">Attributs & Statistiques de la Carte</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={trait1Label}
                      onChange={(e) => setTrait1Label(e.target.value)}
                      placeholder="Nom Talent 1 (ex: Hype Tchat)"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={trait1Value}
                      onChange={(e) => setTrait1Value(e.target.value)}
                      placeholder="Valeur (ex: +500 HYPE)"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={trait2Label}
                      onChange={(e) => setTrait2Label(e.target.value)}
                      placeholder="Nom Talent 2 (ex: Sang-Froid)"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={trait2Value}
                      onChange={(e) => setTrait2Value(e.target.value)}
                      placeholder="Valeur (ex: 100%)"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-bold"
                    />
                  </div>
                </div>

                {/* Lore / Description */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Citation / Lore / Anecdote de Stream</label>
                  <textarea
                    rows={2}
                    value={cardLore}
                    onChange={(e) => setCardLore(e.target.value)}
                    placeholder="Anecdote drôle ou moment historique..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Creator signature */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Auteur / Créateur</label>
                    <input
                      type="text"
                      value={cardCreator}
                      onChange={(e) => setCardCreator(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Édition / Série</label>
                    <input
                      type="text"
                      value={cardEdition}
                      onChange={(e) => setCardEdition(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer et Publier la Carte</span>
                </button>

              </form>
            </div>

            {/* WYSIWYG Live 3D Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
              <div className="mb-4 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Aperçu en Temps Réel (Rendu 3D)
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Bouge ta souris pour voir le reflet holographique foil de la carte.</p>
              </div>

              <CardView
                card={previewCard}
                size="lg"
                isInteractive={true}
              />
            </div>

          </div>

          {/* Cards Catalogue List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center justify-between">
              <span>Catalogue des Cartes Disponibles ({cards.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((c) => {
                const catTheme = CATEGORY_THEMES[c.category] || CATEGORY_THEMES.streamer;
                const rarTheme = RARITY_THEMES[c.rarity] || RARITY_THEMES.common;

                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-['Rajdhani'] font-black text-sm text-white block truncate">
                          {c.name}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${rarTheme.badgeBg}`}>
                          {rarTheme.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                          {c.cardNumber} • Score {c.score}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedCardIdForCode(c.id);
                          setActiveTab('codes');
                        }}
                        className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 text-[11px] font-bold flex items-center gap-1"
                        title="Créer un code de drop pour cette carte"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </button>

                      {cards.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer définitivement la carte "${c.name}" ?`)) {
                              onDeleteCard(c.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Supprimer cette carte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: GESTION DES CODES ================= */}
      {activeTab === 'codes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Code Form */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-purple-300 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Générer un Nouveau Code de Drop
            </h3>

            <form onSubmit={handleCreateCode} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Carte Offerte par ce Code</label>
                <select
                  value={selectedCardIdForCode}
                  onChange={(e) => setSelectedCardIdForCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:border-purple-400 focus:outline-none"
                >
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({RARITY_THEMES[c.rarity]?.label} - Score {c.score})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Code à Annoncer en Direct</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                    placeholder="EX: LIVEDROP50"
                    required
                    className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono font-bold text-sm tracking-wider uppercase focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setNewCodeName('LIVE-' + Math.floor(1000 + Math.random() * 9000))}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
                  >
                    Aléatoire
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Titre de l'Opération</label>
                <input
                  type="text"
                  value={codeTitle}
                  onChange={(e) => setCodeTitle(e.target.value)}
                  placeholder="Ex: Drop du Raid 1000 Subs"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Limite d'Utilisation</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isUnlimitedUses}
                      onChange={() => setIsUnlimitedUses(false)}
                      className="accent-purple-400"
                    />
                    <span className="text-slate-300">Limité aux</span>
                  </label>
                  <input
                    type="number"
                    disabled={isUnlimitedUses}
                    value={codeMaxUses}
                    onChange={(e) => setCodeMaxUses(Number(e.target.value))}
                    min={1}
                    max={10000}
                    className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono font-bold disabled:opacity-30"
                  />
                  <span className="text-slate-400">premiers viewers</span>
                </div>

                <div className="mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={isUnlimitedUses}
                      onChange={() => setIsUnlimitedUses(true)}
                      className="accent-purple-400"
                    />
                    <span className="text-slate-300">Illimité (tous les abonnés peuvent le récupérer)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activer ce Code en Live</span>
              </button>
            </form>
          </div>

          {/* Active Codes List */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center justify-between">
              <span>Codes Actifs & Suivi ({codes.length})</span>
            </h3>

            <div className="space-y-3">
              {codes.map((codeItem) => {
                const targetCard = cards.find(c => c.id === codeItem.cardId);
                const isCopied = copiedCode === codeItem.code;

                return (
                  <div
                    key={codeItem.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-amber-300 tracking-wider">
                          {codeItem.code}
                        </span>
                        <button
                          onClick={() => handleCopy(codeItem.code)}
                          className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white transition"
                          title="Copier le code"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          codeItem.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {codeItem.isActive ? 'Actif' : 'Suspendu'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-semibold">{codeItem.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Offre la carte : <strong className="text-white">{targetCard?.name || 'Carte'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Réclamations</span>
                        <span className="font-mono font-black text-amber-400 text-sm">
                          {codeItem.usedCount} {codeItem.maxUses === -1 ? '/ ∞' : `/ ${codeItem.maxUses}`}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleCodeActive(codeItem.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          codeItem.isActive
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {codeItem.isActive ? 'Suspendre' : 'Réactiver'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedObsCodeId(codeItem.id);
                          setActiveTab('obs');
                        }}
                        className="p-2 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white transition"
                        title="Afficher sur l'Overlay OBS"
                      >
                        <Radio className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer le code "${codeItem.code}" ?`)) {
                            onDeleteCode(codeItem.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Supprimer ce code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 3: OBS OVERLAY ================= */}
      {activeTab === 'obs' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-['Rajdhani'] font-black uppercase text-amber-400 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  Mode Écran Régie / Incrustation OBS
                </h3>
                <p className="text-xs text-slate-400">
                  Affiche cet écran plein écran dans OBS pour que tes viewers découvrent le code et la carte en direct !
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Code à diffuser :</span>
                <select
                  value={selectedObsCodeId}
                  onChange={(e) => setSelectedObsCodeId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono font-bold"
                >
                  {codes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} ({c.title})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LIVE STAGE */}
            {selectedObsCode ? (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950/60 to-slate-950 border-4 border-amber-400/80 p-8 shadow-2xl">
                
                {/* Ping Badge */}
                <div className="absolute top-4 left-6 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-xs font-black tracking-widest text-red-400 uppercase">
                    DROP ACTIF EN DIRECT
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-6">
                  
                  {/* Left Column: Code Info */}
                  <div className="space-y-4 text-center lg:text-left flex-1">
                    <h2 className="text-2xl md:text-4xl font-['Rajdhani'] font-black text-white uppercase tracking-wide">
                      {selectedObsCode.title}
                    </h2>

                    <p className="text-sm text-slate-300">
                      Rends-toi sur le site et tape immédiatement ce code secret pour débloquer ta carte :
                    </p>

                    {/* GIANT CODE BANNER */}
                    <div className="inline-block p-4 bg-slate-900/90 border-2 border-amber-400 rounded-2xl shadow-xl shadow-amber-500/20">
                      <span className="font-['Rajdhani'] font-black text-4xl md:text-6xl text-amber-300 tracking-wider uppercase drop-shadow-md">
                        {selectedObsCode.code}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                      <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-400 mr-2">Disponibilité :</span>
                        <strong className="text-emerald-400 font-mono font-bold">
                          {selectedObsCode.maxUses === -1 ? 'Illimité' : `${selectedObsCode.maxUses - selectedObsCode.usedCount} restantes`}
                        </strong>
                      </div>

                      <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-400 mr-2">Déjà réclamées :</span>
                        <strong className="text-amber-400 font-mono font-bold">
                          {selectedObsCode.usedCount} viewers
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Card View */}
                  <div className="flex flex-col items-center">
                    <div className="relative transform scale-105">
                      <CardView
                        card={selectedObsCard}
                        size="lg"
                        isInteractive={true}
                      />
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                Aucun code configuré.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: HISTORIQUE ET DONNÉES ================= */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* History list */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center justify-between">
              <span>Journal des Déblocages en Direct</span>
              <span className="text-xs text-slate-400 font-mono">{history.length} activations</span>
            </h3>

            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aucun drop n'a encore été débloqué. Rentre un code dans l'interface utilisateur pour tester !
              </div>
            ) : (
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-amber-400 bg-slate-900 border border-slate-800">
                        {entry.code}
                      </span>
                      <span className="text-white font-semibold">{entry.cardName}</span>
                      <span className="text-slate-400 text-[10px]">
                        (Exemplaire #{entry.serialNumber})
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset & Maintenance */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PIN Settings */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Sécurité & Code Créateur
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ce code secret protège l'accès au Panel Admin pour que les spectateurs ne puissent pas modifier tes cartes.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Nouveau Code Secret (PIN) :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPinInput}
                    onChange={(e) => setCustomPinInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
                    placeholder="STREAM2025"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customPinInput.trim()) {
                        setStoredAdminPin(customPinInput.trim());
                        setPinSavedFeedback(true);
                        setTimeout(() => setPinSavedFeedback(false), 2500);
                      }
                    }}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition"
                  >
                    {pinSavedFeedback ? 'Enregistré !' : 'Modifier'}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Code par défaut : {DEFAULT_ADMIN_PIN}
                </span>
              </div>
            </div>

            {/* Reset Data */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Maintenance & Reset
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Tu peux réinitialiser l'ensemble des données (cartes, codes et classeurs de test) aux valeurs de départ à tout moment.
              </p>

              <button
                onClick={() => {
                  if (window.confirm('Es-tu sûr de vouloir réinitialiser toutes les données de test ?')) {
                    onResetData();
                    setFeedbackMsg('Les données ont été réinitialisées aux valeurs initiales.');
                    setTimeout(() => setFeedbackMsg(null), 3000);
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Réinitialiser aux Valeurs de Base</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
