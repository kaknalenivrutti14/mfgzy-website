<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck, Lock } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { securityControls } from '@/data/governance'
import { drawPath, gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

const tenants = [
  { id: 'Tenant A', company: 'Nordwerk GmbH', plants: '2 plants' },
  { id: 'Tenant B', company: 'Halden Industri', plants: '1 plant' },
  { id: 'Tenant C', company: 'Arco Plastics', plants: '3 plants' },
]

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  const paths = Array.from(el.querySelectorAll<SVGPathElement>('[data-arch-line]'))

  if (reduced) {
    paths.forEach((path) => drawPath(path))
    gsap.set(q('[data-arch-col]'), { opacity: 1 })
    return
  }

  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 65%', once: true } })

  paths.forEach((path, index) => {
    const tween = drawPath(path, { duration: 0.6, ease: 'power2.inOut' })
    if (tween) tl.add(tween, index * 0.08)
  })

  tl.fromTo(
    q('[data-arch-col]'),
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 },
    0.35,
  )

  // The shield ring breathes once the architecture has drawn.
  const ring = el.querySelector<SVGCircleElement>('[data-shield-ring]')
  if (ring) {
    gsap.to(ring, {
      scale: 1.06,
      opacity: 0.35,
      transformOrigin: 'center',
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1,
    })
  }
})
</script>

<template>
  <section ref="root" id="security" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Security"
        title="Enterprise security without enterprise complexity."
        lede="Isolation is enforced in the database, not only in application code. A query that forgets its tenant returns nothing — it does not return someone else's stock."
      />

      <div class="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
        <!-- Architecture diagram -->
        <div data-anim class="panel p-5 sm:p-7">
          <div class="flex items-center gap-3">
            <span class="relative grid h-9 w-9 place-items-center">
              <svg viewBox="0 0 40 40" class="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle
                  data-shield-ring
                  cx="20"
                  cy="20"
                  r="17"
                  fill="none"
                  stroke="#4C8DFF"
                  stroke-opacity="0.45"
                  stroke-width="1.5"
                />
              </svg>
              <ShieldCheck class="h-4 w-4 text-accent-400" aria-hidden="true" />
            </span>
            <div>
              <h3 class="text-sm font-semibold text-steel-50">ERP platform</h3>
              <p class="font-mono text-xxs text-steel-500">One deployment · many tenants</p>
            </div>
          </div>

          <!-- Fan-out -->
          <svg
            class="mt-5 h-12 w-full"
            viewBox="0 0 600 48"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path data-arch-line d="M300 0 L300 14 Q300 24 290 24 L110 24 Q100 24 100 34 L100 48" stroke="#4C8DFF" stroke-opacity="0.5" stroke-width="1.5" />
            <path data-arch-line d="M300 0 L300 48" stroke="#4C8DFF" stroke-opacity="0.5" stroke-width="1.5" />
            <path data-arch-line d="M300 0 L300 14 Q300 24 310 24 L490 24 Q500 24 500 34 L500 48" stroke="#4C8DFF" stroke-opacity="0.5" stroke-width="1.5" />
          </svg>

          <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div v-for="tenant in tenants" :key="tenant.id" data-arch-col class="space-y-2">
              <div class="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-2.5 text-center">
                <p class="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-accent-400">
                  {{ tenant.id }}
                </p>
                <p class="mt-1 truncate text-[0.6875rem] text-steel-200">{{ tenant.company }}</p>
                <p class="mt-0.5 font-mono text-[0.625rem] text-steel-600">{{ tenant.plants }}</p>
              </div>

              <div class="grid place-items-center">
                <span class="h-4 w-px bg-white/10" aria-hidden="true" />
              </div>

              <div
                class="flex items-center justify-center gap-1.5 rounded-lg border border-ok/25 bg-ok/[0.07] px-2 py-2"
              >
                <Lock class="h-3 w-3 shrink-0 text-ok" aria-hidden="true" />
                <p class="font-mono text-[0.625rem] text-ok">Isolated</p>
              </div>

              <div class="grid place-items-center">
                <span class="h-4 w-px bg-white/10" aria-hidden="true" />
              </div>

              <div class="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2 py-2 text-center">
                <p class="font-mono text-[0.625rem] text-steel-400">Audit log</p>
              </div>
            </div>
          </div>

          <p class="mt-6 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-steel-500">
            Each tenant's rows carry a tenant id, and row-level policies in PostgreSQL enforce it
            on every read and write. Isolation is verified by an automated check that runs against
            the live database after any migration that touches those policies.
          </p>
        </div>

        <!-- Controls -->
        <ul data-anim class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <li
            v-for="control in securityControls"
            :key="control.title"
            class="rounded-xl border border-white/[0.07] bg-ink-850/60 p-4"
          >
            <h3 class="text-sm font-medium text-steel-100">{{ control.title }}</h3>
            <p class="mt-1.5 text-xs leading-relaxed text-steel-400">{{ control.body }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
