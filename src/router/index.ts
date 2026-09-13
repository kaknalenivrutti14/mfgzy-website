import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { isReducedMotion } from '@/composables/useReducedMotion'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Manufacturing ERP Software | MFGZY',
      description:
        'Cloud manufacturing ERP for inventory, purchasing, production, quality, traceability, maintenance, finance and HR.',
    },
  },
  {
    path: '/get-started',
    name: 'get-started',
    // Secondary page: keep it out of the landing-page bundle.
    component: () => import('@/views/GetStartedView.vue'),
    meta: {
      title: 'Start a trial or book a demo | MFGZY',
      description:
        'Request an MFGZY manufacturing ERP trial workspace or a guided demo with your own production data.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found | MFGZY', description: 'This page does not exist.' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return {
        el: to.hash,
        top: 88,
        behavior: isReducedMotion() ? 'auto' : 'smooth',
      }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'MFGZY'
  document.title = title

  const description = to.meta.description as string | undefined
  if (description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }
})
