import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';
import { usePanel } from '../wheel/state';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{' '}
    </motion.span>
  );
}

/** A paragraph whose words light up one after another as it scrolls through the viewport. */
export default function ScrollText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  // On the page wheel the words light up as the panel turns to the front.
  const panel = usePanel();
  const wheelProgress = useTransform(panel?.local ?? scrollYProgress, [-0.8, 0], [0, 1], { clamp: true });
  const progress = panel ? wheelProgress : scrollYProgress;
  const words = text.split(' ');

  if (reduced) {
    return (
      <p className={className} style={style}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={i} word={word} progress={progress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}
