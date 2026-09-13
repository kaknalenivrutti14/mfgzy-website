<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    lede?: string
    align?: 'left' | 'center'
    /** Heading level — sections use h2, sub-blocks h3. */
    level?: 2 | 3
  }>(),
  { align: 'left', level: 2 },
)
</script>

<template>
  <header
    class="max-w-3xl"
    :class="align === 'center' ? 'mx-auto text-center' : ''"
  >
    <p v-if="eyebrow" class="eyebrow" data-anim>
      <span
        class="h-1 w-1 rounded-full bg-accent-500"
        :class="align === 'center' ? 'hidden' : ''"
        aria-hidden="true"
      />
      {{ eyebrow }}
    </p>

    <component
      :is="level === 2 ? 'h2' : 'h3'"
      class="mt-4 text-balance"
      :class="level === 2 ? 'display-2' : 'text-2xl font-semibold tracking-tight sm:text-3xl'"
      data-anim
    >
      {{ title }}
    </component>

    <p v-if="lede" class="lede mt-5" data-anim>{{ lede }}</p>
    <div v-if="$slots.default" class="mt-6" data-anim><slot /></div>
  </header>
</template>
