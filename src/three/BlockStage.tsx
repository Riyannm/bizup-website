import { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { BLOCKS, FORMATIONS, extent, type Block, type FormationName } from './formations';
import { markStageReady, onRevealed } from '../loader';

/**
 * One fixed WebGL canvas behind the page with 27 glossy blocks that rearrange per section.
 * Sections opt in with data attributes:
 *   data-stage="bars"      formation to build while the section is on screen
 *   data-side="right"      left | right | center (wide screens; phones always centre)
 *   data-y / data-mobile-y vertical offset as a fraction of the viewport height
 *   data-dim / data-mobile-dim   canvas opacity while this section is showing (phones default to 0)
 *   data-spin="0.2"        slow turn around the vertical axis
 *   data-size="0.8"        scale relative to the default fit
 * On phones the canvas can't sit beside the text, so blocks only show in sections that contain a
 * [data-stage-anchor] slot: they fit inside it and scroll with it. Elsewhere they hide.
 */

const FOV = 30;
const DISTANCE = 16;
const STAGGER = 0.35;

/** `anchor`: page y of a [data-stage-anchor] slot the blocks sit in and scroll with (phones). */
type Layout = { x: number; y: number; scale: number; opacity: number; spin: number; anchor: number | null };
type Stage = { el: HTMLElement; name: FormationName };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function BlockStage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      markStageReady();
      return; // No WebGL: the page reads fine without the blocks.
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.domElement.style.opacity = '0';
    renderer.domElement.style.transition = 'opacity 0.2s linear';
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;

    const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = DISTANCE;

    const sun = new DirectionalLight(0xffffff, 1.8);
    sun.position.set(5, 9, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(small ? 512 : 1024, small ? 512 : 1024);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.radius = 6;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const materials = [
      new MeshPhysicalMaterial({ color: 0xf1eee8, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
      new MeshPhysicalMaterial({ color: 0x111113, roughness: 0.22, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 }),
      new MeshPhysicalMaterial({ color: 0x0047ab, roughness: 0.2, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.06 }),
    ];
    const geometry = new RoundedBoxGeometry(1, 1, 1, 3, 0.09);

    const rig = new Group(); // placement on screen + base tilt
    const spinner = new Group(); // slow turn
    rig.add(spinner);
    scene.add(rig);
    const meshes: Mesh[] = [];
    for (let i = 0; i < BLOCKS; i++) {
      const mesh = new Mesh(geometry, materials[0]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      spinner.add(mesh);
      meshes.push(mesh);
    }
    const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: 0.1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    rig.add(floor);

    const sizes = Object.fromEntries(Object.entries(FORMATIONS).map(([name, f]) => [name, extent(f)])) as Record<FormationName, { w: number; h: number }>;
    const bottoms = Object.fromEntries(
      Object.entries(FORMATIONS).map(([name, f]) => [name, Math.min(...f.build(0).filter((b) => b.s[0] > 0.01).map((b) => b.p[1] - b.s[1] / 2))]),
    ) as Record<FormationName, number>;

    let stages: Stage[] = [];
    let bounds: { top: number; bottom: number }[] = [];
    let layouts: Layout[] = [];
    let viewW = 1, viewH = 1;
    let s = 0;
    let time = 0;
    let spinAngle = 0;
    let intro = reduced ? 1 : 0;
    let introStarted = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function layoutFor(stage: Stage, wide: boolean): Layout {
      const d = stage.el.dataset;
      const size = sizes[stage.name];
      const side = wide ? d.side ?? 'center' : 'center';
      let targetW: number, maxH: number, x = 0;
      if (side !== 'center') {
        targetW = viewW * 0.3;
        maxH = viewH * 0.55;
        x = (side === 'right' ? 1 : -1) * viewW * 0.25;
      } else if (wide) {
        targetW = Math.min(viewW * 0.42, 8);
        maxH = viewH * 0.5;
      } else {
        targetW = viewW * 0.6;
        maxH = viewH * 0.3;
      }
      const spin = parseFloat(d.spin ?? '0');
      const slot = wide ? null : stage.el.querySelector<HTMLElement>('[data-stage-anchor]');
      if (slot && slot.offsetHeight > 0) {
        const r = slot.getBoundingClientRect();
        const toWorld = viewH / window.innerHeight;
        const fit = Math.min((viewW * 0.62) / size.w, (r.height * 0.82 * toWorld) / size.h);
        return { x: 0, y: 0, scale: fit, opacity: 1, spin, anchor: r.top + window.scrollY + r.height / 2 };
      }
      const scale = Math.min(targetW / size.w, maxH / size.h) * parseFloat(d.size ?? '1');
      const yFrac = parseFloat((wide ? d.y : '0.25') ?? '0');
      const opacity = wide ? parseFloat(d.dim ?? '1') : 0;
      return { x, y: yFrac * viewH, scale, opacity, spin, anchor: null };
    }

    function measure() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      viewH = 2 * DISTANCE * Math.tan(((FOV / 2) * Math.PI) / 180);
      viewW = viewH * camera.aspect;
      const wide = w >= 900 && camera.aspect > 1.05;
      stages = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]'))
        .filter((el) => el.dataset.stage! in FORMATIONS)
        .map((el) => ({ el, name: el.dataset.stage as FormationName }));
      bounds = stages.map(({ el }) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      });
      layouts = stages.map((st) => layoutFor(st, wide));
    }

    // Holds a formation while its section fills the screen, and rebuilds across the boundary to the next.
    function scrollTarget() {
      const c = window.scrollY + window.innerHeight / 2;
      const zone = window.innerHeight * 0.8;
      for (let i = 0; i < bounds.length - 1; i++) {
        const edge = (bounds[i].bottom + bounds[i + 1].top) / 2;
        if (c < edge - zone / 2) return i;
        if (c <= edge + zone / 2) return i + (c - (edge - zone / 2)) / zone;
      }
      return Math.max(bounds.length - 1, 0);
    }

    function place(mesh: Mesh, a: Block, b: Block, t: number, i: number) {
      const local = reduced ? t : clamp01((t - (i / BLOCKS) * STAGGER) / (1 - STAGGER));
      const e = easeInOut(local);
      const lift = reduced ? 0 : Math.sin(Math.PI * e);
      // Intro: blocks rise into place one after another.
      const ie = easeInOut(clamp01(intro * 1.6 - (i / BLOCKS) * 0.6));
      mesh.position.set(lerp(a.p[0], b.p[0], e), lerp(a.p[1], b.p[1], e) + lift * 0.35 - (1 - ie) * 5, lerp(a.p[2], b.p[2], e) + lift * 1.1);
      mesh.rotation.set(lerp(a.r[0], b.r[0], e) + lift * 0.9 + (1 - ie) * 1.5, lerp(a.r[1], b.r[1], e) + lift * 1.4, lerp(a.r[2], b.r[2], e));
      const grow = Math.max(ie, 0.001);
      mesh.scale.set(lerp(a.s[0], b.s[0], e) * grow, lerp(a.s[1], b.s[1], e) * grow, lerp(a.s[2], b.s[2], e) * grow);
      mesh.material = materials[e < 0.5 ? a.m : b.m];
    }

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let raf = 0;
    let last = performance.now();
    const offRevealed = onRevealed(() => (introStarted = true));

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (document.hidden || stages.length === 0) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduced) time += dt;
      if (introStarted && intro < 1) intro = Math.min(1, intro + dt * 0.6);

      const target = scrollTarget();
      s = reduced ? target : s + (target - s) * (1 - Math.exp(-dt * 5));
      const i = Math.min(Math.floor(s), stages.length - 1);
      const j = Math.min(i + 1, stages.length - 1);
      const t = s - i;
      const fa = FORMATIONS[stages[i].name];
      const fb = FORMATIONS[stages[j].name];
      const blocksA = fa.build(time);
      const blocksB = fb === fa ? blocksA : fb.build(time);
      for (let k = 0; k < BLOCKS; k++) place(meshes[k], blocksA[k], blocksB[k], t, k);

      const la = layouts[i], lb = layouts[j];
      const g = easeInOut(t);
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3));
      // Anchored layouts (phones) follow their slot as the page scrolls. Between two slots the blocks
      // fade out in the old one and back in at the new one, so they never travel across text.
      const yOf = (l: Layout) => (l.anchor === null ? l.y : ((window.innerHeight / 2 - (l.anchor - window.scrollY)) / window.innerHeight) * viewH);
      const hop = la.anchor !== null || lb.anchor !== null;
      rig.position.set(lerp(la.x, lb.x, g), hop ? yOf(g < 0.5 ? la : lb) : lerp(yOf(la), yOf(lb), g), 0);
      rig.scale.setScalar(lerp(la.scale, lb.scale, g));
      rig.rotation.set(lerp(fa.tilt[0], fb.tilt[0], g) + pointer.y * 0.12, lerp(fa.tilt[1], fb.tilt[1], g) + pointer.x * 0.25, 0);
      spinAngle += dt * lerp(la.spin, lb.spin, g) * (reduced ? 0 : 1);
      spinner.rotation.y = spinAngle;
      floor.position.y = lerp(bottoms[stages[i].name], bottoms[stages[j].name], g) - 0.05;
      const opacity = hop ? (g < 0.5 ? la.opacity : lb.opacity) * Math.abs(Math.cos(Math.PI * g)) : lerp(la.opacity, lb.opacity, g);
      renderer.domElement.style.opacity = String(opacity);
      if (opacity > 0.01) renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onPointer, { passive: true });

    measure();
    renderer.compile(scene, camera);
    raf = requestAnimationFrame(frame);
    markStageReady();

    return () => {
      offRevealed();
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}
