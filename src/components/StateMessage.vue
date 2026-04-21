<script setup lang="ts">
defineProps<{ variant?: 'info' | 'error' }>()
</script>

<template>
  <p :class="variant === 'error' ? 'text-red-600' : 'text-gray-500'">
    <slot />
  </p>
</template>
