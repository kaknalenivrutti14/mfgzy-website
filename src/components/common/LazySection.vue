<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useInView } from '@/composables/useInView'

/**
 * Defers both the network request and the mount cost of a below-the-fold
 * section until it is close to the viewport. The slot function is never called
 * while the section is not shown, so an async component inside it is not even
 * created.
 *
 * Lazy here means "later", never "maybe". A hidden tab pauses the rendering
 * lifecycle — and with it IntersectionObserver — and a crawler may never
 * scroll, so each section also mounts on a fallback timer. Without that, a
 * page opened in a background tab would hold eighteen of its twenty sections
 * out of the DOM.
 */
const props = withDefaults(defineProps<{ minHeight?: string }>(), { minHeight: '520px' })

/** Staggers the fallback so the sections do not all mount on the same frame. */
let instances = 0
const slot = instances++

const root = ref<HTMLElement | null>(null)
// 700px of lead time: enough for the chunk to arrive before the user gets there.
const { inView } = useInView(root, { rootMargin: '700px 0px' })

const forced = ref(false)
const show = computed(() => inView.value || forced.value)

let timer = 0
onMounted(() => {
  timer = window.setTimeout(() => (forced.value = true), 2000 + slot * 220)
})
onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <div ref="root" :style="show ? undefined : { minHeight: props.minHeight }">
    <slot v-if="show" />
  </div>
</template>
