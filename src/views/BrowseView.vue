<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <p>Browse</p>
    <RouterLink
      :to="{
        name: 'artwork',
        params: { slug: 'test' },
      }"
    >
      Test
    </RouterLink>
  </section>
</template>
