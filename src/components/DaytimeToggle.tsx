import { Moon, Sunrise, Sunset } from 'lucide-react';
import { DAYTIMES, useDaytime, type Daytime } from '../three/daytime';

const ICONS: Record<Daytime, typeof Sunrise> = { morning: Sunrise, evening: Sunset, night: Moon };

/** Switches the live scene between morning, evening and night. */
export default function DaytimeToggle({ className = '' }: { className?: string }) {
  const [current, set] = useDaytime();
  return (
    <div role="group" aria-label="Scene time of day" className={`inline-flex gap-1 rounded-full border border-white/25 bg-black/20 p-1 ${className}`}>
      {DAYTIMES.map((d) => {
        const Icon = ICONS[d];
        const active = d === current;
        return (
          <button
            key={d}
            type="button"
            aria-pressed={active}
            onClick={() => set(d)}
            className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm font-medium capitalize transition-colors duration-300 sm:px-4 ${
              active ? 'bg-white text-[#0B0B0C]' : 'text-white/85 hover:bg-white/15'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className={active ? '' : 'sr-only sm:not-sr-only'}>{d}</span>
          </button>
        );
      })}
    </div>
  );
}
