/**
 * Point clouds the particle stage morphs between. Every shape returns exactly `count`
 * points (xyz triples), centred on the origin and normalised so its larger side is SIZE.
 */

export type ShapeName = 'logo' | 'globe' | 'browser' | 'phone' | 'gear' | 'cubes' | 'bars' | 'helix' | 'ring' | 'hello';

export type Shape = { positions: Float32Array; width: number; height: number };

const SIZE = 6;

function rand(seed: number) {
  // Small deterministic PRNG so shapes look the same on every load.
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalise(points: number[], count: number): Shape {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < points.length; i += 3) {
    minX = Math.min(minX, points[i]); maxX = Math.max(maxX, points[i]);
    minY = Math.min(minY, points[i + 1]); maxY = Math.max(maxY, points[i + 1]);
    minZ = Math.min(minZ, points[i + 2]); maxZ = Math.max(maxZ, points[i + 2]);
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
  const scale = SIZE / Math.max(maxX - minX, maxY - minY, 1e-6);
  const out = new Float32Array(count * 3);
  const n = points.length / 3;
  for (let i = 0; i < count; i++) {
    const j = (i % n) * 3;
    out[i * 3] = (points[j] - cx) * scale;
    out[i * 3 + 1] = (points[j + 1] - cy) * scale;
    out[i * 3 + 2] = (points[j + 2] - cz) * scale;
  }
  return { positions: out, width: (maxX - minX) * scale, height: (maxY - minY) * scale };
}

/** Rasterise a 2D drawing and scatter `count` points over its filled pixels. */
function fromCanvas(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, count: number, depth: number, seed: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  draw(ctx);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: number[] = [];
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (data[(y * w + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  const r = rand(seed);
  const pts: number[] = [];
  const pixels = filled.length / 2 || 1;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(r() * pixels) * 2;
    pts.push(filled[k] + r() - 0.5, -(filled[k + 1] + r() - 0.5), (r() - 0.5) * depth);
  }
  return normalise(pts, count);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(word: string, count: number, seed: number) {
  return fromCanvas(
    1200,
    300,
    (ctx) => {
      ctx.font = '900 250px Kanit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(word, 600, 160);
    },
    count,
    14,
    seed,
  );
}

function browser(count: number) {
  return fromCanvas(
    640,
    460,
    (ctx) => {
      ctx.lineWidth = 9;
      roundRect(ctx, 20, 20, 600, 420, 34);
      ctx.stroke();
      ctx.fillRect(20, 92, 600, 7);
      [64, 100, 136].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, 56, 11, 0, Math.PI * 2);
        ctx.fill();
      });
      roundRect(ctx, 190, 42, 330, 28, 14);
      ctx.stroke();
      // page content
      roundRect(ctx, 60, 130, 300, 34, 8); ctx.fill();
      roundRect(ctx, 60, 182, 220, 16, 8); ctx.fill();
      roundRect(ctx, 60, 212, 250, 16, 8); ctx.fill();
      roundRect(ctx, 60, 256, 130, 40, 20); ctx.fill();
      roundRect(ctx, 400, 130, 180, 166, 16); ctx.stroke();
      [60, 245, 430].forEach((x) => { roundRect(ctx, x, 330, 150, 80, 14); ctx.stroke(); });
    },
    count,
    24,
    3,
  );
}

function phone(count: number) {
  return fromCanvas(
    320,
    600,
    (ctx) => {
      ctx.lineWidth = 9;
      roundRect(ctx, 20, 20, 280, 560, 48);
      ctx.stroke();
      roundRect(ctx, 120, 40, 80, 18, 9); ctx.fill();
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          roundRect(ctx, 52 + col * 78, 100 + row * 82, 58, 58, 16);
          ctx.fill();
        }
      }
      roundRect(ctx, 52, 450, 216, 70, 20); ctx.stroke();
      roundRect(ctx, 115, 548, 90, 8, 4); ctx.fill();
    },
    count,
    30,
    4,
  );
}

function gearPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number, teeth: number) {
  ctx.beginPath();
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const r = i % 4 < 2 ? outer : inner;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function gear(count: number) {
  return fromCanvas(
    620,
    520,
    (ctx) => {
      ctx.lineWidth = 10;
      gearPath(ctx, 230, 270, 200, 165, 12);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(230, 270, 70, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(230, 270, 22, 0, Math.PI * 2); ctx.fill();
      gearPath(ctx, 485, 120, 105, 82, 9);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(485, 120, 32, 0, Math.PI * 2); ctx.stroke();
    },
    count,
    36,
    5,
  );
}

function globe(count: number) {
  const r = rand(6);
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    // Mostly on latitude/longitude lines, the rest scattered over the surface.
    const mode = r();
    let theta = r() * Math.PI * 2;
    let phi = Math.acos(2 * r() - 1);
    if (mode < 0.35) phi = (Math.round((phi / Math.PI) * 9) / 9) * Math.PI;
    else if (mode < 0.7) theta = (Math.round((theta / (Math.PI * 2)) * 14) / 14) * Math.PI * 2;
    pts.push(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
  }
  return normalise(pts, count);
}

function bars(count: number) {
  const r = rand(7);
  const heights = [0.9, 1.4, 1.1, 2.0, 1.6, 2.6, 2.2, 3.2];
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    const b = Math.floor(r() * heights.length);
    const h = heights[b];
    const x = b * 0.8 + (r() - 0.5) * 0.45;
    const z = (r() - 0.5) * 0.45;
    // Denser on the bar's top face so the chart outline reads clearly.
    const y = r() < 0.25 ? h : r() * h;
    pts.push(x, y, z);
  }
  // A base line under the chart.
  for (let i = 0; i < count * 0.08; i++) pts.push(-0.5 + r() * 6.8, -0.08, (r() - 0.5) * 0.9);
  return normalise(pts, count);
}

function helix(count: number) {
  const r = rand(8);
  const pts: number[] = [];
  const turns = 2.5;
  for (let i = 0; i < count; i++) {
    const t = r();
    const strand = r() < 0.5 ? 0 : Math.PI;
    const a = t * turns * Math.PI * 2 + strand;
    if (r() < 0.12) {
      // rungs between the two strands
      const s = r() * 2 - 1;
      pts.push(Math.cos(a) * s, t * 6 - 3, Math.sin(a) * s);
    } else {
      pts.push(Math.cos(a) + (r() - 0.5) * 0.08, t * 6 - 3, Math.sin(a) + (r() - 0.5) * 0.08);
    }
  }
  return normalise(pts, count);
}

function ring(count: number) {
  const r = rand(9);
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    // torus knot (2,3)
    const t = r() * Math.PI * 2;
    const p = 2, q = 3;
    const rr = 1 + 0.45 * Math.cos(q * t);
    const cx = rr * Math.cos(p * t), cy = rr * Math.sin(p * t), cz = 0.45 * Math.sin(q * t);
    const s = 0.14 * Math.sqrt(r());
    const a = r() * Math.PI * 2;
    pts.push(cx + Math.cos(a) * s, cy + Math.sin(a) * s, cz + (r() - 0.5) * s * 2);
  }
  return normalise(pts, count);
}

/** Three nested wireframe cubes, like modules fitting together. */
function cubes(count: number) {
  const r = rand(10);
  const sizes = [1, 0.62, 0.3];
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    const size = sizes[i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2];
    // pick one of the 12 edges: fix two axes at ±size, run along the third
    const axis = Math.floor(r() * 3);
    const a = (r() < 0.5 ? -1 : 1) * size, b = (r() < 0.5 ? -1 : 1) * size;
    const t = (r() * 2 - 1) * size;
    const j = () => (r() - 0.5) * 0.04;
    const p = axis === 0 ? [t, a, b] : axis === 1 ? [a, t, b] : [a, b, t];
    pts.push(p[0] + j(), p[1] + j(), p[2] + j());
  }
  // tilt so it reads as 3D from the front
  const out: number[] = [];
  const cx = Math.cos(0.5), sx = Math.sin(0.5), cy = Math.cos(0.7), sy = Math.sin(0.7);
  for (let i = 0; i < pts.length; i += 3) {
    const x = pts[i], y = pts[i + 1], z = pts[i + 2];
    const x1 = cy * x + sy * z, z1 = -sy * x + cy * z;
    out.push(x1, cx * y - sx * z1, sx * y + cx * z1);
  }
  return normalise(out, count);
}

export function buildShapes(count: number): Record<ShapeName, Shape> {
  return {
    logo: text('BIZUP', count, 1),
    globe: globe(count),
    browser: browser(count),
    phone: phone(count),
    gear: gear(count),
    cubes: cubes(count),
    bars: bars(count),
    helix: helix(count),
    ring: ring(count),
    hello: text('HELLO', count, 2),
  };
}
