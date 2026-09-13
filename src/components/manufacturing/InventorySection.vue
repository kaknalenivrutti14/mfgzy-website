<script setup lang="ts">
import { computed, ref } from 'vue'
import { Warehouse, ScanLine } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { stockCard, stockMoves, warehouse, type BinState } from '@/data/inventory'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

/** The bin the scan demo writes to. */
const SCANNED_BIN = 'A03-12'
const scannedQty = ref(1240)
const scanning = ref(false)
const lastMoveVisible = ref(false)

const formattedQty = computed(() => `${scannedQty.value.toLocaleString('en-US')} KG`)

const binState: Record<BinState, { dot: string; label: string; text: string }> = {
  ok: { dot: 'bg-ok', label: 'Available', text: 'text-steel-300' },
  reserved: { dot: 'bg-warn', label: 'Reserved', text: 'text-warn' },
  quarantine: { dot: 'bg-crit', label: 'Quarantine', text: 'text-crit' },
  empty: { dot: 'bg-steel-600', label: 'Empty', text: 'text-steel-600' },
}

const toneClass: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  info: 'text-info',
}

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  if (reduced) {
    lastMoveVisible.value = true
    return
  }

  const beam = el.querySelector<HTMLElement>('[data-beam]')
  if (!beam) return

  // Scan -> bin updates -> move appears. One loop, paused off-screen so it
  // costs nothing while the visitor is somewhere else on the page.
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 2.4,
    scrollTrigger: {
      trigger: el,
      start: 'top 75%',
      end: 'bottom top',
      toggleActions: 'play pause resume pause',
    },
  })

  tl.set(beam, { yPercent: -120, opacity: 0 })
    .call(() => {
      scanning.value = true
      lastMoveVisible.value = false
    })
    .to(beam, { opacity: 1, duration: 0.15 })
    .to(beam, { yPercent: 120, duration: 1.05, ease: 'power1.inOut' })
    .to(beam, { opacity: 0, duration: 0.2 })
    .call(() => {
      scanning.value = false
      scannedQty.value = 1240
    })
    .to(
      { value: 1240 },
      {
        value: 1426,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate() {
          scannedQty.value = Math.round((this.targets()[0] as { value: number }).value)
        },
      },
    )
    .call(() => {
      lastMoveVisible.value = true
    })
})
</script>

<template>
  <section ref="root" id="inventory" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Inventory"
        title="Know exactly what you have, where it is, and what it is worth."
        lede="Stock is held down to the bin, with the lot, batch or serial attached. A scan at the rack is the posting — there is no second entry later."
      />

      <div class="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <!-- Warehouse structure -->
        <div data-anim class="min-w-0">
          <UiWindow title="Warehouse" :breadcrumb="warehouse.name" status="4 racks" tone="idle">
            <ul class="space-y-3">
              <li v-for="rack in warehouse.racks" :key="rack.id">
                <div class="flex items-center gap-2">
                  <Warehouse class="h-3.5 w-3.5 text-steel-500" aria-hidden="true" />
                  <p class="font-mono text-xs text-steel-200">{{ rack.id }}</p>
                </div>

                <ul class="mt-1.5 space-y-1 border-l border-white/[0.08] pl-3.5">
                  <li
                    v-for="bin in rack.bins"
                    :key="bin.id"
                    class="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors duration-300"
                    :class="bin.id === SCANNED_BIN ? 'bg-accent-500/10 ring-1 ring-accent-500/30' : ''"
                  >
                    <span
                      class="h-1.5 w-1.5 shrink-0 rounded-full"
                      :class="binState[bin.state].dot"
                      aria-hidden="true"
                    />
                    <span class="w-16 shrink-0 font-mono text-[0.6875rem] text-steel-300">
                      {{ bin.id }}
                    </span>
                    <span class="min-w-0 flex-1 truncate text-[0.6875rem] text-steel-400">
                      {{ bin.material }}
                    </span>
                    <span
                      class="shrink-0 font-mono text-[0.6875rem] tabular-nums"
                      :class="binState[bin.state].text"
                    >
                      {{ bin.id === SCANNED_BIN ? formattedQty : bin.qty }}
                    </span>
                  </li>
                </ul>
              </li>
            </ul>

            <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/[0.07] pt-3">
              <li
                v-for="(meta, state) in binState"
                :key="state"
                class="flex items-center gap-1.5 font-mono text-[0.625rem] text-steel-500"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="meta.dot" aria-hidden="true" />
                {{ meta.label }}
              </li>
            </ul>
          </UiWindow>
        </div>

        <div class="min-w-0 space-y-5">
          <!-- Scan -> posting -->
          <div data-anim>
            <UiWindow
              title="Goods receipt"
              breadcrumb="GRN-000847"
              :status="scanning ? 'Scanning' : 'Posted'"
              :tone="scanning ? 'info' : 'ok'"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  class="relative grid h-24 w-full shrink-0 place-items-center overflow-hidden rounded-lg border border-white/[0.08] bg-ink-900 px-5 sm:w-44"
                >
                  <svg viewBox="0 0 120 44" class="h-11 w-full" aria-hidden="true">
                    <g fill="#A7B4C6">
                      <rect x="4" y="2" width="2" height="40" />
                      <rect x="9" y="2" width="1" height="40" />
                      <rect x="13" y="2" width="3" height="40" />
                      <rect x="20" y="2" width="1" height="40" />
                      <rect x="24" y="2" width="2" height="40" />
                      <rect x="30" y="2" width="4" height="40" />
                      <rect x="38" y="2" width="1" height="40" />
                      <rect x="42" y="2" width="2" height="40" />
                      <rect x="48" y="2" width="3" height="40" />
                      <rect x="55" y="2" width="1" height="40" />
                      <rect x="59" y="2" width="2" height="40" />
                      <rect x="65" y="2" width="4" height="40" />
                      <rect x="73" y="2" width="1" height="40" />
                      <rect x="77" y="2" width="2" height="40" />
                      <rect x="83" y="2" width="3" height="40" />
                      <rect x="90" y="2" width="1" height="40" />
                      <rect x="94" y="2" width="2" height="40" />
                      <rect x="100" y="2" width="4" height="40" />
                      <rect x="108" y="2" width="1" height="40" />
                      <rect x="112" y="2" width="3" height="40" />
                    </g>
                  </svg>
                  <span
                    data-beam
                    class="pointer-events-none absolute inset-x-0 top-1/2 h-8 opacity-0"
                    style="background: linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.32), transparent)"
                    aria-hidden="true"
                  />
                  <span
                    class="pointer-events-none absolute inset-x-4 top-1/2 h-px bg-signal/70"
                    aria-hidden="true"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <ScanLine class="h-4 w-4 text-signal" aria-hidden="true" />
                    <p class="font-mono text-xs text-steel-200">LOT-2026-0842</p>
                  </div>
                  <p class="mt-2 text-sm leading-relaxed text-steel-400">
                    The operator scans the lot label at the rack. Stock, the purchase order line
                    and the valuation all move on that one action.
                  </p>
                </div>
              </div>

              <ul class="mt-4 grid gap-2 border-t border-white/[0.07] pt-3 sm:grid-cols-3">
                <li
                  v-for="effect in ['Stock balance', 'PO-1082 line', 'Inventory value']"
                  :key="effect"
                  class="flex items-center gap-2 font-mono text-[0.625rem] transition-colors duration-500"
                  :class="lastMoveVisible ? 'text-ok' : 'text-steel-600'"
                >
                  <span
                    class="h-1 w-1 rounded-full transition-colors duration-500"
                    :class="lastMoveVisible ? 'bg-ok' : 'bg-steel-600'"
                    aria-hidden="true"
                  />
                  {{ effect }} updated
                </li>
              </ul>
            </UiWindow>
          </div>

          <!-- Stock card + moves -->
          <div data-anim class="grid gap-5 sm:grid-cols-2">
            <UiWindow title="Stock card" :breadcrumb="stockCard.sku">
              <dl class="space-y-2.5">
                <div
                  v-for="row in [
                    { label: 'Material', value: stockCard.material },
                    { label: 'Warehouse', value: stockCard.warehouse },
                    { label: 'Bin', value: stockCard.bin },
                    { label: 'Available', value: stockCard.available },
                    { label: 'Reserved', value: stockCard.reserved },
                    { label: 'Lot', value: stockCard.lot },
                    { label: 'Valuation', value: stockCard.valuation },
                  ]"
                  :key="row.label"
                  class="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2 last:border-0 last:pb-0"
                >
                  <dt class="data-label">{{ row.label }}</dt>
                  <dd class="data-value shrink-0 text-xs">{{ row.value }}</dd>
                </div>
              </dl>
              <p class="mt-3 font-mono text-[0.625rem] text-steel-600">
                Valued at {{ stockCard.method.toLowerCase() }}
              </p>
            </UiWindow>

            <UiWindow title="Stock moves" breadcrumb="Today" status="4" tone="info">
              <ul class="space-y-2">
                <li
                  v-for="move in stockMoves"
                  :key="move.id"
                  class="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                >
                  <div class="flex items-baseline justify-between gap-2">
                    <p class="text-[0.6875rem] font-medium text-steel-200">{{ move.type }}</p>
                    <p class="shrink-0 font-mono text-[0.6875rem] tabular-nums" :class="toneClass[move.tone]">
                      {{ move.qty }}
                    </p>
                  </div>
                  <div class="mt-1 flex items-baseline justify-between gap-2">
                    <p class="font-mono text-[0.625rem] text-steel-600">{{ move.doc }}</p>
                    <p class="shrink-0 font-mono text-[0.625rem] text-steel-600">{{ move.bin }}</p>
                  </div>
                </li>
              </ul>
            </UiWindow>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
