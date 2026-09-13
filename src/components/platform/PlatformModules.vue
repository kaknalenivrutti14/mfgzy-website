<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import ModuleCard from './ModuleCard.vue'
import { platformModules, type ModuleKey } from '@/data/modules'
import { reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const activeKey = ref<ModuleKey | null>(null)

const linkedKeys = computed<ModuleKey[]>(() => {
  if (!activeKey.value) return []
  return platformModules.find((m) => m.key === activeKey.value)?.connects ?? []
})

const activeModule = computed(() =>
  platformModules.find((m) => m.key === activeKey.value) ?? null,
)

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.05, y: 18 })
})
</script>

<template>
  <section ref="root" id="platform" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="One connected platform"
        title="One platform. Every critical manufacturing workflow."
        lede="Nine modules over a single database. A goods receipt updates stock, the purchase order line, the lot genealogy and the ledger in one transaction — because it is one system, not an integration."
      />

      <p class="mt-6 text-xs text-steel-500" data-anim>
        <span class="hidden sm:inline">Hover or focus a module to see the record it holds and what it is connected to.</span>
        <span class="sm:hidden">Tap a module to see the record it holds and what it is connected to.</span>
      </p>

      <ul
        class="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3"
        @mouseleave="activeKey = null"
      >
        <li v-for="module in platformModules" :key="module.key" data-anim>
          <button
            type="button"
            class="block h-full w-full rounded-2xl text-left"
            :aria-pressed="activeKey === module.key"
            @mouseenter="activeKey = module.key"
            @focus="activeKey = module.key"
            @click="activeKey = activeKey === module.key ? null : module.key"
          >
            <ModuleCard
              :module="module"
              :active="activeKey === module.key"
              :linked="linkedKeys.includes(module.key)"
              :dimmed="activeKey !== null && activeKey !== module.key && !linkedKeys.includes(module.key)"
            />
          </button>
        </li>
      </ul>

      <!-- Live region: says out loud what the illumination shows visually. -->
      <p class="mt-6 min-h-[1.25rem] font-mono text-xxs text-steel-500" aria-live="polite">
        <template v-if="activeModule">
          {{ activeModule.name }} shares records with
          {{
            activeModule.connects
              .map((key) => platformModules.find((m) => m.key === key)?.name)
              .filter(Boolean)
              .join(', ')
          }}.
        </template>
      </p>
    </div>
  </section>
</template>
