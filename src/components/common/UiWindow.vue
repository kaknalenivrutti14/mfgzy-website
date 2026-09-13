<script setup lang="ts">
/**
 * The chrome every mock ERP screen on the page sits inside, so twelve different
 * dashboards read as one product rather than twelve illustrations.
 */
withDefaults(
  defineProps<{
    title: string
    breadcrumb?: string
    status?: string
    tone?: 'ok' | 'warn' | 'crit' | 'info' | 'idle'
    /** Removes body padding for diagrams that need the full width. */
    flush?: boolean
  }>(),
  { tone: 'idle', flush: false },
)

const toneClass: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  crit: 'text-crit',
  info: 'text-info',
  idle: 'text-steel-400',
}

const dotClass: Record<string, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  crit: 'bg-crit',
  info: 'bg-info',
  idle: 'bg-steel-500',
}
</script>

<template>
  <div class="panel overflow-hidden">
    <div
      class="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-3 py-2.5 sm:px-4"
    >
      <span class="flex items-center gap-1.5" aria-hidden="true">
        <span class="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span class="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span class="h-1.5 w-1.5 rounded-full bg-white/15" />
      </span>

      <!-- min-w-0 is what lets `truncate` actually engage: without it this flex
           child keeps its content width and widens the whole panel. -->
      <p class="min-w-0 flex-1 truncate font-mono text-xxs uppercase tracking-[0.14em] text-steel-400">
        {{ title }}
        <span v-if="breadcrumb" class="text-steel-600"> / {{ breadcrumb }}</span>
      </p>

      <span
        v-if="status"
        class="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-xxs"
        :class="toneClass[tone]"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="[dotClass[tone], tone === 'ok' ? 'animate-pulse-dot' : '']"
        />
        {{ status }}
      </span>
    </div>

    <div :class="flush ? '' : 'p-3 sm:p-4'">
      <slot />
    </div>
  </div>
</template>
