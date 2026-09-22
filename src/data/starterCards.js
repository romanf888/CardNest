/**
 * Cartes de collection initiales pour le live stream
 * Pas de Pokémon : cartes originales orientées stream, moments cultes et communauté
 */

export const INITIAL_CARDS = [
  {
    id: 'card_streamer_prime',
    name: 'Le Créateur Suprême',
    category: 'streamer',
    rarity: 'mythic',
    score: 990,
    imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Hype du Stream', value: '+500 HYPE', desc: 'Déclenche une pluie d\'émotes et fait exploser le tchat.' },
      { label: 'Charisme Live', value: 'Niv. MAX', desc: 'Tous les viewers restent scotchés devant l\'écran.' }
    ],
    lore: 'Né au cœur d\'un stream marathon légendaire. Quand il allume la régie, des milliers d\'abonnés répondent présents.',
    creator: 'Régie Principale',
    cardNumber: '#001/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'card_clutch_1v4',
    name: 'Clutch 1 contre 4',
    category: 'elite_gaming',
    rarity: 'legendary',
    score: 920,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Sang-Froid', value: '100%', desc: 'Aucun tremblement, 4 tirs dans la tête consécutifs.' },
      { label: 'Cri de Victoire', value: '+300 dB', desc: 'Les tympans du tchat ne s\'en remettront jamais.' }
    ],
    lore: 'Il ne restait qu\'un seul point de vie et 10 secondes au chrono. Le clip a fait le tour des réseaux en moins d\'une heure.',
    creator: 'Clip Squad',
    cardNumber: '#002/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'card_modo_ban',
    name: 'Le Marteau du Modérateur',
    category: 'communaute',
    rarity: 'epic',
    score: 840,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Time-out Éclair', value: '0.1 sec', desc: 'Neutralise les spammeurs avant même l\'apparition du message.' },
      { label: 'Bouclier Anti-Troll', value: '+450 DEF', desc: 'Maintient la bienveillance absolue dans le tchat.' }
    ],
    lore: 'Les yeux rivés sur le flux de messages 60 FPS. Sans lui, le tchat serait un champ de ruines.',
    creator: 'Guilde des Modos',
    cardNumber: '#003/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-03T00:00:00.000Z'
  },
  {
    id: 'card_raid_massif',
    name: 'Le Grand Raid Host',
    category: 'moment_culte',
    rarity: 'legendary',
    score: 880,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Afflux Massif', value: '+5 000 Viewers', desc: 'Déferlement instantané avec le message de spam officiel.' },
      { label: 'Émotion Directe', value: 'Larmes de Joie', desc: 'Le streamer ciblé bégaye sous le choc de la surprise.' }
    ],
    lore: 'Le raid de fin de live qui change une journée. Une marée de cœurs et de bienveillance s\'abat sur la chaîne.',
    creator: 'Commu Raid Squad',
    cardNumber: '#004/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-04T00:00:00.000Z'
  },
  {
    id: 'card_mascotte_luna',
    name: 'Pixel Cat, Mascotte du Live',
    category: 'mascotte',
    rarity: 'rare',
    score: 750,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Passe Devant la Cam', value: 'Imprévu 100%', desc: 'Vole la vedette et coupe le jeu en marchant sur le clavier.' },
      { label: 'Ronronnement Boost', value: '+200 Moral', desc: 'Rassure tout le monde après une session difficile.' }
    ],
    lore: 'Officiellement engagé comme directeur artistique. Il réclame ses croquettes pile à l\'heure du boss final.',
    creator: 'Mascottes TV',
    cardNumber: '#005/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-05T00:00:00.000Z'
  },
  {
    id: 'card_cafe_04h',
    name: 'Le Café de Survie de 04h00',
    category: 'event_special',
    rarity: 'rare',
    score: 680,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Coup de Fouet', value: '+800% Énergie', desc: 'Permet de tenir les dernières heures du marathon caritatif.' },
      { label: 'Palpitations', value: 'Risque élevé', desc: 'La quatrième tasse commence à faire trembler la souris.' }
    ],
    lore: 'L\'élixir vital sans lequel aucun marathon 24 heures ne pourrait être complété avec succès.',
    creator: 'Staff Nuit Blanche',
    cardNumber: '#006/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-06T00:00:00.000Z'
  },
  {
    id: 'card_fail_epique',
    name: 'Le Saut dans le Vide',
    category: 'moment_culte',
    rarity: 'common',
    score: 490,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    traits: [
      { label: 'Incompréhension', value: '404 Brain', desc: 'Appuie sur la mauvaise touche alors qu\'il suffisait de marcher.' },
      { label: 'Fou Rire Général', value: '+1 000 KEKW', desc: 'Le tchat se transforme en mur infini de rires.' }
    ],
    lore: '« T\'inquiète je gère le saut ». Célèbres dernières paroles prononcées 2 secondes avant le désastre.',
    creator: 'Archives des Fails',
    cardNumber: '#007/050',
    edition: 'Saison 1 - Origines',
    createdAt: '2026-01-07T00:00:00.000Z'
  }
];

export const INITIAL_CODES = [
  {
    id: 'code_bienvenue',
    code: 'BIENVENUE',
    cardId: 'card_streamer_prime',
    title: 'Drop d\'Ouverture Officielle',
    description: 'Offert à tous les nouveaux spectateurs du stream !',
    maxUses: -1, // Illimité
    usedCount: 142,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'code_clutch',
    code: 'CLUTCH',
    cardId: 'card_clutch_1v4',
    title: 'Drop de la Victoire Tournoi',
    description: 'Disponible pendant 10 minutes après le clutch incroyable.',
    maxUses: 100,
    usedCount: 78,
    isActive: true,
    createdAt: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'code_modo',
    code: 'MODOPATROL',
    cardId: 'card_modo_ban',
    title: 'Drop Hommage à l\'Équipe de Modération',
    description: 'Réservé à la commu en hommage à nos modérateurs dévoués.',
    maxUses: 50,
    usedCount: 29,
    isActive: true,
    createdAt: '2026-01-03T00:00:00.000Z'
  },
  {
    id: 'code_luna',
    code: 'CHATON',
    cardId: 'card_mascotte_luna',
    title: 'Drop Spécial Mascotte',
    description: 'Débloque la carte de Pixel Cat pour ton classeur.',
    maxUses: 200,
    usedCount: 64,
    isActive: true,
    createdAt: '2026-01-04T00:00:00.000Z'
  }
];
