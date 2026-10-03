/**
 * Space for the 3D blocks on phones, where they can't sit beside the text. The block stage
 * fits the current formation inside this slot and scrolls it with the page. Hidden on wide
 * screens (900px+), where the blocks sit beside the content instead.
 */
export default function StageSlot({ className = 'h-[30svh]' }: { className?: string }) {
  return <div data-stage-anchor aria-hidden="true" className={`min-[900px]:hidden ${className}`} />;
}
