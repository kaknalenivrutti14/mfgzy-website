<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, TriangleAlert, Check } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import AnimatedCounter from '@/components/common/AnimatedCounter.vue'
import { importResult, importSteps } from '@/data/company'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.06 })

  if (reduced) {
    gsap.set(q('[data-import-step]'), { opacity: 1 })
    return
  }

  gsap.fromTo(
    q('[data-import-step]'),
    { opacity: 0.3, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="import" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Migration"
        title="Bring years of manufacturing data with you."
        lede="Your item master, suppliers, BOMs and opening stock arrive as spreadsheets, because that is what they are today. The importer validates before it writes, and shows you exactly what will be created."
      />

      <!-- Pipeline -->
      <div data-anim class="scroll-x mt-10 pb-2">
        <ol class="flex min-w-max items-stretch gap-2">
          <li v-for="(step, index) in importSteps" :key="step.id" class="flex items-stretch gap-2">
            <div
              data-import-step
              class="w-40 rounded-xl border px-3.5 py-3"
              :class="
                index === importSteps.length - 1
                  ? 'border-accent-500/40 bg-accent-500/[0.08]'
                  : 'border-white/[0.07] bg-ink-850/70'
              "
            >
              <p class="text-sm font-medium text-steel-100">{{ step.label }}</p>
              <p class="mt-1.5 text-[0.6875rem] leading-snug text-steel-500">{{ step.detail }}</p>
            </div>
            <ArrowRight
              v-if="index < importSteps.length - 1"
              class="h-4 w-4 shrink-0 self-center text-steel-600"
              aria-hidden="true"
            />
          </li>
        </ol>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-2">
        <!-- Result -->
        <div data-anim>
          <UiWindow title="Import result" :breadcrumb="importResult.file" status="Complete" tone="ok">
            <dl class="grid grid-cols-3 gap-2.5">
              <div class="panel-flat px-3 py-3">
                <dt class="data-label">Imported</dt>
                <dd class="mt-1 font-mono text-xl font-semibold tabular-nums text-steel-50">
                  <AnimatedCounter :value="importResult.imported" />
                </dd>
              </div>
              <div class="panel-flat px-3 py-3">
                <dt class="data-label">Warnings</dt>
                <dd class="mt-1 font-mono text-xl font-semibold tabular-nums text-warn">
                  <AnimatedCounter :value="importResult.warnings" />
                </dd>
              </div>
              <div class="panel-flat px-3 py-3">
                <dt class="data-label">Critical</dt>
                <dd class="mt-1 font-mono text-xl font-semibold tabular-nums text-ok">
                  {{ importResult.errors }}
                </dd>
              </div>
            </dl>

            <ul class="mt-4 space-y-2">
              <li
                v-for="warning in importResult.warningSample"
                :key="warning.row"
                class="flex items-start gap-2.5 rounded-lg border border-warn/20 bg-warn/[0.05] px-3 py-2.5"
              >
                <TriangleAlert class="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" aria-hidden="true" />
                <div class="min-w-0">
                  <p class="font-mono text-[0.625rem] text-steel-400">{{ warning.row }}</p>
                  <p class="mt-0.5 text-xs leading-snug text-steel-300">{{ warning.message }}</p>
                </div>
              </li>
            </ul>

            <p class="mt-4 border-t border-white/[0.07] pt-3 text-xs leading-relaxed text-steel-500">
              A warning is something the importer resolved and recorded. A critical error stops the
              import — the transaction rolls back rather than leaving half a master file behind.
            </p>
          </UiWindow>
        </div>

        <!-- What is importable -->
        <div data-anim class="panel p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-steel-50">What comes across</h3>
          <ul class="mt-4 grid gap-2.5 sm:grid-cols-2">
            <li
              v-for="item in [
                'Item master and units',
                'Suppliers and lead times',
                'Customers',
                'Bills of material',
                'Routings and operations',
                'Opening stock by bin',
                'Open purchase orders',
                'Price lists',
              ]"
              :key="item"
              class="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
            >
              <Check class="h-3.5 w-3.5 shrink-0 text-ok" aria-hidden="true" />
              <span class="text-xs text-steel-300">{{ item }}</span>
            </li>
          </ul>

          <p class="mt-5 text-xs leading-relaxed text-steel-500">
            Column mappings are saved, so the second plant's import is a file upload rather than a
            project. Opening stock is posted as a dated movement, which means the valuation has a
            starting point an auditor can follow.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
