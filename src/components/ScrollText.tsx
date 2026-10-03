import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

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
          <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}
