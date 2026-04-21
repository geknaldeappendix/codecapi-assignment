<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useArtworks } from '../composables/useArtworks'

const { data, loading, error } = useArtworks()
</script>

<template>
  <section>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error">Something went wrong.</p>
    <ul v-else>
      <li v-for="artwork in data" :key="artwork.internalID">
        <RouterLink :to="{ name: 'artwork', params: { slug: artwork.slug } }">
          {{ artwork.title || 'Untitled' }} — {{ artwork.artistNames }}
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
