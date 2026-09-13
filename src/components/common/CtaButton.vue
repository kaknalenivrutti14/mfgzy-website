<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    to: string
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    arrow?: boolean
  }>(),
  { variant: 'primary', size: 'md', arrow: false },
)

/**
 * Anything the router cannot own — an in-page anchor, a mailto, an external
 * URL — renders as a plain <a>. Handing `mailto:` to <router-link> would make
 * it try to match a route and swallow the click.
 */
const isPlainLink = computed(() => /^(#|mailto:|tel:|https?:)/.test(props.to))
const isExternal = computed(() => /^https?:/.test(props.to))

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out active:translate-y-px'

const variants = {
  primary:
    'bg-accent-500 text-white shadow-[0_10px_30px_-12px_rgba(76,141,255,0.9)] hover:bg-accent-400 hover:shadow-[0_14px_38px_-12px_rgba(76,141,255,0.95)]',
  secondary:
    'border border-white/[0.12] bg-white/[0.04] text-steel-100 hover:border-white/25 hover:bg-white/[0.08]',
  ghost: 'text-steel-300 hover:text-steel-50',
} as const

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-12 px-6 text-base',
} as const
</script>

<template>
  <component
    :is="isPlainLink ? 'a' : 'router-link'"
    v-bind="
      isPlainLink
        ? {
            href: to,
            ...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {}),
          }
        : { to }
    "
    :class="[base, variants[variant], sizes[size]]"
  >
    <slot />
    <ArrowRight
      v-if="arrow"
      class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  </component>
</template>
