<script setup lang="ts">
import { ref } from 'vue'
import { Check, Circle, Loader } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { roadmap } from '@/data/company'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

const statusMeta = {
  delivered: { label: 'Delivered', dot: 'bg-ok', text: 'text-ok', ring: 'border-ok/40', icon: Check },
  'in-progress': {
    label: 'In build',
    dot: 'bg-accent-500',
    text: 'text-accent-300',
    ring: 'border-accent-500/50',
    icon: Loader,
  },
  planned: {
    label: 'Planned',
    dot: 'bg-steel-600',
    text: 'text-steel-500',
    ring: 'border-white/12',
    icon: Circle,
  },
} as const

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.06 })

  if (reduced) return

  // The rail fills up to the phase currently in build.
  const rail = el.querySelector<HTMLElement>('[data-rail-fill]')
  if (rail) {
    gsap.fromTo(
      rail,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.3,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 68%', once: true },
      },
    )
  }

  gsap.fromTo(
    q('[data-phase]'),
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.13,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 68%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="roadmap" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Roadmap"
        title="Built in sequence, and honest about where it is."
        lede="Nothing starts before the phase under it is finished and reviewed. The platform and the warehouse and purchasing modules are delivered; manufacturing is in build."
      />

      <!-- Rail -->
      <div data-anim class="relative mt-12 hidden lg:block" aria-hidden="true">
        <div class="h-px w-full bg-white/[0.09]" />
        <div
          data-rail-fill
          class="absolute left-0 top-0 h-px origin-left bg-gradient-to-r from-ok via-ok to-accent-500"
          style="width: 50%"
        />
      </div>

      <ol class="mt-0 grid gap-4 lg:mt-6 lg:grid-cols-5 lg:gap-4">
        <li v-for="phase in roadmap" :key="phase.id" data-phase class="flex">
          <article
            class="flex h-full w-full flex-col rounded-2xl border bg-ink-850/60 p-5 transition-colors duration-300"
            :class="statusMeta[phase.status].ring"
          >
            <header class="flex items-center justify-between gap-3">
              <p class="font-mono text-xxs uppercase tracking-[0.14em] text-steel-500">
                {{ phase.id }}
              </p>
              <span
                class="flex items-center gap-1.5 font-mono text-[0.625rem]"
                :class="statusMeta[phase.status].text"
              >
                <component
                  :is="statusMeta[phase.status].icon"
                  class="h-3 w-3"
                  :class="phase.status === 'in-progress' ? 'animate-spin [animation-duration:3s]' : ''"
                  aria-hidden="true"
                />
                {{ statusMeta[phase.status].label }}
              </span>
            </header>

            <!-- Two lines' worth of room so a wrapping title ("Warehouse &
                 Purchasing") does not push its card's body out of line with
                 the other four. -->
            <h3 class="mt-3 text-base font-semibold leading-snug text-steel-50 lg:min-h-[2.75rem]">
              {{ phase.name }}
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-steel-500">{{ phase.note }}</p>

            <ul class="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3.5">
              <li
                v-for="item in phase.items"
                :key="item"
                class="flex items-center gap-2 text-xs"
                :class="phase.status === 'delivered' ? 'text-steel-300' : 'text-steel-500'"
              >
                <span
                  class="h-1 w-1 shrink-0 rounded-full"
                  :class="statusMeta[phase.status].dot"
                  aria-hidden="true"
                />
                {{ item }}
              </li>
            </ul>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
