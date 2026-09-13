<script setup lang="ts">
import { ref } from 'vue'
import CtaButton from '@/components/common/CtaButton.vue'
import { cta } from '@/data/brand'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

/**
 * A fixed lattice, not a random one — random points cluster badly and the
 * layout has to look the same on every load.
 */
const COLS = 9
const ROWS = 4
const VIEW_W = 900
const VIEW_H = 320

const nodes = Array.from({ length: COLS * ROWS }, (_, index) => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  // Offset alternate rows so the lattice reads as a network, not graph paper.
  const x = (col + (row % 2 ? 0.5 : 0)) * (VIEW_W / COLS) + 40
  const y = row * (VIEW_H / ROWS) + 50
  return { id: `${col}-${row}`, x, y }
})

const links = nodes.flatMap((node, index) => {
  const right = nodes[index + 1]
  const below = nodes[index + COLS]
  const out: { id: string; x1: number; y1: number; x2: number; y2: number }[] = []
  if (right && index % COLS !== COLS - 1) {
    out.push({ id: `${node.id}-r`, x1: node.x, y1: node.y, x2: right.x, y2: right.y })
  }
  if (below) {
    out.push({ id: `${node.id}-d`, x1: node.x, y1: node.y, x2: below.x, y2: below.y })
  }
  return out
})

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.08 })

  if (reduced) return

  // Signal travelling across the lattice: a few links brighten at a time.
  gsap.fromTo(
    q('[data-link]'),
    { opacity: 0.12 },
    {
      opacity: 0.5,
      duration: 1.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.05, from: 'random' },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom top',
        toggleActions: 'play pause resume pause',
      },
    },
  )
})
</script>

<template>
  <section ref="root" id="cta" class="relative overflow-hidden border-t border-white/[0.07]">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg
        class="absolute inset-0 h-full w-full opacity-70"
        :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <line
          v-for="link in links"
          :key="link.id"
          data-link
          :x1="link.x1"
          :y1="link.y1"
          :x2="link.x2"
          :y2="link.y2"
          stroke="#4C8DFF"
          stroke-width="0.8"
          opacity="0.12"
        />
        <circle v-for="node in nodes" :key="node.id" :cx="node.x" :cy="node.y" r="1.6" fill="#4C8DFF" opacity="0.4" />
      </svg>
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(6, 8, 12, 0.6), #06080c 78%)"
      />
    </div>

    <div class="shell relative py-24 text-center sm:py-28 lg:py-32">
      <h2 class="display-2 mx-auto max-w-3xl" data-anim>
        Run your factory from one connected system.
      </h2>
      <p class="lede mx-auto mt-5 max-w-2xl" data-anim>
        Replace spreadsheets, disconnected systems and manual processes with a manufacturing ERP
        designed for the modern factory.
      </p>

      <div
        class="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
        data-anim
      >
        <CtaButton :to="cta.trial.to" variant="primary" size="lg" arrow>
          {{ cta.trial.label }}
        </CtaButton>
        <CtaButton :to="cta.demo.to" variant="secondary" size="lg">
          {{ cta.demo.label }}
        </CtaButton>
      </div>

      <p class="mt-6 font-mono text-xs text-steel-500" data-anim>
        No credit card for the trial · a demo runs against data like yours
      </p>
    </div>
  </section>
</template>
