<script setup lang="ts">
import { ref } from 'vue'
import { countUp, useGsapContext } from '@/composables/useScrollAnimation'

const props = withDefaults(
  defineProps<{
    value: number
    prefix?: string
    suffix?: string
    decimals?: number
    duration?: number
  }>(),
  { decimals: 0 },
)

const root = ref<HTMLElement | null>(null)

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: props.decimals,
  maximumFractionDigits: props.decimals,
})

const format = (value: number) => formatter.format(value)

useGsapContext(root, ({ root: el }) => {
  const target = el.querySelector<HTMLElement>('[data-count]')
  if (target) countUp(target, props.value, format, { duration: props.duration })
})
</script>

<template>
  <span ref="root" class="tabular-nums">
    <span v-if="prefix">{{ prefix }}</span
    ><span data-count>{{ format(0) }}</span
    ><span v-if="suffix">{{ suffix }}</span>
  </span>
</template>
