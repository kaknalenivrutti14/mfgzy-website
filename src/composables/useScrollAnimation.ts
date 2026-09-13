import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * Sections mount at different times (several are lazy), and each mount can
 * change document height. Refreshing once per frame-batch instead of once per
 * section keeps ScrollTrigger's measurements correct without thrashing layout.
 */
let refreshHandle = 0
export function scheduleRefresh(): void {
  window.clearTimeout(refreshHandle)
  refreshHandle = window.setTimeout(() => ScrollTrigger.refresh(), 120)
}

/**
 * Whether an entrance animation should play at all.
 *
 * Browsers stop serving requestAnimationFrame to a hidden document, so a page
 * first painted in a background tab would otherwise mount its sections, start
 * their tweens, and freeze them at opacity 0. Nobody is watching an animation
 * in a background tab — render the end state instead.
 */
export function shouldAnimate(): boolean {
  if (isReducedMotion()) return false
  return typeof document === 'undefined' || document.visibilityState === 'visible'
}

type SetupArgs = {
  /** The gsap.Context — use ctx.selector or plain selectors; both are scoped. */
  self: gsap.Context
  /** Scoped querySelectorAll returning an array (empty when nothing matches). */
  q: (selector: string) => HTMLElement[]
  root: HTMLElement
  /** True when the section must render its end state without animating. */
  reduced: boolean
}

/**
 * Runs GSAP setup scoped to one element and reverts every tween and
 * ScrollTrigger it created when the component unmounts.
 *
 * Elements marked `[data-anim]` start at opacity 0 (see main.css). If setup
 * throws, we reveal them rather than leaving a blank section behind.
 */
export function useGsapContext(
  root: Ref<HTMLElement | null>,
  setup: (args: SetupArgs) => void,
): void {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    const el = root.value
    if (!el) return

    const q = (selector: string) => Array.from(el.querySelectorAll<HTMLElement>(selector))

    try {
      ctx = gsap.context((self) => {
        setup({ self, q, root: el, reduced: !shouldAnimate() })
      }, el)
      scheduleRefresh()
    } catch (error) {
      console.error('[animation] setup failed, revealing content', error)
      gsap.set(q('[data-anim]'), { opacity: 1, clearProps: 'transform' })
    }
  })

  onBeforeUnmount(() => ctx?.revert())
}

type RevealOptions = {
  y?: number
  stagger?: number
  start?: string
  duration?: number
  delay?: number
}

/**
 * The site's default entrance: a short rise + fade, played once when the block
 * reaches the lower third of the viewport. Reduced motion gets the end state.
 */
export function reveal(
  targets: gsap.TweenTarget,
  trigger: Element,
  options: RevealOptions = {},
): gsap.core.Tween | undefined {
  const list = gsap.utils.toArray<HTMLElement>(targets)
  if (!list.length) return undefined

  if (!shouldAnimate()) {
    gsap.set(list, { opacity: 1, y: 0 })
    return undefined
  }

  // fromTo, not from: `[data-anim]` elements are pre-hidden in CSS, so `from`
  // would read opacity 0 as the *end* state and animate nothing into nothing.
  return gsap.fromTo(
    list,
    { opacity: 0, y: options.y ?? 22 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? 0.7,
      delay: options.delay ?? 0,
      ease: 'power2.out',
      stagger: options.stagger ?? 0.08,
      scrollTrigger: { trigger, start: options.start ?? 'top 82%', once: true },
    },
  )
}

/**
 * Counts a number up when its element scrolls into view.
 * `format` receives the interpolated value on every tick.
 */
export function countUp(
  el: HTMLElement,
  to: number,
  format: (value: number) => string,
  options: { duration?: number; start?: string } = {},
): void {
  if (!shouldAnimate()) {
    el.textContent = format(to)
    return
  }

  const state = { value: 0 }
  el.textContent = format(0)

  gsap.to(state, {
    value: to,
    duration: options.duration ?? 1.6,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = format(state.value)
    },
    scrollTrigger: { trigger: el, start: options.start ?? 'top 88%', once: true },
  })
}

/** Animates an SVG path as if it were being drawn. Returns the tween target. */
export function drawPath(
  path: SVGPathElement | SVGLineElement | SVGPolylineElement,
  options: { duration?: number; delay?: number; ease?: string } = {},
): gsap.core.Tween | undefined {
  const length = path.getTotalLength()
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

  if (!shouldAnimate()) {
    gsap.set(path, { strokeDashoffset: 0 })
    return undefined
  }

  return gsap.to(path, {
    strokeDashoffset: 0,
    duration: options.duration ?? 1,
    delay: options.delay ?? 0,
    ease: options.ease ?? 'power1.inOut',
  })
}
