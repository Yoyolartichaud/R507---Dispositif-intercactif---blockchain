// La logique de la blockchain et le contenu de l'histoire, sans aucune 3D.

import { sha256 } from './sha256.js';

export const DIFFICULTY = 2;                    // nombre de zéros exigés au début d'une empreinte
export const PREFIX = '0'.repeat(DIFFICULTY);
export const NO_PARENT = '0'.repeat(64);        // le premier bloc n'a pas de parent : on met des zéros

/** Empreinte d'un bloc : elle dépend de TOUT son contenu. */
export function hashBlock(block) {
  return sha256(`${block.index}|${block.prev}|${block.data}|${block.nonce}`);
}

/** La preuve de travail est valide si l'empreinte commence par assez de zéros. */
export const proofOk = (block) => block.hash.startsWith(PREFIX);

/** Mine un bloc d'un seul coup, sans animation (pour les blocs déjà présents au départ). */
export function mineNow(block) {
  block.nonce = 0;
  block.hash = hashBlock(block);
  while (!proofOk(block)) {
    block.nonce++;
    block.hash = hashBlock(block);
  }
  return block;
}

export const copyChain = (chain) => chain.map((block) => ({ ...block }));

/** 7000 → « 7 000 » */
export const number = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// Les étapes du voyage. Les quatre premières écrivent un bloc de traçabilité,
// avec plusieurs enregistrements chacune. La dernière est le paiement en bitcoin.
export const STAGES = [
  { icon: '🌾', name: 'Champ', actor: 'Ferme', date: '18 juil.',
    records: ['Orge récoltée : parcelle 7', 'Label bio vérifié', 'Poids : 2 000 kg'] },
  { icon: '🏭', name: 'Brasserie', actor: 'Brasserie', date: '18 août',
    records: ['Lot n°42 brassé', 'Fermentation : 14 jours', 'Mise en fût : 30 fûts'] },
  { icon: '🚚', name: 'Transport', actor: 'Transporteur', date: '22 août', alert: true,
    records: ['Chargé : 30 fûts du lot 42', 'Température : 31 °C à 15h', 'Alerte chaleur : 2 heures'] },
  { icon: '🍺', name: 'Bar', actor: 'Bar', date: '23 août',
    records: ['Reçu : 30 fûts du lot 42', 'Alerte chaleur vue', 'Contrôle qualité : validé'] },
  { icon: '🪙', name: 'Paiement', actor: 'Léa', date: '29 août' },
];

// Le paiement de Léa, en satoshis (1 bitcoin = 100 millions de satoshis).
export const PRICE = 7000;
export const FEE = 150;
export const BALANCE = 250000;
