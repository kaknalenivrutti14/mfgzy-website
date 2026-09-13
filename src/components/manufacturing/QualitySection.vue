<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, TriangleAlert, X } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { nonConformance, qualityStages } from '@/data/production'
import { reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const activeKey = ref(qualityStages[1].key)

const active = computed(
  () => qualityStages.find((stage) => stage.key === activeKey.value) ?? qualityStages[0],
)
const hasFailure = computed(() => active.value.checks.some((check) => check.result === 'Fail'))

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })
})
</script>

<template>
  <section ref="root" id="quality" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Quality"
        title="Quality built into the production process."
        lede="Inspection plans sit on the operation, not beside it. A failed check holds the batch where it stands — it cannot be shipped by someone who did not know."
      />

      <!-- Stage selector -->
      <div data-anim class="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Inspection stage">
        <button
          v-for="(stage, index) in qualityStages"
          :key="stage.key"
          type="button"
          role="tab"
          :aria-selected="stage.key === activeKey"
          :tabindex="stage.key === activeKey ? 0 : -1"
          class="flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-[border-color,background-color,color] duration-200"
          :class="
            stage.key === activeKey
              ? 'border-accent-500/45 bg-accent-500/10 text-steel-50'
              : 'border-white/[0.08] bg-white/[0.02] text-steel-400 hover:border-white/20 hover:text-steel-100'
          "
          @click="activeKey = stage.key"
        >
          <span class="font-mono text-[0.625rem] text-steel-600">0{{ index + 1 }}</span>
          {{ stage.name }}
        </button>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <!-- Inspection record -->
        <div data-anim>
          <UiWindow
            title="Inspection"
            :breadcrumb="active.doc"
            :status="active.verdict"
            :tone="active.verdict === 'PASS' ? 'ok' : 'crit'"
          >
            <p class="font-mono text-xs text-steel-300">{{ active.subject }}</p>
            <p class="mt-2 text-sm leading-relaxed text-steel-400">{{ active.summary }}</p>

            <ul class="mt-5 space-y-2">
              <li
                v-for="check in active.checks"
                :key="`${active.key}-${check.name}`"
                class="flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors duration-300"
                :class="
                  check.result === 'Pass'
                    ? 'border-white/[0.07] bg-white/[0.02]'
                    : 'border-crit/30 bg-crit/[0.07]'
                "
              >
                <span
                  class="grid h-6 w-6 shrink-0 place-items-center rounded-md"
                  :class="check.result === 'Pass' ? 'bg-ok/15 text-ok' : 'bg-crit/15 text-crit'"
                >
                  <Check v-if="check.result === 'Pass'" class="h-3.5 w-3.5" aria-hidden="true" />
                  <X v-else class="h-3.5 w-3.5" aria-hidden="true" />
                </span>

                <div class="min-w-0 flex-1">
                  <p class="text-sm text-steel-100">{{ check.name }}</p>
                  <p class="mt-0.5 font-mono text-[0.625rem] text-steel-500">{{ check.spec }}</p>
                </div>

                <span
                  class="shrink-0 font-mono text-xs uppercase"
                  :class="check.result === 'Pass' ? 'text-ok' : 'text-crit'"
                >
                  {{ check.result }}
                </span>
              </li>
            </ul>

            <div
              class="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4"
            >
              <div>
                <p class="data-label">Overall</p>
                <p
                  class="mt-1 font-mono text-2xl font-semibold tabular-nums"
                  :class="active.verdict === 'PASS' ? 'text-steel-50' : 'text-warn'"
                >
                  {{ active.score }}
                </p>
              </div>
              <span
                class="rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-[0.1em]"
                :class="
                  active.verdict === 'PASS'
                    ? 'bg-ok/12 text-ok'
                    : 'bg-crit/12 text-crit'
                "
              >
                {{ active.verdict }}
              </span>
            </div>
          </UiWindow>
        </div>

        <!-- Non-conformance -->
        <div data-anim class="space-y-5">
          <article
            class="panel p-5 transition-opacity duration-300"
            :class="hasFailure ? 'opacity-100' : 'opacity-70'"
          >
            <header class="flex items-center gap-2.5">
              <TriangleAlert class="h-4 w-4 text-warn" aria-hidden="true" />
              <h3 class="text-sm font-semibold text-steel-50">Non-conformance</h3>
              <span class="ml-auto font-mono text-xxs text-steel-500">{{ nonConformance.id }}</span>
            </header>

            <p class="mt-3 text-sm leading-relaxed text-steel-400">
              {{ nonConformance.defect }}
            </p>

            <dl class="mt-4 space-y-2.5">
              <div
                v-for="row in [
                  { label: 'Raised by', value: nonConformance.raisedBy },
                  { label: 'Source', value: nonConformance.source },
                  { label: 'Quantity', value: nonConformance.quantity },
                  { label: 'Disposition', value: nonConformance.disposition },
                  { label: 'Cost', value: nonConformance.cost },
                ]"
                :key="row.label"
                class="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2 last:border-0 last:pb-0"
              >
                <dt class="data-label">{{ row.label }}</dt>
                <dd class="shrink-0 text-right text-[0.6875rem] text-steel-200">{{ row.value }}</dd>
              </div>
            </dl>

            <p
              v-if="hasFailure"
              class="mt-4 rounded-lg border border-crit/25 bg-crit/[0.07] px-3 py-2.5 font-mono text-[0.625rem] text-crit"
            >
              BATCH-2048 blocked · 2 units cannot be picked or shipped
            </p>
          </article>

          <div class="panel p-5">
            <h3 class="text-sm font-semibold text-steel-50">What a failure actually does</h3>
            <ul class="mt-3 space-y-2.5">
              <li
                v-for="effect in [
                  'The batch is blocked in inventory, not flagged in a spreadsheet',
                  'The genealogy records which units were affected',
                  'Rework cost posts back to the work order',
                  'The supplier scorecard updates if the cause was incoming material',
                ]"
                :key="effect"
                class="flex gap-2.5 text-xs leading-relaxed text-steel-400"
              >
                <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                {{ effect }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
