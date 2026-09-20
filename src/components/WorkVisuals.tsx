import { motion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Check,
  Landmark,
  Lock,
  MapPin,
  CreditCard,
  Fuel,
  Package,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { ProjectVisual } from '../data';

/* ---------- shared pieces ---------- */

function Shell({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#D7E2EA]/10 bg-gradient-to-br from-[#1a1a1d] to-[#111113] p-4 [@media(min-height:1000px)]:md:p-6 ${className}`}
    >
      <span className="mb-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/60">{title}</span>
      {children}
    </div>
  );
}

const inView = { once: true, amount: 0.3 } as const;

/* ---------- 1. Cash management ---------- */

const LEDGER = [
  { label: 'Collection · Site 3', amount: '+$1,240', in: true },
  { label: 'Payout · Machine 12', amount: '−$320', in: false },
  { label: 'Collection · Site 1', amount: '+$860', in: true },
  { label: 'Bank deposit', amount: '−$5,000', in: false },
  { label: 'Collection · Site 5', amount: '+$1,015', in: true },
];

const STOCK = [
  { item: 'Bill acceptors', qty: 14, pct: 70 },
  { item: 'Spare boards', qty: 6, pct: 30 },
  { item: 'Cabinets', qty: 9, pct: 45 },
];

const ROLES = [
  { who: 'Owner', access: 'Everything', tone: 'bg-[#B600A8]/20 text-[#f0a6ea]' },
  { who: 'Manager', access: 'Cash + reports', tone: 'bg-[#7621B0]/25 text-[#cfa9f0]' },
  { who: 'Collector', access: 'Collections only', tone: 'bg-sky-400/15 text-sky-300' },
  { who: 'Warehouse', access: 'Stock only', tone: 'bg-[#BE4C00]/20 text-[#f5b98f]' },
];

function CashVisual() {
  return (
    <div className="grid h-full gap-3 sm:grid-cols-[1.25fr_1fr]">
      <Shell title="Cash ledger">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] sm:text-sm text-[#D7E2EA]/60">Cash on hand</div>
            <div className="font-black leading-none text-[#D7E2EA]" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 3rem)' }}>
              $24,830
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] sm:text-xs text-emerald-300">
            <Landmark className="h-3.5 w-3.5" aria-hidden="true" /> Balanced
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-1.5">
          {LEDGER.map((row, i) => (
            <motion.li
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inView}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`${i >= 3 ? 'hidden [@media(min-height:1000px)]:md:flex' : 'flex'} items-center gap-2.5 rounded-xl bg-white/[0.04] px-3 py-2 text-[11px] sm:text-sm`}
            >
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${row.in ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'}`}>
                {row.in ? <ArrowDownLeft className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1 truncate text-[#D7E2EA]/85">{row.label}</span>
              <span className={`shrink-0 font-medium tabular-nums ${row.in ? 'text-emerald-300' : 'text-rose-300'}`}>{row.amount}</span>
            </motion.li>
          ))}
        </ul>
      </Shell>

      <div className="hidden min-h-0 flex-col gap-3 sm:flex">
        <Shell title="Warehouse" className="flex-1">
          <ul className="flex flex-col gap-2.5">
            {STOCK.map(({ item, qty, pct }) => (
              <li key={item} className="text-[11px] sm:text-sm">
                <div className="mb-1 flex items-center justify-between text-[#D7E2EA]/85">
                  <span className="inline-flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 text-[#D7E2EA]/50" aria-hidden="true" />
                    {item}
                  </span>
                  <span className="tabular-nums text-[#D7E2EA]/60">{qty}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#646973] to-[#BBCCD7]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={inView}
                    transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Shell>
        <Shell title="Roles & access" className="flex-1">
          <ul className="flex flex-col gap-1">
            {ROLES.map(({ who, access, tone }) => (
              <li key={who} className="flex items-center justify-between gap-2 text-[11px] sm:text-sm">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${tone}`}>
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {who}
                </span>
                <span className="truncate text-[#D7E2EA]/60">{access}</span>
              </li>
            ))}
          </ul>
        </Shell>
      </div>
    </div>
  );
}

/* ---------- 2. Machine & route tracking ---------- */

const STOPS = [
  { x: 60, y: 210, label: 'Site A', state: 'done' },
  { x: 150, y: 120, label: 'Site B', state: 'done' },
  { x: 265, y: 170, label: 'Site C', state: 'flag' },
  { x: 350, y: 70, label: 'Site D', state: 'next' },
  { x: 440, y: 150, label: 'Site E', state: 'queued' },
] as const;

const ROUTE_PATH = 'M60 210 C 90 160, 120 130, 150 120 S 230 180, 265 170 S 320 80, 350 70 S 420 120, 440 150';

const STOP_COLOR = { done: '#6ee7b7', flag: '#fb7185', next: '#B600A8', queued: '#646973' };

const MACHINES = [
  { id: 'Unit 3', site: 'Site A', rev: '$412', bars: [40, 55, 48, 62, 70] },
  { id: 'Unit 5', site: 'Site B', rev: '$356', bars: [50, 45, 58, 52, 60] },
  { id: 'Unit 7', site: 'Site C', rev: '$64', bars: [60, 52, 40, 22, 12], flag: true },
  { id: 'Unit 9', site: 'Site D', rev: '$498', bars: [55, 64, 70, 76, 82] },
];

function RoutesVisual() {
  return (
    <div className="grid h-full gap-3 sm:grid-cols-[1.35fr_1fr]">
      <Shell title="Route #4 · Today">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#0C0C0C]/60">
          <svg viewBox="0 0 500 270" preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-label="Route map with five stops (sample data)">
            <defs>
              <pattern id="route-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M25 0H0V25" fill="none" stroke="#D7E2EA" strokeOpacity="0.06" />
              </pattern>
            </defs>
            <rect width="500" height="270" fill="url(#route-grid)" />
            <path d={ROUTE_PATH} fill="none" stroke="#D7E2EA" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
            <motion.path
              d={ROUTE_PATH}
              fill="none"
              stroke="#D7E2EA"
              strokeWidth="3"
              strokeDasharray="1 0"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={inView}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
            {STOPS.map((s, i) => (
              <motion.g
                key={s.label}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={inView}
                transition={{ delay: 0.3 + i * 0.3 }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {s.state === 'next' && (
                  <motion.circle
                    cx={s.x}
                    cy={s.y}
                    r="14"
                    fill={STOP_COLOR.next}
                    style={{ originX: 0.5, originY: 0.5 }}
                    animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.85, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <circle cx={s.x} cy={s.y} r="11" fill="#0C0C0C" stroke={STOP_COLOR[s.state]} strokeWidth="4" />
                <text x={s.x} y={s.y + 32} textAnchor="middle" fontSize="15" fill="#D7E2EA" fillOpacity="0.8">
                  {s.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] sm:text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#B600A8]/20 px-2.5 py-1 text-[#f0a6ea]">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Next: Site D
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2.5 py-1 text-rose-300">
            <Wrench className="h-3.5 w-3.5" aria-hidden="true" /> Service: Unit 7
          </span>
        </div>
      </Shell>

      <Shell title="Revenue per machine" className="hidden sm:flex">
        <ul className="flex flex-col gap-2">
          {MACHINES.map((m) => (
            <li
              key={m.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[11px] sm:text-sm ${m.flag ? 'bg-rose-400/10' : 'bg-white/[0.04]'}`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[#D7E2EA]">{m.id}</div>
                <div className="text-[10px] sm:text-xs text-[#D7E2EA]/50">{m.site}</div>
              </div>
              <div className="flex h-7 items-end gap-0.5" aria-hidden="true">
                {m.bars.map((b, i) => (
                  <span key={i} className={`w-1.5 rounded-sm ${m.flag ? 'bg-rose-300' : 'bg-[#BBCCD7]'}`} style={{ height: `${b}%` }} />
                ))}
              </div>
              <span className={`w-12 shrink-0 text-right font-medium tabular-nums ${m.flag ? 'text-rose-300' : 'text-[#D7E2EA]'}`}>{m.rev}</span>
            </li>
          ))}
        </ul>
      </Shell>
    </div>
  );
}

/* ---------- 3. Inventory & reporting ---------- */

const LOCATIONS = [70, 52, 88, 45, 63, 77, 34, 58, 81, 49];
const TABS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const LOW_STOCK = [
  { sku: 'SKU-1042 · Store 2', left: '4 left' },
  { sku: 'SKU-0877 · Store 7', left: '2 left' },
  { sku: 'SKU-2210 · Store 4', left: '6 left' },
];

const SCHEDULE = [
  { name: 'Daily report', when: '7:00 AM' },
  { name: 'Weekly report', when: 'Monday' },
  { name: 'Monthly report', when: '1st' },
];

function ReportsVisual() {
  return (
    <div className="flex h-full flex-col gap-3">
      <Shell title="Sales by location" className="flex-1">
        <div className="mb-3 flex flex-wrap gap-1.5" aria-hidden="true">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={`rounded-full px-3 py-1 text-[10px] sm:text-xs ${i === 0 ? 'bg-[#D7E2EA] text-[#0C0C0C] font-medium' : 'bg-white/[0.05] text-[#D7E2EA]/60'}`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-end gap-1.5 sm:gap-2.5" role="img" aria-label="Sales across 10 locations (sample data)">
          {LOCATIONS.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <motion.div
                className="w-full rounded-md sm:rounded-lg"
                style={{
                  height: `${v}%`,
                  originY: 1,
                  background: v < 40 ? 'linear-gradient(180deg, #fb7185 0%, #BE4C00 100%)' : 'linear-gradient(180deg, #BBCCD7 0%, #646973 100%)',
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={inView}
                transition={{ delay: i * 0.05, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <span className="text-[9px] sm:text-[11px] text-[#D7E2EA]/50">{i + 1}</span>
            </div>
          ))}
        </div>
      </Shell>
      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2">
        <Shell title="Low-stock alerts">
          <ul className="flex flex-col gap-1.5">
            {LOW_STOCK.map(({ sku, left }, i) => (
              <li key={sku} className={`${i >= 2 ? 'hidden [@media(min-height:1000px)]:flex' : 'flex'} items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-1.5 text-[11px] sm:text-sm`}>
                <Package className="h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[#D7E2EA]/85">{sku}</span>
                <span className="shrink-0 font-medium text-amber-300">{left}</span>
              </li>
            ))}
          </ul>
        </Shell>
        <Shell title="Scheduled reports" className="hidden sm:flex">
          <ul className="flex flex-col gap-1.5">
            {SCHEDULE.map(({ name, when }, i) => (
              <li key={name} className={`${i >= 2 ? 'hidden [@media(min-height:1000px)]:flex' : 'flex'} items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-1.5 text-[11px] sm:text-sm`}>
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[#D7E2EA]/85">{name}</span>
                <span className="shrink-0 text-[#D7E2EA]/60">{when}</span>
              </li>
            ))}
          </ul>
        </Shell>
      </div>
    </div>
  );
}

/* ---------- 4. Vending & delivery website ---------- */

const SITE_SERVICES = [
  { icon: ShoppingCart, label: 'E-commerce' },
  { icon: Fuel, label: 'Gas station' },
  { icon: CreditCard, label: 'POS system' },
];

function WebsiteVisual() {
  return (
    <div className="flex h-full items-stretch gap-3 sm:gap-4">
      {/* desktop browser */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#D7E2EA]/10 bg-[#141416]">
        <div className="flex items-center gap-2 border-b border-[#D7E2EA]/10 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-[10px] sm:text-xs text-[#D7E2EA]/60">
            <Lock className="h-3 w-3" aria-hidden="true" /> your-company.com
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 p-4 sm:p-6">
          <div className="flex items-center justify-between" aria-hidden="true">
            <span className="h-3 w-16 rounded-full bg-[#D7E2EA]/70" />
            <span className="hidden gap-3 md:flex">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-10 rounded-full bg-[#D7E2EA]/20" />
              ))}
            </span>
            <span className="h-6 w-20 rounded-full bg-[#D7E2EA]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6 }}
          >
            <div className="font-black uppercase leading-[0.95] text-[#D7E2EA]" style={{ fontSize: 'clamp(1.1rem, 2.6vw, 2.4rem)' }}>
              E-commerce, gas
              <br />station &amp; POS.
            </div>
            <div className="mt-2 flex flex-col gap-1.5" aria-hidden="true">
              <span className="h-2 w-4/5 rounded-full bg-[#D7E2EA]/15" />
              <span className="h-2 w-3/5 rounded-full bg-[#D7E2EA]/15" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] sm:text-xs">
              <span className="rounded-full bg-[#D7E2EA] px-3 py-1 font-medium text-[#0C0C0C]">Shop online</span>
              <span className="rounded-full border border-[#D7E2EA]/40 px-3 py-1 text-[#D7E2EA]">Book a delivery</span>
            </div>
          </motion.div>
          <div className="mt-auto grid grid-cols-3 gap-2 sm:gap-3">
            {SITE_SERVICES.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col gap-2 rounded-2xl bg-white/[0.04] p-2.5 sm:p-3"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#D7E2EA]" aria-hidden="true" />
                <span className="text-[10px] sm:text-xs leading-tight text-[#D7E2EA]/80">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* phone */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="hidden w-[26%] max-w-[190px] shrink-0 flex-col self-center overflow-hidden rounded-[30px] border-2 border-[#D7E2EA]/25 bg-[#141416] p-2 sm:flex"
        style={{ aspectRatio: '9 / 18' }}
      >
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#D7E2EA]/20" />
        <div className="flex flex-1 flex-col gap-2 rounded-[22px] bg-[#0f0f11] p-3">
          <span className="h-2 w-10 rounded-full bg-[#D7E2EA]/70" />
          <div className="mt-1 text-[11px] font-black uppercase leading-tight text-[#D7E2EA]">
            E-commerce, gas station &amp; POS.
          </div>
          <span className="rounded-full bg-[#D7E2EA] py-1 text-center text-[9px] font-medium text-[#0C0C0C]">Shop online</span>
          {SITE_SERVICES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-2 py-1.5">
              <Icon className="h-3 w-3 text-[#D7E2EA]" aria-hidden="true" />
              <span className="text-[9px] text-[#D7E2EA]/80">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const VISUALS: Record<ProjectVisual, () => JSX.Element> = {
  cash: CashVisual,
  routes: RoutesVisual,
  reports: ReportsVisual,
  website: WebsiteVisual,
};

export default function WorkVisual({ type }: { type: ProjectVisual }) {
  const Visual = VISUALS[type];
  return <Visual />;
}
