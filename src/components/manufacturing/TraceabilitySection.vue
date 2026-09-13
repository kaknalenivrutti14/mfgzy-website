<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftRight, ArrowRight, GitBranch } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { genealogyEdges, genealogyNodes } from '@/data/inventory'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

/** Diagram coordinate space; the container scrolls horizontally below it. */
const VIEW_W = 1200
const VIEW_H = 420
const COL_W = VIEW_W / 6
const ROW_H = VIEW_H / 3
const NODE_HALF = 84

const cx = (col: number) => col * COL_W + COL_W / 2
const cy = (row: number) => row * ROW_H + ROW_H / 2

const edgePath = (fromId: string, toId: string) => {
  const from = genealogyNodes.find((n) => n.id === fromId)
  const to = genealogyNodes.find((n) => n.id === toId)
  if (!from || !to) return ''
  const x1 = cx(from.col) + NODE_HALF
  const y1 = cy(from.row)
  const x2 = cx(to.col) - NODE_HALF
  const y2 = cy(to.row)
  const dx = Math.max(40, (x2 - x1) * 0.55)
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

/* Selection drives both directions of the trace. */
const selectedId = ref('wo')
const expanded = ref(false)

function walk(startId: string, direction: 'forward' | 'backward'): string[] {
  const seen = new Set<string>()
  const queue = [startId]
  while (queue.length) {
    const current = queue.shift() as string
    for (const edge of genealogyEdges) {
      const [from, to] =
        direction === 'forward' ? [edge.from, edge.to] : [edge.to, edge.from]
      if (from === current && !seen.has(to)) {
        seen.add(to)
        queue.push(to)
      }
    }
  }
  return [...seen]
}

const forwardIds = computed(() => walk(selectedId.value, 'forward'))
const backwardIds = computed(() => walk(selectedId.value, 'backward'))
const inTrace = computed(
  () => new Set([selectedId.value, ...forwardIds.value, ...backwardIds.value]),
)

const nodeById = (id: string) => genealogyNodes.find((n) => n.id === id)
const selected = computed(() => nodeById(selectedId.value))

const edgeInTrace = (fromId: string, toId: string) =>
  inTrace.value.has(fromId) && inTrace.value.has(toId)

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  const paths = Array.from(el.querySelectorAll<SVGPathElement>('[data-edge]'))
  const nodes = q('[data-node]')

  if (reduced) {
    gsap.set(nodes, { opacity: 1 })
    return
  }

  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 68%', once: true },
  })

  // Material flows left to right: nodes land a column at a time, and each
  // connector draws into the node it feeds.
  tl.fromTo(
    nodes,
    { opacity: 0, x: -14 },
    { opacity: 1, x: 0, duration: 0.45, stagger: 0.11, ease: 'power2.out' },
  )

  paths.forEach((path, index) => {
    const length = path.getTotalLength()
    tl.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' },
      0.25 + index * 0.11,
    )
  })
})
</script>

<template>
  <section ref="root" id="traceability" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Traceability"
        title="Trace every lot. From raw material to customer."
        lede="Genealogy is built as material moves, not reconstructed afterwards. Pick any node and the system answers both questions: what went into this, and where did it end up."
      />

      <div class="mt-10 flex flex-wrap items-center gap-3" data-anim>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-accent-500/35 bg-accent-500/10 px-4 py-2.5 text-sm font-medium text-accent-200 transition-colors duration-200 hover:border-accent-500/60 hover:bg-accent-500/15"
          :aria-expanded="expanded"
          aria-controls="genealogy-detail"
          @click="expanded = !expanded"
        >
          <GitBranch class="h-4 w-4" aria-hidden="true" />
          {{ expanded ? 'Hide genealogy detail' : 'Explore Genealogy' }}
        </button>
        <p class="font-mono text-xxs text-steel-500">
          Selected · {{ selected?.label }} — click any node to re-trace
        </p>
      </div>

      <!-- Genealogy canvas -->
      <div data-anim class="panel mt-6 overflow-hidden">
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3"
        >
          <p class="font-mono text-xxs uppercase tracking-[0.14em] text-steel-400">
            Lot genealogy · LOT-00128
          </p>
          <p class="ml-auto font-mono text-xxs text-ok">Retrieved in 0.4 s</p>
        </div>

        <div class="scroll-x p-4 sm:p-6">
          <div
            class="relative mx-auto"
            :style="{ width: '100%', minWidth: '860px', aspectRatio: `${VIEW_W} / ${VIEW_H}` }"
          >
            <svg
              class="absolute inset-0 h-full w-full"
              :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
              fill="none"
              aria-hidden="true"
            >
              <path
                v-for="edge in genealogyEdges"
                :key="`${edge.from}-${edge.to}`"
                data-edge
                :d="edgePath(edge.from, edge.to)"
                :stroke="edgeInTrace(edge.from, edge.to) ? '#4C8DFF' : '#2D3A4B'"
                stroke-width="2"
                class="transition-[stroke] duration-300"
              />
            </svg>

            <button
              v-for="node in genealogyNodes"
              :key="node.id"
              type="button"
              data-node
              class="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2.5 text-left transition-[border-color,background-color,box-shadow] duration-300"
              :class="
                node.id === selectedId
                  ? 'border-accent-500 bg-ink-800 shadow-glow'
                  : inTrace.has(node.id)
                    ? 'border-accent-500/35 bg-ink-850'
                    : 'border-white/[0.08] bg-ink-850/70 opacity-60'
              "
              :style="{
                left: `${(cx(node.col) / VIEW_W) * 100}%`,
                top: `${(cy(node.row) / VIEW_H) * 100}%`,
                width: `${(NODE_HALF * 2 / VIEW_W) * 100}%`,
              }"
              :aria-pressed="node.id === selectedId"
              @click="selectedId = node.id"
            >
              <p class="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-steel-500">
                {{ node.kind }}
              </p>
              <p class="mt-1 truncate font-mono text-xs text-steel-50">{{ node.label }}</p>
              <p class="mt-0.5 truncate text-[0.625rem] text-steel-500">{{ node.meta }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Forward / backward detail -->
      <div
        id="genealogy-detail"
        class="grid transition-[grid-template-rows,opacity] duration-400 ease-out"
        :class="expanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'"
      >
        <div class="overflow-hidden">
          <div class="grid gap-5 md:grid-cols-2">
            <article class="panel p-5">
              <header class="flex items-center gap-2">
                <ArrowRight class="h-4 w-4 text-accent-400" aria-hidden="true" />
                <h3 class="text-sm font-semibold text-steel-50">Forward traceability</h3>
              </header>
              <p class="mt-1.5 text-xs text-steel-500">Where did this material go?</p>

              <ol v-if="forwardIds.length" class="mt-4 space-y-2">
                <li
                  v-for="id in forwardIds"
                  :key="`f-${id}`"
                  class="flex items-baseline justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                >
                  <span class="text-[0.6875rem] text-steel-400">{{ nodeById(id)?.kind }}</span>
                  <span class="shrink-0 font-mono text-[0.6875rem] text-steel-100">
                    {{ nodeById(id)?.label }}
                  </span>
                </li>
              </ol>
              <p v-else class="mt-4 font-mono text-xs text-steel-600">
                End of the chain — nothing downstream.
              </p>
            </article>

            <article class="panel p-5">
              <header class="flex items-center gap-2">
                <ArrowLeftRight class="h-4 w-4 text-signal" aria-hidden="true" />
                <h3 class="text-sm font-semibold text-steel-50">Backward traceability</h3>
              </header>
              <p class="mt-1.5 text-xs text-steel-500">Where did this product come from?</p>

              <ol v-if="backwardIds.length" class="mt-4 space-y-2">
                <li
                  v-for="id in backwardIds"
                  :key="`b-${id}`"
                  class="flex items-baseline justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                >
                  <span class="text-[0.6875rem] text-steel-400">{{ nodeById(id)?.kind }}</span>
                  <span class="shrink-0 font-mono text-[0.6875rem] text-steel-100">
                    {{ nodeById(id)?.label }}
                  </span>
                </li>
              </ol>
              <p v-else class="mt-4 font-mono text-xs text-steel-600">
                Start of the chain — this is the raw material.
              </p>
            </article>
          </div>

          <p class="mt-4 text-xs leading-relaxed text-steel-500">
            A recall scopes to exactly these records. For
            <span class="font-mono text-steel-300">{{ selected?.label }}</span>
            that is {{ forwardIds.length }} downstream record{{ forwardIds.length === 1 ? '' : 's' }}
            and {{ backwardIds.length }} upstream — not a warehouse-wide quarantine.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
