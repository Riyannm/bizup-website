import { useEffect, useState } from 'react';

/**
 * Tracks the intro loader. The 3D stage reports when its shapes are ready, the loader
 * plays out, then the rest of the page (hero text, 3D blocks rising in) starts.
 */

let stageReady = false;
let revealed = false;
const stageListeners = new Set<() => void>();
const revealListeners = new Set<() => void>();

export function markStageReady() {
  if (stageReady) return;
  stageReady = true;
  stageListeners.forEach((fn) => fn());
}

export function onStageReady(fn: () => void) {
  if (stageReady) fn();
  else stageListeners.add(fn);
  return () => stageListeners.delete(fn);
}

export function markRevealed() {
  if (revealed) return;
  revealed = true;
  revealListeners.forEach((fn) => fn());
}

export function onRevealed(fn: () => void) {
  if (revealed) fn();
  else revealListeners.add(fn);
  return () => revealListeners.delete(fn);
}

/** True once the loader has opened and the page is showing. */
export function useRevealed() {
  const [value, setValue] = useState(revealed);
  useEffect(() => {
    const off = onRevealed(() => setValue(true));
    return () => {
      off();
    };
  }, []);
  return value;
}
