<script setup lang="ts">
import { toRef } from 'vue'
import { useArtwork } from '../composables/useArtwork'

const props = defineProps<{ slug: string }>()
const { data, loading, error } = useArtwork(toRef(props, 'slug'))
</script>

<template>
  <section>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error">Something went wrong.</p>
    <p v-else-if="!data">Artwork not found.</p>
    <article v-else>
      <img
        v-if="data.image?.url"
        :src="data.image.url"
        :alt="data.title ?? ''"
      />
      <h2>{{ data.title || 'Untitled' }}</h2>
      <p>{{ data.artistNames }}</p>
    </article>
  </section>
</template>
