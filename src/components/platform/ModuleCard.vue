<script setup lang="ts">
import type { PlatformModule } from '@/data/modules'

defineProps<{
  module: PlatformModule
  /** True when another card's connections include this one. */
  linked: boolean
  active: boolean
  dimmed: boolean
}>()

const toneClass: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  crit: 'text-crit',
  info: 'text-info',
}

const phaseLabel: Record<number, string> = {
  1: 'Available',
  2: 'Available',
  3: 'In build',
  4: 'Planned',
  5: 'Planned',
}
</script>

<template>
  <article
    class="group relative h-full rounded-2xl border p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out"
    :class="[
      active
        ? '-translate-y-1 border-accent-500/45 bg-ink-800 shadow-glow'
        : linked
          ? 'border-accent-500/25 bg-ink-850'
          : 'border-white/[0.07] bg-ink-850/70',
      dimmed ? 'opacity-55' : 'opacity-100',
    ]"
  >
    <div class="flex items-start justify-between gap-3">
      <span
        class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors duration-300"
        :class="
          active || linked
            ? 'border-accent-500/40 bg-accent-500/10 text-accent-400'
            : 'border-white/[0.08] bg-white/[0.03] text-steel-300'
        "
      >
        <component
          :is="module.icon"
          class="h-4 w-4 transition-transform duration-300"
          :class="active ? 'scale-110' : ''"
          aria-hidden="true"
        />
      </span>

      <span
        class="font-mono text-xxs uppercase tracking-[0.12em]"
        :class="module.phase <= 2 ? 'text-ok/80' : 'text-steel-600'"
      >
        {{ phaseLabel[module.phase] }}
      </span>
    </div>

    <h3 class="mt-4 text-base font-semibold text-steel-50">{{ module.name }}</h3>
    <p class="mt-2 text-sm leading-relaxed text-steel-400">{{ module.blurb }}</p>

    <!-- Mini record preview: always present for screen readers and keyboard
         users, but only takes up space once the card is engaged. -->
    <div
      class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
      :class="active ? 'mt-4 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <dl class="space-y-1 rounded-lg border border-white/[0.07] bg-ink-900/70 p-2.5">
          <div
            v-for="row in module.preview"
            :key="row.label"
            class="flex items-baseline justify-between gap-3"
          >
            <dt class="truncate font-mono text-[0.625rem] text-steel-500">{{ row.label }}</dt>
            <dd
              class="shrink-0 font-mono text-[0.625rem] tabular-nums"
              :class="row.tone ? toneClass[row.tone] : 'text-steel-200'"
            >
              {{ row.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </article>
</template>
