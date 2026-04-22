<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="space-y-4 py-16 text-center">
    <h2 class="text-2xl font-semibold text-gray-900">Page not found</h2>
    <p class="text-sm text-gray-600">That route doesn't exist.</p>
    <RouterLink to="/" class="inline-block text-sm text-gray-600 hover:underline">
      <span aria-hidden="true">←</span> Back to browse
    </RouterLink>
  </section>
</template>
