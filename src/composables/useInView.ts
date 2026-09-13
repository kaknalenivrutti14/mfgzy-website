import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Cheap one-shot visibility flag. Used for CSS-driven effects and for deciding
 * when to mount a lazily imported section, where a full ScrollTrigger would be
 * more machinery than the job needs.
 */
export function useInView(
  target: Ref<HTMLElement | null>,
  options: { rootMargin?: string; threshold?: number; once?: boolean } = {},
) {
  const inView = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const el = target.value
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      inView.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inView.value = true
            if (options.once !== false) observer?.disconnect()
          } else if (options.once === false) {
            inView.value = false
          }
        }
      },
      { rootMargin: options.rootMargin ?? '0px', threshold: options.threshold ?? 0 },
    )
    observer.observe(el)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { inView }
}
