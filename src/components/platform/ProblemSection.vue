<script setup lang="ts">
import { ref } from 'vue'
import { FileSpreadsheet, Database, FileText, Mail, Calculator, TriangleAlert } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { brokenStack, brokenSymptoms, connectedOutcomes } from '@/data/company'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const icons = [FileSpreadsheet, Database, FileText, Mail, Calculator]

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.06 })

  if (reduced) return

  // Packets that set off down a broken link and never arrive — the point of
  // the left-hand column, made without a word of copy.
  q('[data-packet]').forEach((packet, index) => {
    gsap.fromTo(
      packet,
      { yPercent: -40, opacity: 0 },
      {
        yPercent: 130,
        opacity: 0,
        duration: 2.2,
        ease: 'none',
        repeat: -1,
        delay: index * 0.55,
        keyframes: {
          opacity: [0, 1, 1, 0],
          easeEach: 'none',
        },
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom top', toggleActions: 'play pause resume pause' },
      },
    )
  })

  // The connected column assembles: spine draws, then the four lanes light up.
  const spine = el.querySelector<SVGPathElement>('[data-spine]')
  if (spine) {
    const length = spine.getTotalLength()
    gsap.fromTo(
      spine,
      { strokeDasharray: length, strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 62%', once: true },
      },
    )
  }

  gsap.fromTo(
    q('[data-lane]'),
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.5,
      scrollTrigger: { trigger: el, start: 'top 62%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="problem" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="The problem"
        title="Your factory shouldn't run on spreadsheets and disconnected systems."
        lede="Most mid-market plants run on five systems that do not talk to each other. The gaps between them are where inventory drifts, decisions go stale and month-end disappears."
      />

      <div class="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
        <!-- Before -->
        <article data-anim class="panel relative overflow-hidden p-5 sm:p-7">
          <header class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-steel-100">Today</h3>
            <span class="chip border-crit/25 bg-crit/10 text-crit">
              <TriangleAlert class="h-3 w-3" aria-hidden="true" />
              Disconnected
            </span>
          </header>

          <ol class="mt-6 space-y-0">
            <li v-for="(system, index) in brokenStack" :key="system.label">
              <div class="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                <component
                  :is="icons[index]"
                  class="h-4 w-4 shrink-0 text-steel-500"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-steel-200">{{ system.label }}</p>
                  <p class="truncate text-xs text-steel-500">{{ system.detail }}</p>
                </div>
              </div>

              <!-- Broken link between systems -->
              <div
                v-if="index < brokenStack.length - 1"
                class="relative ml-6 h-8 w-px overflow-hidden"
                aria-hidden="true"
              >
                <span
                  class="absolute inset-0 border-l border-dashed border-steel-600/70"
                />
                <span
                  data-packet
                  class="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-crit"
                />
              </div>
            </li>
          </ol>

          <ul class="mt-7 space-y-2 border-t border-white/[0.07] pt-5">
            <li
              v-for="symptom in brokenSymptoms"
              :key="symptom"
              class="flex gap-2.5 text-xs leading-relaxed text-steel-400"
            >
              <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crit/70" aria-hidden="true" />
              {{ symptom }}
            </li>
          </ul>
        </article>

        <!-- After -->
        <article
          data-anim
          class="panel relative overflow-hidden p-5 sm:p-7"
          style="background-image: radial-gradient(120% 80% at 50% 0%, rgba(76, 141, 255, 0.09), transparent 60%)"
        >
          <header class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-steel-100">On one platform</h3>
            <span class="chip border-ok/25 bg-ok/10 text-ok">Connected</span>
          </header>

          <div class="mt-6">
            <div
              class="mx-auto w-full max-w-xs rounded-lg border border-accent-500/30 bg-accent-500/[0.07] px-4 py-3 text-center"
            >
              <p class="font-mono text-xxs uppercase tracking-[0.16em] text-accent-400">
                Manufacturing ERP
              </p>
              <p class="mt-1 text-sm font-medium text-steel-100">One operational record</p>
            </div>

            <svg
              class="h-14 w-full"
              viewBox="0 0 400 56"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                data-spine
                d="M200 0 L200 20 M50 56 L50 34 Q50 20 64 20 L336 20 Q350 20 350 34 L350 56 M150 56 L150 20 M250 56 L250 20"
                stroke="#4C8DFF"
                stroke-opacity="0.55"
                stroke-width="1.5"
              />
            </svg>

            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div
                v-for="lane in connectedOutcomes"
                :key="lane.label"
                data-lane
                class="rounded-lg border border-white/[0.07] bg-white/[0.03] p-3 text-center"
              >
                <p class="text-xs font-medium text-steel-100">{{ lane.label }}</p>
                <p class="mt-1.5 text-[0.6875rem] leading-snug text-steel-500">
                  {{ lane.detail }}
                </p>
              </div>
            </div>
          </div>

          <dl class="mt-7 grid gap-3 border-t border-white/[0.07] pt-5 sm:grid-cols-3">
            <div>
              <dt class="data-label">Re-keying</dt>
              <dd class="mt-1 text-sm text-steel-200">None between modules</dd>
            </div>
            <div>
              <dt class="data-label">Stock accuracy</dt>
              <dd class="mt-1 text-sm text-steel-200">Posted as material moves</dd>
            </div>
            <div>
              <dt class="data-label">Month end</dt>
              <dd class="mt-1 text-sm text-steel-200">Close, not reconcile</dd>
            </div>
          </dl>
        </article>
      </div>
    </div>
  </section>
</template>
