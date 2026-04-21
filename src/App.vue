<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-[1280px] flex-col">
    <header class="border-b border-gray-200 px-6 py-4">
      <RouterLink to="/" class="text-xl font-semibold">
        Artsy Browser
      </RouterLink>
    </header>
    <main class="flex-1 px-6 py-6">
      <RouterView />
    </main>
    <footer class="border-t border-gray-200 px-6 py-4 text-xs text-gray-500">
      thanks to:
      <a
        href="https://www.artsy.net"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline"
      >
        artsy
      </a>
    </footer>
  </div>
</template>
