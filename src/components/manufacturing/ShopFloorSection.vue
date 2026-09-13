<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Check, ChevronRight, Cpu } from 'lucide-vue-next'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { completionEffects, operatorSteps, workOrder } from '@/data/production'
import { useInView } from '@/composables/useInView'
import { reveal, shouldAnimate, useGsapContext } from '@/composables/useScrollAnimation'

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const { inView } = useInView(stage, { once: false, threshold: 0.25 })

const stepIndex = ref(0)
const completed = ref(workOrder.startCompleted)

const step = computed(() => operatorSteps[stepIndex.value])
const isRecording = computed(() => step.value.id === 'record')
const isComplete = computed(() => step.value.id === 'complete')
const percent = computed(() => Math.round((completed.value / workOrder.target) * 100))

/** Steps advance on their own while on screen; clicking takes over. */
let timer = 0
function stopAuto() {
  window.clearInterval(timer)
  timer = 0
}

function startAuto() {
  if (timer || !shouldAnimate()) return
  timer = window.setInterval(() => {
    if (document.hidden) return
    if (stepIndex.value >= operatorSteps.length - 1) {
      stepIndex.value = 0
      completed.value = workOrder.startCompleted
      return
    }
    stepIndex.value += 1
  }, 2300)
}

watch(inView, (visible) => (visible ? startAuto() : stopAuto()), { immediate: true })

// The counter only moves on the step where the operator confirms output.
let countTimer = 0
watch(
  isRecording,
  (recording) => {
    window.clearInterval(countTimer)
    if (!recording || !shouldAnimate()) return
    countTimer = window.setInterval(() => {
      if (completed.value < workOrder.target) completed.value += 1
    }, 260)
  },
  { immediate: true },
)

function selectStep(index: number) {
  stopAuto()
  stepIndex.value = index
  if (index < operatorSteps.findIndex((s) => s.id === 'record')) {
    completed.value = workOrder.startCompleted
  }
}

onBeforeUnmount(() => {
  stopAuto()
  window.clearInterval(countTimer)
})

useGsapContext(root, ({ q, root: el }) => {
  reveal(q('[data-anim]'), el, { stagger: 0.07 })
})
</script>

<template>
  <section ref="root" id="shop-floor" class="section">
    <div class="shell">
      <SectionHeading
        eyebrow="Shop floor"
        title="Built for operators, not just office screens."
        lede="A tablet at the machine, in gloves, under factory light. Large targets, no free-text where a scan will do, and one confirmation that posts to every module at once."
      />

      <div ref="stage" class="mt-12 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10">
        <!-- Operator workflow -->
        <div data-anim>
          <p class="data-label">Operator workflow</p>
          <ol class="mt-4 space-y-1.5">
            <li v-for="(item, index) in operatorSteps" :key="item.id">
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-[border-color,background-color] duration-300"
                :class="
                  index === stepIndex
                    ? 'border-accent-500/45 bg-accent-500/[0.08]'
                    : index < stepIndex
                      ? 'border-white/[0.07] bg-white/[0.02]'
                      : 'border-white/[0.05] bg-transparent'
                "
                :aria-current="index === stepIndex ? 'step' : undefined"
                @click="selectStep(index)"
              >
                <span
                  class="grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-[0.625rem] transition-colors duration-300"
                  :class="
                    index < stepIndex
                      ? 'border-ok/40 bg-ok/10 text-ok'
                      : index === stepIndex
                        ? 'border-accent-500/50 bg-accent-500/15 text-accent-200'
                        : 'border-white/10 text-steel-600'
                  "
                >
                  <Check v-if="index < stepIndex" class="h-3 w-3" aria-hidden="true" />
                  <template v-else>{{ index + 1 }}</template>
                </span>

                <span class="min-w-0 flex-1">
                  <span
                    class="block truncate text-sm transition-colors duration-200"
                    :class="index === stepIndex ? 'font-medium text-steel-50' : 'text-steel-400'"
                  >
                    {{ item.label }}
                  </span>
                </span>

                <span class="shrink-0 font-mono text-[0.625rem] text-steel-600">
                  {{ item.hint }}
                </span>
              </button>
            </li>
          </ol>

          <p class="mt-5 min-h-[2.5rem] text-sm leading-relaxed text-steel-400" aria-live="polite">
            {{ step.detail }}
          </p>
        </div>

        <!-- The tablet -->
        <div data-anim>
          <div
            class="mx-auto max-w-xl rounded-[1.75rem] border border-white/[0.09] bg-ink-900 p-2.5 shadow-lift sm:p-3"
          >
            <div class="overflow-hidden rounded-[1.25rem] border border-white/[0.06] bg-ink-850">
              <!-- Status bar -->
              <div
                class="flex items-center gap-3 border-b border-white/[0.07] bg-ink-900/80 px-4 py-2.5"
              >
                <Cpu class="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
                <p class="font-mono text-xxs text-steel-300">{{ workOrder.machine }}</p>
                <p class="font-mono text-xxs text-steel-600">{{ workOrder.operator }}</p>
                <span
                  class="ml-auto flex items-center gap-1.5 font-mono text-xxs"
                  :class="isComplete ? 'text-ok' : 'text-accent-300'"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="isComplete ? 'bg-ok' : 'bg-accent-400 animate-pulse-dot'"
                    aria-hidden="true"
                  />
                  {{ isComplete ? 'COMPLETE' : 'RUNNING' }}
                </span>
              </div>

              <div class="p-4 sm:p-5">
                <div class="flex items-baseline justify-between gap-3">
                  <h3 class="font-mono text-lg font-semibold text-steel-50">
                    WORK ORDER #{{ workOrder.id }}
                  </h3>
                  <span class="shrink-0 font-mono text-xxs text-steel-500">
                    OP 20
                  </span>
                </div>

                <dl class="mt-4 grid grid-cols-2 gap-2.5">
                  <div class="panel-flat px-3 py-2.5">
                    <dt class="data-label">Product</dt>
                    <dd class="mt-1 text-xs leading-snug text-steel-100">{{ workOrder.product }}</dd>
                  </div>
                  <div class="panel-flat px-3 py-2.5">
                    <dt class="data-label">Operation</dt>
                    <dd class="mt-1 text-xs text-steel-100">{{ workOrder.operation }}</dd>
                  </div>
                </dl>

                <!-- Output -->
                <div class="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div class="flex items-end justify-between gap-4">
                    <div>
                      <p class="data-label">Completed</p>
                      <p class="mt-1 font-mono text-4xl font-semibold tabular-nums text-steel-50">
                        {{ completed }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="data-label">Target</p>
                      <p class="mt-1 font-mono text-xl tabular-nums text-steel-300">
                        {{ workOrder.target }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      class="h-full rounded-full bg-accent-500 transition-[width] duration-300 ease-out"
                      :style="{ width: `${percent}%` }"
                    />
                  </div>
                  <p class="mt-2 font-mono text-xxs text-steel-500">
                    {{ percent }}% · material {{ workOrder.material }}
                  </p>
                </div>

                <!-- What the confirmation posted -->
                <div
                  class="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
                  :class="isComplete ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'"
                >
                  <div class="overflow-hidden">
                    <div class="rounded-xl border border-ok/25 bg-ok/[0.07] p-4">
                      <p class="text-sm font-medium text-ok">Production complete</p>
                      <ul class="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                        <li
                          v-for="effect in completionEffects"
                          :key="effect"
                          class="flex items-center gap-2 font-mono text-[0.6875rem] text-steel-200"
                        >
                          <Check class="h-3 w-3 shrink-0 text-ok" aria-hidden="true" />
                          {{ effect }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Primary action -->
                <button
                  type="button"
                  class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-400"
                  @click="selectStep((stepIndex + 1) % operatorSteps.length)"
                >
                  {{ isComplete ? 'Start next work order' : operatorSteps[Math.min(stepIndex + 1, operatorSteps.length - 1)].label }}
                  <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
