<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronRight } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { procurementSteps, suppliers } from '@/data/production'
import { reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const activeIndex = ref(2)
const active = computed(() => procurementSteps[activeIndex.value])

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })
})
</script>

<template>
  <section ref="root" id="procurement" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Procurement"
        title="From purchase request to received material."
        lede="Requisitions come from the plan, quotes are compared on the same line, and approval routes by value. The receipt closes against the order it came from."
      />

      <!-- Workflow -->
      <div data-anim class="scroll-x mt-10 pb-2">
        <ol class="flex min-w-max items-stretch gap-2">
          <li v-for="(item, index) in procurementSteps" :key="item.id" class="flex items-stretch gap-2">
            <button
              type="button"
              class="w-40 rounded-xl border px-3.5 py-3 text-left transition-[border-color,background-color] duration-200"
              :class="
                index === activeIndex
                  ? 'border-accent-500/45 bg-accent-500/[0.08]'
                  : 'border-white/[0.07] bg-ink-850/70 hover:border-white/20'
              "
              :aria-current="index === activeIndex ? 'step' : undefined"
              @click="activeIndex = index"
            >
              <p
                class="font-mono text-[0.625rem] uppercase tracking-[0.1em]"
                :class="index <= activeIndex ? 'text-accent-400' : 'text-steel-600'"
              >
                Step {{ index + 1 }}
              </p>
              <p class="mt-1.5 truncate text-sm font-medium text-steel-100">{{ item.label }}</p>
              <p class="mt-1 truncate font-mono text-[0.625rem] text-steel-500">{{ item.doc }}</p>
            </button>
            <ChevronRight
              v-if="index < procurementSteps.length - 1"
              class="h-4 w-4 shrink-0 self-center text-steel-600"
              aria-hidden="true"
            />
          </li>
        </ol>
      </div>

      <p class="mt-4 min-h-[1.5rem] text-sm text-steel-400" data-anim aria-live="polite">
        {{ active.note }}
      </p>

      <!-- Supplier comparison -->
      <div data-anim class="mt-6">
        <UiWindow title="Supplier comparison" breadcrumb="RFQ-0338" status="Awarded" tone="ok">
          <div class="scroll-x">
            <table class="w-full min-w-[36rem] border-collapse text-left">
              <caption class="sr-only">
                Quotes for Steel Sheet 304, 1,800 KG
              </caption>
              <thead>
                <tr class="border-b border-white/[0.07]">
                  <th scope="col" class="data-label pb-2.5 font-normal">Supplier</th>
                  <th scope="col" class="data-label pb-2.5 text-right font-normal">Price / KG</th>
                  <th scope="col" class="data-label pb-2.5 text-right font-normal">Lead time</th>
                  <th scope="col" class="data-label pb-2.5 text-right font-normal">Rating</th>
                  <th scope="col" class="data-label pb-2.5 text-right font-normal">On-time</th>
                  <th scope="col" class="data-label pb-2.5 text-right font-normal">Award</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="supplier in suppliers"
                  :key="supplier.name"
                  class="border-b border-white/[0.04] transition-colors duration-200 last:border-0"
                  :class="supplier.awarded ? 'bg-accent-500/[0.06]' : ''"
                >
                  <th scope="row" class="py-3 pr-3 text-sm font-medium text-steel-100">
                    {{ supplier.name }}
                  </th>
                  <td class="py-3 text-right font-mono text-xs tabular-nums text-steel-300">
                    {{ supplier.price }}
                  </td>
                  <td
                    class="py-3 text-right font-mono text-xs tabular-nums"
                    :class="supplier.lead === '5 days' ? 'text-ok' : 'text-steel-300'"
                  >
                    {{ supplier.lead }}
                  </td>
                  <td class="py-3 text-right font-mono text-xs tabular-nums text-steel-300">
                    {{ supplier.rating.toFixed(1) }}
                  </td>
                  <td class="py-3 text-right font-mono text-xs tabular-nums text-steel-300">
                    {{ supplier.otd }}
                  </td>
                  <td class="py-3 text-right">
                    <span
                      v-if="supplier.awarded"
                      class="inline-flex items-center gap-1.5 rounded-md bg-ok/12 px-2 py-1 font-mono text-[0.625rem] text-ok"
                    >
                      <Check class="h-3 w-3" aria-hidden="true" />
                      PO-1082
                    </span>
                    <span v-else class="font-mono text-[0.625rem] text-steel-600">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-4 border-t border-white/[0.07] pt-3 text-xs leading-relaxed text-steel-500">
            Supplier B is cheapest per kilo and still loses: twelve days of lead time pushes
            WO-2048 past its promise date. The comparison shows the reason the award was made,
            and the reason stays on the record.
          </p>
        </UiWindow>
      </div>
    </div>
  </section>
</template>
