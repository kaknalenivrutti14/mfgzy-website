<script setup lang="ts">
import { ref } from 'vue'
import { History, Server, User } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { auditTrail } from '@/data/governance'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  if (reduced) {
    gsap.set(q('[data-entry]'), { opacity: 1 })
    return
  }

  // Entries arrive the way a log arrives: one after another, from the top.
  gsap.fromTo(
    q('[data-entry]'),
    { opacity: 0, x: -12 },
    {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 68%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="audit" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Audit trail"
        title="Every important change has a history."
        lede="Who changed what, when, and what the value was before it changed. The log is written by the system, exportable by an administrator, and editable by nobody."
      />

      <div class="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div data-anim>
          <UiWindow title="Audit log" breadcrumb="Plant 01 · Today" status="Append only" tone="info">
            <ol class="relative space-y-0 pl-5">
              <span class="absolute left-[5px] top-2 bottom-2 w-px bg-white/[0.08]" aria-hidden="true" />

              <li
                v-for="entry in auditTrail"
                :key="`${entry.time}-${entry.target}`"
                data-entry
                class="relative py-2.5"
              >
                <span
                  class="absolute -left-5 top-[1.1rem] h-2 w-2 rounded-full ring-4 ring-ink-850"
                  :class="entry.actorKind === 'system' ? 'bg-steel-500' : 'bg-accent-500'"
                  aria-hidden="true"
                />

                <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <time class="font-mono text-xs tabular-nums text-steel-500">{{ entry.time }}</time>
                  <span class="flex items-center gap-1.5 text-sm font-medium text-steel-100">
                    <component
                      :is="entry.actorKind === 'system' ? Server : User"
                      class="h-3 w-3 text-steel-500"
                      aria-hidden="true"
                    />
                    {{ entry.actor }}
                  </span>
                  <span class="text-sm text-steel-400">{{ entry.action }}</span>
                  <span class="font-mono text-xs text-accent-400">{{ entry.target }}</span>
                </div>
                <p class="mt-1 text-xs leading-relaxed text-steel-500">{{ entry.detail }}</p>
              </li>
            </ol>
          </UiWindow>
        </div>

        <div data-anim class="space-y-5">
          <article class="panel p-5 sm:p-6">
            <header class="flex items-center gap-2.5">
              <History class="h-4 w-4 text-accent-400" aria-hidden="true" />
              <h3 class="text-sm font-semibold text-steel-50">Attributable by design</h3>
            </header>
            <p class="mt-3 text-base leading-relaxed text-steel-200">
              Every data change is attributable to a person and a time.
            </p>
            <ul class="mt-4 space-y-2.5">
              <li
                v-for="item in [
                  'Before and after values, not just “record updated”',
                  'System actions logged as the system, never as the last person who touched it',
                  'Deactivation instead of deletion, so history survives the employee',
                  'Exportable for an auditor without database access',
                ]"
                :key="item"
                class="flex gap-2.5 text-xs leading-relaxed text-steel-400"
              >
                <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                {{ item }}
              </li>
            </ul>
          </article>

          <article class="panel p-5">
            <h3 class="text-sm font-semibold text-steel-50">Regulated plants</h3>
            <p class="mt-2.5 text-xs leading-relaxed text-steel-400">
              Pharmaceutical and automotive customers need the audit record to carry an electronic
              signature and to be provably unaltered. That work is scheduled with the
              <span class="text-steel-200">Phase 3 quality module</span>, alongside 21 CFR Part 11
              support.
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
