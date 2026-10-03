import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three';
import { buildShapes, type Shape, type ShapeName } from './shapes';
import { markStageReady, onRevealed } from '../loader';

/**
 * One fixed WebGL canvas behind the whole page. Sections opt in with data attributes:
 *   data-stage="browser"   shape to form while the section is on screen
 *   data-side="right"      left | right | center (wide screens only; phones always centre)
 *   data-y="0.1"           vertical offset as a fraction of the viewport height
 *   data-dim="0.4"         opacity on wide screens (phones use data-mobile-dim, default 0.4)
 *   data-spin="0.15"       slow turn for 3D shapes
 */

const FOV = 35;
const DISTANCE = 10;

const vertexShader = /* glsl */ `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute vec4 aRand;
  uniform float uT, uTime, uScatter, uIdle, uSize, uPR, uIntro;
  uniform vec4 uA, uB;
  uniform vec2 uSpin, uOpacity, uTilt, uMouse;
  varying float vAlpha;
  varying vec3 vColor;

  vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
  vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }

  vec3 place(vec3 p, float spin, vec4 o) {
    p = rotY(p, uTime * spin + uTilt.x);
    p = rotX(p, uTilt.y);
    return p * o.w + o.xyz;
  }

  void main() {
    // Each particle leaves a little later than the last, so shapes peel apart instead of jumping.
    float t = clamp((uT - aRand.x * 0.3) / 0.7, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 p = mix(place(posA, uSpin.x, uA), place(posB, uSpin.y, uB), t);
    vec3 dir = normalize(aRand.yzw - 0.5 + 0.0001);
    p += dir * sin(3.14159 * t) * uScatter * (0.4 + aRand.x);
    p += uIdle * 0.035 * vec3(sin(uTime * 0.9 + aRand.y * 40.0), cos(uTime * 0.7 + aRand.z * 40.0), sin(uTime * 0.6 + aRand.w * 40.0));

    vec2 d = p.xy - uMouse;
    float l = length(d);
    p.xy += d / max(l, 0.001) * (1.0 - smoothstep(0.0, 1.3, l)) * 0.45 * uIdle;

    float intro = uIntro * uIntro * (3.0 - 2.0 * uIntro);
    p = mix(dir * (8.0 + aRand.x * 6.0), p, intro);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPR * (0.45 + aRand.y) * (10.0 / -mv.z);

    // Cobalt blue with white sparkles.
    vColor = mix(vec3(0.0, 0.28, 0.67), vec3(0.24, 0.48, 1.0), aRand.z);
    if (aRand.w > 0.78) vColor = vec3(1.0);
    vAlpha = mix(uOpacity.x, uOpacity.y, t) * (0.5 + 0.5 * aRand.x) * intro;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.05, d) * vAlpha);
  }
`;

type Stage = { el: HTMLElement; shape: ShapeName };

function readStages(): Stage[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).map((el) => ({
    el,
    shape: el.dataset.stage as ShapeName,
  }));
}

export default function ParticleStage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      markStageReady();
      return; // No WebGL: the CSS glow behind the page is enough.
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;
    const weak = (navigator.hardwareConcurrency || 8) <= 4;
    const count = small || weak ? 7000 : 14000;
    const pr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);

    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = DISTANCE;

    const geometry = new BufferGeometry();
    const posA = new BufferAttribute(new Float32Array(count * 3), 3);
    const posB = new BufferAttribute(new Float32Array(count * 3), 3);
    const randoms = new Float32Array(count * 4);
    for (let i = 0; i < randoms.length; i++) randoms[i] = Math.random();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute('posA', posA);
    geometry.setAttribute('posB', posB);
    geometry.setAttribute('aRand', new BufferAttribute(randoms, 4));

    const uniforms = {
      uT: { value: 0 },
      uTime: { value: 0 },
      uScatter: { value: reduced ? 0 : 1.4 },
      uIdle: { value: reduced ? 0 : 1 },
      uSize: { value: small ? 1.9 : 2.6 },
      uPR: { value: pr },
      uIntro: { value: reduced ? 1 : 0 },
      uA: { value: new Vector4(0, 0, 0, 1) },
      uB: { value: new Vector4(0, 0, 0, 1) },
      uSpin: { value: new Vector2() },
      uOpacity: { value: new Vector2(1, 1) },
      uTilt: { value: new Vector2() },
      uMouse: { value: new Vector2(99, 99) },
    };
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    let shapes: Record<ShapeName, Shape> | null = null;
    let stages: Stage[] = [];
    let bounds: { top: number; bottom: number }[] = [];
    let viewW = 1, viewH = 1, wide = true;
    let pair = [-1, -1];
    let s = 0, sTarget = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    function measure() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      viewH = 2 * DISTANCE * Math.tan(((FOV / 2) * Math.PI) / 180);
      viewW = viewH * camera.aspect;
      wide = w >= 900 && camera.aspect > 1.05;
      stages = readStages();
      bounds = stages.map(({ el }) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      });
      pair = [-1, -1];
    }

    function layout(stage: Stage) {
      const shape = shapes![stage.shape];
      const d = stage.el.dataset;
      const side = wide ? d.side ?? 'center' : 'center';
      let targetW: number, maxH: number, x = 0;
      if (side !== 'center') {
        targetW = viewW * 0.36;
        maxH = viewH * 0.6;
        x = (side === 'right' ? 1 : -1) * viewW * 0.24;
      } else {
        targetW = wide ? Math.min(viewW * 0.66, 11) : viewW * 0.88;
        maxH = viewH * (wide ? 0.55 : 0.4);
      }
      const scale = Math.min(targetW / shape.width, maxH / shape.height);
      const y = parseFloat((wide ? d.y : d.mobileY ?? d.y) ?? '0') * viewH;
      const opacity = parseFloat((wide ? d.dim : d.mobileDim) ?? (wide ? '1' : '0.4'));
      return { offset: new Vector4(x, y, 0, scale), opacity, spin: parseFloat(d.spin ?? '0') };
    }

    function setPair(a: number, b: number) {
      if (pair[0] === a && pair[1] === b) return;
      pair = [a, b];
      const la = layout(stages[a]), lb = layout(stages[b]);
      (posA.array as Float32Array).set(shapes![stages[a].shape].positions);
      (posB.array as Float32Array).set(shapes![stages[b].shape].positions);
      posA.needsUpdate = true;
      posB.needsUpdate = true;
      uniforms.uA.value.copy(la.offset);
      uniforms.uB.value.copy(lb.offset);
      uniforms.uOpacity.value.set(la.opacity, lb.opacity);
      uniforms.uSpin.value.set(la.spin, lb.spin);
    }

    // Holds a shape while its section fills the screen, and morphs across the boundary to the next one.
    function scrollTarget() {
      const c = window.scrollY + window.innerHeight / 2;
      const zone = window.innerHeight * 0.7;
      for (let i = 0; i < bounds.length - 1; i++) {
        const edge = (bounds[i].bottom + bounds[i + 1].top) / 2;
        if (c < edge - zone / 2) return i;
        if (c <= edge + zone / 2) return i + (c - (edge - zone / 2)) / zone;
      }
      return Math.max(bounds.length - 1, 0);
    }

    function onPointer(e: PointerEvent) {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.active = e.pointerType === 'mouse';
    }

    let raf = 0;
    let last = performance.now();
    let disposed = false;
    // The particles fly in once the loader opens.
    let introStarted = false;
    const offRevealed = onRevealed(() => (introStarted = true));

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (document.hidden || !shapes || stages.length === 0) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      sTarget = scrollTarget();
      s = reduced ? sTarget : s + (sTarget - s) * (1 - Math.exp(-dt * 6));
      const i = Math.min(Math.floor(s), stages.length - 1);
      setPair(i, Math.min(i + 1, stages.length - 1));
      uniforms.uT.value = s - i;

      uniforms.uTime.value += dt;
      if (!reduced && introStarted) uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + dt * 0.55);

      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 4));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 4));
      if (!reduced) uniforms.uTilt.value.set(pointer.x * 0.25, -pointer.y * 0.15);
      if (pointer.active) uniforms.uMouse.value.set((pointer.tx * viewW) / 2, (pointer.ty * viewH) / 2);

      renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onPointer, { passive: true });

    // The text shapes are drawn with Kanit, so wait for it before rasterising them.
    document.fonts.load('900 250px Kanit').finally(() => {
      if (disposed) return;
      shapes = buildShapes(count);
      measure();
      last = performance.now();
      raf = requestAnimationFrame(frame);
      markStageReady();
    });

    return () => {
      disposed = true;
      offRevealed();
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}
