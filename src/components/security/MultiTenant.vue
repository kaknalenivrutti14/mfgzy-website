<script setup lang="ts">
import { ref } from 'vue'
import { Building2, Database, Factory, Layers, Warehouse } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { tenancyLayers } from '@/data/governance'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const icons = [Layers, Building2, Factory, Warehouse, Database]

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  if (reduced) {
    gsap.set(q('[data-layer]'), { opacity: 1 })
    return
  }

  gsap.fromTo(
    q('[data-layer]'),
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="tenancy" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="SaaS architecture"
        title="One platform, many companies, many plants."
        lede="The hierarchy is part of the data model, not a naming convention. A company can add a plant, a plant can add a warehouse, and nothing has to be re-implemented for the second site."
      />

      <div class="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <!-- Hierarchy -->
        <ol data-anim class="space-y-0">
          <li v-for="(layer, index) in tenancyLayers" :key="layer.label">
            <div
              data-layer
              class="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-ink-850/60 p-4 transition-colors duration-300"
              :class="index === tenancyLayers.length - 1 ? 'border-ok/25 bg-ok/[0.05]' : ''"
              :style="{ marginLeft: `${index * 1.1}rem` }"
            >
              <span
                class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03]"
                :class="index === tenancyLayers.length - 1 ? 'text-ok' : 'text-accent-400'"
              >
                <component :is="icons[index]" class="h-4 w-4" aria-hidden="true" />
              </span>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-steel-100">{{ layer.label }}</p>
                <p class="mt-0.5 text-xs text-steel-500">{{ layer.detail }}</p>
              </div>

              <span class="shrink-0 font-mono text-xxs text-steel-400">{{ layer.value }}</span>
            </div>

            <div
              v-if="index < tenancyLayers.length - 1"
              class="h-4 w-px bg-white/10"
              :style="{ marginLeft: `${index * 1.1 + 1.25}rem` }"
              aria-hidden="true"
            />
          </li>
        </ol>

        <!-- Isolation model -->
        <div data-anim class="space-y-5">
          <article class="panel p-5 sm:p-6">
            <h3 class="text-sm font-semibold text-steel-50">How isolation works today</h3>
            <p class="mt-3 text-sm leading-relaxed text-steel-400">
              Tenants share one production database. Every table carries a tenant id and PostgreSQL
              row-level security enforces it on every statement, so isolation does not depend on
              application code remembering to filter.
            </p>
            <dl class="mt-4 grid gap-2 sm:grid-cols-2">
              <div class="panel-flat px-3.5 py-2.5">
                <dt class="data-label">Enforcement</dt>
                <dd class="mt-1 font-mono text-xs text-steel-200">Row-level security</dd>
              </div>
              <div class="panel-flat px-3.5 py-2.5">
                <dt class="data-label">Verification</dt>
                <dd class="mt-1 font-mono text-xs text-ok">Automated per release</dd>
              </div>
            </dl>
          </article>

          <article class="panel p-5 sm:p-6">
            <h3 class="text-sm font-semibold text-steel-50">When a contract needs more</h3>
            <p class="mt-3 text-sm leading-relaxed text-steel-400">
              Some buyers — usually in pharmaceutical and defence supply chains — require their data
              in a database of its own. The architecture is designed so a tenant can be moved to a
              dedicated database without redesigning the application, and that path is available
              under an Enterprise contract.
            </p>
            <p class="mt-4 font-mono text-xxs text-steel-600">
              Shared database by default · dedicated database on request
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
