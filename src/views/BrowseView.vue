<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useArtworks } from '../composables/useArtworks'
import SearchBar from '../components/SearchBar.vue'

const route = useRoute()
const router = useRouter()

const initialQuery = typeof route.query.q === 'string' ? route.query.q : ''
const query = ref(initialQuery)
const { data, loading, error } = useArtworks(query)

watch(query, (value) => {
  router.replace({ query: value ? { q: value } : {} })
})
</script>

<template>
  <section class="space-y-4">
    <SearchBar :initial-value="initialQuery" @update:query="query = $event" />
    <p v-if="loading" class="text-gray-500">Loading…</p>
    <p v-else-if="error" class="text-red-600">Something went wrong.</p>
    <p v-else-if="!data.length" class="text-gray-500">No artworks found.</p>
    <ul v-else class="space-y-2">
      <li v-for="artwork in data" :key="artwork.internalID">
        <RouterLink
          :to="{ name: 'artwork', params: { slug: artwork.slug } }"
          class="hover:underline"
        >
          {{ artwork.title || 'Untitled' }} — {{ artwork.artistNames }}
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
