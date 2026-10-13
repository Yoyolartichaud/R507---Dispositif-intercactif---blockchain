// Les objets 3D liés à la blockchain, dans le style « Maquette » : blocs pastel arrondis, fond clair.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { tween } from './anim.js';
import { DIFFICULTY } from './blockchain.js';

export const W = 2.4;        // largeur d'un bloc
export const DEPTH = 0.7;    // épaisseur d'un bloc
export const STAND = 0.3;    // hauteur du socle
const GAP = 0.07;            // espace entre deux parties d'un bloc
const PX = 220;              // pixels de texture par unité 3D

const SANS = 'system-ui, "Segoe UI", sans-serif';
const MONO = 'Consolas, "Cascadia Mono", monospace';
const INK = '#1f2a44';
const MUTED = '#55607d';

// Un bloc = quatre parties empilées, chacune avec sa couleur. Ce code couleur ne change jamais.
export const PARTS = [
  { key: 'data',  name: 'Données',             label: 'DONNÉES',             h: 1.15, color: '#8ecae6' },
  { key: 'prev',  name: 'Empreinte du parent', label: 'EMPREINTE DU PARENT', h: 0.62, color: '#cdb4db' },
  { key: 'nonce', name: 'Nonce',               label: 'NONCE',               h: 0.5,  color: '#ffd97d' },
  { key: 'hash',  name: 'Empreinte du bloc',   label: 'EMPREINTE DU BLOC',   h: 0.62, color: '#95d5b2' },
];
export const BLOCK_H = PARTS.reduce((sum, part) => sum + part.h, 0) + GAP * (PARTS.length - 1);

// États possibles d'un bloc : texte du badge, couleur du texte, couleur du socle.
export const STATES = {
  ok:       { text: '✔ valide',         ink: '#1b7f5c', base: 0xb7e4c7 },
  edited:   { text: '✎ modifié',        ink: '#9a6700', base: 0xffe29a },
  bad:      { text: '✖ lien rompu',     ink: '#c0392b', base: 0xf5a3a0 },
  building: { text: 'en construction…', ink: '#55607d', base: 0xdcd7cc },
};

export function canvasTexture(width, height, anisotropy = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return { canvas, texture, g: canvas.getContext('2d') };
}

export function wrap(g, text, max) {
  const lines = [];
  for (const paragraph of String(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const test = line ? `${line} ${word}` : word;
      if (g.measureText(test).width > max && line) { lines.push(line); line = word; } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

/** Étiquette en forme de pilule, toujours tournée vers la caméra. */
export function makePill(text, ink = INK) {
  const { canvas, texture, g } = canvasTexture(512, 96);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(2.56, 0.48, 1);
  sprite.setText = (value, color = ink) => {
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.font = `700 38px ${SANS}`;
    const width = Math.min(500, g.measureText(value).width + 56);
    g.beginPath(); g.roundRect((512 - width) / 2, 8, width, 80, 40);
    g.fillStyle = '#ffffff'; g.fill();
    g.lineWidth = 4; g.strokeStyle = color; g.stroke();
    g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(value, 256, 50, 440);
    texture.needsUpdate = true;
  };
  sprite.setText(text);
  return sprite;
}

/** Un bloc de la chaîne. `model` contient ses valeurs : index, data, prev, nonce, hash. */
export class Block3D {
  constructor(model, anisotropy = 4) {
    this.model = model;
    this.state = 'ok';
    this.prevBroken = false;   // vrai si l'empreinte du parent ne correspond plus au bloc d'avant
    this.amount = 0;           // 0 = bloc fermé, 1 = vue éclatée
    this.lifted = null;        // partie mise en avant dans la vue éclatée
    this.group = new THREE.Group();
    this.slabs = {};

    let y = BLOCK_H / 2;
    for (const part of PARTS) {
      const slab = new THREE.Group();
      slab.userData.baseY = y - part.h / 2;
      slab.userData.part = part.key;
      slab.position.y = slab.userData.baseY;

      const body = new THREE.Mesh(
        new RoundedBoxGeometry(W, part.h, DEPTH, 3, 0.14),
        new THREE.MeshStandardMaterial({ color: part.color, roughness: 0.9 }),
      );
      body.castShadow = body.receiveShadow = true;

      // La face avant porte le texte, dessiné sur un canvas 2D.
      const fw = W - 0.28, fh = part.h - 0.16;
      const face = canvasTexture(fw * PX, fh * PX, anisotropy);
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), new THREE.MeshBasicMaterial({ map: face.texture, transparent: true }));
      plane.position.z = DEPTH / 2 + 0.004;

      slab.add(body, plane);
      slab.userData.face = face;
      this.group.add(slab);
      this.slabs[part.key] = slab;
      y -= part.h + GAP;
    }

    this.base = new THREE.Mesh(
      new RoundedBoxGeometry(W + 0.5, STAND, 1.3, 3, 0.1),
      new THREE.MeshStandardMaterial({ color: STATES.ok.base, roughness: 0.9 }),
    );
    this.base.position.y = -BLOCK_H / 2 - STAND / 2;
    this.base.castShadow = this.base.receiveShadow = true;

    this.badge = makePill(STATES.ok.text, STATES.ok.ink);
    this.badge.position.y = BLOCK_H / 2 + 0.5;

    this.group.add(this.base, this.badge);
    this.redraw();
  }

  /** Change l'état du bloc : couleur du socle, badge et couleur des textes. */
  setState(state, prevBroken = false) {
    if (state === this.state && prevBroken === this.prevBroken) return;
    this.state = state;
    this.prevBroken = prevBroken;
    this.base.material.color.set(STATES[state].base);
    this.badge.setText(STATES[state].text, STATES[state].ink);
    this.redraw();
  }

  /** Redessine le texte des parties demandées (toutes par défaut). */
  redraw(keys) {
    for (const part of PARTS) if (!keys || keys.includes(part.key)) this.#draw(part);
  }

  #draw(part) {
    const { canvas, texture, g } = this.slabs[part.key].userData.face;
    const w = canvas.width, h = canvas.height;
    const m = this.model;
    const pad = 26;
    const valueY = h * 0.68;

    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(255, 255, 255, .95)';
    g.beginPath(); g.roundRect(0, 0, w, h, 18); g.fill();

    g.textBaseline = 'middle';
    g.textAlign = 'left';
    const labelY = part.key === 'nonce' ? h / 2 : Math.min(30, h * 0.27);
    g.font = `700 22px ${SANS}`;
    g.fillStyle = MUTED;
    g.fillText(part.label, pad, labelY);

    g.fillStyle = INK;
    if (part.key === 'nonce') {
      g.textAlign = 'right';
      g.font = `700 36px ${MONO}`;
      g.fillText(m.nonce === null ? '?' : String(m.nonce), w - 24, h / 2 + 1);
    } else if (part.key === 'data') {
      g.textAlign = 'right';
      g.font = `800 26px ${SANS}`;
      g.fillText(m.title ?? `BLOC N°${m.index}`, w - 22, labelY);
      g.textAlign = 'left';
      g.font = `600 27px ${SANS}`;
      if (!m.data) {
        g.fillStyle = '#9aa3b8';
        g.fillText('(vide)', pad, h * 0.44);
      } else {
        // Un bloc regroupe plusieurs enregistrements : un par ligne, précédé d'une puce.
        const ink = this.state === 'edited' ? STATES.edited.ink : INK;
        m.data.split('\n').slice(0, 3).forEach((line, i) => {
          const y = h * 0.42 + i * 44;
          g.fillStyle = '#3a86c8';
          g.beginPath(); g.arc(pad + 7, y, 7, 0, Math.PI * 2); g.fill();
          g.fillStyle = ink;
          g.fillText(line, pad + 24, y, w - pad - 40);
        });
      }
    } else if (part.key === 'prev') {
      g.font = `700 34px ${MONO}`;
      if (this.prevBroken) g.fillStyle = STATES.bad.ink;
      g.fillText(m.prev ? `${m.prev.slice(0, 10)}…` : '?', pad, valueY);
    } else {
      // Empreinte du bloc : ses premiers caractères doivent être des zéros (vert si oui, rouge sinon).
      g.font = `700 34px ${MONO}`;
      if (!m.hash) g.fillText('?', pad, valueY);
      else {
        const cw = g.measureText('0').width;
        [...`${m.hash.slice(0, 10)}…`].forEach((ch, i) => {
          g.fillStyle = i < DIFFICULTY ? (ch === '0' ? STATES.ok.ink : STATES.bad.ink) : INK;
          g.fillText(ch, pad + i * cw, valueY);
        });
      }
    }
    texture.needsUpdate = true;
  }

  /**
   * Vue éclatée : `amount` va de 0 (bloc fermé) à 1 (parties écartées).
   * `time` fait flotter doucement les parties.
   */
  layout(amount, time = 0) {
    this.amount = amount;
    PARTS.forEach((part, i) => {
      const slab = this.slabs[part.key];
      const side = i % 2 ? 1 : -1;
      const lift = ((PARTS.length - 1 - i) * 0.62 + 0.25) * amount;
      const float = Math.sin(time * 1.4 + i * 1.3) * 0.04 * amount;
      const pop = this.lifted === part.key ? 0.5 * amount : 0;
      slab.position.set(side * 0.28 * amount, slab.userData.baseY + lift + float, (i - 1.5) * 0.3 * amount + pop);
      slab.rotation.y = -side * 0.13 * amount;
    });
    this.badge.material.opacity = 1 - amount;
  }

  /** Point dans le monde, sur une partie du bloc. sx : -1 bord gauche, 0 centre, 1 bord droit. sz : 1 = devant. */
  anchor(key, sx = 0, sz = 0) {
    return this.slabs[key].localToWorld(new THREE.Vector3((sx * W) / 2, 0, sz * (DEPTH / 2 + 0.15)));
  }
}

/** Lien entre l'empreinte d'un bloc et la case « empreinte du parent » du bloc suivant. */
export class Link {
  constructor(from, to) {
    this.group = new THREE.Group();
    const dx = (to.x - from.x) * 0.5;
    const curve = new THREE.CubicBezierCurve3(
      from, from.clone().add(new THREE.Vector3(dx, 0, 0)), to.clone().add(new THREE.Vector3(-dx, 0, 0)), to,
    );
    this.material = new THREE.MeshStandardMaterial({ color: 0x6c8ea4, roughness: 0.6 });
    const piece = (a, b) => {
      const points = [];
      for (let i = 0; i <= 16; i++) points.push(curve.getPoint(a + ((b - a) * i) / 16));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 0.1, 10), this.material);
      mesh.castShadow = true;
      this.group.add(mesh);
      return mesh;
    };
    this.whole = piece(0, 1);
    // Version rompue : deux moitiés séparées par un vide, avec un bout arrondi.
    this.broken = [piece(0, 0.4), piece(0.6, 1)];
    for (const t of [0.4, 0.6]) {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), this.material);
      tip.position.copy(curve.getPoint(t));
      this.group.add(tip);
      this.broken.push(tip);
    }
    this.setBroken(false);
  }

  setBroken(isBroken) {
    this.whole.visible = !isBroken;
    for (const mesh of this.broken) mesh.visible = isBroken;
    this.material.color.set(isBroken ? 0xc0392b : 0x6c8ea4);
  }
}

/** Carte portant le message d'un capteur, avant qu'il n'entre dans un bloc. */
export function makeCard(text, anisotropy = 4, color = 0x8ecae6) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(2.7, 0.8, 0.12, 2, 0.05),
    new THREE.MeshStandardMaterial({ color, roughness: 0.9 }),
  );
  body.castShadow = true;
  const face = canvasTexture(2.54 * PX, 0.66 * PX, anisotropy);
  const { g, canvas } = face;
  g.fillStyle = 'rgba(255, 255, 255, .95)';
  g.beginPath(); g.roundRect(0, 0, canvas.width, canvas.height, 14); g.fill();
  g.font = `600 32px ${SANS}`;
  g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
  const lines = wrap(g, text, canvas.width - 40).slice(0, 2);
  lines.forEach((line, i) => g.fillText(line, canvas.width / 2, canvas.height / 2 + (i - (lines.length - 1) / 2) * 40));
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.54, 0.66), new THREE.MeshBasicMaterial({ map: face.texture, transparent: true }));
  plane.position.z = 0.064;
  group.add(body, plane);
  return group;
}

/** La copie de la chaîne que garde un acteur : son nom, et un petit cube par bloc reçu. */
export class Copy {
  constructor(name) {
    this.name = name;
    this.group = new THREE.Group();
    const pill = makePill(name, MUTED);
    pill.scale.multiplyScalar(0.72);
    this.pill = pill;
    this.cubes = new THREE.Group();
    this.cubes.position.y = 0.42;
    this.geometry = new RoundedBoxGeometry(0.26, 0.26, 0.26, 2, 0.05);
    this.group.add(pill, this.cubes);
  }

  /** Affiche `count` cubes ; celui de rang `badIndex` (à partir de 0) est colorié en rouge. */
  setCount(count, badIndex = -1) {
    for (const cube of [...this.cubes.children]) { this.cubes.remove(cube); cube.material.dispose(); }
    for (let i = 0; i < count; i++) {
      const cube = new THREE.Mesh(this.geometry, new THREE.MeshStandardMaterial({ color: i === badIndex ? 0xf28482 : 0x95d5b2, roughness: 0.9 }));
      cube.position.x = (i - (count - 1) / 2) * 0.32;
      cube.castShadow = true;
      this.cubes.add(cube);
    }
  }

  /** Affiche un court message à la place du nom, puis remet le nom. */
  flash(text, color, seconds = 1.8) {
    this.pill.setText(text, color);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.pill.setText(this.name, MUTED), seconds * 1000);
  }

  get point() {
    return this.group.localToWorld(new THREE.Vector3(0, 0.45, 0));
  }
}

/** La grande carte d'une transaction bitcoin : qui paie qui, combien, et la signature. */
export class TxCard {
  constructor(anisotropy = 4) {
    this.group = new THREE.Group();
    const body = new THREE.Mesh(
      new RoundedBoxGeometry(3.7, 2.35, 0.12, 2, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffd97d, roughness: 0.9 }),
    );
    body.castShadow = true;
    this.face = canvasTexture(3.5 * PX, 2.15 * PX, anisotropy);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.15), new THREE.MeshBasicMaterial({ map: this.face.texture, transparent: true }));
    plane.position.z = 0.064;
    this.group.add(body, plane);
  }

  /** status : 'none' (pas signée), 'ok' (signature valide) ou 'bad' (signature qui ne correspond plus). */
  draw({ from, to, amount, fee, signature, status }) {
    const { canvas, texture, g } = this.face;
    const w = canvas.width, h = canvas.height;
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(255, 255, 255, .96)';
    g.beginPath(); g.roundRect(0, 0, w, h, 20); g.fill();
    g.textBaseline = 'middle';
    g.textAlign = 'left';

    g.font = `700 24px ${SANS}`;
    g.fillStyle = MUTED;
    g.fillText('TRANSACTION', 30, 38);

    [['De', from], ['À', to], ['Montant', amount], ['Frais', fee]].forEach(([label, value], i) => {
      const y = 100 + i * 58;
      g.font = `700 23px ${SANS}`;
      g.fillStyle = MUTED;
      g.fillText(label, 30, y);
      g.font = `600 30px ${SANS}`;
      g.fillStyle = INK;
      g.fillText(value, 170, y, w - 200);
    });

    g.strokeStyle = '#d9dee8'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(30, 326); g.lineTo(w - 30, 326); g.stroke();
    g.font = `700 23px ${SANS}`;
    g.fillStyle = MUTED;
    g.fillText('SIGNATURE', 30, 366);
    if (status === 'none') {
      g.font = `600 28px ${SANS}`;
      g.fillStyle = '#9aa3b8';
      g.fillText('pas encore signée', 30, 420);
    } else if (status === 'ok') {
      g.font = `700 28px ${MONO}`;
      g.fillStyle = STATES.ok.ink;
      g.fillText(`${signature.slice(0, 22)}… ✔`, 30, 420, w - 60);
    } else {
      g.font = `700 28px ${SANS}`;
      g.fillStyle = STATES.bad.ink;
      g.fillText('✖ ne correspond plus à la transaction', 30, 420, w - 60);
    }
    texture.needsUpdate = true;
  }
}

/** Petite bille qui voyage d'un point à un autre : elle représente une information transmise. */
export function flyOrb(scene, from, to, { color = 0x6c8ea4, duration = 0.7, size = 0.14, arc = 1, cube = false } = {}) {
  const orb = new THREE.Mesh(
    // Un petit cube quand c'est la copie d'un bloc qui voyage, une bille sinon.
    cube ? new RoundedBoxGeometry(size * 2, size * 2, size * 2, 2, size * 0.3) : new THREE.SphereGeometry(size, 16, 16),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5, emissive: color, emissiveIntensity: 0.25 }),
  );
  orb.castShadow = true;
  orb.position.copy(from);
  scene.add(orb);
  return tween(duration, (k) => {
    orb.position.lerpVectors(from, to, k);
    orb.position.y += Math.sin(Math.PI * k) * arc;
  }).then(() => {
    scene.remove(orb);
    orb.geometry.dispose();
    orb.material.dispose();
  });
}

/**
 * Un ordinateur du réseau (un nœud). Son écran montre son nom, sa copie de la chaîne
 * (un carré par bloc) et un court message. Les mineurs ont en plus une grosse machine de calcul.
 */
export class Computer {
  constructor(name, anisotropy = 4, { miner = false } = {}) {
    this.name = name;
    this.count = 0;           // nombre de blocs dans sa copie
    this.bad = -1;            // rang d'un bloc en désaccord (colorié en rouge)
    this.status = null;       // message sous les carrés ; null = « sa copie : n blocs »
    this.group = new THREE.Group();
    const grey = new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.9 });

    // L'écran, incliné vers la caméra.
    this.head = new THREE.Group();
    const frame = new THREE.Mesh(
      new RoundedBoxGeometry(1.6, 1.0, 0.1, 3, 0.05),
      new THREE.MeshStandardMaterial({ color: miner ? 0xf4a261 : 0xb8c4d6, roughness: 0.8 }),
    );
    frame.castShadow = true;
    this.screen = canvasTexture(1.46 * 256, 0.86 * 256, anisotropy);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 0.86), new THREE.MeshBasicMaterial({ map: this.screen.texture }));
    plane.position.z = 0.052;
    this.head.add(frame, plane);
    this.head.rotation.x = -0.3;

    if (miner) {
      // La machine de minage : un gros boîtier avec deux ventilateurs.
      const rig = new THREE.Mesh(new RoundedBoxGeometry(1.4, 0.45, 0.75, 3, 0.06), new THREE.MeshStandardMaterial({ color: 0x3d405b, roughness: 0.7 }));
      rig.position.y = 0.225;
      rig.castShadow = rig.receiveShadow = true;
      this.group.add(rig);
      this.fans = [-0.35, 0.35].map((x) => {
        const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 6), grey);
        fan.rotation.x = Math.PI / 2;
        fan.position.set(x, 0.225, 0.39);
        this.group.add(fan);
        return fan;
      });
      this.head.position.y = 1.0;
    } else {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.06, 24), grey);
      foot.position.y = 0.03;
      foot.castShadow = true;
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 10), grey);
      neck.position.y = 0.2;
      this.group.add(foot, neck);
      this.head.position.y = 0.85;
    }
    this.group.add(this.head);
    this.redraw();
  }

  /** Nombre de blocs dans sa copie ; `bad` est le rang d'un bloc en désaccord. */
  setCount(count, bad = -1) {
    this.count = count;
    this.bad = bad;
    this.redraw();
  }

  /** Message affiché sous les carrés. Sans texte, on revient au nombre de blocs. */
  setStatus(text, color = MUTED) {
    this.status = text ? { text, color } : null;
    this.redraw();
  }

  /** Affiche un message quelques secondes, puis revient au nombre de blocs. */
  flash(text, color, seconds = 1.8) {
    this.setStatus(text, color);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setStatus(null), seconds * 1000);
  }

  redraw() {
    const { canvas, texture, g } = this.screen;
    const w = canvas.width;
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, w, canvas.height);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = INK;
    g.font = `800 34px ${SANS}`;
    g.fillText(this.name, w / 2, 36, w - 20);

    // Sa copie de la chaîne : un carré par bloc (les 8 derniers).
    const shown = Math.min(this.count, 8);
    const first = this.count - shown;
    const size = 28, gap = 8;
    const total = shown * size + (shown - 1) * gap;
    for (let i = 0; i < shown; i++) {
      g.fillStyle = first + i === this.bad ? '#f28482' : '#95d5b2';
      g.beginPath(); g.roundRect((w - total) / 2 + i * (size + gap), 80, size, size, 6); g.fill();
    }

    const status = this.status ?? {
      text: this.count ? `sa copie : ${this.count} bloc${this.count > 1 ? 's' : ''}` : 'sa copie : vide',
      color: MUTED,
    };
    g.fillStyle = status.color;
    g.font = `700 26px ${SANS}`;
    g.fillText(status.text, w / 2, 164, w - 16);
    texture.needsUpdate = true;
  }

  /** Centre de l'écran, dans le monde. */
  get point() {
    return this.head.localToWorld(new THREE.Vector3(0, 0, 0.1));
  }
}
