import { createRouter, createWebHistory } from 'vue-router'

import BrowseView from '../views/BrowseView.vue'
import ArtworkView from '../views/ArtworkView.vue'

const routes =  [
  { path: '/', name: 'browse', component: BrowseView },
  { path: '/artwork/:slug', name: 'artwork', component: ArtworkView, props: true },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
