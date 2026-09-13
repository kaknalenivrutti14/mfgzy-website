<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { assistantExchange } from '@/data/company'
import { useInView } from '@/composables/useInView'
import { reveal, shouldAnimate, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const { inView } = useInView(stage, { threshold: 0.3 })

const typed = ref('')
const revealed = ref(0)
let typeTimer = 0
let stepTimer = 0

function finish() {
  typed.value = assistantExchange.headline
  revealed.value = assistantExchange.reasons.length + 1
}

watch(inView, (visible) => {
  if (!visible) return

  if (!shouldAnimate()) {
    finish()
    return
  }

  // Type the headline, then let the cited reasons and the actions land.
  let index = 0
  typeTimer = window.setInterval(() => {
    index += 1
    typed.value = assistantExchange.headline.slice(0, index)
    if (index >= assistantExchange.headline.length) {
      window.clearInterval(typeTimer)
      stepTimer = window.setInterval(() => {
        revealed.value += 1
        if (revealed.value > assistantExchange.reasons.length) window.clearInterval(stepTimer)
      }, 420)
    }
  }, 26)
})

onBeforeUnmount(() => {
  window.clearInterval(typeTimer)
  window.clearInterval(stepTimer)
})

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })
})
</script>

<template>
  <section ref="root" id="ai" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Phase 5 · Intelligence"
        title="The ERP should eventually recommend what to do next."
        lede="Once purchasing, production, quality and maintenance all write to one record, the useful question stops being “what happened” and becomes “what should I do about it”."
      />

      <div ref="stage" data-anim class="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <!-- Assistant exchange -->
        <div class="panel overflow-hidden">
          <div
            class="flex items-center gap-2.5 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3"
          >
            <Sparkles class="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
            <p class="font-mono text-xxs uppercase tracking-[0.14em] text-steel-400">
              ERP assistant
            </p>
            <span class="chip ml-auto border-warn/25 bg-warn/10 py-0.5 text-warn">Not yet built</span>
          </div>

          <div class="space-y-4 p-4 sm:p-6">
            <!-- Question -->
            <div class="flex justify-end">
              <p
                class="max-w-md rounded-2xl rounded-br-sm border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-steel-100"
              >
                {{ assistantExchange.question }}
              </p>
            </div>

            <!-- Answer -->
            <div class="max-w-xl rounded-2xl rounded-bl-sm border border-accent-500/20 bg-accent-500/[0.05] p-4">
              <p class="min-h-[1.5rem] text-sm font-medium text-steel-50">
                {{ typed
                }}<span
                  v-if="typed.length < assistantExchange.headline.length"
                  class="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent-400"
                  aria-hidden="true"
                />
              </p>

              <ol class="mt-4 space-y-2.5">
                <li
                  v-for="(reason, index) in assistantExchange.reasons"
                  :key="reason.title"
                  class="rounded-lg border border-white/[0.07] bg-ink-900/60 px-3.5 py-3 transition-[opacity,transform] duration-500 ease-out"
                  :class="revealed > index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'"
                >
                  <div class="flex items-baseline gap-2.5">
                    <span class="font-mono text-[0.625rem] text-steel-600">{{ index + 1 }}</span>
                    <p class="text-sm font-medium text-steel-100">{{ reason.title }}</p>
                  </div>
                  <p class="mt-1 pl-6 text-xs leading-relaxed text-steel-400">{{ reason.detail }}</p>
                  <p class="mt-1.5 pl-6 font-mono text-[0.625rem] text-accent-400">
                    {{ reason.source }}
                  </p>
                </li>
              </ol>

              <div
                class="mt-4 transition-[opacity,transform] duration-500 ease-out"
                :class="
                  revealed > assistantExchange.reasons.length
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-2 opacity-0'
                "
              >
                <p class="data-label">Recommended actions</p>
                <ul class="mt-2 flex flex-wrap gap-2">
                  <li
                    v-for="action in assistantExchange.actions"
                    :key="action"
                    class="flex items-center gap-1.5 rounded-lg border border-white/[0.09] bg-white/[0.04] px-3 py-1.5 text-xs text-steel-200"
                  >
                    <ArrowRight class="h-3 w-3 text-accent-400" aria-hidden="true" />
                    {{ action }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Grounding -->
        <div class="space-y-5">
          <article class="panel p-5 sm:p-6">
            <h3 class="text-sm font-semibold text-steel-50">Why this is credible later, not now</h3>
            <p class="mt-3 text-sm leading-relaxed text-steel-400">
              {{ assistantExchange.disclaimer }}
            </p>
          </article>

          <article class="panel p-5 sm:p-6">
            <h3 class="text-sm font-semibold text-steel-50">What Phase 5 covers</h3>
            <ul class="mt-3.5 space-y-2.5">
              <li
                v-for="item in [
                  { name: 'Demand forecasting', note: 'From your own order history, per item' },
                  { name: 'Predictive maintenance', note: 'From machine downtime and run hours' },
                  { name: 'Document OCR', note: 'Supplier invoices and mill certificates' },
                  { name: 'ERP assistant', note: 'Questions answered from records, with citations' },
                ]"
                :key="item.name"
                class="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2.5 last:border-0 last:pb-0"
              >
                <span class="text-sm text-steel-200">{{ item.name }}</span>
                <span class="shrink-0 text-right text-[0.6875rem] text-steel-500">{{ item.note }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
