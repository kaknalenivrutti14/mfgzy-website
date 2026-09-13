<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { flowStages, laneMeta } from '@/data/flow'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const active = computed(() => flowStages[activeIndex.value])
const progress = computed(() => (activeIndex.value / (flowStages.length - 1)) * 100)

const toneClass: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  crit: 'text-crit',
  info: 'text-info',
}

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.06 })

  if (!track.value) return

  // Scrub through the fourteen documents as the tall track passes the viewport.
  // CSS `position: sticky` does the pinning, so there is no pin-spacer to fight.
  gsap.to(
    {},
    {
      scrollTrigger: {
        trigger: track.value,
        start: 'top top+=120',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const next = Math.round(self.progress * (flowStages.length - 1))
          if (next !== activeIndex.value) activeIndex.value = next
        },
      },
    },
  )

  if (reduced) activeIndex.value = 0
})
</script>

<template>
  <section ref="root" id="flow" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="End to end"
        title="From raw material to finished product — connected end to end."
        lede="One customer order, followed through fourteen documents. Every step writes to the same record, so nothing is re-keyed and nothing drifts."
      />
    </div>

    <!-- Desktop and tablet: a tall track with a sticky stage inside it. -->
    <div ref="track" class="relative mt-12 hidden md:block" :style="{ height: `${flowStages.length * 24}vh` }">
      <div class="sticky top-24">
        <div class="shell">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <!-- The chain, all of it visible at once. -->
            <div class="relative">
              <span
                class="absolute left-[7px] top-2 w-px bg-white/[0.09]"
                style="height: calc(100% - 1rem)"
                aria-hidden="true"
              />
              <span
                class="absolute left-[7px] top-2 w-px bg-accent-500 transition-[height] duration-300 ease-out"
                :style="{ height: `calc(${progress}% * 0.94)` }"
                aria-hidden="true"
              />

              <ol class="relative space-y-0">
                <li v-for="(stage, index) in flowStages" :key="stage.id">
                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-md py-[0.3rem] pl-0 pr-2 text-left transition-colors duration-200"
                    :aria-current="index === activeIndex ? 'step' : undefined"
                    @click="activeIndex = index"
                  >
                    <span
                      class="relative z-10 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-all duration-300"
                      :class="
                        index === activeIndex
                          ? 'scale-110 border-accent-500 bg-ink-950'
                          : index < activeIndex
                            ? 'border-accent-500/70 bg-accent-500/70'
                            : 'border-white/15 bg-ink-900'
                      "
                      aria-hidden="true"
                    />
                    <span
                      class="truncate text-[0.8125rem] transition-colors duration-200"
                      :class="index === activeIndex ? 'font-medium text-steel-50' : 'text-steel-500'"
                    >
                      {{ stage.label }}
                    </span>
                    <span
                      class="ml-auto shrink-0 font-mono text-[0.625rem] transition-opacity duration-200"
                      :class="index === activeIndex ? 'text-accent-400 opacity-100' : 'opacity-0'"
                    >
                      {{ stage.doc }}
                    </span>
                  </button>
                </li>
              </ol>
            </div>

            <!-- The document the ERP writes at this step. -->
            <div class="panel overflow-hidden">
              <div
                class="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3"
              >
                <span
                  class="h-2 w-2 shrink-0 rounded-full"
                  :style="{ backgroundColor: laneMeta[active.lane].color }"
                  aria-hidden="true"
                />
                <p class="font-mono text-xxs uppercase tracking-[0.14em] text-steel-400">
                  {{ laneMeta[active.lane].name }}
                </p>
                <p class="ml-auto font-mono text-xs text-steel-200">{{ active.doc }}</p>
              </div>

              <div class="p-5 sm:p-6" aria-live="polite">
                <p class="font-mono text-xxs uppercase tracking-[0.14em] text-steel-500">
                  Step {{ activeIndex + 1 }} of {{ flowStages.length }}
                </p>
                <h3 class="mt-2 text-xl font-semibold text-steel-50 sm:text-2xl">
                  {{ active.label }}
                </h3>
                <p class="mt-3 max-w-xl text-sm leading-relaxed text-steel-400">
                  {{ active.effect }}
                </p>

                <dl class="mt-6 grid gap-2 sm:grid-cols-2">
                  <div
                    v-for="row in active.rows"
                    :key="`${active.id}-${row.label}`"
                    class="panel-flat flex items-baseline justify-between gap-3 px-3.5 py-2.5"
                  >
                    <dt class="data-label">{{ row.label }}</dt>
                    <dd
                      class="shrink-0 font-mono text-xs tabular-nums"
                      :class="row.tone ? toneClass[row.tone] : 'text-steel-100'"
                    >
                      {{ row.value }}
                    </dd>
                  </div>
                </dl>

                <div
                  v-if="activeIndex < flowStages.length - 1"
                  class="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-4 font-mono text-xxs text-steel-500"
                >
                  Next
                  <ArrowRight class="h-3 w-3" aria-hidden="true" />
                  {{ flowStages[activeIndex + 1].label }}
                </div>
                <div
                  v-else
                  class="mt-6 border-t border-white/[0.07] pt-4 font-mono text-xxs text-ok"
                >
                  Order closed · demand to cash on one record
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: no pinning, no scrubbing. The same chain as a plain list. -->
    <div class="shell mt-10 md:hidden">
      <ol class="relative space-y-3 border-l border-white/[0.09] pl-5">
        <li v-for="(stage, index) in flowStages" :key="`m-${stage.id}`" data-anim class="relative">
          <span
            class="absolute -left-[1.6rem] top-4 h-2.5 w-2.5 rounded-full border-2 border-white/20 bg-ink-900"
            :style="{ borderColor: laneMeta[stage.lane].color }"
            aria-hidden="true"
          />
          <div class="panel-flat p-4">
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-sm font-semibold text-steel-50">{{ stage.label }}</h3>
              <p class="shrink-0 font-mono text-[0.625rem] text-accent-400">{{ stage.doc }}</p>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-steel-400">{{ stage.effect }}</p>
            <dl class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              <div v-for="row in stage.rows" :key="row.label" class="flex items-baseline gap-1.5">
                <dt class="font-mono text-[0.625rem] text-steel-600">{{ row.label }}</dt>
                <dd
                  class="font-mono text-[0.625rem]"
                  :class="row.tone ? toneClass[row.tone] : 'text-steel-200'"
                >
                  {{ row.value }}
                </dd>
              </div>
            </dl>
          </div>
          <span class="sr-only">Step {{ index + 1 }} of {{ flowStages.length }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>
