// Le chef d'orchestre : il crée la scène, raconte l'histoire étape par étape,
// écrit les blocs, gère la vue éclatée et le paiement en bitcoin.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { tween, wait, ease, updateTweens } from './anim.js';
import { STAGES, PRICE, FEE, BALANCE, NO_PARENT, hashBlock, proofOk, mineNow, copyChain, number } from './blockchain.js';
import { makeWallet, addressOf, signMessage, verifyMessage } from './cles.js';
import { sha256 } from './sha256.js';
import { Block3D, Link, Computer, TxCard, PARTS, makeCard, makePill, flyOrb, STAND, BLOCK_H } from './objets3d.js';
import * as decor from './decor.js';

const FLOOR_Y = -2;
const STEP = 5;                       // distance entre deux étapes du voyage
const ROAD_Z = 3.2;                   // la route passe devant les bâtiments
const SHELF_Z = -2.2;                 // les étagères des blockchains sont au fond
const SHELF_H = 1.6;
const BLOCK_Y = FLOOR_Y + SHELF_H + STAND + BLOCK_H / 2;   // centre d'un bloc posé sur une étagère
const FOCUS_DISTANCE = 10;            // distance de la caméra en vue éclatée
const TRUCK_Y = FLOOR_Y + 0.06;
const TERRACE_X = 20;
const BITCOIN_X = 27.5;               // premier bloc de la blockchain Bitcoin
const BITCOIN_STEP = 3.3;
const GREEN = '#1b7f5c';

const stageX = (i) => i * STEP;
const v = (x, y, z) => new THREE.Vector3(x, y, z);
const $ = (id) => document.getElementById(id);
const tip = (text) => `<span class="tip">👉 ${text}</span>`;
const escapeHtml = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const short = (text, n = 14) => `${text.slice(0, n)}…`;

// ---------------------------------------------------------------------------
// État
// ---------------------------------------------------------------------------
let busy = false;        // une animation est en cours : on ne peut rien lancer d'autre
let focus = null;        // bloc ouvert en vue éclatée : { ledger, index }
let explode = 0;         // 0 = bloc fermé, 1 = vue éclatée
let pending = null;      // prochaine étape de l'histoire, en attente d'un clic
let ask = null;          // question ponctuelle, prioritaire sur l'histoire
let story = null;        // dernier texte de l'histoire, pour le rétablir après une parenthèse
let savedView = null;    // position de la caméra avant l'ouverture d'un bloc
let lastFrame = { x: 0, half: 5.8 };
let mining = null;       // recherche de nonce en cours
let brewing = 1;         // vitesse des bulles de la brasserie

// ---------------------------------------------------------------------------
// Scène
// ---------------------------------------------------------------------------
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);
const aniso = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f1ea);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 90;
controls.minPolarAngle = Math.PI * 0.2;
controls.maxPolarAngle = Math.PI * 0.5;      // la caméra ne passe jamais sous le sol
controls.minAzimuthAngle = -1.1;
controls.maxAzimuthAngle = 1.1;

scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d2c3, 1.8));
const sun = new THREE.DirectionalLight(0xffffff, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 18, bottom: -18, near: 1, far: 70 });
sun.shadow.bias = -0.0005;
sun.shadow.radius = 5;
scene.add(sun, sun.target);

// Sol invisible : seules les ombres s'y dessinent.
const floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 160), new THREE.ShadowMaterial({ opacity: 0.2 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = FLOOR_Y;
floor.receiveShadow = true;
scene.add(floor);

function place(object, x, y, z) {
  object.position.set(x, y, z);
  scene.add(object);
  return object;
}

function removeObject(object) {
  scene.remove(object);
  object.traverse((o) => {
    o.geometry?.dispose();
    o.material?.map?.dispose();
    o.material?.dispose();
  });
}

// ---------------------------------------------------------------------------
// Une blockchain : ses blocs, ses liens, et les copies gardées par ses participants
// ---------------------------------------------------------------------------
class Ledger {
  constructor(x0, spacing) {
    this.x0 = x0;
    this.spacing = spacing;
    this.chain = [];      // la chaîne posée sur l'étagère : celle qu'on peut essayer de modifier
    this.network = [];    // la version que gardent les autres participants
    this.blocks = [];     // Block3D, un par bloc
    this.links = [];      // links[i] relie le bloc i au bloc i + 1
    this.copies = [];     // la copie de chaque participant (acteur ou nœud)
  }

  x(i) { return this.x0 + i * this.spacing; }

  /** Rang du premier bloc qui ne correspond plus à la version du réseau (-1 si tout va bien). */
  get bad() { return this.chain.findIndex((block, i) => block.hash !== this.network[i].hash); }

  addBlock(model) {
    const index = this.blocks.length;
    const block = new Block3D(model, aniso);
    block.group.position.set(this.x(index), BLOCK_Y, SHELF_Z);
    block.group.userData.pick = { ledger: this, index };
    scene.add(block.group);
    this.blocks.push(block);
    return block;
  }

  addLink(i) {
    scene.updateMatrixWorld(true);
    const link = new Link(this.blocks[i].anchor('hash', 1), this.blocks[i + 1].anchor('prev', -1));
    scene.add(link.group);
    this.links[i] = link;
  }

  /** Le bloc est accepté : il rejoint la chaîne, et tout le réseau l'enregistre. */
  commit(model) {
    this.chain.push(model);
    this.network = copyChain(this.chain);
  }

  /** Met à jour l'aspect de chaque bloc : valide, modifié, ou lien rompu. */
  refresh() {
    let brokenBefore = false;
    this.chain.forEach((model, i) => {
      const edited = model.hash !== this.network[i].hash;
      const linkBroken = i > 0 && model.prev !== this.chain[i - 1].hash;
      if (i > 0) this.links[i - 1].setBroken(linkBroken);
      if (linkBroken) brokenBefore = true;
      this.blocks[i].setState(edited ? 'edited' : brokenBefore ? 'bad' : 'ok', linkBroken);
    });
  }

  restore() {
    this.chain.forEach((model, i) => {
      Object.assign(model, this.network[i]);
      this.blocks[i].redraw();
    });
    this.refresh();
    for (const copy of this.copies) copy.setCount(this.network.length);
  }
}

const trace = new Ledger(0, STEP);                        // traçabilité : un bloc au-dessus de chaque étape
const bitcoin = new Ledger(BITCOIN_X, BITCOIN_STEP);
const ledgers = [trace, bitcoin];
const tamperedLedger = () => ledgers.find((ledger) => ledger.bad >= 0);

// ---------------------------------------------------------------------------
// Décor
// ---------------------------------------------------------------------------
place(decor.makeShelf(-2.2, 17.2, SHELF_H, 1.9, 0xebe6da, 'BLOCKCHAIN DE TRAÇABILITÉ'), 0, FLOOR_Y, SHELF_Z);
place(decor.makeShelf(25.7, 42.6, SHELF_H, 1.9, 0xf6e3c5, 'BLOCKCHAIN BITCOIN'), 0, FLOOR_Y, SHELF_Z);

const field = place(decor.makeField(), 0, FLOOR_Y, 2.9);
const tractor = place(decor.makeTractor(), -2.1, FLOOR_Y + 0.12, 2.7);
const brewery = place(decor.makeBrewery(), stageX(1), FLOOR_Y, 1.5);
place(decor.makeRoad(2.6, 18.7), 0, FLOOR_Y, ROAD_Z);
const truck = place(decor.makeTruck(), 6.9, TRUCK_Y, ROAD_Z);
place(decor.makeBar(), stageX(3), FLOOR_Y, 1.5);
place(decor.makeTerrace(), TERRACE_X, FLOOR_Y, 2.9);

const sack = place(decor.makeSack(), 0, 0, 0);
const keg = place(decor.makeKeg(), 0, 0, 0);
const glass = place(decor.makeGlass(), TERRACE_X - 0.15, FLOOR_Y + 0.66, 3.4);
const key = place(decor.makeKey(), TERRACE_X - 0.7, FLOOR_Y + 1.75, 3.3);
const scanLine = place(decor.makeScanLine(), 0, 0, 0);
sack.visible = keg.visible = key.visible = false;
key.scale.setScalar(1.3);

const alertPill = place(makePill('⚠ clim en panne : 31 °C', '#c0392b'), 0, FLOOR_Y + 2.15, ROAD_Z);
const paidPill = place(makePill('✔ payé', GREEN), TERRACE_X, FLOOR_Y + 3.05, 2.9);
const confirmPill = place(makePill('1 confirmation', GREEN), bitcoin.x(2), BLOCK_Y + BLOCK_H / 2 + 1.05, SHELF_Z);
alertPill.visible = paidPill.visible = confirmPill.visible = false;

// Où est rangée la blockchain ? Sur l'ordinateur de chaque acteur. Ces ordinateurs (les nœuds)
// sont reliés entre eux par un réseau, et chacun garde une copie complète de la chaîne.
const NODE_SIZE = 1;
trace.copies = STAGES.slice(0, 4).map((info, i) => {
  const computer = new Computer(info.actor, aniso);
  place(computer.group, stageX(i), FLOOR_Y, 5.2);
  computer.group.scale.setScalar(0.001);       // ils apparaissent quand on présente le réseau
  return computer;
});
const traceNetwork = place(decor.makeNetwork(trace.copies.map((computer) => v(computer.group.position.x, 0.04, 5.85))), 0, FLOOR_Y, 0);
traceNetwork.visible = false;

// Le réseau Bitcoin : des nœuds partout dans le monde. Certains sont aussi des mineurs.
bitcoin.copies = ['Nœud Paris', '⛏ Mineur A', 'Nœud Tokyo', '⛏ Mineur B', 'Nœud Lagos', '⛏ Mineur C'].map((name, i) => {
  const computer = new Computer(name, aniso, { miner: name.includes('Mineur') });
  place(computer.group, BITCOIN_X + 0.7 + i * 2.4, FLOOR_Y, 6);
  computer.group.scale.setScalar(NODE_SIZE);
  return computer;
});
const MINERS = bitcoin.copies.filter((computer) => computer.fans);
place(decor.makeNetwork(bitcoin.copies.map((computer) => v(computer.group.position.x, 0.04, 6.65))), 0, FLOOR_Y, 0);
const coin = place(decor.makeCoin(), 0, 0, 0);
coin.visible = false;
let racing = false;       // vrai pendant que les mineurs font la course

// La mempool : là où les transactions attendent.
const MEMPOOL_X = bitcoin.x(2);
place(decor.makeTray(), MEMPOOL_X, FLOOR_Y, 3.4);
const mempoolPill = place(makePill('mempool', '#55607d'), MEMPOOL_X - 2.6, FLOOR_Y + 0.3, 3.4);
mempoolPill.scale.multiplyScalar(0.8);
const mempoolSlot = (k) => v(MEMPOOL_X, FLOOR_Y + 0.55 + k * 0.72, 3.4);
let mempoolCards = [];

const txCard = new TxCard(aniso);
place(txCard.group, 23.7, FLOOR_Y + 2.6, 3);
txCard.group.visible = false;
const TX_SCALE = 1.15;

// Points de passage.
const P = {
  fieldEdge: v(1.4, FLOOR_Y + 0.6, 4.4),
  breweryDoor: v(stageX(1), FLOOR_Y + 0.45, 2.3),
  roadside: v(stageX(1) + 0.2, FLOOR_Y + 0.36, 3.05),
  doorstep: v(stageX(3), FLOOR_Y + 0.34, 2.75),
  qr: v(TERRACE_X + 0.42, FLOOR_Y + 0.9, 3.2),
  keyHome: v(TERRACE_X - 0.7, FLOOR_Y + 1.75, 3.3),
};
const trailer = () => v(truck.position.x - 0.35, FLOOR_Y + 0.95, ROAD_Z);

// D'où partent les enregistrements de chaque étape.
const SENSORS = [
  () => v(0, FLOOR_Y + 1.7, 2.9),
  () => v(stageX(1), FLOOR_Y + 2.1, 1.5),
  () => v(truck.position.x - 0.35, FLOOR_Y + 1.8, ROAD_Z),
  () => v(stageX(3), FLOOR_Y + 2.4, 1.5),
];

// Anneau qui monte et descend autour du bloc en vue éclatée.
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.85, 0.018, 8, 72),
  new THREE.MeshBasicMaterial({ color: 0x1f2a44, transparent: true, opacity: 0.3 }),
);
ring.rotation.x = Math.PI / 2;
ring.visible = false;
scene.add(ring);

// ---------------------------------------------------------------------------
// Petites animations réutilisables
// ---------------------------------------------------------------------------
/** Fait sauter un objet jusqu'à un point, en cloche. */
function hop(object, to, { height = 1.2, duration = 0.7 } = {}) {
  const from = object.position.clone();
  return tween(duration, (k) => {
    object.position.lerpVectors(from, to, k);
    object.position.y += Math.sin(Math.PI * k) * height;
  });
}

function scaleTo(object, from, to, duration = 0.3, easing = ease.inOut) {
  return tween(duration, (k) => object.scale.setScalar(Math.max(0.001, from + (to - from) * k)), easing);
}

function drive(x, duration) {
  const from = truck.position.x;
  return tween(duration, (k) => {
    truck.position.x = from + (x - from) * k;
    truck.position.y = TRUCK_Y + Math.abs(Math.sin(k * 40)) * 0.012;
  });
}

async function scan(point, width = 1) {
  scanLine.visible = true;
  scanLine.scale.set(width, 1, width);
  await tween(1.3, (k) => scanLine.position.set(point.x, point.y - 0.3 + Math.abs(Math.sin(k * Math.PI * 2)) * 0.6, point.z), ease.linear);
  scanLine.visible = false;
}

/** Gerbe de petites billes : poussière, ou confettis. */
function splash(point, colors) {
  for (let i = 0; i < 10; i++) {
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.6 }));
    const angle = (i / 10) * Math.PI * 2;
    const to = point.clone().add(v(Math.cos(angle) * 0.9, -0.2, Math.sin(angle) * 0.9));
    drop.position.copy(point);
    scene.add(drop);
    tween(0.7, (k) => {
      drop.position.lerpVectors(point, to, k);
      drop.position.y += Math.sin(Math.PI * k) * 0.9;
    }).then(() => removeObject(drop));
  }
}

// ---------------------------------------------------------------------------
// Caméra
// ---------------------------------------------------------------------------
const tanH = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;

function flyTo(target, distance, { azimuth = 0, elevation = 0.26, duration = 1 } = {}) {
  const direction = v(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
  return flyToPosition(target, target.clone().addScaledVector(direction, distance), duration);
}

function flyToPosition(target, position, duration = 1) {
  const from = { target: controls.target.clone(), position: camera.position.clone() };
  const apply = (t) => {
    controls.target.lerpVectors(from.target, target, t);
    camera.position.lerpVectors(from.position, position, t);
    sun.position.set(controls.target.x + 6, 12, 9);
    sun.target.position.set(controls.target.x, 0, 0);
  };
  if (duration === 0) { apply(1); return Promise.resolve(); }
  return tween(duration, apply);
}

/** Cadre une zone : centrée sur x, large de 2 × half. */
function frame(x, half, duration = 1.2) {
  lastFrame = { x, half };
  return flyTo(v(x, 0.6, 0.5), THREE.MathUtils.clamp(half / tanH(), 15, 88), { duration });
}

const overview = () => flyTo(v(20, 0.4, 0.5), Math.min(88, 24 / tanH()), { duration: 1.4 });

function resize() {
  const width = stage.clientWidth, height = stage.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if (!focus && !busy) frame(lastFrame.x, lastFrame.half, 0);
}

// ---------------------------------------------------------------------------
// Interface : texte, boutons, registre
// ---------------------------------------------------------------------------
function narrate(title, html, tone = '', remember = true) {
  $('ex-title').textContent = title;
  $('ex-text').innerHTML = html;
  $('ex-live').textContent = '';
  $('explain').dataset.tone = tone;
  if (remember) story = { title, html, tone };
}

const live = (text) => { $('ex-live').textContent = text; };

/** Fait défiler le panneau pour qu'un encadré qui vient d'apparaître soit visible. */
const reveal = (id) => requestAnimationFrame(() => $(id).scrollIntoView({ block: 'end', behavior: 'smooth' }));

/** Le bouton principal change de rôle selon la situation. */
function refreshButtons() {
  const tampered = Boolean(tamperedLedger());
  const next = $('next');
  $('close').hidden = !focus;
  $('close').disabled = busy;
  $('focus').hidden = !focus;
  $('undo').hidden = Boolean(focus) || !tampered || busy;
  next.hidden = Boolean(focus);
  if (ask) { next.textContent = ask.label; next.disabled = false; }
  else if (tampered) { next.textContent = 'Faire vérifier par les autres'; next.disabled = busy; }
  else if (pending) { next.textContent = pending.label; next.disabled = busy; }
  else next.disabled = true;
  $('view-all').disabled = $('view-reset').disabled = Boolean(focus) || busy;
}

/** Attend un clic sur le bouton principal, qui affiche `label`. */
function question(label) {
  return new Promise((resolve) => { ask = { label, resolve }; refreshButtons(); });
}

function setStage(i) {
  $('clock').textContent = `${STAGES[i].date} 2026`;
  [...$('stepper').children].forEach((item, k) => {
    item.classList.toggle('done', k < i);
    item.classList.toggle('current', k === i);
  });
}

/** Le registre de traçabilité, tel que n'importe qui peut le lire. */
function renderHistory() {
  $('history-hint').hidden = trace.network.length > 0;
  $('history').replaceChildren(...trace.network.map((block, i) => {
    const item = document.createElement('li');
    if (STAGES[i].alert) item.className = 'alert';
    const time = document.createElement('time');
    time.textContent = STAGES[i].date;
    item.append(time);
    for (const line of block.data.split('\n')) {
      const text = document.createElement('span');
      const isAlert = /alerte|31 °C/i.test(line) && STAGES[i].alert;
      text.textContent = `${isAlert ? '⚠ ' : ''}${line}`;
      if (isAlert) text.className = 'alert';
      item.append(text);
    }
    const who = document.createElement('small');
    who.textContent = `Bloc n°${block.index}, écrit par : ${STAGES[i].actor}`;
    item.append(who);
    return item;
  }));
}

// ---------------------------------------------------------------------------
// Écrire un bloc
// ---------------------------------------------------------------------------
/** Lance le minage d'un bloc. La promesse donne le nombre d'essais quand le nonce est trouvé. */
function mine(block, slow, by, onTry) {
  return new Promise((resolve) => { mining = { block, slow, by, onTry, time: 0, budget: 0, tries: 0, resolve }; });
}

/** Appelée à chaque image : essaie quelques nonces, de plus en plus vite. */
function updateMining(dt) {
  if (!mining) return;
  const model = mining.block.model;
  mining.time += dt;
  const perSecond = mining.slow
    ? (mining.time < 2.5 ? 3 : Math.min(500, 3 * Math.exp((mining.time - 2.5) * 1.8)))
    : Math.min(500, 10 * Math.exp(mining.time * 1.8));
  mining.budget += perSecond * dt;
  let count = Math.floor(mining.budget);
  if (!count) return;
  mining.budget -= count;

  let found = false;
  while (count-- > 0 && !found) {
    model.nonce = mining.tries++;        // on essaie les nonces dans l'ordre : 0, 1, 2, 3…
    model.hash = hashBlock(model);       // on recalcule l'empreinte avec ce nonce
    found = proofOk(model);              // commence-t-elle par « 00 » ?
  }
  mining.block.redraw(['nonce', 'hash']);
  live(`3 sur 4 · ${mining.by} : essai n° ${mining.tries} → ${model.hash.slice(0, 10)}… ${found ? '✔' : '✖'}`);
  mining.onTry?.(mining.tries);
  if (found) {
    const { resolve, tries } = mining;
    mining = null;
    resolve(tries);
  }
}

/**
 * Écrit un nouveau bloc dans une blockchain, en 4 temps.
 * `sources` donne, pour chaque enregistrement, soit le point d'où il part,
 * soit une carte déjà présente dans la scène (une transaction de la mempool).
 */
async function writeBlock(ledger, {
  index, title, records, sources, slow = false, fast = false, noun = 'enregistrements',
  by = 'Un mineur cherche le nonce',      // qui fait le calcul : on le dit toujours
  onTry, onFound,
}) {
  const rank = ledger.chain.length;
  const parent = ledger.chain[rank - 1];
  const final = { index, title, data: records.join('\n'), prev: parent ? parent.hash : NO_PARENT, nonce: null, hash: '' };
  const model = { ...final, data: '', prev: '' };       // au début, le bloc est vide

  // 1. Les enregistrements entrent, un par un, dans un nouveau bloc.
  live(`1 sur 4 · ${records.length} ${noun} entrent dans un nouveau bloc`);
  const block = ledger.addBlock(model);
  block.setState('building');
  block.group.scale.setScalar(0.001);
  await scaleTo(block.group, 0.6, 1, 0.45, ease.back);
  const end = v(ledger.x(rank), BLOCK_Y + 0.9, SHELF_Z + 0.6);
  for (let k = 0; k < records.length; k++) {
    let card = sources[k];
    if (card.isVector3) {
      const origin = card;
      card = makeCard(records[k], aniso);
      card.position.copy(origin);
      scene.add(card);
      await scaleTo(card, 0, 1, fast ? 0.2 : 0.3, ease.back);
      if (!fast) await wait(0.3);
    }
    const start = card.position.clone();
    const size = card.scale.x;
    const tilt = card.rotation.x;
    await tween(fast ? 0.5 : 0.8, (t) => {
      card.position.lerpVectors(start, end, t);
      card.position.y += Math.sin(Math.PI * t) * 1.2;
      card.scale.setScalar(size * (1 - 0.7 * t));
      card.rotation.x = tilt * (1 - t);
    });
    removeObject(card);
    model.data = records.slice(0, k + 1).join('\n');
    block.redraw(['data']);
  }
  if (!fast) await wait(0.4);

  // 2. Le bloc recopie l'empreinte du bloc précédent : c'est le maillon de la chaîne.
  if (parent) {
    live("2 sur 4 · Il recopie l'empreinte du bloc précédent");
    scene.updateMatrixWorld(true);
    await flyOrb(scene, ledger.blocks[rank - 1].anchor('hash', 1), block.anchor('prev', -1), { color: 0x9b7fc0, arc: 0.6, duration: fast ? 0.5 : 0.9 });
  } else {
    live("2 sur 4 · C'est le premier bloc : il n'a pas de parent");
    await wait(0.8);
  }
  model.prev = final.prev;
  block.redraw(['prev']);
  if (parent) ledger.addLink(rank - 1);
  if (!fast) await wait(0.4);

  // 3. Minage : on cherche le nonce qui donne une empreinte commençant par « 00 ».
  const tries = await mine(block, slow, by, onTry);
  block.setState('ok');
  live(`3 sur 4 · Bonne empreinte trouvée après ${number(tries)} essais : le bloc est scellé`);
  await tween(0.45, (k) => block.group.scale.setScalar(1 + 0.08 * Math.sin(Math.PI * k)));
  if (onFound) await onFound(block, tries);
  if (!fast) await wait(0.5);

  // 4. Une copie du bloc part vers chaque ordinateur du réseau, qui l'enregistre sur son disque.
  live('4 sur 4 · Une copie du bloc part vers chaque ordinateur du réseau');
  ledger.commit(model);
  scene.updateMatrixWorld(true);
  const from = block.anchor('hash', 0, 1);
  await Promise.all(ledger.copies.map(async (copy, k) => {
    await wait(k * (fast ? 0.1 : 0.2));
    await flyOrb(scene, from, copy.point, { color: 0x95d5b2, size: 0.16, cube: true, duration: fast ? 0.7 : 1, arc: 2 });
    copy.setCount(ledger.network.length);
  }));
  return { block, tries };
}

// ---------------------------------------------------------------------------
// Chapitre 1 : le voyage de la bière, et sa blockchain de traçabilité
// ---------------------------------------------------------------------------
const AFTER_BLOCK = [
  ['Le premier bloc est écrit',
    "Les trois enregistrements sont rangés ensemble dans un <b>bloc</b> : une page du registre. C'est l'ordinateur de la ferme qui l'a fabriqué, puis il en a envoyé une copie aux trois autres. Regarde leurs écrans : chacun a maintenant 1 bloc sur son disque. Pour sceller le bloc, l'ordinateur a calculé son <b>empreinte</b>. C'est le mot le plus important de toute la blockchain : voyons ce que c'est."],
  ['Deuxième bloc, accroché au premier',
    "Ce bloc recopie l'empreinte du bloc n°1 : c'est le lien qui les attache. Voilà pourquoi on parle de <b>chaîne de blocs</b>, ou <i>blockchain</i>."],
  ['Le coup de chaud est gravé dans le bloc n°3',
    `Le transporteur aimerait bien effacer cette ligne : c'est lui qui paiera si la bière est abîmée.${tip('Mets-toi à sa place : clique sur le bloc n°3 et remplace 31 par 6.')}`],
  ['Quatrième bloc',
    "La ferme, la brasserie, le transporteur et le bar ont tous la même copie des 4 blocs. Cette blockchain est <b>privée</b> : seules ces entreprises y écrivent. Il en existe aussi des <b>publiques</b>, ouvertes au monde entier. La plus connue : celle du <b>bitcoin</b>."],
];

// Dans la blockchain de traçabilité, c'est l'ordinateur de l'acteur concerné qui fabrique le bloc.
const WRITERS = ['de la ferme', 'de la brasserie', 'du transporteur', 'du bar'];

async function record(i) {
  narrate('Écriture dans la blockchain',
    `L'ordinateur ${WRITERS[i]} fabrique un bloc avec les enregistrements de cette étape, en 4 temps.`, '', false);
  const origin = SENSORS[i]();
  await writeBlock(trace, {
    index: i + 1, title: `BLOC N°${i + 1}`, records: STAGES[i].records, sources: STAGES[i].records.map(() => origin),
    by: `L'ordinateur ${WRITERS[i]} cherche le nonce`,
  });
  renderHistory();
  narrate(...AFTER_BLOCK[i], i === 2 ? 'warn' : 'ok');
}

/** Avant de commencer : où est rangée une blockchain, et qui la garde ? */
async function introNetwork() {
  narrate('Où est rangée une blockchain ?', 'Regardons qui participe…', '', false);
  await frame(7.5, 10.3, 1.6);
  for (const computer of trace.copies) await scaleTo(computer.group, 0, NODE_SIZE, 0.45, ease.back);
  traceNetwork.visible = true;
  // Un signal fait le tour du réseau, d'ordinateur en ordinateur.
  scene.updateMatrixWorld(true);
  for (let i = 0; i < trace.copies.length - 1; i++) {
    await flyOrb(scene, trace.copies[i].point, trace.copies[i + 1].point, { color: 0x6c8ea4, duration: 0.5, arc: 0.7 });
  }
  narrate('Où est rangée une blockchain ?',
    "Ni dans un coffre, ni sur un serveur central. Chaque participant a un ordinateur, appelé <b>nœud</b> : ici la ferme, la brasserie, le transporteur et le bar. Ces 4 ordinateurs sont reliés par Internet : c'est le <b>réseau</b>. Chacun garde sur son disque dur <b>une copie complète</b> de la blockchain. Si l'un tombe en panne ou ment, les trois autres ont toujours la bonne version. L'étagère du fond montre en grand ce que contient chaque copie : pour l'instant, rien.");
}

// La machine à empreintes : on tape un texte, on voit son empreinte changer.
let labPrevious = '';

function updateLab() {
  const hash = sha256($('lab-text').value);
  const changed = labPrevious ? [...hash].filter((char, i) => char !== labPrevious[i]).length : 0;
  $('lab-hash').replaceChildren(...[...hash].map((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    if (labPrevious && char !== labPrevious[i]) span.className = 'diff';
    return span;
  }));
  $('lab-note').textContent = labPrevious
    ? `${changed} caractères sur 64 viennent de changer.`
    : 'Toujours 64 caractères, que le texte soit court ou très long.';
  labPrevious = hash;
}

async function hashLesson() {
  labPrevious = '';
  updateLab();
  $('hash-lab').hidden = false;
  reveal('hash-lab');
  narrate("C'est quoi, une empreinte ?",
    `Une <b>empreinte</b> (en anglais, <i>hash</i>) est un code de 64 caractères, calculé par l'ordinateur à partir d'un texte. C'est comme l'empreinte digitale de ce texte :<ol><li>le même texte donne toujours la même empreinte ;</li><li>si on change une seule lettre, toute l'empreinte change ;</li><li>impossible de retrouver le texte à partir de l'empreinte.</li></ol>Elle sert d'alarme : si quelqu'un modifie un bloc, son empreinte n'est plus la même, et tout le monde le voit.${tip('Essaie dans la machine à empreintes, juste en dessous : change une lettre.')}`);
}

async function sceneField() {
  setStage(0);
  narrate('18 juillet · La moisson', "Dans la parcelle n°7, le tracteur récolte l'orge…", '', false);
  await frame(stageX(0), 5.8, 1.4);
  await tween(2.8, (k) => {
    const x = -2.1 + 4.3 * k;
    tractor.position.x = x;
    tractor.position.y = FLOOR_Y + 0.12 + Math.abs(Math.sin(k * 30)) * 0.015;
    for (const stalk of field.userData.stalks) {
      if (stalk.position.x < x - 0.2 && stalk.scale.y === 1) { stalk.scale.y = 0.18; stalk.position.y = 0.18; }
    }
  }, ease.linear);
  sack.visible = true;
  sack.position.copy(P.fieldEdge);
  await scaleTo(sack, 0, 1, 0.45, ease.back);
  splash(P.fieldEdge.clone().setY(FLOOR_Y + 0.5), [0xe9c46a, 0xf4e3a1]);
  narrate('18 juillet · La moisson',
    "L'orge de la parcelle n°7 est récoltée : c'est le début d'une bière. La ferme prépare <b>trois enregistrements</b> : la récolte, le label bio et le poids.");
}

async function sceneBrewery() {
  setStage(1);
  $('hash-lab').hidden = true;
  narrate('18 août · La brasserie', "L'orge part à la brasserie…", '', false);
  const moving = frame(stageX(1), 5.8, 2);
  await hop(sack, v(3, FLOOR_Y + 0.5, 3.3), { height: 1.5, duration: 0.75 });
  await hop(sack, P.breweryDoor, { height: 1.4, duration: 0.75 });
  await scaleTo(sack, 1, 0, 0.3);
  sack.visible = false;
  brewing = 4;                          // ça bouillonne dans les cuves
  await wait(1.6);
  brewing = 1;
  keg.visible = true;
  keg.position.copy(P.breweryDoor);
  await tween(0.8, (k) => {
    keg.scale.setScalar(0.2 + 0.8 * k);
    keg.position.lerpVectors(P.breweryDoor, P.roadside, k);
  });
  await moving;
  narrate('18 août · La brasserie',
    "L'orge devient du malt, puis de la bière : brassage, deux semaines de fermentation, mise en fût. La brasserie prépare trois enregistrements pour le <b>lot n°42</b>.");
}

async function sceneRoad() {
  setStage(2);
  narrate('22 août · Le camion part', 'Les fûts sont chargés dans le camion frigorifique, réglé sur 6 °C…', '', false);
  await hop(keg, trailer(), { height: 1, duration: 0.7 });
  await scaleTo(keg, 1, 0, 0.25);
  keg.visible = false;
  const moving = frame(stageX(2), 5.8, 2.6);
  await drive(stageX(2), 2.6);
  await moving;
  // La panne : le camion tremble, l'afficheur passe au rouge.
  await tween(0.6, (k) => { truck.rotation.z = Math.sin(k * 30) * 0.03 * (1 - k); });
  truck.rotation.z = 0;
  truck.userData.setTemp(31);
  alertPill.visible = true;
  narrate('22 août · Coup de chaud sur la route',
    "En plein après-midi, la climatisation du camion tombe en panne : 31 °C pendant deux heures, alors que la bière doit rester au frais. Le capteur l'écrit tout seul. Personne ne lui demande son avis, pas même le chauffeur.", 'warn');
}

async function sceneBar() {
  setStage(3);
  alertPill.visible = false;
  truck.userData.setTemp(6);
  narrate('22 août · La clim est réparée', 'Le camion repart vers le bar…', '', false);
  const moving = frame(stageX(3), 5.8, 2.2);
  await drive(13.1, 2.2);
  keg.visible = true;
  keg.position.copy(trailer());
  await scaleTo(keg, 0, 1, 0.3);
  await hop(keg, P.doorstep, { height: 1.1, duration: 0.7 });
  await moving;
  await scan(keg.position.clone());
  narrate('23 août · Le bar',
    "Le patron scanne un fût et lit toute l'histoire du lot dans la blockchain. Il voit l'alerte chaleur du camion : il goûte et contrôle la bière avant de l'accepter. Puis il l'écrit à son tour.");
}

// ---------------------------------------------------------------------------
// Chapitre 2 : Léa paie sa bière en bitcoin
// ---------------------------------------------------------------------------
const pay = { wallet: null, barAddress: addressOf('le-bar-du-coin'), amount: PRICE, signature: '', check: 0 };

/** Le texte exact que Léa signe : si un seul caractère change, la signature ne vaut plus rien. */
const transactionText = () => `${pay.wallet.address}>${pay.barAddress}:${pay.amount}+${FEE}`;

function drawTransaction(status) {
  txCard.draw({
    from: `Léa · ${short(pay.wallet.address, 12)}`,
    to: `Le bar · ${short(pay.barAddress, 12)}`,
    amount: `${number(pay.amount)} satoshis`,
    fee: `${number(FEE)} satoshis`,
    signature: pay.signature,
    status,
  });
}

async function payOrder() {
  setStage(4);
  keg.visible = false;
  narrate('29 août · Léa arrive en terrasse', 'Sur la table, un QR code permet de lire l\'histoire de la bière…', '', false);
  await frame(22.2, 4.4, 2.2);
  await scan(P.qr, 0.4);
  $('history').classList.add('read');
  narrate('29 août · Léa commande une bière',
    `Léa scanne le QR code de la carte. Son téléphone ouvre un <b>explorateur de blocs</b> : une page qui affiche la blockchain sous forme de tableau, un bloc par ligne. Elle y lit les 4 blocs, coup de chaud compris. Lire ne crée pas de bloc et ne demande la permission de personne. Rassurée, elle commande, et veut payer en <b>bitcoin</b> : une monnaie numérique qui fonctionne sans banque.${tip('Clique sur « Lire la blockchain », en bas de la scène, pour voir ce que voit Léa.')}`);
}

async function payWallet() {
  pay.wallet = await makeWallet();
  $('w-public').textContent = short(pay.wallet.publicKey, 22);
  $('w-address').textContent = pay.wallet.address;
  $('w-balance').textContent = `${number(BALANCE)} satoshis`;
  $('wallet').hidden = false;
  reveal('wallet');
  key.visible = true;
  await Promise.all([scaleTo(key, 0, 1.3, 0.5, ease.back), tween(0.8, (k) => { key.rotation.y = k * Math.PI * 2; })]);
  narrate('Le portefeuille de Léa',
    "Son <b>portefeuille</b> (en anglais, <i>wallet</i>) ne contient pas de pièces : il garde ses clés. La <b>clé privée</b> est son secret, elle ne la montre jamais. La <b>clé publique</b> est calculée à partir de la clé privée, et peut être donnée à tout le monde. Son <b>adresse</b> en est une version courte : c'est comme un numéro de compte.");
}

async function payTransaction() {
  drawTransaction('none');
  txCard.group.visible = true;
  await scaleTo(txCard.group, 0, TX_SCALE, 0.5, ease.back);
  narrate('La transaction',
    `Une <b>transaction</b> est un ordre de paiement : « l'adresse de Léa envoie ${number(PRICE)} <b>satoshis</b> à l'adresse du bar ». Le satoshi est le centime du bitcoin : il en faut 100 millions pour faire 1 bitcoin. Léa ajoute ${number(FEE)} satoshis de <b>frais</b> : ils iront à celui qui inscrira sa transaction dans la blockchain.`);
}

async function paySign() {
  pay.signature = await signMessage(pay.wallet, transactionText());
  // La clé privée vient « tamponner » la transaction.
  const stamp = txCard.group.position.clone().add(v(0.9, -0.75, 0.5));
  await tween(0.8, (k) => {
    key.position.lerpVectors(P.keyHome, stamp, k);
    key.position.y += Math.sin(Math.PI * k) * 0.8;
  });
  await tween(0.6, (k) => { key.rotation.z = k * Math.PI * 2; });
  key.rotation.z = 0;
  drawTransaction('ok');
  splash(stamp, [0xf2b705, 0xffd97d]);
  await wait(0.4);
  await tween(0.8, (k) => {
    key.position.lerpVectors(stamp, P.keyHome, k);
    key.position.y += Math.sin(Math.PI * k) * 0.8;
  });
  $('tx-amount').value = PRICE;
  $('tamper-tx').hidden = false;
  reveal('tamper-tx');
  narrate('La transaction est signée',
    `La <b>signature</b> est calculée à partir de la transaction ET de la clé privée. Elle prouve que c'est bien Léa qui paie, sans jamais révéler sa clé. Tout le monde peut la vérifier avec la clé publique.${tip('Joue le pirate : change le montant dans le panneau, et regarde la signature.')}`, 'ok');
}

/** Un pirate change le montant : la signature, faite pour l'ancien texte, ne correspond plus. */
async function tamperTransaction(value) {
  if (!pay.signature || busy) return;
  pay.amount = Math.max(0, Math.round(Number(value) || 0));
  const check = ++pay.check;
  const valid = await verifyMessage(pay.wallet, transactionText(), pay.signature);
  if (check !== pay.check) return;      // une frappe plus récente est déjà en cours de vérification
  drawTransaction(valid ? 'ok' : 'bad');
  if (valid) {
    narrate('Signature valide', `Avec le montant d'origine, la signature correspond de nouveau : la transaction est authentique.`, 'ok', false);
  } else {
    narrate('Signature refusée',
      `La transaction dit maintenant ${number(pay.amount)} satoshis, mais la signature a été calculée pour ${number(PRICE)}. Elle ne correspond plus : le réseau rejettera cette transaction. Seule Léa, avec sa clé privée, pourrait en signer une nouvelle.`, 'bad', false);
  }
}

const OTHER_PAYMENTS = ['Tom → Ana : 52 000 sats', 'Zoé → Max : 1 300 sats'];

async function payBroadcast() {
  // On repart de la vraie transaction, au cas où le montant aurait été modifié pour essayer.
  $('tamper-tx').hidden = true;
  pay.amount = PRICE;
  drawTransaction('ok');
  narrate('Envoi au réseau', 'La transaction signée part vers les ordinateurs du réseau Bitcoin…', '', false);

  // D'autres paiements attendent déjà dans la mempool.
  mempoolCards = OTHER_PAYMENTS.map((text, k) => {
    const card = makeCard(text, aniso, 0xffd97d);
    card.scale.setScalar(0.8);
    card.rotation.x = -0.2;
    return place(card, MEMPOOL_X, mempoolSlot(k + 1).y, 3.4);
  });
  await frame(31.5, 11.5, 1.8);

  // Chaque nœud reçoit la transaction et la vérifie.
  const from = txCard.group.position.clone();
  await Promise.all(bitcoin.copies.map(async (node, k) => {
    await wait(k * 0.25);
    await flyOrb(scene, from, node.point, { color: 0xf2b705, duration: 1.1, arc: 2.4 });
    node.flash('✔ signature valide', GREEN, 2.6);
  }));

  // Puis elle rejoint la mempool.
  const token = makeCard(`Léa → Bar : ${number(PRICE)} sats`, aniso, 0xffd97d);
  token.rotation.x = -0.2;
  token.scale.setScalar(0.8);
  place(token, from.x, from.y, from.z);
  await Promise.all([
    scaleTo(txCard.group, TX_SCALE, 0, 0.4),
    hop(token, mempoolSlot(0), { height: 2.2, duration: 1.1 }),
  ]);
  txCard.group.visible = false;
  mempoolCards.unshift(token);
  await frame(34.1, 8.3, 1.4);
  narrate('Vérifiée par le réseau, en salle d\'attente',
    "La transaction a été envoyée à des milliers d'ordinateurs, les <b>nœuds</b>. Aucun chef, aucun serveur central : le réseau est <b>décentralisé</b>. Chaque nœud vérifie deux choses : la signature est-elle valide ? Léa possède-t-elle bien ces bitcoins, sans les avoir déjà dépensés ? La transaction attend maintenant dans la <b>mempool</b>, avec les paiements d'autres personnes.", 'ok');
}

/** Qui écrit le prochain bloc ? On présente les mineurs avant de lancer la course. */
async function minersIntro() {
  narrate('Qui écrit le prochain bloc ?', 'Trois machines se mettent en route…', '', false);
  for (const miner of MINERS) {
    await tween(0.4, (k) => { miner.group.position.y = FLOOR_Y + Math.sin(Math.PI * k) * 0.5; });
    miner.setStatus('prêt à calculer', AMBER);
  }
  narrate('Qui écrit le prochain bloc ?',
    "Dans une banque, c'est la banque qui inscrit les paiements. Ici, il n'y a pas de chef. Alors qui écrit la prochaine page ? Des volontaires, les <b>mineurs</b> : des personnes ou des entreprises équipées d'ordinateurs très puissants. Ils font la course : le premier qui résout une énigme de calcul gagne le droit d'écrire le bloc, et reçoit une <b>récompense</b> en bitcoins. C'est pour elle qu'ils travaillent.");
}

const AMBER = '#9a6700';

async function payMine() {
  narrate('La course des mineurs',
    "Chaque mineur prend les transactions de la mempool et cherche le bon nonce : celui qui donne une empreinte commençant par « 00 ». Impossible de deviner, il faut essayer des milliers de nombres. On appelle ça la <b>preuve de travail</b>. Regarde leurs écrans.", '', false);
  const winner = MINERS[Math.floor(Math.random() * MINERS.length)];
  racing = true;
  const records = [`Léa → Bar : ${number(PRICE)} sats`, ...OTHER_PAYMENTS];
  const { tries } = await writeBlock(bitcoin, {
    index: 970413, title: 'BLOC N°970 413', records, sources: mempoolCards, slow: true, noun: 'transactions',
    by: 'Les mineurs cherchent le nonce',
    // Chaque mineur essaie des nombres de son côté ; un seul tombera sur le bon en premier.
    onTry: (count) => MINERS.forEach((miner, k) => {
      const own = miner === winner ? count : Math.max(1, Math.round(count * (0.72 + 0.11 * k)));
      miner.setStatus(`essai n° ${number(own)} ✖`, AMBER);
    }),
    onFound: async (block) => {
      racing = false;
      for (const miner of MINERS) miner.setStatus(miner === winner ? '✔ trouvé en premier !' : 'trop tard…', miner === winner ? GREEN : '#55607d');
      // La récompense part du nouveau bloc vers le mineur gagnant.
      scene.updateMatrixWorld(true);
      const from = block.anchor('nonce', 0, 1);
      const to = winner.point;
      coin.visible = true;
      await tween(1.1, (k) => {
        coin.position.lerpVectors(from, to, k);
        coin.position.y += Math.sin(Math.PI * k) * 1.6;
        coin.rotation.y = k * Math.PI * 4;
      });
      coin.visible = false;
      winner.setStatus('+ récompense 🪙', GREEN);
    },
  });
  mempoolCards = [];
  confirmPill.setText('1 confirmation', GREEN);
  confirmPill.visible = true;
  const name = winner.name.replace('⛏ ', '');
  narrate(`${name} a gagné, après ${number(tries)} essais`,
    `Il reçoit les frais des transactions, plus des bitcoins tout neufs. Les autres nœuds vérifient son bloc en un seul calcul, puis l'ajoutent à leur copie. Pourquoi une énigme si difficile ? Parce qu'elle coûte du temps et de l'électricité : pour modifier un ancien bloc, un tricheur devrait refaire toutes les énigmes plus vite que tous les mineurs du monde réunis. C'est le travail des mineurs qui protège la blockchain. Le paiement de Léa, lui, a <b>1 confirmation</b>.${tip('Clique sur ce bloc : il contient trois transactions.')}`, 'ok');
}

const NEXT_PAYMENTS = [
  ['Inès → Paul : 21 000 sats', 'Marc → Lina : 4 500 sats', 'Omar → Jade : 88 000 sats'],
  ['Noa → Eva : 9 900 sats', 'Sam → Lou : 150 000 sats', 'Mia → Hugo : 2 100 sats'],
];

async function payConfirm() {
  narrate('Les confirmations', "La course recommence aussitôt pour le bloc suivant, et d'autres blocs s'ajoutent après celui de Léa…", '', false);
  for (const miner of MINERS) miner.setStatus(null);
  for (let k = 0; k < NEXT_PAYMENTS.length; k++) {
    const origin = mempoolSlot(1);
    await writeBlock(bitcoin, {
      index: 970414 + k, title: `BLOC N°970 ${414 + k}`, records: NEXT_PAYMENTS[k], sources: NEXT_PAYMENTS[k].map(() => origin), fast: true, noun: 'transactions',
    });
    confirmPill.setText(`${k + 2} confirmations`, GREEN);
  }
  live('');
  // Le bar voit le paiement confirmé : il sert la bière.
  await frame(22.2, 4.4, 1.8);
  paidPill.visible = true;
  await tween(1.6, (k) => glass.userData.fill(k));
  splash(glass.position.clone().add(v(0, 0.6, 0)), [0x8ecae6, 0xcdb4db, 0xffd97d, 0x95d5b2]);
  $('w-balance').textContent = `${number(BALANCE - PRICE - FEE)} satoshis`;
  $('stepper').lastElementChild.classList.add('done');
  narrate('Payé. Santé !',
    `Chaque bloc ajouté par-dessus est une <b>confirmation</b> de plus. Pour annuler le paiement, il faudrait refaire le minage de tous ces blocs plus vite que le reste du monde : c'est ce qui rend la blockchain si difficile à falsifier. Le bar voit 3 confirmations et sert la bière.${tip("Tu peux encore ouvrir n'importe quel bloc en cliquant dessus.")}`, 'ok');
}

/** Deux blocs Bitcoin sont déjà là au départ : la chaîne existe depuis 2009. */
function seedBitcoin() {
  let prev = mineNow({ index: 970410, prev: '', data: 'avant', nonce: 0, hash: '' }).hash;
  const seeds = [
    ['Luc → Emma : 12 000 sats', 'Ali → Rose : 640 sats', 'Yan → Chloé : 30 500 sats'],
    ['Jade → Théo : 5 000 sats', 'Nina → Axel : 77 000 sats', 'Enzo → Léna : 900 sats'],
  ];
  seeds.forEach((records, i) => {
    const index = 970411 + i;
    const model = mineNow({ index, title: `BLOC N°970 ${411 + i}`, data: records.join('\n'), prev, nonce: 0, hash: '' });
    bitcoin.addBlock(model);
    bitcoin.commit(model);
    if (i) bitcoin.addLink(i - 1);
    prev = model.hash;
  });
  for (const copy of bitcoin.copies) copy.setCount(bitcoin.network.length);
}

const BEATS = [
  { label: 'Découvrir le réseau', run: introNetwork },
  { label: 'Commencer le voyage ▶', run: sceneField },
  { label: 'Écrire dans la blockchain', run: () => record(0) },
  { label: "C'est quoi, une empreinte ?", run: hashLesson },
  { label: 'Direction la brasserie ▶', run: sceneBrewery },
  { label: 'Écrire dans la blockchain', run: () => record(1) },
  { label: 'Le camion part ▶', run: sceneRoad },
  { label: 'Écrire dans la blockchain', run: () => record(2) },
  { label: 'Continuer le voyage ▶', run: sceneBar },
  { label: 'Écrire dans la blockchain', run: () => record(3) },
  { label: 'Léa arrive en terrasse ▶', run: payOrder },
  { label: 'Ouvrir son portefeuille', run: payWallet },
  { label: 'Préparer la transaction', run: payTransaction },
  { label: 'Signer avec la clé privée', run: paySign },
  { label: 'Envoyer au réseau', run: payBroadcast },
  { label: 'Qui écrit le prochain bloc ?', run: minersIntro },
  { label: 'Lancer la course des mineurs', run: payMine },
  { label: 'Attendre les confirmations', run: payConfirm },
];

async function play() {
  for (const beat of BEATS) {
    await new Promise((resolve) => { pending = { label: beat.label, resolve }; refreshButtons(); });
    busy = true;
    refreshButtons();
    await beat.run();
    busy = false;
    refreshButtons();
  }
  await new Promise((resolve) => { pending = { label: 'Rejouer le voyage', resolve }; refreshButtons(); });
  window.location.reload();
}

// ---------------------------------------------------------------------------
// Vue éclatée d'un bloc
// ---------------------------------------------------------------------------
const focusModel = () => focus.ledger.chain[focus.index];
const focusBlock = () => focus.ledger.blocks[focus.index];
const isBitcoin = () => focus.ledger === bitcoin;

/** Texte court affiché dans l'étiquette de chaque partie : [valeur, phrase]. */
function calloutContent(model, key) {
  if (key === 'data') {
    const count = model.data.split('\n').length;
    return [model.data, isBitcoin() ? `${count} transactions rangées dans ce bloc.` : `${count} enregistrements rangés dans ce bloc.`];
  }
  if (key === 'prev') {
    return model.prev === NO_PARENT
      ? ['aucun parent', "C'est le premier bloc de la chaîne : on met des zéros."]
      : [short(model.prev), "L'empreinte du bloc précédent, recopiée ici : c'est le maillon."];
  }
  if (key === 'nonce') return [String(model.nonce), 'Le nombre trouvé par le minage pour sceller le bloc.'];
  return proofOk(model)
    ? [short(model.hash), 'Le code calculé à partir des trois cases du dessus.']
    : [short(model.hash), "Elle a changé et ne commence plus par « 00 » : le bloc n'est plus valide."];
}

/** Explication détaillée, affichée dans le panneau quand on clique sur une partie. */
const DETAILS = {
  data: (m) => {
    const lines = m.data.split('\n');
    const what = isBitcoin() ? 'transactions' : 'enregistrements';
    return `<b>Les données.</b> C'est ce que l'on veut garder pour toujours. Ce bloc regroupe ${lines.length} ${what} : ${lines.map((line) => `« ${escapeHtml(line)} »`).join(', ')}. Dans le vrai Bitcoin, un bloc contient plusieurs milliers de transactions.`;
  },
  prev: (m) => (m.prev === NO_PARENT
    ? "<b>L'empreinte du parent.</b> Chaque bloc recopie ici l'empreinte du bloc d'avant. Celui-ci est le tout premier : il n'a pas de parent, alors on écrit des zéros."
    : "<b>L'empreinte du parent.</b> C'est l'empreinte du bloc précédent, recopiée ici. Elle attache ce bloc à celui d'avant : si quelqu'un modifie le bloc précédent, son empreinte change et ne correspond plus à celle-ci. La triche se voit tout de suite."),
  nonce: (m) => `<b>Le nonce.</b> Un simple nombre, sans signification. Pour sceller le bloc, on a essayé 0, 1, 2, 3… jusqu'à ${number(m.nonce)} : c'est le premier nombre qui donne une empreinte commençant par « 00 ». Cette recherche s'appelle le <b>minage</b> : longue à faire, mais très rapide à vérifier.`,
  hash: () => `<b>L'empreinte du bloc</b> (en anglais, <i>hash</i>). Un code de 64 caractères, calculé à partir des trois cases du dessus. C'est la signature du bloc : si une seule lettre change là-haut, ce code change entièrement.${tip('Essaie : change un chiffre dans les données, juste en dessous.')}`,
};

// Les 4 étiquettes HTML de la vue éclatée, reliées aux parties du bloc par un trait.
const SVG = 'http://www.w3.org/2000/svg';
const callouts = PARTS.map((part) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'callout';
  button.style.setProperty('--c', part.color);
  const name = document.createElement('strong');
  name.textContent = part.name;
  const value = document.createElement('code');
  if (part.key === 'data') value.className = 'lines';
  const text = document.createElement('span');
  button.append(name, value, text);
  button.addEventListener('click', () => selectPart(part.key));
  $('callouts').append(button);
  const line = document.createElementNS(SVG, 'line');
  const dot = document.createElementNS(SVG, 'circle');
  dot.setAttribute('r', 4);
  $('leaders').append(line, dot);
  return { key: part.key, button, value, text, line, dot };
});

function fillCallouts() {
  const model = focusModel();
  for (const callout of callouts) {
    const [value, text] = calloutContent(model, callout.key);
    callout.value.textContent = value;
    callout.text.textContent = text;
    callout.button.classList.toggle('changed', callout.key === 'hash' && model.hash !== focus.ledger.network[focus.index].hash);
  }
}

/** Place les étiquettes en colonne à droite du bloc, chacune à la hauteur de sa partie. */
function updateCallouts() {
  const block = focusBlock();
  const width = stage.clientWidth, height = stage.clientHeight;
  block.group.updateMatrixWorld(true);
  const points = callouts.map((callout) => {
    const p = block.anchor(callout.key, 1, 0).project(camera);
    return { x: (p.x * 0.5 + 0.5) * width, y: (-p.y * 0.5 + 0.5) * height };
  });
  const boxWidth = callouts[0].button.offsetWidth;
  const column = Math.min(width - boxWidth - 10, Math.max(...points.map((p) => p.x)) + 56);

  // Chaque étiquette vise la hauteur de sa partie, sans chevaucher la précédente ni sortir de l'écran.
  const tops = [];
  callouts.forEach((callout, i) => {
    const wanted = points[i].y - callout.button.offsetHeight / 2;
    tops.push(i ? Math.max(wanted, tops[i - 1] + callouts[i - 1].button.offsetHeight + 8) : Math.max(54, wanted));
  });
  const overflow = Math.max(0, tops.at(-1) + callouts.at(-1).button.offsetHeight - (height - 54));
  callouts.forEach((callout, i) => {
    const top = tops[i] - overflow;
    callout.button.style.transform = `translate(${column}px, ${top}px)`;
    callout.line.setAttribute('x1', points[i].x);
    callout.line.setAttribute('y1', points[i].y);
    callout.line.setAttribute('x2', column);
    callout.line.setAttribute('y2', top + callout.button.offsetHeight / 2);
    callout.dot.setAttribute('cx', points[i].x);
    callout.dot.setAttribute('cy', points[i].y);
  });
}

function selectPart(key) {
  if (!focus) return;
  focusBlock().lifted = key;
  for (const callout of callouts) callout.button.classList.toggle('active', callout.key === key);
  const model = focusModel();
  const title = `${model.title} : vue éclatée`;
  if (key) narrate(title, DETAILS[key](model), '', false);
  else {
    narrate(title, `Un bloc est toujours fait de <b>4 parties</b>. Les voici séparées.${tip('Clique sur une partie, ou sur son étiquette, pour comprendre à quoi elle sert.')}`, '', false);
  }
}

async function openFocus(target) {
  if (busy || focus || ask) return;
  busy = true;
  focus = target;
  savedView = { target: controls.target.clone(), position: camera.position.clone() };
  const block = focusBlock();
  // On ne garde que ce bloc à l'écran.
  for (const ledger of ledgers) {
    for (const other of ledger.blocks) other.group.visible = other === block;
    for (const link of ledger.links) if (link) link.group.visible = false;
  }
  confirmPill.material.opacity = 0;
  ring.visible = true;
  $('focus-name').textContent = block.model.title.toLowerCase();
  $('focus-edit').value = block.model.data;
  fillCallouts();
  selectPart(null);
  refreshButtons();

  // Le bloc se place à gauche de l'écran, pour laisser la place aux étiquettes à droite.
  const x = focus.ledger.x(focus.index);
  await Promise.all([
    flyTo(v(x + FOCUS_DISTANCE * tanH() * 0.36, BLOCK_Y + 1.18, SHELF_Z), FOCUS_DISTANCE, { azimuth: 0.3, elevation: 0.1, duration: 1 }),
    tween(0.9, (k) => { explode = k; }, ease.back),
  ]);
  explode = 1;
  $('callouts').hidden = false;
  busy = false;
  refreshButtons();
}

async function closeFocus() {
  if (!focus || busy) return;
  busy = true;
  refreshButtons();
  $('callouts').hidden = true;
  ring.visible = false;
  const block = focusBlock();
  block.lifted = null;
  await Promise.all([
    flyToPosition(savedView.target, savedView.position, 0.9),
    tween(0.6, (k) => { explode = 1 - k; }),
  ]);
  explode = 0;
  block.layout(0);
  for (const ledger of ledgers) {
    for (const other of ledger.blocks) other.group.visible = true;
    for (const link of ledger.links) if (link) link.group.visible = true;
  }
  confirmPill.material.opacity = 1;
  focus = null;
  busy = false;
  if (tamperedLedger()) narrateTampered();
  else narrate(story.title, story.html, story.tone);
  refreshButtons();
}

// ---------------------------------------------------------------------------
// Tricher sur un bloc, puis faire vérifier
// ---------------------------------------------------------------------------
function editBlock(text) {
  if (!focus || busy) return;
  const { ledger, index } = focus;
  const model = ledger.chain[index];
  const original = ledger.network[index];
  model.data = text;
  model.hash = hashBlock(model);      // le contenu change, donc l'empreinte change
  focusBlock().redraw(['data', 'hash']);
  ledger.refresh();
  fillCallouts();
  focusBlock().lifted = 'hash';
  for (const callout of callouts) callout.button.classList.toggle('active', callout.key === 'hash');

  if (model.hash === original.hash) {
    narrate("Retour à l'original", 'Exactement le même contenu donne exactement la même empreinte : le bloc est de nouveau valide.', 'ok', false);
    return;
  }
  const after = index < ledger.chain.length - 1 ? " Le bloc suivant contient toujours l'ancienne empreinte : la chaîne est cassée." : '';
  narrate("L'empreinte a changé",
    `Tu as modifié les données, donc l'empreinte du bloc n'est plus la même${proofOk(model) ? '' : ' et ne commence plus par « 00 »'}.${after}${tip('Referme le bloc pour voir le résultat sur la chaîne.')}`, 'warn', false);
  live(`Avant : ${original.hash.slice(0, 20)}…\nAprès : ${model.hash.slice(0, 20)}…`);
}

function narrateTampered() {
  const ledger = tamperedLedger();
  narrate('La chaîne est cassée',
    `Le ${ledger.chain[ledger.bad].title.toLowerCase()} ne correspond plus à ce que les autres ont enregistré.${tip('Fais vérifier la chaîne, ou annule ta modification.')}`, 'warn', false);
}

function undo() {
  if (busy) return;
  tamperedLedger()?.restore();
  narrate(story.title, story.html, story.tone);
  refreshButtons();
}

async function verify() {
  const ledger = tamperedLedger();
  if (!ledger) return;
  busy = true;
  refreshButtons();
  const back = { ...lastFrame };
  const bad = ledger.bad;
  const isTrace = ledger === trace;
  const who = isTrace ? 'acteurs' : 'nœuds';
  narrate('Vérification en cours', `Chaque ${isTrace ? 'acteur' : 'nœud'} compare ce bloc avec sa propre copie de la chaîne.`, '', false);
  await frame(ledger.x((ledger.chain.length - 1) / 2), isTrace ? 11.5 : 10);
  lastFrame = back;
  scene.updateMatrixWorld(true);
  const to = ledger.blocks[bad].anchor('data', 0, 1);
  // Dans la traçabilité, l'auteur du bloc est celui qui triche : ce sont les autres qui jugent.
  const judges = ledger.copies.filter((_, i) => !(isTrace && i === bad));
  await Promise.all(judges.map(async (copy, i) => {
    await wait(i * 0.3);
    await flyOrb(scene, copy.point, to, { color: 0xd9a400, duration: 1.1, arc: 2.2 });
    copy.setCount(ledger.network.length, bad);
  }));
  narrate('Triche détectée',
    `Les ${judges.length} autres ${who} ont tous la même version du ${ledger.chain[bad].title.toLowerCase()}. La copie modifiée est la seule à dire autre chose : <b>elle est refusée</b>. Dans une blockchain, c'est la version partagée par la majorité qui compte.`, 'bad', false);
  await question('Réparer la copie');

  ledger.restore();
  narrate('La copie est réparée',
    "Elle a été remplacée par la version du réseau : rien n'a été effacé. C'est ça, l'<b>immutabilité</b> : on peut modifier sa propre copie, mais pas faire accepter le mensonge aux autres.", 'ok', false);
  await question("Reprendre l'histoire");

  narrate(story.title, story.html, story.tone);
  await frame(back.x, back.half);
  busy = false;
  refreshButtons();
}

// ---------------------------------------------------------------------------
// L'explorateur de blocs : la blockchain sous sa forme lisible, un tableau
// ---------------------------------------------------------------------------
/** Pastille colorée pour une empreinte : la même empreinte a toujours la même couleur. */
function hashChip(hash) {
  const chip = document.createElement('span');
  chip.className = 'chip';
  if (hash === NO_PARENT) {
    chip.textContent = 'aucun (premier bloc)';
    return chip;
  }
  chip.textContent = short(hash, 10);
  chip.style.background = `hsl(${parseInt(hash.slice(-6), 16) % 360} 75% 86%)`;
  return chip;
}

function ledgerTable(ledger, title, where) {
  const section = document.createElement('section');
  const heading = document.createElement('h3');
  heading.textContent = title;
  const intro = document.createElement('p');
  intro.className = 'hint';
  intro.textContent = where;
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Bloc</th><th>Données</th><th>Empreinte du parent</th><th>Nonce</th><th>Empreinte du bloc</th></tr></thead>';
  const body = document.createElement('tbody');
  for (const block of ledger.network) {
    const row = document.createElement('tr');
    const cell = (content) => {
      const td = document.createElement('td');
      td.append(content);
      row.append(td);
      return td;
    };
    cell(block.title.replace('BLOC ', ''));
    cell(block.data).className = 'lines';
    cell(hashChip(block.prev));
    cell(number(block.nonce));
    cell(hashChip(block.hash));
    body.append(row);
  }
  table.append(body);
  section.append(heading, intro, table);
  return section;
}

function openExplorer() {
  const body = $('explorer-body');
  body.replaceChildren();
  if (trace.network.length) {
    body.append(ledgerTable(trace, 'Blockchain de traçabilité',
      'Rangée sur 4 ordinateurs : ceux de la ferme, de la brasserie, du transporteur et du bar. Chacun en a une copie complète.'));
  } else {
    const empty = document.createElement('p');
    empty.textContent = "La blockchain de traçabilité est encore vide : aucune étape n'a écrit de bloc.";
    body.append(empty);
  }
  body.append(ledgerTable(bitcoin, 'Blockchain Bitcoin (les derniers blocs)',
    "Rangée sur des milliers d'ordinateurs dans le monde. Elle compte plus de 900 000 blocs depuis 2009 : on n'en montre ici que la fin."));
  $('explorer').showModal();
}

// ---------------------------------------------------------------------------
// Clics dans la scène
// ---------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pressed = null;

/** Renvoie ce qu'il y a sous la souris : un bloc (hors vue éclatée) ou une partie du bloc ouvert. */
function pick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  if (focus) {
    const hit = raycaster.intersectObjects(Object.values(focusBlock().slabs), true)[0];
    let object = hit?.object;
    while (object && !object.userData.part) object = object.parent;
    return object ? { part: object.userData.part } : null;
  }
  const groups = ledgers.flatMap((ledger) => ledger.blocks.slice(0, ledger.chain.length).map((block) => block.group));
  const hit = raycaster.intersectObjects(groups, true)[0];
  let object = hit?.object;
  while (object && !object.userData.pick) object = object.parent;
  return object ? { block: object.userData.pick } : null;
}

renderer.domElement.addEventListener('pointerdown', (event) => { pressed = [event.clientX, event.clientY]; });
renderer.domElement.addEventListener('pointerup', (event) => {
  if (!pressed) return;
  const moved = Math.hypot(event.clientX - pressed[0], event.clientY - pressed[1]);
  pressed = null;
  if (moved > 6 || busy) return;        // c'était un glissé pour tourner la vue, pas un clic
  const target = pick(event);
  if (target?.part) selectPart(target.part);
  else if (target?.block) openFocus(target.block);
});
renderer.domElement.addEventListener('pointermove', (event) => {
  renderer.domElement.style.cursor = !busy && !ask && pick(event) ? 'pointer' : 'grab';
});

// ---------------------------------------------------------------------------
// Branchement des boutons
// ---------------------------------------------------------------------------
$('stepper').replaceChildren(...STAGES.map((info) => {
  const item = document.createElement('li');
  const icon = document.createElement('span');
  icon.textContent = info.icon;
  item.append(icon, info.name);
  return item;
}));

$('next').addEventListener('click', () => {
  if (ask) {
    const { resolve } = ask;
    ask = null;
    refreshButtons();
    resolve();
  } else if (busy) return;
  else if (tamperedLedger()) verify();
  else if (pending) {
    const { resolve } = pending;
    pending = null;
    resolve();
  }
});
$('undo').addEventListener('click', undo);
$('close').addEventListener('click', closeFocus);
$('focus-edit').addEventListener('input', (event) => editBlock(event.target.value));
$('tx-amount').addEventListener('input', (event) => tamperTransaction(event.target.value));
$('lab-text').addEventListener('input', updateLab);
$('view-table').addEventListener('click', openExplorer);
$('explorer-close').addEventListener('click', () => $('explorer').close());
$('view-all').addEventListener('click', overview);
$('view-reset').addEventListener('click', () => frame(lastFrame.x, lastFrame.half));
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeFocus(); });

// ---------------------------------------------------------------------------
// Démarrage
// ---------------------------------------------------------------------------
seedBitcoin();
new ResizeObserver(resize).observe(stage);
resize();
setStage(0);
$('clock').textContent = 'Juillet 2026';
renderHistory();
narrate('Du champ au verre : suivons une bière',
  "À chaque étape de sa fabrication, des informations sont écrites dans une <b>blockchain</b> : un registre numérique partagé entre la ferme, la brasserie, le transporteur et le bar. Personne ne peut le modifier dans son coin. À la fin, Léa paiera sa bière en bitcoin, et on verra comment ça marche. Mais d'abord : une blockchain, c'est rangé où ?");
play();

let lastTime = performance.now();
renderer.setAnimationLoop((now) => {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const time = now / 1000;
  updateTweens(dt);
  updateMining(dt);

  // Petites animations permanentes du décor.
  decor.animateBubbles(brewery, time, brewing);
  if (racing) for (const miner of MINERS) for (const fan of miner.fans) fan.rotation.y += dt * 22;
  alertPill.position.x = truck.position.x - 0.3;
  if (key.visible) key.position.y += Math.sin(time * 2.2) * 0.0012;

  if (focus) {
    focusBlock().layout(explode, time);
    ring.position.set(focus.ledger.x(focus.index), BLOCK_Y + 1.18 + Math.sin(time * 0.9) * 2.4, SHELF_Z);
  }
  controls.update();
  renderer.render(scene, camera);
  if (focus && !$('callouts').hidden) updateCallouts();
});
