import type Lenis from 'lenis';
import { createContext, useContext } from 'react';
import type { MotionValue } from 'framer-motion';

/**
 * Shared state for the page wheel. The wheel turns as the page scrolls; the particle
 * stage reads the same turn so the shapes morph in step with the rooms.
 */

type WheelHandle = {
  /** Current turn in panels: 0 = first panel at the front, 1.5 = halfway between panels 2 and 3. */
  getTurn: () => number;
  /** Scroll so the panel with this id faces the front. */
  goTo: (id: string, immediate?: boolean) => boolean;
};

let handle: WheelHandle | null = null;
let lenis: Lenis | null = null;

export const wheel = {
  register(h: WheelHandle | null) {
    handle = h;
  },
  get active() {
    return handle !== null;
  },
  getTurn() {
    return handle?.getTurn() ?? 0;
  },
  goTo(id: string, immediate = false) {
    return handle?.goTo(id, immediate) ?? false;
  },
  setLenis(l: Lenis | null) {
    lenis = l;
  },
  get lenis() {
    return lenis;
  },
};

/** Per-panel context: `local` is this panel's distance from the front (-1 = next in line, +1 = just left). */
export type PanelState = { index: number; local: MotionValue<number>; seen: boolean };

export const PanelContext = createContext<PanelState | null>(null);

export function usePanel() {
  return useContext(PanelContext);
}
