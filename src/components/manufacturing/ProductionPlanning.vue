<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { machineUtilisation, mrpShortages, planningSteps } from '@/data/production'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

const barColor: Record<string, string> = {
  high: 'bg-warn',
  ok: 'bg-accent-500',
  low: 'bg-steel-500',
}

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  if (reduced) return

  // MRP runs down the chain, then the machine load bars fill.
  gsap.fromTo(
    q('[data-mrp-step]'),
    { opacity: 0.35 },
    {
      opacity: 1,
      duration: 0.32,
      stagger: 0.13,
      scrollTrigger: { trigger: el, start: 'top 68%', once: true },
    },
  )

  gsap.fromTo(
    q('[data-load-bar]'),
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 62%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="planning" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Production planning"
        title="Turn demand into an executable production plan."
        lede="MRP nets open demand against stock, open purchase orders and work in progress, then proposes what to buy and what to make. You approve suggestions; you do not assemble them."
      />

      <!-- Planning chain -->
      <div data-anim class="scroll-x mt-10 pb-2">
        <ol class="flex min-w-max items-stretch gap-2">
          <li v-for="(item, index) in planningSteps" :key="item.id" class="flex items-stretch gap-2">
            <div
              data-mrp-step
              class="w-44 rounded-xl border border-white/[0.07] bg-ink-850/70 px-3.5 py-3"
            >
              <p class="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-steel-600">
                0{{ index + 1 }}
              </p>
              <p class="mt-1.5 text-sm font-medium text-steel-100">{{ item.label }}</p>
              <p class="mt-1 font-mono text-[0.625rem] text-accent-400">{{ item.value }}</p>
            </div>
            <ChevronRight
              v-if="index < planningSteps.length - 1"
              class="h-4 w-4 shrink-0 self-center text-steel-600"
              aria-hidden="true"
            />
          </li>
        </ol>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-2">
        <!-- MRP result -->
        <div data-anim>
          <UiWindow title="MRP run" breadcrumb="Week 38" status="3 shortages" tone="warn">
            <div class="scroll-x">
              <table class="w-full min-w-[26rem] border-collapse text-left">
                <thead>
                  <tr class="border-b border-white/[0.07]">
                    <th scope="col" class="data-label pb-2 font-normal">Material</th>
                    <th scope="col" class="data-label pb-2 text-right font-normal">Required</th>
                    <th scope="col" class="data-label pb-2 text-right font-normal">On hand</th>
                    <th scope="col" class="data-label pb-2 text-right font-normal">Short</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in mrpShortages"
                    :key="row.material"
                    class="border-b border-white/[0.04] last:border-0"
                  >
                    <td class="py-2.5 pr-3 text-xs text-steel-200">{{ row.material }}</td>
                    <td class="py-2.5 text-right font-mono text-[0.6875rem] tabular-nums text-steel-400">
                      {{ row.required }}
                    </td>
                    <td class="py-2.5 text-right font-mono text-[0.6875rem] tabular-nums text-steel-400">
                      {{ row.onHand }}
                    </td>
                    <td
                      class="py-2.5 text-right font-mono text-[0.6875rem] tabular-nums"
                      :class="row.short === 'Covered' ? 'text-ok' : 'text-warn'"
                    >
                      {{ row.short }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul class="mt-4 space-y-1.5 border-t border-white/[0.07] pt-3">
              <li
                v-for="row in mrpShortages"
                :key="`action-${row.material}`"
                class="flex items-center justify-between gap-3 font-mono text-[0.625rem]"
              >
                <span class="truncate text-steel-500">{{ row.material }}</span>
                <span
                  class="shrink-0"
                  :class="row.action === 'No action' ? 'text-steel-600' : 'text-accent-400'"
                >
                  {{ row.action }}
                </span>
              </li>
            </ul>
          </UiWindow>
        </div>

        <!-- Machine load -->
        <div data-anim>
          <UiWindow title="Machine utilisation" breadcrumb="Next 6 days" status="5 machines" tone="info">
            <ul class="space-y-3.5">
              <li v-for="machine in machineUtilisation" :key="machine.machine">
                <div class="flex items-baseline justify-between gap-3">
                  <span class="font-mono text-xs text-steel-300">{{ machine.machine }}</span>
                  <span
                    class="font-mono text-xs tabular-nums"
                    :class="machine.state === 'high' ? 'text-warn' : 'text-steel-300'"
                  >
                    {{ machine.value }}%
                  </span>
                </div>
                <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    data-load-bar
                    class="h-full origin-left rounded-full"
                    :class="barColor[machine.state]"
                    :style="{ width: `${machine.value}%` }"
                  />
                </div>
              </li>
            </ul>

            <div class="mt-5 grid gap-2 border-t border-white/[0.07] pt-4 sm:grid-cols-2">
              <div class="panel-flat px-3 py-2.5">
                <p class="data-label">Bottleneck</p>
                <p class="mt-1 font-mono text-xs text-warn">CNC-01 · 92%</p>
              </div>
              <div class="panel-flat px-3 py-2.5">
                <p class="data-label">Spare capacity</p>
                <p class="mt-1 font-mono text-xs text-ok">CNC-03 · 37%</p>
              </div>
            </div>

            <p class="mt-3 text-xs leading-relaxed text-steel-500">
              WO-2048 can move to CNC-03 without pushing another order late — the schedule shows
              the trade before you commit it.
            </p>
          </UiWindow>
        </div>
      </div>
    </div>
  </section>
</template>
