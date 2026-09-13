<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Boxes, ShoppingCart, Factory, ClipboardCheck, GitBranch, Landmark } from 'lucide-vue-next'
import { drawPath, gsap, useGsapContext } from '@/composables/useScrollAnimation'

/**
 * The hero diagram lives in a fixed 1000x600 coordinate space. The container
 * keeps that aspect ratio, so a card placed at `x/y` and an SVG line ending at
 * the same `x/y` always meet — no measuring, no resize listener.
 *
 * Positioning and animation are kept on separate elements throughout: the
 * outer element carries the centering translate, the inner one is GSAP's to
 * move. Sharing them would let an inline transform knock a card off its line.
 */
const VIEW_W = 1000
const VIEW_H = 600

type Satellite = {
  key: string
  title: string
  icon: typeof Boxes
  rows: { label: string; value: string; tone?: 'ok' | 'warn' | 'info' }[]
  x: number
  y: number
  /** Where the connector leaves the central console. */
  from: [number, number]
  /** Control point for the connector's curve. */
  ctrl: [number, number]
}

const satellites: Satellite[] = [
  {
    key: 'procurement',
    title: 'Procurement',
    icon: ShoppingCart,
    rows: [
      { label: 'PO-1082', value: 'Approved', tone: 'ok' },
      { label: 'Lead time', value: '5 days' },
    ],
    x: 500,
    y: 74,
    from: [500, 168],
    ctrl: [500, 120],
  },
  {
    key: 'inventory',
    title: 'Inventory',
    icon: Boxes,
    rows: [
      { label: 'Raw material', value: '2,480 units' },
      { label: 'Change', value: '+12.4%', tone: 'ok' },
    ],
    x: 158,
    y: 196,
    from: [296, 236],
    ctrl: [214, 200],
  },
  {
    key: 'production',
    title: 'Production',
    icon: Factory,
    rows: [
      { label: 'WO-2048', value: '87%' },
      { label: 'Status', value: 'On schedule', tone: 'ok' },
    ],
    x: 842,
    y: 196,
    from: [704, 236],
    ctrl: [786, 200],
  },
  {
    key: 'quality',
    title: 'Quality',
    icon: ClipboardCheck,
    rows: [
      { label: 'Pass rate', value: '98.7%', tone: 'ok' },
      { label: 'Open NCR', value: '1', tone: 'warn' },
    ],
    x: 152,
    y: 428,
    from: [296, 382],
    ctrl: [212, 420],
  },
  {
    key: 'traceability',
    title: 'Traceability',
    icon: GitBranch,
    rows: [
      { label: 'LOT-2048', value: 'Traceable', tone: 'info' },
      { label: 'Retrieval', value: '< 60 sec' },
    ],
    x: 848,
    y: 428,
    from: [704, 382],
    ctrl: [788, 420],
  },
  {
    key: 'finance',
    title: 'Finance',
    icon: Landmark,
    rows: [
      { label: 'Production cost', value: '$184,240' },
      { label: 'Margin', value: '42.9%', tone: 'ok' },
    ],
    x: 500,
    y: 524,
    from: [500, 450],
    ctrl: [500, 496],
  },
]

const pathFor = (s: Satellite) =>
  `M ${s.from[0]} ${s.from[1]} Q ${s.ctrl[0]} ${s.ctrl[1]} ${s.x} ${s.y}`

const pct = (value: number, total: number) => `${(value / total) * 100}%`

const toneClass: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  info: 'text-info',
}

const schedule = [
  { machine: 'CNC-01', load: 92 },
  { machine: 'CNC-02', load: 81 },
  { machine: 'CNC-03', load: 63 },
  { machine: 'CNC-04', load: 87 },
]

/* The one genuinely live figure on the page. */
const completed = ref(342)
const utilisation = ref(87)
let ticker = 0

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ q, reduced }) => {
  const lines = Array.from(root.value?.querySelectorAll<SVGPathElement>('[data-line]') ?? [])

  if (reduced) {
    gsap.set(q('[data-anim]'), { opacity: 1 })
    lines.forEach((line) => drawPath(line))
    return
  }

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  tl.fromTo(q('[data-hero-grid]'), { opacity: 0 }, { opacity: 1, duration: 0.9 })
    .fromTo(
      q('[data-hero-console]'),
      { opacity: 0, y: 26, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75 },
      '-=0.55',
    )
    .fromTo(
      q('[data-hero-tile]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 },
      '-=0.35',
    )
    .fromTo(
      q('[data-hero-bar] span > span'),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, stagger: 0.06, ease: 'power2.inOut' },
      '-=0.25',
    )
    .fromTo(
      q('[data-hero-card]'),
      { opacity: 0, y: 18, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
      '-=0.45',
    )

  // Connectors draw outward as each card lands.
  lines.forEach((line, index) => {
    const tween = drawPath(line, { duration: 0.7, ease: 'power2.out' })
    if (tween) tl.add(tween, 1.15 + index * 0.08)
  })

  // Continuous, low-amplitude drift. Transform-only, so it never costs layout.
  q('[data-hero-float]').forEach((card, index) => {
    gsap.to(card, {
      y: index % 2 === 0 ? -7 : 6,
      duration: 4.5 + index * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.8 + index * 0.2,
    })
  })

  ticker = window.setInterval(() => {
    if (document.hidden) return
    completed.value = completed.value >= 498 ? 342 : completed.value + 1
    utilisation.value = 84 + Math.round(Math.sin(completed.value / 6) * 4)
  }, 2400)
})

onBeforeUnmount(() => window.clearInterval(ticker))
</script>

<template>
  <div ref="root" class="relative">
    <!-- Desktop: the full connected diagram. -->
    <div
      class="relative mx-auto hidden w-full max-w-5xl lg:block"
      style="aspect-ratio: 1000 / 600"
      role="img"
      aria-label="A central plant operations console connected to procurement, inventory, production, quality, traceability and finance modules."
    >
      <div
        data-hero-grid
        class="pointer-events-none absolute inset-0 grid-backdrop radial-fade"
        aria-hidden="true"
      />

      <svg
        class="pointer-events-none absolute inset-0 h-full w-full"
        :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#4C8DFF" stop-opacity="1" />
            <stop offset="1" stop-color="#22D3EE" stop-opacity="0.55" />
          </linearGradient>
        </defs>

        <path
          v-for="s in satellites"
          :key="s.key"
          data-line
          :d="pathFor(s)"
          stroke="url(#hero-line)"
          stroke-width="2.25"
          stroke-linecap="round"
        />
        <path
          v-for="s in satellites"
          :key="`flow-${s.key}`"
          :d="pathFor(s)"
          stroke="#22D3EE"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="2 22"
          class="animate-dash-flow opacity-60"
        />
      </svg>

      <!-- Central console. Outer div positions, inner div animates. -->
      <div class="absolute left-1/2 top-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2">
        <div data-anim data-hero-console data-hero-float class="will-anim">
          <div class="panel overflow-hidden shadow-lift">
            <div
              class="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-ok animate-pulse-dot" aria-hidden="true" />
              <p class="font-mono text-xxs uppercase tracking-[0.16em] text-steel-400">
                Plant 01 · Operations
              </p>
              <p class="ml-auto font-mono text-xxs text-steel-600">Live</p>
            </div>

            <div class="grid grid-cols-2 gap-2 p-3">
              <div
                data-anim
                data-hero-tile
                class="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5"
              >
                <p class="data-label">Output today</p>
                <p class="mt-1 font-mono text-xl font-semibold tabular-nums text-steel-50">
                  {{ completed }}
                </p>
                <p class="mt-0.5 font-mono text-xxs text-steel-500">of 500 units</p>
              </div>
              <div
                data-anim
                data-hero-tile
                class="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5"
              >
                <p class="data-label">Utilisation</p>
                <p class="mt-1 font-mono text-xl font-semibold tabular-nums text-steel-50">
                  {{ utilisation }}%
                </p>
                <p class="mt-0.5 font-mono text-xxs text-ok">On schedule</p>
              </div>
            </div>

            <div data-hero-bar class="space-y-1.5 px-3 pb-3">
              <div v-for="row in schedule" :key="row.machine" class="flex items-center gap-2">
                <span class="w-14 shrink-0 font-mono text-xxs text-steel-500">{{ row.machine }}</span>
                <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    class="block h-full origin-left rounded-full"
                    :class="row.load > 88 ? 'bg-warn' : 'bg-accent-500'"
                    :style="{ width: `${row.load}%` }"
                  />
                </span>
                <span class="w-8 shrink-0 text-right font-mono text-xxs text-steel-400">
                  {{ row.load }}%
                </span>
              </div>
            </div>

            <div
              class="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-3 py-2"
            >
              <span class="font-mono text-xxs text-steel-500">WO-2048 · CNC-04</span>
              <span class="chip py-0.5 text-ok">Running</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Satellite module cards -->
      <div
        v-for="s in satellites"
        :key="s.key"
        class="absolute w-[19%] -translate-x-1/2 -translate-y-1/2"
        :style="{ left: pct(s.x, VIEW_W), top: pct(s.y, VIEW_H) }"
      >
        <article
          data-anim
          data-hero-card
          data-hero-float
          class="will-anim rounded-xl border border-white/[0.08] bg-ink-850/95 p-2.5 shadow-panel backdrop-blur-sm"
        >
          <div class="flex items-center gap-1.5">
            <component :is="s.icon" class="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
            <p class="text-xs font-medium text-steel-100">{{ s.title }}</p>
          </div>
          <dl class="mt-2 space-y-1">
            <div
              v-for="row in s.rows"
              :key="row.label"
              class="flex items-baseline justify-between gap-2"
            >
              <dt class="truncate font-mono text-[0.625rem] text-steel-500">{{ row.label }}</dt>
              <dd
                class="shrink-0 font-mono text-[0.625rem] tabular-nums"
                :class="row.tone ? toneClass[row.tone] : 'text-steel-200'"
              >
                {{ row.value }}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </div>

    <!-- Mobile and tablet: the same records, stacked. No absolute positioning. -->
    <div class="lg:hidden">
      <div data-anim data-hero-console class="panel overflow-hidden">
        <div class="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
          <span class="h-1.5 w-1.5 rounded-full bg-ok animate-pulse-dot" aria-hidden="true" />
          <p class="font-mono text-xxs uppercase tracking-[0.16em] text-steel-400">
            Plant 01 · Operations
          </p>
          <p class="ml-auto font-mono text-xxs text-steel-600">Live</p>
        </div>

        <div class="grid grid-cols-2 gap-2 p-3">
          <div
            data-anim
            data-hero-tile
            class="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3"
          >
            <p class="data-label">Output today</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-steel-50">
              {{ completed }}
            </p>
            <p class="mt-0.5 font-mono text-xxs text-steel-500">of 500 units</p>
          </div>
          <div
            data-anim
            data-hero-tile
            class="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3"
          >
            <p class="data-label">Utilisation</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-steel-50">
              {{ utilisation }}%
            </p>
            <p class="mt-0.5 font-mono text-xxs text-ok">On schedule</p>
          </div>
        </div>

        <div data-hero-bar class="space-y-2 px-3 pb-3">
          <div v-for="row in schedule" :key="row.machine" class="flex items-center gap-2.5">
            <span class="w-16 shrink-0 font-mono text-xxs text-steel-500">{{ row.machine }}</span>
            <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                class="block h-full origin-left rounded-full"
                :class="row.load > 88 ? 'bg-warn' : 'bg-accent-500'"
                :style="{ width: `${row.load}%` }"
              />
            </span>
            <span class="w-9 shrink-0 text-right font-mono text-xxs text-steel-400">
              {{ row.load }}%
            </span>
          </div>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <article
          v-for="s in satellites"
          :key="`m-${s.key}`"
          data-anim
          data-hero-card
          class="rounded-xl border border-white/[0.08] bg-ink-850/90 p-3"
        >
          <div class="flex items-center gap-1.5">
            <component :is="s.icon" class="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
            <p class="text-xs font-medium text-steel-100">{{ s.title }}</p>
          </div>
          <dl class="mt-2 space-y-1">
            <div
              v-for="row in s.rows"
              :key="row.label"
              class="flex items-baseline justify-between gap-2"
            >
              <dt class="truncate font-mono text-[0.625rem] text-steel-500">{{ row.label }}</dt>
              <dd
                class="shrink-0 font-mono text-[0.625rem] tabular-nums"
                :class="row.tone ? toneClass[row.tone] : 'text-steel-200'"
              >
                {{ row.value }}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </div>
  </div>
</template>
