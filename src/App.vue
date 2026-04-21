<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-[1280px]">
    <header class="border-b border-gray-200 px-6 py-4">
      <RouterLink to="/" class="text-xl font-semibold">
        Artsy Browser
      </RouterLink>
    </header>
    <main class="px-6 py-6">
      <RouterView />
    </main>
  </div>
</template>
 q  