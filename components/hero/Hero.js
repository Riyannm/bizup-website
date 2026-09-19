"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import IntroPanels from "./IntroPanels";
import { usePrefersReducedMotion, useWebglSupported } from "@/lib/useEnvironment";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

// Fractions (0..1) of the intro track's own scroll range, not the whole page —
// so the panel sequence always finishes at a fixed point near the top regardless
// of how much content follows further down the page.
const CUES = [
  [0.0, 0.0, 0.15, 0.23],
  [0.35, 0.43, 0.57, 0.65],
  [0.77, 0.85, 0.92, 0.98],
];
const DRIFT = 22;

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function smooth(t) {
  return t * t * (3 - 2 * t);
}
function ramp(p, a, b) {
  if (b <= a) return p >= b ? 1 : 0;
  return smooth(clamp((p - a) / (b - a), 0, 1));
}

export default function Hero() {
  const trackRef = useRef(null);
  const meterRef = useRef(null);
  const panelRefs = useRef([]);
  const scrollRef = useRef({ progress: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebglSupported();
  const showScene = webglSupported;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function paint(introProgress) {
      scrollRef.current.progress = introProgress;
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const c = CUES[i];
        const enter = ramp(introProgress, c[0], c[1]);
        const leave = ramp(introProgress, c[2], c[3]);
        const o = enter * (1 - leave);
        const y = (1 - enter) * DRIFT - leave * DRIFT;
        el.style.opacity = o;
        el.style.transform = `translate3d(0,${y}px,0)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });
    }

    const introTrigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => paint(self.progress),
    });

    const pageTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (meterRef.current) {
          meterRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    paint(0);

    return () => {
      introTrigger.kill();
      pageTrigger.kill();
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden bg-shade">
        {showScene ? (
          <div className="absolute -inset-4" style={{ filter: "blur(6px)" }}>
            <Scene3D scrollRef={scrollRef} reducedMotion={reducedMotion} />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 20%, rgba(60,122,82,.10), transparent 60%), radial-gradient(120% 90% at 80% 80%, rgba(169,102,15,.10), transparent 60%), var(--shade)",
            }}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(242,240,236,.7) 0%, rgba(242,240,236,.4) 22%, rgba(242,240,236,.4) 78%, rgba(242,240,236,.72) 100%), radial-gradient(100% 80% at 50% 48%, rgba(242,240,236,0) 0%, rgba(242,240,236,.4) 100%), rgba(242,240,236,.3)",
          }}
        />
        <div
          className="pointer-events-none absolute -inset-1/2 opacity-[.13] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.5'/></svg>\")",
          }}
        />
      </div>

      <i
        ref={meterRef}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left scale-x-0 bg-fg opacity-55"
      />

      <IntroPanels panelRefs={panelRefs} />

      <div ref={trackRef} className="relative z-[1]" style={{ height: "400vh", minHeight: 2400 }} />
    </>
  );
}
