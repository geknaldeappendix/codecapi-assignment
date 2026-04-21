<script setup lang="ts">
import { toRef } from 'vue'
import { useArtwork } from '../composables/useArtwork'

const props = defineProps<{ slug: string }>()
const { data, loading, error } = useArtwork(toRef(props, 'slug'))
</script>

<template>
  <section>
    <p v-if="loading" class="text-gray-500">Loading…</p>
    <p v-else-if="error" class="text-red-600">Something went wrong.</p>
    <p v-else-if="!data" class="text-gray-500">Artwork not found.</p>
    <article v-else class="space-y-4">
      <div class="flex items-baseline gap-3">
        <h2 class="text-2xl font-semibold text-gray-900">{{ data.title || 'Untitled' }}</h2>
        <p class="lowercase text-gray-600">{{ data.artistNames }}</p>
      </div>
      <img
        v-if="data.image?.url"
        :src="data.image.url"
        :alt="data.title ?? ''"
        class="mx-auto w-full max-w-2xl"
      />
    </article>
  </section>
</template>
