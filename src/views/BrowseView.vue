<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useArtworks, type Artwork } from '../composables/useArtworks'
import SearchBar from '../components/SearchBar.vue'
import HoverPreview from '../components/HoverPreview.vue'
import StateMessage from '../components/StateMessage.vue'

const route = useRoute()
const router = useRouter()

const initialQuery = typeof route.query.q === 'string' ? route.query.q : ''
const query = ref(initialQuery)
const { data, loading, error } = useArtworks(query)

watch(query, (value) => {
  router.replace({ query: value ? { q: value } : {} })
})

const hovered = ref<Artwork | null>(null)
const cursor = ref({ x: 0, y: 0 })
const centerY = ref(0)
const listRef = ref<HTMLUListElement | null>(null)
const canHover = window.matchMedia('(hover: hover)').matches

function enter(artwork: Artwork, event: MouseEvent) {
  if (!canHover) return
  hovered.value = artwork
  cursor.value = { x: event.clientX, y: event.clientY }
  const rect = listRef.value?.getBoundingClientRect()
  if (rect) centerY.value = rect.top + rect.height / 2
}
function move(event: MouseEvent) {
  cursor.value = { x: event.clientX, y: event.clientY }
}
function leave() {
  hovered.value = null
}
</script>

<template>
  <section class="space-y-4">
    <SearchBar :initial-value="initialQuery" @update:query="query = $event" />
    <StateMessage v-if="loading">Loading…</StateMessage>
    <StateMessage v-else-if="error" variant="error">Something went wrong.</StateMessage>
    <StateMessage v-else-if="!data.length">No artworks found.</StateMessage>
    <ul v-else ref="listRef" class="space-y-2">
      <li v-for="artwork in data" :key="artwork.internalID">
        <RouterLink
          :to="{ name: 'artwork', params: { slug: artwork.slug } }"
          class="hover:underline"
          @mouseenter="enter(artwork, $event)"
          @mousemove="move"
          @mouseleave="leave"
        >
          {{ artwork.title || 'Untitled' }} — {{ artwork.artistNames }}
        </RouterLink>
      </li>
    </ul>
    <HoverPreview
      :show="!!hovered?.image?.thumb"
      :url="hovered?.image?.thumb ?? ''"
      :cursor-x="cursor.x"
      :cursor-y="cursor.y"
      :center-y="centerY"
    />
  </section>
</template>
