import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'

/**
 * `motion-ready` is what hides `[data-anim]` elements before their entrance
 * tween runs. Setting it from JS (rather than in the markup) means a browser
 * with JavaScript disabled or broken renders the full page instead of a
 * column of invisible sections.
 */
document.documentElement.classList.add('motion-ready')

createApp(App).use(router).mount('#app')
