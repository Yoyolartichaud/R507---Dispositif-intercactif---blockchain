// Les clés d'un portefeuille et la signature d'une transaction.
//
// On utilise la vraie cryptographie du navigateur : des signatures ECDSA, la même
// famille que celles de Bitcoin (Bitcoin emploie une courbe voisine, secp256k1).
// Si le navigateur ne la fournit pas, on bascule sur une imitation à base d'empreintes.

import { sha256 } from './sha256.js';

const ALGORITHM = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGNING = { name: 'ECDSA', hash: 'SHA-256' };
const encoder = new TextEncoder();

const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => new Uint8Array(hex.match(/../g).map((pair) => parseInt(pair, 16)));

/** Une adresse est une version courte de la clé publique : son empreinte. (Format simplifié.) */
export const addressOf = (publicKey) => `bc1q${sha256(publicKey).slice(0, 12)}`;

/** Crée un portefeuille : une clé privée (secrète) et la clé publique qui en découle. */
export async function makeWallet() {
  try {
    const pair = await crypto.subtle.generateKey(ALGORITHM, false, ['sign', 'verify']);
    const publicKey = toHex(await crypto.subtle.exportKey('raw', pair.publicKey));
    return { real: true, pair, publicKey, address: addressOf(publicKey) };
  } catch {
    const secret = sha256(`secret-${Math.random()}-${Date.now()}`);
    const publicKey = sha256(`public-${secret}`);
    return { real: false, secret, publicKey, address: addressOf(publicKey) };
  }
}

/** Signe un message avec la clé privée du portefeuille. */
export async function signMessage(wallet, message) {
  if (!wallet.real) return sha256(`${wallet.secret}|${message}`);
  return toHex(await crypto.subtle.sign(SIGNING, wallet.pair.privateKey, encoder.encode(message)));
}

/** Vérifie une signature avec la clé publique : vrai seulement si le message n'a pas changé. */
export async function verifyMessage(wallet, message, signature) {
  if (!wallet.real) return sha256(`${wallet.secret}|${message}`) === signature;
  return crypto.subtle.verify(SIGNING, wallet.pair.publicKey, fromHex(signature), encoder.encode(message));
}
