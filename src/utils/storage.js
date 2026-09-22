/**
 * Gestion du stockage LocalStorage et de la synchronisation en direct / Firebase Cloud
 */
import { INITIAL_CARDS, INITIAL_CODES } from '../data/starterCards';
import { saveUserCollectionToCloud } from '../firebase';

const STORAGE_KEYS = {
  CARDS: 'livecards_cards_v3',
  CODES: 'livecards_codes_v3',
  COLLECTION: 'livecards_user_collection_v3',
  HISTORY: 'livecards_redemption_history_v3',
  ADMIN_PIN: 'livecards_admin_pin_v3',
  ADMIN_SESSION: 'livecards_admin_session_v3'
};

export const DEFAULT_ADMIN_PIN = 'STREAM2025';

const broadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('livecards_events_channel_v3') 
  : null;

export function notifyLiveUpdate(action, data) {
  if (broadcast) {
    try {
      broadcast.postMessage({ action, data, timestamp: Date.now() });
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }
}

export function subscribeToLiveEvents(callback) {
  if (!broadcast) return () => {};

  const handler = (event) => {
    if (callback) callback(event.data);
  };

  broadcast.addEventListener('message', handler);

  const storageHandler = () => {
    if (callback) callback({ action: 'storage_sync' });
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    broadcast.removeEventListener('message', handler);
    window.removeEventListener('storage', storageHandler);
  };
}

// ADMIN PASSKEY & AUTH VERIFICATION
export function getStoredAdminPin() {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
}

export function setStoredAdminPin(newPin) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
}

export function isAdminSessionActive() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
}

export function setAdminSessionActive(active) {
  if (typeof window === 'undefined') return;
  if (active) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
}

// CARDS CATALOGUE MANAGEMENT
export function getStoredCards() {
  if (typeof window === 'undefined') return INITIAL_CARDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(INITIAL_CARDS));
      return INITIAL_CARDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CARDS;
  } catch (err) {
    console.error('Error reading cards:', err);
    return INITIAL_CARDS;
  }
}

export function saveStoredCards(cards) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    notifyLiveUpdate('cards_updated', cards);
  } catch (err) {
    console.error('Error saving cards:', err);
  }
}

// CODES MANAGEMENT
export function getStoredCodes() {
  if (typeof window === 'undefined') return INITIAL_CODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CODES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(INITIAL_CODES));
      return INITIAL_CODES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CODES;
  } catch (err) {
    console.error('Error reading codes:', err);
    return INITIAL_CODES;
  }
}

export function saveStoredCodes(codes) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(codes));
    notifyLiveUpdate('codes_updated', codes);
  } catch (err) {
    console.error('Error saving codes:', err);
  }
}

// USER COLLECTION MANAGEMENT
export function getStoredCollection() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading collection:', err);
    return [];
  }
}

export function saveStoredCollection(collection, currentUserId = null) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    notifyLiveUpdate('collection_updated', collection);

    // If logged in to Google account, sync immediately with Firestore
    if (currentUserId) {
      saveUserCollectionToCloud(currentUserId, collection);
    }
  } catch (err) {
    console.error('Error saving collection:', err);
  }
}

/**
 * Merge local collection with cloud collection upon Google login
 */
export function mergeCollections(localList = [], cloudList = []) {
  const map = new Map();

  // Load cloud first
  cloudList.forEach(item => {
    map.set(item.cardId, { ...item });
  });

  // Merge local
  localList.forEach(localItem => {
    if (map.has(localItem.cardId)) {
      const existing = map.get(localItem.cardId);
      map.set(localItem.cardId, {
        ...existing,
        count: Math.max(existing.count || 1, localItem.count || 1),
        serialNumber: existing.serialNumber || localItem.serialNumber,
        obtainedAt: existing.obtainedAt || localItem.obtainedAt,
        lastObtainedAt: new Date().toISOString()
      });
    } else {
      map.set(localItem.cardId, { ...localItem });
    }
  });

  return Array.from(map.values());
}

// REDEMPTION HISTORY (FOR ADMIN PANEL LOGS)
export function getRedemptionHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function saveRedemptionHistory(history) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    notifyLiveUpdate('history_updated', history);
  } catch (err) {
    console.error('Error saving history:', err);
  }
}

/**
 * Traitement complet d'un code saisi par un spectateur
 */
export function redeemDropCode(inputCode, currentUserId = null, userDisplayName = null) {
  const normalized = inputCode.trim().toUpperCase();
  const codes = getStoredCodes();
  const cards = getStoredCards();
  const collection = getStoredCollection();
  const history = getRedemptionHistory();

  // 1. Recherche du code
  const drop = codes.find(c => c.code.toUpperCase() === normalized);
  if (!drop) {
    return {
      success: false,
      message: `Le code "${normalized}" n'existe pas ou a expiré.`
    };
  }

  // 2. Vérification de l'activation
  if (!drop.isActive) {
    return {
      success: false,
      message: `Le code "${drop.code}" est actuellement suspendu par le créateur.`
    };
  }

  // 3. Vérification du quota
  if (drop.maxUses !== -1 && drop.usedCount >= drop.maxUses) {
    return {
      success: false,
      message: `Trop tard ! Les ${drop.maxUses} exemplaires du code "${drop.code}" ont tous été réclamés.`
    };
  }

  // 4. Recherche de la carte associée
  const targetCard = cards.find(c => c.id === drop.cardId);
  if (!targetCard) {
    return {
      success: false,
      message: `Erreur interne : la carte associée à ce code n'a pas été trouvée.`
    };
  }

  // 5. Vérifier si l'utilisateur possède déjà la carte
  const existingCollected = collection.find(c => c.cardId === targetCard.id);
  const isAlreadyOwned = !!existingCollected;

  // Calcul du numéro d'exemplaire unique (série #1, #2...)
  const nextSerial = (drop.usedCount || 0) + 1;

  // Mettre à jour le compteur d'utilisation du code
  const updatedCodes = codes.map(c => {
    if (c.id === drop.id) {
      return { ...c, usedCount: (c.usedCount || 0) + 1 };
    }
    return c;
  });
  saveStoredCodes(updatedCodes);

  // Mettre à jour la collection du viewer
  let collectedEntry;
  let updatedCollection;

  if (existingCollected) {
    collectedEntry = {
      ...existingCollected,
      count: existingCollected.count + 1,
      lastObtainedAt: new Date().toISOString()
    };
    updatedCollection = collection.map(c => 
      c.cardId === targetCard.id ? collectedEntry : c
    );
  } else {
    collectedEntry = {
      cardId: targetCard.id,
      obtainedAt: new Date().toISOString(),
      lastObtainedAt: new Date().toISOString(),
      count: 1,
      codeUsed: drop.code,
      serialNumber: nextSerial
    };
    updatedCollection = [collectedEntry, ...collection];
  }
  
  saveStoredCollection(updatedCollection, currentUserId);

  // Ajouter au journal d'activité du panel admin
  const historyEntry = {
    id: 'act_' + Date.now(),
    code: drop.code,
    cardName: targetCard.name,
    cardId: targetCard.id,
    serialNumber: nextSerial,
    user: userDisplayName || 'Spectateur Anonyme',
    timestamp: new Date().toISOString()
  };
  saveRedemptionHistory([historyEntry, ...history.slice(0, 49)]);

  return {
    success: true,
    message: `Félicitations ! Tu as débloqué : ${targetCard.name} !`,
    card: targetCard,
    collectedCard: collectedEntry,
    isAlreadyOwned
  };
}

/**
 * Réinitialiser les données aux valeurs par défaut
 */
export function resetToDefaults() {
  saveStoredCards(INITIAL_CARDS);
  saveStoredCodes(INITIAL_CODES);
  saveStoredCollection([]);
  saveRedemptionHistory([]);
  notifyLiveUpdate('reset_all', {});
}
