/**
 * Arrangements of the 3D blocks, one per page section. Every formation places the same
 * BLOCKS blocks; ones it doesn't need are shrunk to nothing. Some move with time.
 */

export const BLOCKS = 27;

export type Material = 0 | 1 | 2; // white ceramic, black gloss, cobalt
export type Block = { p: [number, number, number]; s: [number, number, number]; r: [number, number, number]; m: Material };
export type Formation = {
  /** Base tilt of the whole group, so flat formations still show their depth. */
  tilt: [number, number];
  /** Formations that animate on their own (conveyor, orbit, ...). */
  animated?: boolean;
  build: (time: number) => Block[];
};

export type FormationName =
  | 'sculpture'
  | 'globe'
  | 'browser'
  | 'phone'
  | 'conveyor'
  | 'stack'
  | 'bars'
  | 'stairs'
  | 'orbit'
  | 'cube';

const hidden = (): Block => ({ p: [0, 0, 0], s: [0.001, 0.001, 0.001], r: [0, 0, 0], m: 0 });
const box = (p: Block['p'], s: Block['s'], m: Material = 0, r: Block['r'] = [0, 0, 0]): Block => ({ p, s, r, m });

function fill(blocks: Block[]) {
  while (blocks.length < BLOCKS) blocks.push(hidden());
  return blocks.slice(0, BLOCKS);
}

function grid3(spacing: number, size: number) {
  const out: { p: Block['p']; i: number; corner: boolean; centre: boolean }[] = [];
  let i = 0;
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const edges = Math.abs(x) + Math.abs(y) + Math.abs(z);
        out.push({ p: [x * spacing, y * spacing, z * spacing], i: i++, corner: edges === 3, centre: edges === 0 });
      }
  return out.map((c) => ({ ...c, size }));
}

export const FORMATIONS: Record<FormationName, Formation> = {
  // An exploded cube that slowly breathes.
  sculpture: {
    tilt: [0.45, -0.6],
    animated: true,
    build: (time) =>
      grid3(1.08, 0.94).map(({ p, i, corner, centre }) => {
        const len = Math.hypot(...p) || 1;
        const push = centre ? 0 : 0.28 + 0.22 * Math.sin(time * 0.9 + i * 0.7);
        return box(
          [p[0] + (p[0] / len) * push, p[1] + (p[1] / len) * push, p[2] + (p[2] / len) * push],
          [0.94, 0.94, 0.94],
          corner ? 2 : centre ? 2 : i % 4 === 0 ? 1 : 0,
          [Math.sin(i * 1.7) * 0.25, Math.cos(i * 1.3) * 0.25, 0],
        );
      }),
  },

  // Blocks spread over a sphere: working with businesses anywhere.
  globe: {
    tilt: [0.2, 0],
    build: () => {
      const out: Block[] = [];
      const r = 2.1;
      for (let i = 0; i < BLOCKS; i++) {
        const y = 1 - (i / (BLOCKS - 1)) * 2;
        const ring = Math.sqrt(1 - y * y);
        const a = i * 2.39996;
        const p: Block['p'] = [Math.cos(a) * ring * r, y * r, Math.sin(a) * ring * r];
        out.push(box(p, [0.58, 0.58, 0.58], i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0, [-Math.asin(y), Math.atan2(p[0], p[2]), 0]));
      }
      return out;
    },
  },

  browser: {
    tilt: [0.12, -0.38],
    build: () =>
      fill([
        box([0, 0, 0], [5, 3.4, 0.22], 0),
        box([0, 1.48, 0.13], [5, 0.44, 0.08], 1),
        box([-2.2, 1.48, 0.22], [0.18, 0.18, 0.1], 2),
        box([-1.9, 1.48, 0.22], [0.18, 0.18, 0.1], 0),
        box([-1.6, 1.48, 0.22], [0.18, 0.18, 0.1], 0),
        box([-1.0, 0.75, 0.2], [2.4, 0.42, 0.14], 1),
        box([-1.3, 0.22, 0.18], [1.8, 0.15, 0.1], 1),
        box([-1.45, -0.06, 0.18], [1.5, 0.15, 0.1], 1),
        box([-1.75, -0.55, 0.24], [0.9, 0.34, 0.16], 2),
        box([1.3, 0.1, 0.22], [1.7, 1.45, 0.18], 2),
        box([-1.6, -1.22, 0.18], [1.4, 0.55, 0.12], 0),
        box([0, -1.22, 0.18], [1.4, 0.55, 0.12], 0),
        box([1.6, -1.22, 0.18], [1.4, 0.55, 0.12], 0),
      ]),
  },

  phone: {
    tilt: [0.1, -0.45],
    build: () => {
      const b: Block[] = [box([0, 0, 0], [2.3, 4.6, 0.28], 1), box([0, -0.05, 0.16], [2.05, 4.15, 0.06], 0), box([0, 2.0, 0.22], [0.6, 0.12, 0.08], 1)];
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 3; col++) b.push(box([-0.62 + col * 0.62, 1.3 - row * 0.65, 0.27], [0.44, 0.44, 0.14], (row + col) % 3 === 0 ? 2 : 1));
      b.push(box([0, -1.6, 0.26], [1.6, 0.42, 0.12], 2));
      return fill(b);
    },
  },

  // Plain blocks ride through the gate and come out cobalt: work that runs itself.
  conveyor: {
    tilt: [0.4, -0.5],
    animated: true,
    build: (time) => {
      const b: Block[] = [
        box([0, -0.62, 0], [6.4, 0.24, 1.3], 1),
        box([0, 0.18, -0.55], [0.24, 1.4, 0.24], 0),
        box([0, 0.18, 0.55], [0.24, 1.4, 0.24], 0),
        box([0, 0.98, 0], [0.5, 0.24, 1.34], 2),
      ];
      const items = 8;
      for (let k = 0; k < items; k++) {
        const u = (k / items + time * 0.06) % 1;
        const x = u * 6 - 3;
        const edge = Math.min(1, Math.min(u, 1 - u) * 8); // grow in at the start, shrink out at the end
        const size = 0.6 * edge + 0.001;
        b.push(box([x, -0.2, 0], [size, size, size], x > 0 ? 2 : 0, [0, u * 1.2, 0]));
      }
      return fill(b);
    },
  },

  // A block tower, a few pieces pulled out.
  stack: {
    tilt: [0.32, -0.7],
    build: () => {
      const b: Block[] = [];
      for (let layer = 0; layer < 9; layer++) {
        for (let k = 0; k < 3; k++) {
          const off = (k - 1) * 0.6;
          const pulled = (layer === 3 && k === 0) || (layer === 6 && k === 2) ? 0.7 : 0;
          const y = layer * 0.42 - 1.7;
          const m: Material = layer === 8 ? 1 : (layer + k) % 5 === 0 ? 2 : 0;
          b.push(
            layer % 2 === 0
              ? box([pulled, y, off], [1.8, 0.38, 0.56], m)
              : box([off, y, pulled], [0.56, 0.38, 1.8], m),
          );
        }
      }
      return b;
    },
  },

  bars: {
    tilt: [0.3, -0.55],
    build: () => {
      const heights = [1.0, 1.6, 1.3, 2.3, 1.9, 3.0, 2.6];
      const b: Block[] = [box([0, -1.6, 0], [5.4, 0.14, 1.3], 1)];
      heights.forEach((h, k) => b.push(box([-2.1 + k * 0.7, h / 2 - 1.53, 0], [0.52, h, 0.52], k === 5 ? 2 : k % 2 ? 1 : 0)));
      return fill(b);
    },
  },

  // Steps up, with a cobalt block climbing them.
  stairs: {
    tilt: [0.3, -0.6],
    animated: true,
    build: (time) => {
      const steps = 9;
      const b: Block[] = [];
      for (let k = 0; k < steps; k++) {
        const h = (k + 1) * 0.36;
        b.push(box([-2.5 + k * 0.62, h / 2 - 1.6, 0], [0.6, h, 1.3], k === steps - 1 ? 1 : 0));
      }
      const u = (time * 0.18) % 1;
      const k = Math.min(steps - 1, Math.floor(u * steps));
      const hop = Math.sin((u * steps - k) * Math.PI) * 0.35;
      b.push(box([-2.5 + k * 0.62, (k + 1) * 0.36 - 1.6 + 0.24 + hop, 0], [0.42, 0.42, 0.42], 2));
      return fill(b);
    },
  },

  orbit: {
    tilt: [0.25, 0],
    animated: true,
    build: (time) => {
      const b: Block[] = [box([0, 0, 0], [1.1, 1.1, 1.1], 2, [time * 0.3, time * 0.4, 0])];
      const rings = [
        { n: 8, r: 2.1, tilt: 0.35, speed: 0.35, m: 0 as Material },
        { n: 6, r: 1.45, tilt: -0.6, speed: -0.5, m: 1 as Material },
      ];
      for (const ring of rings)
        for (let k = 0; k < ring.n; k++) {
          const a = (k / ring.n) * Math.PI * 2 + time * ring.speed;
          const x = Math.cos(a) * ring.r;
          const z = Math.sin(a) * ring.r;
          b.push(box([x, z * Math.sin(ring.tilt), z * Math.cos(ring.tilt)], [0.36, 0.36, 0.36], ring.m, [a, a, 0]));
        }
      return fill(b);
    },
  },

  // Everything locked together: the finished product.
  cube: {
    tilt: [0.5, -0.65],
    build: () => grid3(1.0, 0.97).map(({ p, corner, centre, i }) => box(p, [0.97, 0.97, 0.97], corner ? 2 : centre ? 1 : i % 6 === 0 ? 1 : 0)),
  },
};

/** Half-extents of a formation (at time 0), used to fit it on screen. */
export function extent(f: Formation) {
  let w = 0, h = 0;
  for (const b of f.build(0)) {
    if (b.s[0] < 0.01) continue;
    w = Math.max(w, Math.abs(b.p[0]) + b.s[0] / 2, Math.abs(b.p[2]) + b.s[2] / 2);
    h = Math.max(h, Math.abs(b.p[1]) + b.s[1] / 2);
  }
  return { w: w * 2, h: h * 2 };
}
