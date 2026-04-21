<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useArtworks } from '../composables/useArtworks'

const { data, loading, error } = useArtworks()
</script>

<template>
  <section>
    <p v-if="loading" class="text-gray-500">Loading…</p>
    <p v-else-if="error" class="text-red-600">Something went wrong.</p>
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
