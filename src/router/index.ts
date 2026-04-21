import { createRouter, createWebHistory } from 'vue-router'

import BrowseView from '../views/BrowseView.vue'
import ArtworkView from '../views/ArtworkView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes =  [
  { path: '/', name: 'browse', component: BrowseView },
  { path: '/artwork/:slug', name: 'artwork', component: ArtworkView, props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
