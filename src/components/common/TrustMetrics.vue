<script setup lang="ts">
import { ref } from 'vue'
import AnimatedCounter from '@/components/common/AnimatedCounter.vue'
import { trustMetrics } from '@/data/company'
import { reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.09, y: 16 })
})
</script>

<template>
  <section ref="root" class="relative border-y border-white/[0.07] bg-ink-900/50">
    <div class="shell">
      <dl class="grid grid-cols-2 divide-white/[0.07] lg:grid-cols-4 lg:divide-x">
        <div
          v-for="(metric, index) in trustMetrics"
          :key="metric.label"
          data-anim
          class="border-white/[0.07] px-1 py-8 sm:px-6 sm:py-10"
          :class="[
            index % 2 === 0 ? 'lg:pl-0' : '',
            index < 2 ? 'border-b lg:border-b-0' : '',
            index % 2 === 1 ? 'border-l lg:border-l-0 pl-5 sm:pl-6' : '',
          ]"
        >
          <dd class="font-mono text-3xl font-semibold tracking-tight text-steel-50 sm:text-4xl">
            <AnimatedCounter
              :value="metric.value"
              :prefix="metric.prefix"
              :suffix="metric.suffix"
            />
          </dd>
          <dt class="mt-2 text-sm font-medium text-steel-200">{{ metric.label }}</dt>
          <p class="mt-1 text-xs leading-relaxed text-steel-500">{{ metric.note }}</p>
        </div>
      </dl>
    </div>
  </section>
</template>
