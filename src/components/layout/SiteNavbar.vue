<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import BrandMark from '@/components/common/BrandMark.vue'
import CtaButton from '@/components/common/CtaButton.vue'
import { primaryNav } from '@/data/navigation'
import { brand, cta } from '@/data/brand'

const scrolled = ref(false)
const menuOpen = ref(false)
const activeHash = ref('')

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 24
    ticking = false
  })
}

/** Highlights the nav item whose section currently owns the viewport. */
let sectionObserver: IntersectionObserver | undefined
function observeSections() {
  if (typeof IntersectionObserver === 'undefined') return
  const targets = primaryNav
    .map((item) => document.querySelector(item.hash))
    .filter((el): el is Element => el !== null)
  if (!targets.length) return

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeHash.value = `#${entry.target.id}`
      }
    },
    // A band across the upper-middle of the viewport: whatever crosses it wins.
    { rootMargin: '-20% 0px -70% 0px' },
  )
  targets.forEach((el) => sectionObserver?.observe(el))
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  // Sections below the fold mount lazily; give them a beat to appear.
  window.setTimeout(observeSections, 400)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  sectionObserver?.disconnect()
  document.body.style.overflow = ''
})

// The mobile menu is a full-height overlay; the page behind it must not scroll.
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
    :class="
      scrolled || menuOpen
        ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl'
        : 'border-b border-transparent bg-transparent'
    "
  >
    <nav
      class="shell flex items-center justify-between transition-[height] duration-300"
      :class="scrolled ? 'h-14' : 'h-16 lg:h-20'"
      aria-label="Primary"
    >
      <router-link
        to="/"
        class="shrink-0 rounded-md"
        :aria-label="`${brand.name} — home`"
        @click="menuOpen = false"
      >
        <BrandMark :size="scrolled ? 'sm' : 'md'" />
      </router-link>

      <ul class="hidden items-center gap-0.5 lg:flex">
        <li v-for="item in primaryNav" :key="item.hash">
          <a
            :href="item.hash"
            class="relative block rounded-md px-3 py-2 text-sm transition-colors duration-200"
            :class="
              activeHash === item.hash
                ? 'text-steel-50'
                : 'text-steel-300 hover:text-steel-50'
            "
            :aria-current="activeHash === item.hash ? 'true' : undefined"
          >
            {{ item.label }}
            <span
              class="absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent-500 transition-transform duration-300"
              :class="activeHash === item.hash ? 'scale-x-100' : 'scale-x-0'"
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>

      <div class="hidden items-center gap-2 lg:flex">
        <!-- Sign in is hidden until the application exposes a public sign-in
             URL. Restore this and the mobile entry below with cta.signIn. -->
        <!-- <CtaButton :to="cta.signIn.to" variant="ghost" size="sm">{{ cta.signIn.label }}</CtaButton> -->
        <CtaButton :to="cta.demo.to" variant="secondary" size="sm">{{ cta.demo.label }}</CtaButton>
        <CtaButton :to="cta.trial.to" variant="primary" size="sm">{{ cta.trial.label }}</CtaButton>
      </div>

      <button
        type="button"
        class="-mr-2 grid h-10 w-10 place-items-center rounded-lg text-steel-200 transition-colors hover:bg-white/5 lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" class="h-5 w-5" aria-hidden="true" />
        <Menu v-else class="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>

    <!-- Mobile menu: transform + opacity only, staggered by index. -->
    <div
      id="mobile-menu"
      class="overflow-hidden border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out lg:hidden"
      :class="menuOpen ? 'max-h-[calc(100dvh-3.5rem)] opacity-100' : 'max-h-0 opacity-0'"
      :aria-hidden="!menuOpen"
      :inert="!menuOpen || undefined"
    >
      <div class="shell max-h-[calc(100dvh-3.5rem)] overflow-y-auto py-5">
        <ul class="space-y-1">
          <li
            v-for="(item, index) in primaryNav"
            :key="item.hash"
            class="transition-[transform,opacity] duration-300 ease-out"
            :class="menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'"
            :style="{ transitionDelay: menuOpen ? `${60 + index * 35}ms` : '0ms' }"
          >
            <a
              :href="item.hash"
              class="flex items-baseline justify-between gap-4 rounded-lg px-3 py-3 hover:bg-white/[0.04]"
              @click="menuOpen = false"
            >
              <span class="text-base font-medium text-steel-100">{{ item.label }}</span>
              <span class="font-mono text-xxs text-steel-500">{{ item.blurb }}</span>
            </a>
          </li>
        </ul>

        <div class="mt-5 grid gap-2 border-t border-white/[0.07] pt-5">
          <CtaButton :to="cta.trial.to" variant="primary" @click="menuOpen = false">
            {{ cta.trial.label }}
          </CtaButton>
          <CtaButton :to="cta.demo.to" variant="secondary" @click="menuOpen = false">
            {{ cta.demo.label }}
          </CtaButton>
          <!-- <CtaButton :to="cta.signIn.to" variant="ghost" @click="menuOpen = false">
            {{ cta.signIn.label }}
          </CtaButton> -->
        </div>
      </div>
    </div>
  </header>
</template>
