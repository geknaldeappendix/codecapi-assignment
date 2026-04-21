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
  <input
    v-model="input"
    type="search"
    placeholder="Search artworks…"
    class="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
  />
</template>
