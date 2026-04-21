<script setup lang="ts">
import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import { useArtwork } from '../composables/useArtwork'

const props = defineProps<{ slug: string }>()
const { data, loading, error } = useArtwork(toRef(props, 'slug'))
const router = useRouter()
</script>

<template>
  <section class="space-y-4">
    <button
      type="button"
      class="text-sm text-gray-600 hover:underline"
      @click="router.back()"
    >
      <- Back to browse
    </button>
    <p v-if="loading" class="text-gray-500">Loading…</p>
    <p v-else-if="error" class="text-red-600">Something went wrong.</p>
    <p v-else-if="!data" class="text-gray-500">Artwork not found.</p>
    <article v-else class="mx-auto max-w-2xl space-y-6">
      <div class="flex items-baseline gap-3">
        <h2 class="text-2xl font-semibold text-gray-900">{{ data.title || 'Untitled' }}</h2>
        <p class="lowercase text-gray-600">{{ data.artistNames }}</p>
      </div>
      <img
        v-if="data.image?.url"
        :src="data.image.url"
        :alt="data.title ?? ''"
        class="w-full"
      />
      <dl class="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
        <template v-if="data.date">
          <dt class="text-gray-500">Year</dt>
          <dd class="text-gray-800">{{ data.date }}</dd>
        </template>
        <template v-if="data.medium">
          <dt class="text-gray-500">Medium</dt>
          <dd class="text-gray-800">{{ data.medium }}</dd>
        </template>
        <template v-if="data.dimensions?.cm">
          <dt class="text-gray-500">Dimensions</dt>
          <dd class="text-gray-800">{{ data.dimensions.cm }}</dd>
        </template>
        <template v-if="data.saleMessage">
          <dt class="text-gray-500">Status</dt>
          <dd class="text-gray-800">{{ data.saleMessage }}</dd>
        </template>
      </dl>
      <p
        v-if="data.description"
        class="whitespace-pre-line text-sm text-gray-800"
      >
        {{ data.description }}
      </p>
    </article>
  </section>
</template>
