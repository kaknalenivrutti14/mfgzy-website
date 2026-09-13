<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import CtaButton from '@/components/common/CtaButton.vue'
import { brand, cta } from '@/data/brand'
import { gsap, useGsapContext } from '@/composables/useScrollAnimation'

// The diagram is the heaviest thing above the fold; let the copy paint first.
const HeroDashboard = defineAsyncComponent(() => import('./HeroDashboard.vue'))

const root = ref<HTMLElement | null>(null)

const proofPoints = ['Multi-plant', 'Lot and serial traceability', 'Audit trail on every change']

useGsapContext(root, ({ q, reduced }) => {
  const targets = q('[data-anim]')
  if (reduced) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return
  }

  gsap.timeline({ defaults: { ease: 'power3.out' } }).fromTo(
    targets,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 },
  )
})
</script>

<template>
  <section ref="root" id="top" class="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-40">
    <!-- Backdrop: one grid, one soft light source, nothing else. -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 grid-backdrop radial-fade opacity-80" />
      <div
        class="absolute left-1/2 top-[-22rem] h-[38rem] w-[min(72rem,100%)] -translate-x-1/2 rounded-full blur-[120px]"
        style="background: radial-gradient(closest-side, rgba(76, 141, 255, 0.22), transparent 70%)"
      />
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
    </div>

    <div class="shell relative">
      <div class="mx-auto max-w-3xl text-center">
        <p class="eyebrow justify-center" data-anim>
          <span class="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-dot" aria-hidden="true" />
          Cloud manufacturing ERP
        </p>

        <h1 class="display-1 mt-6" data-anim>
          <span class="text-gradient">Manufacturing ERP built for the factory floor.</span>
        </h1>

        <p class="lede mx-auto mt-6 max-w-2xl text-lg sm:text-xl" data-anim>
          {{ brand.subline }}
        </p>

        <div class="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center" data-anim>
          <CtaButton :to="cta.trial.to" variant="primary" size="lg" arrow>
            {{ cta.trial.label }}
          </CtaButton>
          <CtaButton :to="cta.demo.to" variant="secondary" size="lg">
            {{ cta.demo.label }}
          </CtaButton>
        </div>

        <p class="mt-6 font-mono text-xs text-steel-500" data-anim>{{ brand.audience }}</p>

        <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2" data-anim>
          <li
            v-for="point in proofPoints"
            :key="point"
            class="flex items-center gap-1.5 text-xs text-steel-400"
          >
            <Check class="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
            {{ point }}
          </li>
        </ul>
      </div>

      <div class="mt-14 sm:mt-16 lg:mt-20" data-anim>
        <HeroDashboard />
      </div>
    </div>
  </section>
</template>
