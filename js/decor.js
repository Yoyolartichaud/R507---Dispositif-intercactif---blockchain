// Le décor du voyage : champ, tracteur, brasserie, camion, bar, terrasse, fût, verre, clé.
// Tout est construit avec des formes simples (boîtes arrondies, cylindres, sphères, cônes).

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { canvasTexture } from './objets3d.js';

const SANS = 'system-ui, "Segoe UI", sans-serif';

const mat = (color, roughness = 0.9, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });

function shadow(mesh) {
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

/** Boîte aux coins arrondis, placée en (x, y, z). */
function box(w, h, d, color, [x, y, z] = [0, 0, 0], radius = 0.08) {
  const r = Math.max(0.005, Math.min(radius, w / 2 - 0.005, h / 2 - 0.005, d / 2 - 0.005));
  const mesh = shadow(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat(color)));
  mesh.position.set(x, y, z);
  return mesh;
}

function cylinder(top, bottom, h, material, [x, y, z] = [0, 0, 0], segments = 24) {
  const mesh = shadow(new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, h, segments), typeof material === 'number' ? mat(material) : material));
  mesh.position.set(x, y, z);
  return mesh;
}

function sphere(radius, material, [x, y, z] = [0, 0, 0]) {
  const mesh = shadow(new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), typeof material === 'number' ? mat(material) : material));
  mesh.position.set(x, y, z);
  return mesh;
}

/** Panneau avec du texte (enseigne, étiquette). On peut changer son texte avec setText. */
function sign(text, w, h, { bg = '#ffffff', ink = '#1f2a44' } = {}) {
  const { canvas, texture, g } = canvasTexture(w * 256, h * 256, 4);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
  plane.setText = (value, background = bg, color = ink) => {
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = background;
    g.beginPath(); g.roundRect(0, 0, canvas.width, canvas.height, canvas.height * 0.2); g.fill();
    g.fillStyle = color;
    g.font = `800 ${Math.round(canvas.height * 0.58)}px ${SANS}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(value, canvas.width / 2, canvas.height / 2 + canvas.height * 0.04, canvas.width - 16);
    texture.needsUpdate = true;
  };
  plane.setText(text);
  return plane;
}

/** Un personnage très simple : un corps et une tête. */
function person(color, [x, y, z]) {
  const body = shadow(new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.5, 6, 14), mat(color)));
  body.position.set(x, y + 0.5, z);
  return [body, sphere(0.2, 0xf2d0b8, [x, y + 1.08, z])];
}

// ---------------------------------------------------------------------------
// Les objets qui voyagent
// ---------------------------------------------------------------------------

/** Le sac d'orge qui sort du champ. */
export function makeSack() {
  const sack = new THREE.Group();
  const body = sphere(0.4, 0xe6ccb2);
  body.scale.set(0.95, 1.1, 0.8);
  sack.add(body, cylinder(0.1, 0.16, 0.14, 0xd4b08c, [0, 0.46, 0], 12), box(0.3, 0.2, 0.02, 0xe9c46a, [0, 0, 0.32], 0.03));
  return sack;
}

/** Le fût de bière. */
export function makeKeg() {
  const keg = new THREE.Group();
  const steel = mat(0xcfd6de, 0.35, 0.6);
  const dark = mat(0x9aa5b1, 0.4, 0.6);
  keg.add(cylinder(0.28, 0.28, 0.56, steel), cylinder(0.286, 0.286, 0.2, 0xf4a72c));
  for (const y of [-0.24, 0.24]) {
    const rim = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 8, 24), dark));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = y;
    keg.add(rim);
  }
  const label = sign('LOT 42', 0.36, 0.14);
  label.position.set(0, 0, 0.292);
  keg.add(label);
  return keg;
}

/** Le verre de Léa. fill(k) le remplit de 0 (vide) à 1 (plein, avec la mousse). */
export function makeGlass() {
  const glass = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.13, 0.36, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xdff3ff, transparent: true, opacity: 0.4, roughness: 0.1, side: THREE.DoubleSide }),
  );
  shell.position.y = 0.18;
  const beer = new THREE.Mesh(new THREE.CylinderGeometry(0.138, 0.122, 0.3, 24), mat(0xf4a72c, 0.4));
  const foam = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.14, 0.08, 24), mat(0xffffff, 1));
  foam.position.y = 0.36;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 16, Math.PI), mat(0xdff3ff, 0.2));
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(0.15, 0.18, 0);
  glass.add(shell, beer, foam, handle, cylinder(0.14, 0.14, 0.02, 0xdff3ff, [0, 0.01, 0]));
  glass.userData.fill = (k) => {
    beer.visible = k > 0.01;
    beer.scale.y = Math.max(0.01, k);
    beer.position.y = 0.02 + 0.15 * k;
    foam.visible = k > 0.95;
  };
  glass.userData.fill(0);
  return glass;
}

/** La clé privée de Léa. */
export function makeKey() {
  const key = new THREE.Group();
  const gold = mat(0xf2b705, 0.3, 0.6);
  const ring = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 10, 24), gold));
  ring.position.x = -0.3;
  const shaft = cylinder(0.04, 0.04, 0.52, gold, [0.1, 0, 0], 10);
  shaft.rotation.z = Math.PI / 2;
  const tooth = (x) => {
    const mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.15, 0.06), gold));
    mesh.position.set(x, -0.09, 0);
    return mesh;
  };
  key.add(ring, shaft, tooth(0.22), tooth(0.32));
  return key;
}

// ---------------------------------------------------------------------------
// Les lieux
// ---------------------------------------------------------------------------

/** Le champ d'orge. userData.stalks contient les épis, pour pouvoir les faucher. */
export function makeField() {
  const field = new THREE.Group();
  field.add(box(4.8, 0.2, 3.8, 0xd8c690, [0, 0.02, 0], 0.1));
  const gold = mat(0xe9c46a);
  field.userData.stalks = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      const stalk = cylinder(0.055, 0.025, 0.6, gold, [-1.9 + col * 0.42, 0.42, -1.4 + row * 0.6], 6);
      field.userData.stalks.push(stalk);
      field.add(stalk);
    }
  }
  return field;
}

/** Le tracteur. Il roule vers la droite (+x). */
export function makeTractor() {
  const tractor = new THREE.Group();
  tractor.add(
    box(1.0, 0.34, 0.5, 0xe63946, [0.08, 0.5, 0], 0.08),       // capot
    box(0.5, 0.55, 0.52, 0xe63946, [-0.3, 0.86, 0], 0.08),      // cabine
    box(0.03, 0.3, 0.4, 0x9ad1d4, [-0.04, 0.9, 0], 0.01),       // vitre
    cylinder(0.03, 0.03, 0.4, 0x3d405b, [0.38, 0.85, 0.12], 8), // pot d'échappement
  );
  for (const [x, radius] of [[-0.3, 0.32], [0.42, 0.19]]) {
    for (const z of [-0.3, 0.3]) {
      const wheel = cylinder(radius, radius, 0.14, 0x3d405b, [x, radius, z]);
      wheel.rotation.x = Math.PI / 2;
      tractor.add(wheel);
    }
  }
  return tractor;
}

/** La brasserie, avec ses deux cuves en cuivre. La porte est à l'origine du groupe (x = 0). */
export function makeBrewery() {
  const brewery = new THREE.Group();
  const copper = mat(0xd9905a, 0.35, 0.5);
  const logo = sign('BRASSERIE', 1.6, 0.28, { bg: '#1f2a44', ink: '#ffffff' });
  logo.position.set(0, 1.25, 0.76);
  brewery.add(
    box(2.5, 1.5, 1.5, 0xe9b98a, [0, 0.75, 0], 0.1),             // bâtiment
    box(2.65, 0.16, 1.65, 0xc98f5a, [0, 1.56, 0], 0.05),         // toit
    box(0.55, 0.75, 0.04, 0x3d405b, [0, 0.38, 0.76], 0.02),      // porte
    box(0.4, 0.34, 0.03, 0x9ad1d4, [-0.8, 0.7, 0.76], 0.02),     // fenêtre
    logo,
  );
  for (const z of [0.35, -0.5]) {
    const dome = sphere(0.36, copper, [1.75, 1.2, z]);
    dome.scale.y = 0.55;
    brewery.add(cylinder(0.36, 0.36, 1.1, copper, [1.75, 0.65, z]), dome, cylinder(0.05, 0.05, 0.3, copper, [1.75, 1.5, z], 10));
  }
  // Bulles au-dessus des cuves (voir animateBubbles).
  brewery.userData.bubbles = [0, 1, 2, 3].map(() => {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfff3c4, transparent: true, roughness: 1 }));
    brewery.add(bubble);
    return bubble;
  });
  return brewery;
}

export function animateBubbles(brewery, time, speed = 1) {
  brewery.userData.bubbles.forEach((bubble, i) => {
    const k = (time * 0.4 * speed + i / 4) % 1;
    bubble.position.set(1.75 + Math.sin(k * 6 + i) * 0.07, 1.7 + k * 0.5, i % 2 ? 0.35 : -0.5);
    bubble.scale.setScalar(0.5 + k * 0.7);
    bubble.material.opacity = 0.8 * (1 - k);
  });
}

/** Le camion frigorifique. Il roule vers la droite (+x). */
export function makeTruck() {
  const truck = new THREE.Group();
  truck.add(
    box(2.5, 0.12, 0.8, 0x3d405b, [0, 0.3, 0], 0.03),           // châssis
    box(1.75, 1.0, 0.95, 0xfafafa, [-0.35, 0.86, 0], 0.08),     // remorque frigorifique
    box(0.62, 0.78, 0.9, 0x81b29a, [0.92, 0.75, 0], 0.1),       // cabine
    box(0.03, 0.32, 0.7, 0x9ad1d4, [1.235, 0.9, 0], 0.01),      // pare-brise
  );
  for (const x of [-0.95, -0.3, 0.9]) {
    for (const z of [-0.42, 0.42]) {
      const wheel = cylinder(0.2, 0.2, 0.14, 0x3d405b, [x, 0.2, z]);
      wheel.rotation.x = Math.PI / 2;
      truck.add(wheel);
    }
  }
  // Afficheur de température sur le côté de la remorque.
  const display = sign('', 1.0, 0.44);
  display.position.set(-0.35, 0.9, 0.48);
  truck.add(display);
  truck.userData.setTemp = (degrees) => {
    const ok = degrees <= 8;
    display.setText(`❄ ${degrees} °C`, ok ? '#d8f3dc' : '#f5a3a0', ok ? '#1b7f5c' : '#8c1d18');
  };
  truck.userData.setTemp(6);
  return truck;
}

export function makeBar() {
  const bar = new THREE.Group();
  const logo = sign('BAR', 1.0, 0.34, { bg: '#1f2a44', ink: '#ffffff' });
  logo.position.set(0, 1.86, 0.55);
  bar.add(
    box(2.5, 1.5, 1.4, 0xfff1e6, [0, 0.75, 0], 0.1),            // bâtiment
    box(2.6, 0.14, 1.5, 0xe9d8c4, [0, 1.55, 0], 0.05),          // toit
    box(1.1, 0.44, 0.08, 0x1f2a44, [0, 1.86, 0.5], 0.04),       // support de l'enseigne
    box(0.6, 0.85, 0.04, 0x9ad1d4, [0, 0.43, 0.71], 0.02),      // porte vitrée
    box(0.55, 0.45, 0.03, 0x9ad1d4, [-0.85, 0.6, 0.71], 0.02),  // vitrines
    box(0.55, 0.45, 0.03, 0x9ad1d4, [0.85, 0.6, 0.71], 0.02),
    logo,
  );
  // Store rayé au-dessus de l'entrée.
  for (let i = 0; i < 5; i++) {
    const stripe = box(0.5, 0.06, 0.7, i % 2 ? 0xffffff : 0x2a9d8f, [(i - 2) * 0.5, 1.18, 0.95], 0.02);
    stripe.rotation.x = 0.45;
    bar.add(stripe);
  }
  return bar;
}

/** Dessine un faux QR code : il représente l'adresse bitcoin du bar. */
function qrCode(size) {
  const { canvas, texture, g } = canvasTexture(210, 210, 4);
  const cell = 10;
  let seed = 42;
  const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.fillStyle = '#1f2a44';
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) if (random() > 0.5) g.fillRect(x * cell, y * cell, cell, cell);
  for (const [x, y] of [[0, 0], [14, 0], [0, 14]]) {          // les trois repères d'angle
    g.fillStyle = '#ffffff'; g.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
    g.fillStyle = '#1f2a44'; g.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
    g.fillStyle = '#ffffff'; g.fillRect((x + 1) * cell, (y + 1) * cell, 5 * cell, 5 * cell);
    g.fillStyle = '#1f2a44'; g.fillRect((x + 2) * cell, (y + 2) * cell, 3 * cell, 3 * cell);
  }
  texture.needsUpdate = true;
  return new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: texture }));
}

/** La terrasse du bar : une table, un parasol, Léa et son téléphone, le QR code du bar. */
export function makeTerrace() {
  const terrace = new THREE.Group();
  const canopy = shadow(new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.5, 8), mat(0xe76f51)));
  canopy.position.set(0.2, 2.3, -0.6);
  const phone = box(0.14, 0.24, 0.03, 0x1f2a44, [-0.78, 0.86, 0.34], 0.01);
  phone.rotation.z = -0.5;
  const qr = qrCode(0.3);
  qr.position.set(0.42, 0.9, 0.268);
  terrace.add(
    cylinder(0.08, 0.12, 0.6, 0xc9a66b, [0, 0.3, 0.2]),          // pied de table
    cylinder(0.78, 0.78, 0.08, 0xddb892, [0, 0.62, 0.2], 32),    // plateau
    cylinder(0.04, 0.04, 2.1, 0xc9c3b6, [0.2, 1.05, -0.6], 10),  // mât du parasol
    canopy,
    ...person(0x9bb1ff, [-1.1, 0, 0.2]),                         // Léa
    phone,
    box(0.38, 0.46, 0.03, 0xffffff, [0.42, 0.9, 0.25], 0.02),    // chevalet du QR code
    qr,
  );
  return terrace;
}

/** La route entre la brasserie et le bar, avec sa ligne en pointillés. */
export function makeRoad(fromX, toX) {
  const road = new THREE.Group();
  road.add(box(toX - fromX, 0.06, 1.15, 0xd9d4c8, [(fromX + toX) / 2, 0.03, 0], 0.03));
  for (let x = fromX + 0.6; x < toX - 0.3; x += 1) road.add(box(0.45, 0.02, 0.08, 0xffffff, [x, 0.065, 0], 0.01));
  return road;
}

/** Une étagère sur laquelle sont posés les blocs, avec son nom écrit sur le devant. */
export function makeShelf(fromX, toX, height, depth, color, title) {
  const shelf = new THREE.Group();
  shelf.add(box(toX - fromX, height, depth, color, [(fromX + toX) / 2, height / 2, 0], 0.12));
  const label = sign(title, 4.4, 0.42, { bg: '#1f2a44', ink: '#ffffff' });
  label.position.set(fromX + 2.9, height - 0.42, depth / 2 + 0.01);
  shelf.add(label);
  return shelf;
}

/** Plateau de la mempool : là où les transactions attendent. */
export function makeTray() {
  return box(3, 0.12, 1.1, 0xe6e1d6, [0, 0.06, 0], 0.05);
}

/** Trait rouge qui balaie un objet : un scan de code-barres ou de QR code. */
export function makeScanLine() {
  const line = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.8), new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.75 }));
  line.visible = false;
  return line;
}

/** Les câbles du réseau : ils relient les ordinateurs entre eux, sans passer par un centre. */
export function makeNetwork(points) {
  const network = new THREE.Group();
  const material = mat(0x9fb3c8, 0.8);
  const cable = (a, b, bulge) => {
    const middle = a.clone().lerp(b, 0.5);
    middle.z += bulge;
    network.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, middle, b), 24, 0.035, 6), material));
  };
  for (let i = 0; i < points.length - 1; i++) cable(points[i], points[i + 1], 0);       // voisins
  for (let i = 0; i < points.length - 2; i++) cable(points[i], points[i + 2], 1.6);     // et au-delà
  return network;
}

/** Une pièce : la récompense du mineur. */
export function makeCoin() {
  const coin = new THREE.Group();
  const disc = cylinder(0.2, 0.2, 0.05, mat(0xf2b705, 0.3, 0.6));
  disc.rotation.x = Math.PI / 2;
  coin.add(disc);
  return coin;
}
