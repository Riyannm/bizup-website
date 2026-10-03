import { useEffect, useState } from 'react';

/**
 * Time of day for the live scene. It starts from the visitor's own clock, and the
 * Morning / Evening / Night buttons in the hero can change it.
 */

export type Daytime = 'morning' | 'evening' | 'night';

export const DAYTIMES: Daytime[] = ['morning', 'evening', 'night'];

function fromClock(): Daytime {
  const h = new Date().getHours();
  if (h >= 5 && h < 16) return 'morning';
  if (h >= 16 && h < 20) return 'evening';
  return 'night';
}

let current: Daytime = fromClock();
const listeners = new Set<(d: Daytime) => void>();

export function getDaytime() {
  return current;
}

export function setDaytime(d: Daytime) {
  if (d === current) return;
  current = d;
  listeners.forEach((fn) => fn(d));
}

export function onDaytime(fn: (d: Daytime) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useDaytime(): [Daytime, (d: Daytime) => void] {
  const [value, setValue] = useState(current);
  useEffect(() => onDaytime(setValue), []);
  return [value, setDaytime];
}
