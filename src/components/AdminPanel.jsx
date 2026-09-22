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
  Edit3, 
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
  Lock,
  X,
  AlertTriangle
} from 'lucide-react';

export const AdminPanel = ({
  cards,
  codes,
  history,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onAddCode,
  onToggleCodeActive,
  onDeleteCode,
  onResetData,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'codes' | 'obs' | 'history'

  // Edit Mode state
  const [editingCardId, setEditingCardId] = useState(null);

  // Admin PIN settings
  const [customPinInput, setCustomPinInput] = useState(getStoredAdminPin());
  const [pinSavedFeedback, setPinSavedFeedback] = useState(false);

  // Card Form State (Initial defaults)
  const defaultCardForm = {
    name: 'Le Micro Sacré',
    category: 'streamer',
    rarity: 'legendary',
    score: 890,
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    edition: 'Saison 1 - Live Drops',
    creator: 'Admin Studio',
    lore: 'Forgé dans les studios du live stream. Il capture chaque rire et chaque hurlement de victoire.',
    trait1Label: 'Gain Audio',
    trait1Value: '+48 dB Max',
    trait2Label: 'Filtre Anti-Bruit',
    trait2Value: '100% Crisp'
  };

  const [cardName, setCardName] = useState(defaultCardForm.name);
  const [cardCategory, setCardCategory] = useState(defaultCardForm.category);
  const [cardRarity, setCardRarity] = useState(defaultCardForm.rarity);
  const [cardScore, setCardScore] = useState(defaultCardForm.score);
  const [cardImageUrl, setCardImageUrl] = useState(defaultCardForm.imageUrl);
  const [cardEdition, setCardEdition] = useState(defaultCardForm.edition);
  const [cardCreator, setCardCreator] = useState(defaultCardForm.creator);
  const [cardLore, setCardLore] = useState(defaultCardForm.lore);
  const [trait1Label, setTrait1Label] = useState(defaultCardForm.trait1Label);
  const [trait1Value, setTrait1Value] = useState(defaultCardForm.trait1Value);
  const [trait2Label, setTrait2Label] = useState(defaultCardForm.trait2Label);
  const [trait2Value, setTrait2Value] = useState(defaultCardForm.trait2Value);

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

  // Delete modal state
  const [cardToDelete, setCardToDelete] = useState(null);

  // Live preview card object
  const currentEditingCard = editingCardId ? cards.find(c => c.id === editingCardId) : null;
  const previewCard = {
    id: editingCardId || 'preview_card',
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
    cardNumber: currentEditingCard ? currentEditingCard.cardNumber : `#0${cards.length + 1}/050`,
    edition: cardEdition || 'Saison 1',
    createdAt: currentEditingCard ? currentEditingCard.createdAt : new Date().toISOString()
  };

  const handleStartEditCard = (card) => {
    setEditingCardId(card.id);
    setCardName(card.name || '');
    setCardCategory(card.category || 'streamer');
    setCardRarity(card.rarity || 'common');
    setCardScore(card.score || 500);
    setCardImageUrl(card.imageUrl || '');
    setCardEdition(card.edition || 'Saison 1');
    setCardCreator(card.creator || 'Admin');
    setCardLore(card.lore || '');
    
    if (card.traits && card.traits[0]) {
      setTrait1Label(card.traits[0].label || '');
      setTrait1Value(card.traits[0].value || '');
    } else {
      setTrait1Label('');
      setTrait1Value('');
    }

    if (card.traits && card.traits[1]) {
      setTrait2Label(card.traits[1].label || '');
      setTrait2Value(card.traits[1].value || '');
    } else {
      setTrait2Label('');
      setTrait2Value('');
    }

    // Scroll to top of form smoothly
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setCardName(defaultCardForm.name);
    setCardCategory(defaultCardForm.category);
    setCardRarity(defaultCardForm.rarity);
    setCardScore(defaultCardForm.score);
    setCardImageUrl(defaultCardForm.imageUrl);
    setCardEdition(defaultCardForm.edition);
    setCardCreator(defaultCardForm.creator);
    setCardLore(defaultCardForm.lore);
    setTrait1Label(defaultCardForm.trait1Label);
    setTrait1Value(defaultCardForm.trait1Value);
    setTrait2Label(defaultCardForm.trait2Label);
    setTrait2Value(defaultCardForm.trait2Value);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    if (editingCardId) {
      // UPDATE EXISTING CARD
      const existing = cards.find(c => c.id === editingCardId);
      const updatedCard = {
        ...existing,
        ...previewCard,
        id: editingCardId,
        cardNumber: existing ? existing.cardNumber : previewCard.cardNumber,
        updatedAt: new Date().toISOString()
      };

      if (onUpdateCard) {
        onUpdateCard(updatedCard);
      }
      playSuccessChime();
      setFeedbackMsg(`La carte "${updatedCard.name}" a été mise à jour avec succès !`);
      setEditingCardId(null);
    } else {
      // CREATE NEW CARD
      const newCard = {
        ...previewCard,
        id: 'card_' + Date.now(),
        cardNumber: `#${String(cards.length + 1).padStart(3, '0')}/050`
      };

      onAddCard(newCard);
      setSelectedCardIdForCode(newCard.id);
      playSuccessChime();
      setFeedbackMsg(`La carte "${newCard.name}" a été créée et ajoutée au catalogue !`);
    }

    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleConfirmDelete = () => {
    if (!cardToDelete) return;
    const deletedName = cardToDelete.name;
    onDeleteCard(cardToDelete.id);
    if (editingCardId === cardToDelete.id) {
      handleCancelEdit();
    }
    setCardToDelete(null);
    setFeedbackMsg(`La carte "${deletedName}" a été supprimée du catalogue.`);
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
      <header className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
                Espace Régie Streamer (/admin)
              </span>
              {onExitAdmin && (
                <button
                  type="button"
                  onClick={onExitAdmin}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Retour au site public (/)</span>
                </button>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-['Rajdhani'] font-black uppercase text-white tracking-wide">
              Panel Admin & Gestion des Cartes
            </h1>
            <p className="text-xs text-slate-400">
              Ajoute, modifie ou supprime des cartes de collection, gère les codes et pilote ton overlay OBS.
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <nav className="flex flex-wrap bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activité & Sécurité</span>
          </button>
        </nav>
      </header>

      {/* Feedback Toast Notification */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ================= TAB 1: GESTION DES CARTES ================= */}
      {activeTab === 'cards' && (
        <section className="space-y-8">
          
          {/* Card Creation / Editing Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {editingCardId ? (
                    <>
                      <Edit3 className="w-5 h-5 text-amber-400" />
                      <h2 className="text-lg font-['Rajdhani'] font-black uppercase text-amber-300">
                        Modifier la Carte : {cardName}
                      </h2>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5 text-purple-400" />
                      <h2 className="text-lg font-['Rajdhani'] font-black uppercase text-purple-300">
                        Créer & Ajouter une Nouvelle Carte
                      </h2>
                    </>
                  )}
                </div>
                
                {editingCardId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Annuler l'édition</span>
                  </button>
                )}
              </div>

              {editingCardId && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <span>Tu modifies actuellement une carte existante. Modifie ses champs puis clique sur "Enregistrer les modifications".</span>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="underline text-amber-200 hover:text-white font-bold text-xs"
                  >
                    Créer une nouvelle carte plutôt
                  </button>
                </div>
              )}

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
                          {RARITY_THEMES[rarKey].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Card Artwork Image URL */}
                <div className="space-y-2">
                  <label className="block text-slate-400 font-bold">Image / Artwork de la Carte</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={cardImageUrl}
                      onChange={(e) => setCardImageUrl(e.target.value)}
                      placeholder="https://... (URL d'image)"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:border-purple-400 focus:outline-none"
                    />
                    
                    <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fichier local</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preset quick images */}
                  <div className="flex flex-wrap gap-1.5 items-center pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">Presets stream :</span>
                    {[
                      { label: 'Micro Pro', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80' },
                      { label: 'Setup RGB', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80' },
                      { label: 'Casque Gaming', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80' },
                      { label: 'Trophée Victoire', url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800&auto=format&fit=crop&q=80' }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCardImageUrl(preset.url)}
                        className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-purple-900/30 text-slate-400 hover:text-purple-300 text-[10px] border border-slate-800 transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Traits & Abilities */}
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    Talents et Bonus de la Carte
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={trait1Label}
                      onChange={(e) => setTrait1Label(e.target.value)}
                      placeholder="Nom Talent 1 (ex: Gain Audio)"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={trait1Value}
                      onChange={(e) => setTrait1Value(e.target.value)}
                      placeholder="Valeur (ex: +48 dB)"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={trait2Label}
                      onChange={(e) => setTrait2Label(e.target.value)}
                      placeholder="Nom Talent 2 (ex: Filtre Anti-Bruit)"
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
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className={`flex-1 py-3.5 px-4 rounded-xl font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                      editingCardId
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-amber-500/25'
                        : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingCardId ? 'Enregistrer les Modifications de la Carte' : 'Créer et Publier la Carte'}</span>
                  </button>

                  {editingCardId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                    >
                      Annuler
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* Live 3D Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
              <div className="mb-4 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Aperçu en Direct ({editingCardId ? 'Mode Modification' : 'Nouvelle Carte'})
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white">
                  Catalogue des Cartes Disponibles ({cards.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Clique sur "Modifier" pour changer les attributs d'une carte ou sur "Supprimer" pour la retirer du jeu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((c) => {
                const catTheme = CATEGORY_THEMES[c.category] || CATEGORY_THEMES.streamer;
                const rarTheme = RARITY_THEMES[c.rarity] || RARITY_THEMES.common;
                const isCurrentEditing = editingCardId === c.id;

                return (
                  <article
                    key={c.id}
                    className={`p-3.5 rounded-2xl bg-slate-950 border transition flex flex-col justify-between gap-3 ${
                      isCurrentEditing 
                        ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-950/10' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-20 rounded-xl object-cover border border-slate-700 shrink-0 shadow-sm"
                      />
                      <div className="truncate flex-1">
                        <span className="font-['Rajdhani'] font-black text-base text-white block truncate">
                          {c.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${rarTheme.badgeBg}`}>
                            {rarTheme.label}
                          </span>
                          <span className="text-[10px] font-mono text-amber-300 font-bold">
                            Score {c.score}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono truncate">
                          {c.cardNumber} • {c.edition || 'Saison 1'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Modifier / Supprimer / Drop Code */}
                    <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        {/* Modifier Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEditCard(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-bold flex items-center gap-1 transition"
                          title="Modifier cette carte"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>

                        {/* Supprimer Button */}
                        <button
                          type="button"
                          onClick={() => setCardToDelete(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition"
                          title="Supprimer cette carte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>

                      {/* Créer Code Shortcut */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCardIdForCode(c.id);
                          setActiveTab('codes');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 text-xs font-bold flex items-center gap-1 transition"
                        title="Créer un code de drop pour cette carte"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </section>
      )}

      {/* ================= TAB 2: GESTION DES CODES ================= */}
      {activeTab === 'codes' && (
        <section className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Code Form */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-lg font-['Rajdhani'] font-black uppercase text-purple-300 flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  Créer un Code de Drop Stream
                </h2>
              </div>

              <form onSubmit={handleCreateCode} className="space-y-4 text-xs">
                
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Mot de Passe / Code Secret (Majuscules)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCodeName}
                      onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                      required
                      placeholder="EX: TOP1-LIVE"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold text-sm tracking-wider uppercase focus:border-purple-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setNewCodeName('LIVE-' + Math.floor(1000 + Math.random() * 9000))}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                    >
                      Aléatoire
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Carte associée à débloquer</label>
                  <select
                    value={selectedCardIdForCode}
                    onChange={(e) => setSelectedCardIdForCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:border-purple-400 focus:outline-none"
                  >
                    {cards.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({RARITY_THEMES[c.rarity]?.label || c.rarity}) - Score {c.score}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Titre de l'événement / Raison du Drop</label>
                  <input
                    type="text"
                    value={codeTitle}
                    onChange={(e) => setCodeTitle(e.target.value)}
                    placeholder="Ex: Victoire en tournoi, 100k Followers..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">Limite d'utilisations</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUnlimitedUses}
                        onChange={(e) => setIsUnlimitedUses(e.target.checked)}
                        className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-slate-400 text-xs">Illimité</span>
                    </label>
                  </div>

                  {!isUnlimitedUses && (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="500"
                        value={codeMaxUses}
                        onChange={(e) => setCodeMaxUses(Number(e.target.value))}
                        className="flex-1 accent-purple-500"
                      />
                      <span className="w-16 text-right font-mono font-bold text-amber-300">
                        {codeMaxUses} max
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Key className="w-4 h-4" />
                  <span>Activer le Code en Direct</span>
                </button>

              </form>
            </div>

            {/* List of active and past codes */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center justify-between">
                <span>Codes Actifs & Historique ({codes.length})</span>
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {codes.map((c) => {
                  const linkedCard = cards.find(card => card.id === c.cardId);

                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-amber-400 text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {c.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {c.isActive ? 'Actif' : 'Désactivé'}
                          </span>
                        </div>

                        <span className="text-xs text-slate-300 font-semibold block">
                          {c.title} • Donne : <strong className="text-white">{linkedCard?.name || 'Carte inconnue'}</strong>
                        </span>

                        <span className="text-[10px] text-slate-500 font-mono block">
                          Utilisations : {c.usedCount} / {c.maxUses === -1 ? 'Illimité' : c.maxUses}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(c.code)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                          title="Copier le code"
                        >
                          {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleCodeActive(c.id)}
                          className={`p-2 rounded-xl text-xs font-bold transition ${
                            c.isActive ? 'bg-slate-800 text-amber-300 hover:bg-slate-700' : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30'
                          }`}
                          title={c.isActive ? 'Désactiver ce code' : 'Réactiver ce code'}
                        >
                          {c.isActive ? 'Mettre en pause' : 'Réactiver'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Supprimer le code "${c.code}" ?`)) {
                              onDeleteCode(c.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition"
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

        </section>
      )}

      {/* ================= TAB 3: OVERLAY OBS ================= */}
      {activeTab === 'obs' && (
        <section className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-['Rajdhani'] font-black uppercase text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  Overlay OBS & Affichage en Direct
                </h2>
                <p className="text-xs text-slate-400">
                  Affiche la carte et le code en cours sur ton live pour que tes viewers le voient à l'écran.
                </p>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold">Code à diffuser :</span>
                <select
                  value={selectedObsCodeId}
                  onChange={(e) => setSelectedObsCodeId(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono font-bold"
                >
                  {codes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} ({cards.find(card => card.id === c.cardId)?.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* OBS Broadcast Widget Preview */}
            {selectedObsCode ? (
              <div className="p-6 md:p-10 rounded-3xl bg-slate-950 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  <div className="space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider animate-pulse">
                      <Radio className="w-4 h-4" />
                      <span>Drop En Direct Maintenant !</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-['Rajdhani'] font-black uppercase text-white tracking-wide">
                      {selectedObsCard?.name}
                    </h3>

                    <p className="text-slate-400 text-xs md:text-sm">
                      Tape le code ci-dessous sur le site pour recevoir cette carte dans ton classeur personnel :
                    </p>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-400/50 inline-block shadow-inner">
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
        </section>
      )}

      {/* ================= TAB 4: HISTORIQUE ET SÉCURITÉ ================= */}
      {activeTab === 'history' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
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

          {/* Settings & Reset */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PIN Settings */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-['Rajdhani'] font-black uppercase text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Sécurité & Code Créateur
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ce code secret protège l'accès à <code className="text-amber-300 font-mono font-bold">/admin</code> pour que les spectateurs ne puissent pas modifier tes cartes.
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
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
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
                Tu peux réinitialiser l'ensemble des cartes et des codes aux valeurs par défaut à tout moment.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Es-tu sûr de vouloir réinitialiser toutes les cartes et codes aux valeurs par défaut ?')) {
                    onResetData();
                    setFeedbackMsg('Les données ont été réinitialisées aux valeurs initiales.');
                    setTimeout(() => setFeedbackMsg(null), 3000);
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Réinitialiser aux Valeurs de Base</span>
              </button>
            </div>

          </div>

        </section>
      )}

      {/* Delete Confirmation Modal */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-sm w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Rajdhani'] font-black uppercase text-lg text-white">Supprimer la Carte ?</h3>
                <span className="text-xs text-slate-400 font-semibold">{cardToDelete.name}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Êtes-vous certain de vouloir supprimer cette carte du catalogue ? Cette action est irréversible.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCardToDelete(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/30"
              >
                Confirmer la Suppression
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
