<script setup lang="ts">
import { brand } from '@/data/brand'

/**
 * The icon is the raster mark cropped from the supplied logo; the wordmark is
 * live text. That keeps it crisp at every size, lets "ZY" take the accent
 * colour, and keeps the spelling in one editable place — the artwork's own
 * wordmark is dark navy and would disappear on this background anyway.
 */
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

// The mark carries a swoosh below the block, so it reads smaller than its box.
// One step up from the wordmark's cap height balances the two.
const icon = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-11',
} as const

const word = {
  sm: 'text-[0.95rem]',
  md: 'text-lg',
  lg: 'text-2xl',
} as const
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <img
      src="/logo-mark.png"
      alt=""
      class="w-auto shrink-0"
      :class="icon[size]"
      width="288"
      height="329"
      decoding="async"
    />
    <span class="font-semibold tracking-tight" :class="word[size]">
      <span class="text-steel-50">{{ brand.markLead }}</span
      ><span class="text-signal">{{ brand.markTail }}</span>
    </span>
  </span>
</template>
