import { onBeforeUnmount, readonly, ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

function initialPreference(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/**
 * Module-level so every component reads the same answer and a single listener
 * keeps it current when the OS setting changes mid-session.
 */
const reduced = ref(initialPreference())

if (typeof window !== 'undefined' && window.matchMedia) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', (event) => {
    reduced.value = event.matches
  })
}

/** Synchronous read, for code paths that run outside a component scope. */
export function isReducedMotion(): boolean {
  return reduced.value
}

export function useReducedMotion() {
  return { reduced: readonly(reduced) }
}

/**
 * Runs `fn` on an idle callback, or immediately when the browser has no
 * requestIdleCallback. Used to defer non-critical animation setup.
 */
export function onIdle(fn: () => void): void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }
  if (typeof w.requestIdleCallback === 'function') {
    const handle = w.requestIdleCallback(fn, { timeout: 600 })
    onBeforeUnmount(() => w.cancelIdleCallback?.(handle))
    return
  }
  const t = window.setTimeout(fn, 60)
  onBeforeUnmount(() => window.clearTimeout(t))
}
