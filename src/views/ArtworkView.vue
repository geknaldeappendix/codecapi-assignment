<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <section>
    <p>Artwork: {{ slug }}</p>
  </section>
</template>
