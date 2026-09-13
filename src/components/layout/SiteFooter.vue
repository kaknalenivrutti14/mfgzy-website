<script setup lang="ts">
import BrandMark from '@/components/common/BrandMark.vue'
import CtaButton from '@/components/common/CtaButton.vue'
import { footerNav, legalNav } from '@/data/navigation'
import { brand, cta } from '@/data/brand'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-white/[0.07] bg-ink-950">
    <div class="shell py-14 sm:py-16">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2.4fr)]">
        <div>
          <BrandMark size="lg" />
          <p class="mt-3 text-xs text-steel-500">{{ brand.descriptor }}</p>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-steel-400">
            One connected cloud ERP for purchasing, inventory, production, quality, traceability
            and finance.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <CtaButton :to="cta.trial.to" variant="primary" size="sm">
              {{ cta.trial.label }}
            </CtaButton>
            <CtaButton :to="cta.demo.to" variant="secondary" size="sm">
              {{ cta.demo.label }}
            </CtaButton>
          </div>
        </div>

        <nav class="grid grid-cols-2 gap-8 sm:grid-cols-4" aria-label="Footer">
          <div v-for="group in footerNav" :key="group.title">
            <h2 class="font-mono text-xxs uppercase tracking-[0.16em] text-steel-500">
              {{ group.title }}
            </h2>
            <ul class="mt-4 space-y-2.5">
              <li v-for="link in group.links" :key="`${group.title}-${link.label}`">
                <a
                  :href="link.hash"
                  class="text-sm text-steel-400 transition-colors hover:text-steel-100"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div
        class="mt-12 flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="font-mono text-xxs text-steel-600">
          © {{ year }} {{ brand.name }}. Manufacturing ERP SaaS.
        </p>
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li v-for="link in legalNav" :key="link.label">
            <a
              :href="link.hash"
              class="font-mono text-xxs text-steel-500 transition-colors hover:text-steel-200"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
