<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Mail } from 'lucide-vue-next'
import { brand, contact, cta } from '@/data/brand'
import CtaButton from '@/components/common/CtaButton.vue'

/**
 * Nothing on the landing page links here any more — the calls to action open a
 * prefilled email straight to the team. The route is kept because the URL may
 * already be shared, and it is where a real trial-provisioning or CRM flow
 * would land once one exists.
 */
const route = useRoute()

const intents = {
  trial: {
    title: 'Start a free trial',
    body: 'A trial workspace is provisioned per company, with your plants, warehouses and a sample item master already loaded.',
    action: cta.trial,
  },
  demo: {
    title: 'Book a demo',
    body: 'A 45-minute walkthrough against a plant like yours: receipt to work order to inspection to invoice.',
    action: cta.demo,
  },
  sales: {
    title: 'Talk to sales',
    body: 'Plan sizing, rollout sequencing per plant, security review and contracting.',
    action: cta.sales,
  },
} as const

type IntentKey = keyof typeof intents

const intent = computed<IntentKey>(() => {
  const value = route.query.intent
  const key = Array.isArray(value) ? value[0] : value
  return key && key in intents ? (key as IntentKey) : 'trial'
})

const current = computed(() => intents[intent.value])
</script>

<template>
  <section class="relative min-h-[70vh] overflow-hidden pb-24 pt-32">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 grid-backdrop radial-fade opacity-70" />
    </div>

    <div class="shell relative">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-sm text-steel-400 transition-colors hover:text-steel-100"
      >
        <ArrowLeft class="h-4 w-4" aria-hidden="true" />
        Back to {{ brand.name }}
      </router-link>

      <div class="mt-10 max-w-2xl">
        <h1 class="display-2">{{ current.title }}</h1>
        <p class="lede mt-5">{{ current.body }}</p>

        <div class="panel mt-10 p-6 sm:p-8">
          <h2 class="text-lg font-semibold text-steel-50">Email the {{ contact.team }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-steel-400">
            There is no application backend behind this site yet, so rather than a form that only
            looks like it submits, the button below opens your mail client with the details we need
            already laid out.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <CtaButton :to="current.action.to" variant="primary" arrow>
              {{ current.action.label }}
            </CtaButton>
            <CtaButton :to="cta.demo.to" v-if="intent !== 'demo'" variant="secondary">
              {{ cta.demo.label }}
            </CtaButton>
          </div>

          <a
            :href="`mailto:${contact.email}`"
            class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-200"
          >
            <Mail class="h-4 w-4" aria-hidden="true" />
            {{ contact.email }}
          </a>
        </div>

        <div class="mt-8">
          <CtaButton to="/" variant="secondary">Back to the overview</CtaButton>
        </div>
      </div>
    </div>
  </section>
</template>
