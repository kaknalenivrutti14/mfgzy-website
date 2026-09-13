<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import AnimatedCounter from '@/components/common/AnimatedCounter.vue'
import { costBreakdown, financeChain, financeKpis } from '@/data/production'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

const kpiFormat: Record<string, { prefix?: string; suffix?: string; decimals: number }> = {
  'currency-m': { prefix: '$', suffix: 'M', decimals: 2 },
  'currency-k': { prefix: '$', suffix: 'K', decimals: 0 },
  percent: { suffix: '%', decimals: 1 },
}

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  if (reduced) return

  gsap.fromTo(
    q('[data-cost-bar]'),
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 62%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="finance" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Finance"
        title="Production and finance finally speak the same language."
        lede="Cost is not an estimate typed in later. It accumulates on the work order from the material issued, the hours booked and the machine time recorded — and posts to the ledger from the same document."
      />

      <!-- Posting chain -->
      <div data-anim class="scroll-x mt-10 pb-2">
        <ol class="flex min-w-max items-stretch gap-2">
          <li v-for="(link, index) in financeChain" :key="link.id" class="flex items-stretch gap-2">
            <div class="w-44 rounded-xl border border-white/[0.07] bg-ink-850/70 px-3.5 py-3">
              <p class="text-sm font-medium text-steel-100">{{ link.label }}</p>
              <p class="mt-1 font-mono text-[0.625rem] text-steel-500">{{ link.doc }}</p>
              <p class="mt-2 font-mono text-[0.625rem] text-accent-400">{{ link.posting }}</p>
            </div>
            <ArrowRight
              v-if="index < financeChain.length - 1"
              class="h-4 w-4 shrink-0 self-center text-steel-600"
              aria-hidden="true"
            />
          </li>
        </ol>
      </div>

      <!-- KPIs -->
      <dl data-anim class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="kpi in financeKpis" :key="kpi.label" class="panel p-5">
          <dt class="data-label">{{ kpi.label }}</dt>
          <dd class="mt-2 font-mono text-2xl font-semibold tracking-tight text-steel-50 sm:text-3xl">
            <AnimatedCounter
              :value="kpi.value"
              :prefix="kpiFormat[kpi.format].prefix"
              :suffix="kpiFormat[kpi.format].suffix"
              :decimals="kpiFormat[kpi.format].decimals"
            />
          </dd>
          <p class="mt-1.5 font-mono text-xxs" :class="kpi.tone === 'ok' ? 'text-ok' : 'text-steel-500'">
            {{ kpi.delta }}
          </p>
        </div>
      </dl>

      <div class="mt-5 grid gap-5 lg:grid-cols-2">
        <!-- Cost structure -->
        <div data-anim>
          <UiWindow title="Order costing" breadcrumb="WO-2048" status="Closed" tone="ok">
            <ul class="space-y-3.5">
              <li v-for="item in costBreakdown" :key="item.label">
                <div class="flex items-baseline justify-between gap-3">
                  <span class="text-xs text-steel-300">{{ item.label }}</span>
                  <span class="font-mono text-xs tabular-nums text-steel-300">{{ item.value }}%</span>
                </div>
                <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    data-cost-bar
                    class="h-full origin-left rounded-full"
                    :style="{ width: `${item.value}%`, backgroundColor: item.color }"
                  />
                </div>
              </li>
            </ul>

            <dl class="mt-5 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-4">
              <div class="panel-flat px-3 py-2.5">
                <dt class="data-label">Planned cost</dt>
                <dd class="mt-1 font-mono text-xs text-steel-200">$104,900</dd>
              </div>
              <div class="panel-flat px-3 py-2.5">
                <dt class="data-label">Actual cost</dt>
                <dd class="mt-1 font-mono text-xs text-warn">$106,580</dd>
              </div>
            </dl>
            <p class="mt-3 text-xs leading-relaxed text-steel-500">
              The $1,680 variance is two reworked units and 47 minutes of CNC-04 downtime — both
              traceable to the records that caused them.
            </p>
          </UiWindow>
        </div>

        <!-- What this replaces -->
        <div data-anim class="panel p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-steel-50">What stops happening</h3>
          <ul class="mt-4 space-y-3.5">
            <li
              v-for="item in [
                {
                  before: 'Inventory value re-counted into a spreadsheet at month end',
                  after: 'Valuation moves with every receipt, issue and confirmation',
                },
                {
                  before: 'Production cost estimated from last year’s standard',
                  after: 'Cost accumulated from the material and hours actually used',
                },
                {
                  before: 'Invoices re-keyed from delivery notes',
                  after: 'Invoice raised from the delivery it belongs to',
                },
                {
                  before: 'Three days of reconciliation before the close',
                  after: 'One ledger that was never out of step',
                },
              ]"
              :key="item.before"
              class="border-b border-white/[0.05] pb-3.5 last:border-0 last:pb-0"
            >
              <p class="text-xs leading-relaxed text-steel-500 line-through decoration-crit/50">
                {{ item.before }}
              </p>
              <p class="mt-1.5 flex gap-2 text-xs leading-relaxed text-steel-200">
                <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ok" aria-hidden="true" />
                {{ item.after }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
