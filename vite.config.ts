import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the animation engine out of the entry chunk: the hero needs it,
        // but splitting lets the browser parse markup while GSAP downloads.
        manualChunks: {
          gsap: ['gsap'],
        },
      },
    },
  },
})
