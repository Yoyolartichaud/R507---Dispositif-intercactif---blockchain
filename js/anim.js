// Petites animations : on fait varier une valeur de 0 à 1 pendant une durée donnée.

const active = new Set();

export const ease = {
  linear: (t) => t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  back: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
};

/** Lance une animation. La promesse se termine quand l'animation est finie. */
export function tween(duration, onUpdate, easing = ease.inOut) {
  return new Promise((resolve) => {
    active.add({ time: 0, duration: Math.max(duration, 0.001), onUpdate, easing, resolve });
  });
}

/** Attend un certain nombre de secondes. */
export const wait = (seconds) => tween(seconds, () => {});

/** À appeler à chaque image, avec le temps écoulé depuis l'image précédente. */
export function updateTweens(dt) {
  for (const item of [...active]) {
    item.time += dt;
    const k = Math.min(1, item.time / item.duration);
    item.onUpdate(item.easing(k));
    if (k === 1) {
      active.delete(item);
      item.resolve();
    }
  }
}
