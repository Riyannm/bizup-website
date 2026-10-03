import { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type WebGLRenderTarget,
} from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getDaytime, onDaytime, type Daytime } from './daytime';
import { markStageReady, onRevealed } from '../loader';

/**
 * A living 3D world behind the page: an ocean with real reflections, sky and sun, drifting
 * clouds, birds, and the BizUp cube monument floating over a rock island. It follows the
 * visitor's time of day, and the camera glides along a path as the page scrolls.
 *
 * Content sections marked [data-cover] hide the world completely; while one fills the
 * screen the scene stops drawing to save battery.
 */

type Preset = {
  elevation: number;
  azimuth: number;
  turbidity: number;
  rayleigh: number;
  mie: number;
  mieG: number;
  exposure: number;
  sun: Color;
  sunIntensity: number;
  hemiSky: Color;
  hemiGround: Color;
  hemiIntensity: number;
  water: Color;
  fog: Color;
  fogDensity: number;
  cloud: Color;
  cloudOpacity: number;
  night: number;
  dusk: number;
};

const PRESETS: Record<Daytime, Preset> = {
  morning: {
    elevation: 7, azimuth: 115, turbidity: 3.5, rayleigh: 1.4, mie: 0.004, mieG: 0.8, exposure: 0.52,
    sun: new Color(0xffe2bf), sunIntensity: 2.6, hemiSky: new Color(0xcfe3ff), hemiGround: new Color(0x6b5a4a), hemiIntensity: 0.9,
    water: new Color(0x0b2c3d), fog: new Color(0xd8cdbf), fogDensity: 0.0011, cloud: new Color(0xfff6ec), cloudOpacity: 0.75, night: 0, dusk: 0,
  },
  evening: {
    elevation: 1.6, azimuth: 180, turbidity: 9, rayleigh: 3, mie: 0.007, mieG: 0.93, exposure: 0.48,
    sun: new Color(0xffa36b), sunIntensity: 3, hemiSky: new Color(0xffb38a), hemiGround: new Color(0x3a2420), hemiIntensity: 0.7,
    water: new Color(0x2a1a1c), fog: new Color(0xe9a07c), fogDensity: 0.0013, cloud: new Color(0xffb994), cloudOpacity: 0.8, night: 0, dusk: 1,
  },
  night: {
    elevation: -6, azimuth: 200, turbidity: 2, rayleigh: 0.5, mie: 0.002, mieG: 0.8, exposure: 0.4,
    sun: new Color(0x9db4ff), sunIntensity: 0.55, hemiSky: new Color(0x31407a), hemiGround: new Color(0x0a0c14), hemiIntensity: 0.45,
    water: new Color(0x02060f), fog: new Color(0x080c1a), fogDensity: 0.0012, cloud: new Color(0x2a3354), cloudOpacity: 0.5, night: 1, dusk: 0.3,
  },
};

const ISLAND = new Vector3(0, 0, -70);
const MONUMENT_Y = 14;

// Camera stops along the page: hero → (covered by the content sheet) → closing shot.
// Wide screens frame the island on the right, beside the text; phones frame it above the text.
const PATHS = {
  wide: {
    pos: [new Vector3(12, 6, -36), new Vector3(30, 10, -10), new Vector3(-26, 15, -18), new Vector3(-8, 20, -24), new Vector3(-16, 3.5, -42)],
    look: [new Vector3(-17, 11, -70), new Vector3(-4, 12, -70), new Vector3(0, 13, -70), new Vector3(0, 13, -70), new Vector3(-12, 15, -70)],
  },
  tall: {
    pos: [new Vector3(0, 5, -34), new Vector3(18, 9, -20), new Vector3(-16, 13, -26), new Vector3(-4, 16, -30), new Vector3(0, 3, -40)],
    look: [new Vector3(0, 7, -70), new Vector3(0, 8, -70), new Vector3(0, 8, -70), new Vector3(0, 9, -70), new Vector3(0, 6, -70)],
  },
};
const curves = (k: keyof typeof PATHS) => ({ pos: new CatmullRomCurve3(PATHS[k].pos), look: new CatmullRomCurve3(PATHS[k].look) });

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** A tileable water normal map made from overlapping sine waves (no image download needed). */
function waterNormals(size = 256) {
  const waves = Array.from({ length: 28 }, () => ({
    fx: Math.round((Math.random() - 0.5) * 16),
    fy: Math.round((Math.random() - 0.5) * 16),
    a: 0.4 + Math.random(),
    p: Math.random() * Math.PI * 2,
  })).filter((w) => w.fx || w.fy);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let dx = 0, dy = 0;
      for (const w of waves) {
        const k = ((2 * Math.PI) / size) * (w.fx * x + w.fy * y) + w.p;
        const c = Math.cos(k) * w.a / Math.hypot(w.fx, w.fy);
        dx += c * w.fx;
        dy += c * w.fy;
      }
      const n = new Vector3(-dx * 0.08, -dy * 0.08, 1).normalize();
      const i = (y * size + x) * 4;
      data[i] = (n.x * 0.5 + 0.5) * 255;
      data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  const tex = new DataTexture(data, size, size, RGBAFormat);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** A soft cloud drawn from overlapping blurred puffs. */
function cloudTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < 46; i++) {
    const x = 90 + Math.random() * 332, y = 100 + Math.random() * 80 - Math.abs(x - 256) * 0.18;
    const r = 30 + Math.random() * 60;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.32)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/** A rough rock island: a squashed, noise-displaced sphere. */
function islandGeometry() {
  const geo = new IcosahedronGeometry(18, 5);
  const pos = geo.attributes.position as BufferAttribute;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = Math.sin(v.x * 0.35) * Math.cos(v.z * 0.3) + Math.sin(v.x * 0.9 + v.z * 0.7) * 0.4 + Math.sin(v.z * 1.7) * 0.15;
    v.multiplyScalar(1 + n * 0.08);
    v.y *= v.y > 0 ? 0.32 : 0.6;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** A simple bird silhouette: two wings that flap. */
function makeBird(material: MeshBasicMaterial) {
  const wingGeo = new BufferGeometry();
  wingGeo.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, -0.35, 0, 0, 0.45, 2.2, 0.15, 0]), 3));
  const left = new Mesh(wingGeo, material);
  const right = new Mesh(wingGeo, material);
  right.scale.x = -1;
  const body = new Mesh(new BufferGeometry().setAttribute('position', new BufferAttribute(new Float32Array([0, 0.05, -0.6, 0.18, 0, 0.6, -0.18, 0, 0.6]), 3)), material);
  const bird = new Group();
  bird.add(left, right, body);
  return { bird, left, right };
}

export default function LiveScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      markStageReady();
      return; // No WebGL: the CSS sky gradient behind the hero stands in.
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
    renderer.toneMapping = ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    scene.fog = new FogExp2(0xd8cdbf, 0.0011);
    const camera = new PerspectiveCamera(small ? 62 : 48, 1, 0.5, 20000);

    // Sky and sun
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    const sunDir = new Vector3();

    // Ocean
    const water = new Water(new PlaneGeometry(10000, 10000), {
      textureWidth: small ? 256 : 512,
      textureHeight: small ? 256 : 512,
      waterNormals: waterNormals(),
      sunDirection: new Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x0b2c3d,
      distortionScale: 2.6,
      fog: true,
    });
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    const waterUniforms = water.material.uniforms;

    // Lights
    const sunLight = new DirectionalLight(0xffffff, 2);
    scene.add(sunLight);
    const hemi = new HemisphereLight(0xffffff, 0x444444, 0.8);
    scene.add(hemi);
    // A soft light from the viewer's side, so the monument's faces read even against the sun.
    const fill = new DirectionalLight(0xfff4e8, 0.9);
    fill.position.set(10, 25, 40);
    scene.add(fill);
    const glowLight = new PointLight(0x2f6bff, 0, 140, 1.6);
    glowLight.position.set(ISLAND.x, MONUMENT_Y, ISLAND.z + 4);
    scene.add(glowLight);

    // Island and shore rocks
    const rockMat = new MeshStandardMaterial({ color: 0x3a312b, roughness: 0.95, metalness: 0 });
    const island = new Mesh(islandGeometry(), rockMat);
    island.position.copy(ISLAND).setY(-1.5);
    scene.add(island);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      const r = 19 + Math.random() * 8;
      const rock = new Mesh(new IcosahedronGeometry(1 + Math.random() * 2.2, 1), rockMat);
      rock.position.set(ISLAND.x + Math.cos(a) * r, -0.3, ISLAND.z + Math.sin(a) * r);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.scale.y = 0.6;
      scene.add(rock);
    }

    // The monument: the BizUp cube, exploded and breathing.
    const materials = [
      new MeshPhysicalMaterial({ color: 0xf1eee8, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
      new MeshPhysicalMaterial({ color: 0x111113, roughness: 0.2, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }),
      new MeshPhysicalMaterial({ color: 0x0047ab, roughness: 0.18, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0x1d5cff, emissiveIntensity: 0 }),
    ];
    const blockGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.09);
    const monument = new Group();
    monument.position.set(ISLAND.x, MONUMENT_Y, ISLAND.z);
    scene.add(monument);
    const cells: { mesh: Mesh; p: Vector3; centre: boolean; i: number }[] = [];
    let ci = 0;
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const edges = Math.abs(x) + Math.abs(y) + Math.abs(z);
          const m = edges === 3 || edges === 0 ? 2 : ci % 4 === 0 ? 1 : 0;
          const mesh = new Mesh(blockGeo, materials[m]);
          mesh.scale.setScalar(2.3);
          mesh.rotation.set(Math.sin(ci * 1.7) * 0.25, Math.cos(ci * 1.3) * 0.25, 0);
          monument.add(mesh);
          cells.push({ mesh, p: new Vector3(x, y, z).multiplyScalar(2.6), centre: edges === 0, i: ci++ });
        }
    const glowMat = new SpriteMaterial({ map: glowTexture(), color: 0x2f6bff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const glow = new Sprite(glowMat);
    glow.scale.setScalar(46);
    glow.position.copy(monument.position);
    scene.add(glow);

    // Clouds
    const cloudMap = cloudTexture();
    const clouds: Sprite[] = [];
    for (let i = 0; i < 9; i++) {
      const mat = new SpriteMaterial({ map: cloudMap, transparent: true, depthWrite: false, fog: false, opacity: 0.75 });
      const cloud = new Sprite(mat);
      const s = 260 + Math.random() * 260;
      cloud.scale.set(s, s * 0.45, 1);
      cloud.position.set(-900 + Math.random() * 1800, 120 + Math.random() * 160, -700 - Math.random() * 600);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // Birds
    const birdMat = new MeshBasicMaterial({ color: 0x1b1512, side: DoubleSide, transparent: true, fog: false });
    const flock = Array.from({ length: 7 }, (_, k) => {
      const b = makeBird(birdMat);
      b.bird.scale.setScalar(1.4);
      scene.add(b.bird);
      const row = Math.ceil(k / 2);
      return { ...b, offset: new Vector3((k % 2 ? 1 : -1) * row * 4.5, row * 1.2 + Math.random(), row * 3), phase: Math.random() * 6 };
    });

    // Stars
    const starCount = 1600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.95);
      starPos.set([Math.sin(ph) * Math.cos(th) * 4000, Math.cos(ph) * 4000 + 60, Math.sin(ph) * Math.sin(th) * 4000], i * 3);
    }
    const starMat = new PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
    scene.add(new Points(new BufferGeometry().setAttribute('position', new BufferAttribute(starPos, 3)), starMat));

    // Fireflies around the island
    const flyCount = 140;
    const flyBase = new Float32Array(flyCount * 3);
    const flyPos = new Float32Array(flyCount * 3);
    for (let i = 0; i < flyCount; i++) {
      const a = Math.random() * Math.PI * 2, r = 6 + Math.random() * 26;
      flyBase.set([ISLAND.x + Math.cos(a) * r, 1 + Math.random() * 16, ISLAND.z + Math.sin(a) * r], i * 3);
    }
    const flyGeo = new BufferGeometry().setAttribute('position', new BufferAttribute(flyPos, 3));
    const flyMat = new PointsMaterial({ map: glowTexture(), color: 0xffc98a, size: 1.1, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    scene.add(new Points(flyGeo, flyMat));

    // Environment reflections come from the sky itself.
    const pmrem = new PMREMGenerator(renderer);
    const envScene = new Scene();
    let envTarget: WebGLRenderTarget | null = null;
    function refreshEnvironment() {
      envScene.add(sky);
      const next = pmrem.fromScene(envScene);
      scene.add(sky);
      envTarget?.dispose();
      envTarget = next;
      scene.environment = next.texture;
    }

    // Time of day: the live values ease toward the chosen preset.
    const NUMERIC = ['elevation', 'azimuth', 'turbidity', 'rayleigh', 'mie', 'mieG', 'exposure', 'sunIntensity', 'hemiIntensity', 'fogDensity', 'cloudOpacity', 'night', 'dusk'] as const;
    const start = PRESETS[getDaytime()];
    const live = Object.fromEntries(NUMERIC.map((k) => [k, start[k]])) as Record<(typeof NUMERIC)[number], number>;
    const colours = {
      sun: start.sun.clone(),
      hemiSky: start.hemiSky.clone(),
      hemiGround: start.hemiGround.clone(),
      water: start.water.clone(),
      fog: start.fog.clone(),
      cloud: start.cloud.clone(),
    };
    let target = PRESETS[getDaytime()];
    let envDirty = true;
    let settle = 0;
    const offDaytime = onDaytime((d) => {
      target = PRESETS[d];
      settle = 0;
    });

    function applyDaytime(dt: number) {
      const k = reduced ? 1 : 1 - Math.exp(-dt * 1.4);
      let moving = 0;
      for (const key of NUMERIC) {
        const to = target[key];
        moving += Math.abs(to - live[key]);
        live[key] += (to - live[key]) * k;
      }
      for (const key of Object.keys(colours) as (keyof typeof colours)[]) colours[key].lerp(target[key], k);

      const u = sky.material.uniforms;
      u.turbidity.value = live.turbidity;
      u.rayleigh.value = live.rayleigh;
      u.mieCoefficient.value = live.mie;
      u.mieDirectionalG.value = live.mieG;
      sunDir.setFromSphericalCoords(1, MathUtils.degToRad(90 - live.elevation), MathUtils.degToRad(live.azimuth));
      u.sunPosition.value.copy(sunDir);
      waterUniforms.sunDirection.value.copy(sunDir).normalize();
      renderer.toneMappingExposure = live.exposure;

      // At night the "sun" light becomes moonlight from high up.
      const night = live.night;
      sunLight.position.copy(sunDir).multiplyScalar(100).lerp(new Vector3(-60, 120, -40), night);
      sunLight.color.copy(colours.sun);
      sunLight.intensity = live.sunIntensity;
      waterUniforms.sunColor.value.copy(colours.sun).multiplyScalar(1 - night * 0.6);
      waterUniforms.waterColor.value.copy(colours.water);
      hemi.color.copy(colours.hemiSky);
      hemi.groundColor.copy(colours.hemiGround);
      hemi.intensity = live.hemiIntensity;
      fill.intensity = 0.9 * (1 - night) + 0.15;
      (scene.fog as FogExp2).color.copy(colours.fog);
      (scene.fog as FogExp2).density = live.fogDensity;
      for (const c of clouds) {
        (c.material as SpriteMaterial).color.copy(colours.cloud);
        (c.material as SpriteMaterial).opacity = live.cloudOpacity;
      }
      starMat.opacity = night;
      birdMat.opacity = 1 - night;
      flyMat.opacity = Math.min(1, live.dusk * 0.5 + night);
      materials[2].emissiveIntensity = night * 1.6;
      glowMat.opacity = night * 0.55;
      glowLight.intensity = night * 900;

      // Re-light reflections once a change has mostly settled.
      settle = moving < 0.5 ? settle + dt : 0;
      if (envDirty || (settle > 0.2 && settle < 0.2 + dt * 1.5)) {
        refreshEnvironment();
        envDirty = false;
      }
    }

    // Camera
    let progress = 0;
    let intro = reduced ? 1 : 0;
    let introStarted = false;
    const offRevealed = onRevealed(() => (introStarted = true));
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    let path = curves(window.innerWidth < 768 ? 'tall' : 'wide');
    const camPos = new Vector3();
    const camLook = new Vector3();
    const introFrom = new Vector3(0, 38, 120);

    function measure() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 62 : 48;
      camera.updateProjectionMatrix();
      path = curves(w < 768 ? 'tall' : 'wide');
    }

    const covers = () => Array.from(document.querySelectorAll<HTMLElement>('[data-cover]'));
    let coverEls = covers();
    function covered() {
      const h = window.innerHeight;
      return coverEls.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 0 && r.bottom >= h;
      });
    }

    let raf = 0;
    let last = performance.now();
    let time = 0;
    let firstFrame = true;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduced) time += dt;
      if (introStarted && intro < 1) intro = Math.min(1, intro + dt / 3.2);

      applyDaytime(dt);
      if (!firstFrame && covered()) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? window.scrollY / max : 0;
      progress += (target - progress) * (reduced ? 1 : 1 - Math.exp(-dt * 3));

      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 2));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 2));
      const p = easeInOut(Math.min(Math.max(progress, 0), 1));
      path.pos.getPoint(p, camPos);
      path.look.getPoint(p, camLook);
      camPos.x += Math.sin(time * 0.13) * 0.9 + pointer.x * 2.2;
      camPos.y += Math.sin(time * 0.17) * 0.45 - pointer.y * 1.2;
      camPos.lerpVectors(introFrom, camPos, easeInOut(intro));
      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // Monument breathes, bobs and turns.
      monument.position.y = MONUMENT_Y + Math.sin(time * 0.6) * 0.6;
      monument.rotation.y = time * 0.08;
      monument.rotation.x = 0.35;
      for (const c of cells) {
        const push = c.centre ? 0 : 0.28 + 0.22 * Math.sin(time * 0.9 + c.i * 0.7);
        c.mesh.position.copy(c.p).multiplyScalar(1 + push * 0.42);
      }
      glow.position.y = monument.position.y;

      // Birds glide across the sky in a loose V, wings flapping.
      const lap = (time * 0.022) % 1;
      const lead = new Vector3(-320 + lap * 640, 62 + Math.sin(time * 0.3) * 6, -210);
      for (const b of flock) {
        b.bird.position.copy(lead).add(b.offset);
        b.bird.position.y += Math.sin(time * 1.3 + b.phase) * 0.6;
        b.bird.rotation.set(0, Math.PI / 2, 0);
        const flap = Math.sin(time * 7 + b.phase) * 0.55;
        b.left.rotation.z = flap;
        b.right.rotation.z = -flap;
      }

      for (const c of clouds) {
        c.position.x += dt * 4;
        if (c.position.x > 1000) c.position.x = -1000;
      }

      const fp = flyGeo.attributes.position as BufferAttribute;
      for (let i = 0; i < flyCount; i++) {
        fp.setXYZ(
          i,
          flyBase[i * 3] + Math.sin(time * 0.5 + i) * 1.5,
          flyBase[i * 3 + 1] + Math.sin(time * 0.8 + i * 1.7) * 1.2,
          flyBase[i * 3 + 2] + Math.cos(time * 0.4 + i * 0.9) * 1.5,
        );
      }
      fp.needsUpdate = true;

      waterUniforms.time.value += dt * 0.55;
      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        markStageReady();
      }
    }

    const onResize = () => {
      measure();
      coverEls = covers();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    measure();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      offDaytime();
      offRevealed();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      envTarget?.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}
