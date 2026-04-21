<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/">
      <h1>Artsy Browser</h1>
    </RouterLink>
  </header>
  <main>
    <RouterView />
  </main>
</template>
