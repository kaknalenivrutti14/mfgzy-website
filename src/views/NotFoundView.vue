<script setup lang="ts">
import CtaButton from '@/components/common/CtaButton.vue'
</script>

<template>
  <section class="relative grid min-h-[70vh] place-items-center overflow-hidden px-5 pt-24">
    <div class="pointer-events-none absolute inset-0 grid-backdrop radial-fade opacity-60" aria-hidden="true" />
    <div class="relative text-center">
      <p class="eyebrow justify-center">404</p>
      <h1 class="display-2 mt-4">This page does not exist.</h1>
      <p class="lede mx-auto mt-4 max-w-md">
        The link may be out of date. Everything about the platform lives on the overview page.
      </p>
      <div class="mt-8 flex justify-center">
        <CtaButton to="/" variant="primary" arrow>Back to the overview</CtaButton>
      </div>
    </div>
  </section>
</template>
