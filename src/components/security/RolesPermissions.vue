<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, X } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { roles } from '@/data/governance'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'
import { isReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement | null>(null)
const grid = ref<HTMLElement | null>(null)
const activeKey = ref('production-manager')

const active = computed(() => roles.find((role) => role.key === activeKey.value) ?? roles[0])

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.06 })
})

function select(key: string) {
  if (key === activeKey.value) return
  activeKey.value = key
  if (isReducedMotion() || !grid.value) return

  // Permissions re-deal like a hand of cards when the role changes.
  gsap.fromTo(
    grid.value.querySelectorAll('[data-permission]'),
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.035, ease: 'power2.out', overwrite: true },
  )
}
</script>

<template>
  <section ref="root" id="roles" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Roles and permissions"
        title="People see the plant they work in, and the work they do."
        lede="Permissions are granted to roles and scoped to plant and warehouse. An operator confirms production without ever seeing a margin; a controller closes the period without releasing a work order."
      />

      <div class="mt-10 grid gap-5 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <!-- Role list -->
        <ul data-anim class="scroll-x flex gap-2 pb-2 lg:block lg:space-y-1 lg:pb-0">
          <li v-for="role in roles" :key="role.key" class="shrink-0 lg:shrink">
            <button
              type="button"
              class="w-full whitespace-nowrap rounded-lg border px-3.5 py-2.5 text-left text-sm transition-[border-color,background-color,color] duration-200 lg:whitespace-normal"
              :class="
                role.key === activeKey
                  ? 'border-accent-500/45 bg-accent-500/[0.08] text-steel-50'
                  : 'border-white/[0.07] bg-ink-850/50 text-steel-400 hover:border-white/20 hover:text-steel-100'
              "
              :aria-pressed="role.key === activeKey"
              @click="select(role.key)"
            >
              {{ role.name }}
            </button>
          </li>
        </ul>

        <!-- Permission matrix -->
        <div ref="grid" data-anim class="panel p-5 sm:p-7">
          <header class="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/[0.07] pb-4">
            <h3 class="text-lg font-semibold text-steel-50">{{ active.name }}</h3>
            <p class="font-mono text-xxs text-steel-500">Scope · {{ active.scope }}</p>
          </header>

          <div class="mt-5 grid gap-6 sm:grid-cols-2" aria-live="polite">
            <div>
              <p class="data-label text-ok">Allowed</p>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="permission in active.allowed"
                  :key="`allow-${permission}`"
                  data-permission
                  class="flex items-start gap-2.5 text-sm text-steel-200"
                >
                  <Check class="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                  <span class="leading-snug">{{ permission }}</span>
                </li>
              </ul>
            </div>

            <div>
              <p class="data-label text-crit">Denied</p>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="permission in active.denied"
                  :key="`deny-${permission}`"
                  data-permission
                  class="flex items-start gap-2.5 text-sm text-steel-500"
                >
                  <X class="mt-0.5 h-4 w-4 shrink-0 text-crit" aria-hidden="true" />
                  <span class="leading-snug">{{ permission }}</span>
                </li>
              </ul>
            </div>
          </div>

          <p class="mt-6 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-steel-500">
            These nine roles ship as a starting point. Every one of them is a set of permissions
            you can copy and edit — the catalogue is the same one the standard roles are built from.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
