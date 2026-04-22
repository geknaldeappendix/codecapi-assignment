<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from '../lib/debounce'

const props = defineProps<{ initialValue?: string }>()
const emit = defineEmits<{ 'update:query': [value: string] }>()

const input = ref(props.initialValue ?? '')
const emitDebounced = debounce((value: string) => emit('update:query', value), 350)

watch(input, (value) => emitDebounced(value))
</script>

<template>
  <div class="relative">
    <input
      v-model="input"
      type="text"
      aria-label="Search artworks"
      placeholder="Search artworks…"
      class="w-full border border-gray-300 px-3 py-2 pr-14 text-sm focus:border-gray-500 focus:outline-none"
    />
    <button
      v-if="input"
      type="button"
      class="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-600 hover:underline"
      @click="input = ''"
    >
      clear
    </button>
  </div>
</template>
