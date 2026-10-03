import { motion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { usePanel } from '../wheel/state';

type FadeInProps = {
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  [key: string]: unknown;
};

const motionCache = new Map<string, ElementType>();

function getMotionComponent(tag: string): ElementType {
  let component = motionCache.get(tag);
  if (!component) {
    component = motion.create(tag) as ElementType;
    motionCache.set(tag, component);
  }
  return component;
}

export default function FadeIn({
  as = 'div',
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  ...rest
}: FadeInProps) {
  const Component = getMotionComponent(as);
  // On the page wheel, "in view" means the panel has turned to the front.
  const panel = usePanel();
  const inView = panel
    ? { animate: panel.seen ? { opacity: 1, x: 0, y: 0 } : undefined }
    : { whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: '50px', amount: 0 } };
  return (
    <Component
      initial={{ opacity: 0, x, y }}
      {...inView}
      transition={{ duration, delay: delay + (panel ? 0.1 : 0), ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
