<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import CtaButton from '@/components/common/CtaButton.vue'
import UiWindow from '@/components/common/UiWindow.vue'
import { plans, usageMeters } from '@/data/company'
import { cta } from '@/data/brand'
import { gsap, reveal, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)

const meterTone = (used: number, limit: number) => {
  const ratio = used / limit
  if (ratio >= 0.9) return 'bg-crit'
  if (ratio >= 0.75) return 'bg-warn'
  return 'bg-accent-500'
}

useGsapContext(root, ({ q, root: el, reduced }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })

  if (reduced) return

  gsap.fromTo(
    q('[data-meter]'),
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 62%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" id="pricing" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Pricing"
        title="Plans sized by plants, users and modules."
        lede="Priced per user and billed annually, with the plant and warehouse limits that actually determine what a manufacturer needs. Final pricing is set per contract."
        align="center"
      />

      <ul class="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <li v-for="plan in plans" :key="plan.key" data-anim class="flex">
          <article
            class="flex h-full w-full flex-col rounded-2xl border p-6 transition-[border-color,transform] duration-300"
            :class="
              plan.highlighted
                ? 'border-accent-500/45 bg-ink-800/80 shadow-glow'
                : 'border-white/[0.07] bg-ink-850/50 hover:-translate-y-1 hover:border-white/20'
            "
          >
            <header>
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-lg font-semibold text-steel-50">{{ plan.name }}</h3>
                <span
                  v-if="plan.highlighted"
                  class="rounded-md bg-accent-500/15 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-accent-200"
                >
                  Most chosen
                </span>
              </div>
              <p class="mt-2 min-h-[2.5rem] text-sm leading-snug text-steel-400">
                {{ plan.summary }}
              </p>
            </header>

            <div class="mt-5 border-y border-white/[0.07] py-4">
              <p class="text-xl font-semibold text-steel-50">{{ plan.price }}</p>
              <p class="mt-1 font-mono text-xxs text-steel-500">{{ plan.priceNote }}</p>
            </div>

            <dl class="mt-4 space-y-2">
              <div
                v-for="limit in plan.limits"
                :key="`${plan.key}-${limit.label}`"
                class="flex items-baseline justify-between gap-3"
              >
                <dt class="text-xs text-steel-500">{{ limit.label }}</dt>
                <dd class="shrink-0 font-mono text-xs text-steel-200">{{ limit.value }}</dd>
              </div>
            </dl>

            <ul class="mt-5 flex-1 space-y-2 border-t border-white/[0.07] pt-4">
              <li
                v-for="feature in plan.features"
                :key="`${plan.key}-${feature}`"
                class="flex items-start gap-2 text-xs leading-snug text-steel-300"
              >
                <Check class="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
                {{ feature }}
              </li>
            </ul>

            <div class="mt-6">
              <CtaButton
                :to="plan.cta === 'trial' ? cta.trial.to : cta.sales.to"
                :variant="plan.highlighted ? 'primary' : 'secondary'"
                size="sm"
                class="w-full"
              >
                {{ plan.cta === 'trial' ? cta.trial.label : cta.sales.label }}
              </CtaButton>
            </div>
          </article>
        </li>
      </ul>

      <!-- Usage -->
      <div class="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div data-anim>
          <UiWindow title="Usage" breadcrumb="Growth plan" status="Within limits" tone="ok">
            <ul class="space-y-4">
              <li v-for="meter in usageMeters" :key="meter.label">
                <div class="flex items-baseline justify-between gap-3">
                  <span class="text-xs text-steel-300">{{ meter.label }}</span>
                  <span class="font-mono text-xs tabular-nums text-steel-300">
                    {{ meter.used }}{{ meter.unit }} / {{ meter.limit }}{{ meter.unit }}
                  </span>
                </div>
                <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    data-meter
                    class="h-full origin-left rounded-full"
                    :class="meterTone(meter.used, meter.limit)"
                    :style="{ width: `${(meter.used / meter.limit) * 100}%` }"
                  />
                </div>
              </li>
            </ul>
            <p class="mt-4 border-t border-white/[0.07] pt-3 text-xs leading-relaxed text-steel-500">
              Limits are visible inside the application, not discovered at renewal. Passing one
              raises a prompt to change plan; it does not silently stop a goods receipt.
            </p>
          </UiWindow>
        </div>

        <div data-anim class="panel p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-steel-50">What is not metered</h3>
          <ul class="mt-4 grid gap-2.5 sm:grid-cols-2">
            <li
              v-for="item in [
                'Transactions and documents',
                'Shop-floor terminals',
                'API calls within fair use',
                'Audit history retention',
                'Environments for testing',
                'Product updates',
              ]"
              :key="item"
              class="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
            >
              <Check class="h-3.5 w-3.5 shrink-0 text-ok" aria-hidden="true" />
              <span class="text-xs text-steel-300">{{ item }}</span>
            </li>
          </ul>
          <p class="mt-5 text-xs leading-relaxed text-steel-500">
            An ERP that charges per transaction gives a plant a reason to record fewer of them.
            That is the opposite of what the system is for.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
