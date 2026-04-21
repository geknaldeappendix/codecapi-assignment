<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const SIZE = 320
const CONTAINER = 1280

const props = defineProps<{
  url: string
  show: boolean
  cursorX: number
  cursorY: number
  centerY: number
}>()

const loaded = ref(false)
watch(() => props.url, () => (loaded.value = false))

const pos = computed(() => {
  const contentWidth = Math.min(window.innerWidth, CONTAINER)
  return {
    left: Math.round((window.innerWidth + contentWidth) / 2) - SIZE,
    top: Math.round(props.centerY - SIZE / 2),
  }
})

const nearest = computed(() => {
  const { left, top } = pos.value
  const right = left + SIZE
  const bottom = top + SIZE
  return {
    x: Math.max(left, Math.min(props.cursorX, right)),
    y: Math.max(top, Math.min(props.cursorY, bottom)),
  }
})
</script>

<template>
  <div v-show="show" class="pointer-events-none fixed inset-0 z-40">
    <svg class="absolute inset-0 h-full w-full">
      <line
        :x1="cursorX"
        :y1="cursorY"
        :x2="nearest.x"
        :y2="nearest.y"
        stroke="#6b7280"
        stroke-width="1"
      />
    </svg>
    <div
      class="absolute overflow-hidden border border-gray-300 bg-white shadow-lg"
      :style="{
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: `${SIZE}px`,
        height: `${SIZE}px`,
      }"
    >
      <img
        :src="url"
        alt=""
        class="h-full w-full transition-opacity duration-150"
        :class="{ 'opacity-0': !loaded }"
        @load="loaded = true"
      />
      <div
        v-if="!loaded"
        class="absolute inset-0 flex items-center justify-center bg-gray-50 text-xs text-gray-400"
      >
        Loading…
      </div>
    </div>
  </div>
</template>
