<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { industries } from '@/data/industries'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'
import { isReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const activeKey = ref(industries[0].key)

const active = computed(
  () => industries.find((industry) => industry.key === activeKey.value) ?? industries[0],
)

const toneClass: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  info: 'text-info',
}

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.05 })
})

function select(key: string) {
  if (key === activeKey.value) return
  activeKey.value = key

  // A short cross-fade so switching industry reads as a change of content
  // rather than a flicker.
  const el = panel.value
  if (!el || isReducedMotion()) return
  gsap.fromTo(el, { opacity: 0.35, y: 8 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' })
}
</script>

<template>
  <section ref="root" id="industries" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Industries"
        title="Built for the way different manufacturers operate."
        lede="A dye lot is not a heat number is not a serial. The same platform, configured to the unit of measure, the traceability rule and the compliance evidence each industry actually needs."
      />

      <div class="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <!-- Selector -->
        <ul data-anim class="grid grid-cols-2 gap-2.5 self-start sm:grid-cols-4 lg:grid-cols-2">
          <li v-for="industry in industries" :key="industry.key">
            <button
              type="button"
              class="flex h-full w-full flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition-[border-color,background-color,transform] duration-200"
              :class="
                industry.key === activeKey
                  ? '-translate-y-0.5 border-accent-500/45 bg-accent-500/[0.08]'
                  : 'border-white/[0.07] bg-ink-850/60 hover:-translate-y-0.5 hover:border-white/20'
              "
              :aria-pressed="industry.key === activeKey"
              @click="select(industry.key)"
            >
              <component
                :is="industry.icon"
                class="shrink-0 transition-colors duration-200"
                :class="industry.key === activeKey ? 'text-accent-400' : 'text-steel-400'"
                style="height: 1.125rem; width: 1.125rem"
                aria-hidden="true"
              />
              <span
                class="text-[0.8125rem] font-medium leading-snug"
                :class="industry.key === activeKey ? 'text-steel-50' : 'text-steel-300'"
              >
                {{ industry.name }}
              </span>
            </button>
          </li>
        </ul>

        <!-- Detail -->
        <div ref="panel" data-anim>
          <UiWindow
            title="Industry profile"
            :breadcrumb="active.name"
            status="Configured"
            tone="info"
          >
            <p class="text-base leading-relaxed text-steel-200">{{ active.tension }}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              <li
                v-for="requirement in active.requirements"
                :key="requirement"
                class="chip border-accent-500/25 bg-accent-500/[0.07] text-accent-200"
              >
                {{ requirement }}
              </li>
            </ul>

            <dl class="mt-5 grid gap-2 border-t border-white/[0.07] pt-4 sm:grid-cols-2">
              <div
                v-for="row in active.record"
                :key="`${active.key}-${row.label}`"
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
          </UiWindow>
        </div>
      </div>
    </div>
  </section>
</template>
