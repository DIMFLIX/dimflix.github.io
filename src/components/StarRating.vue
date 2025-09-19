<template>
  <div class="stars" @mouseleave="onLeave" :style="{ gap: gapPx }">
    <button
      v-for="i in 5"
      :key="i"
      class="star-btn"
      :class="{ interactive }"
      type="button"
      @mouseenter="onEnter(i)"
      @click="onClick(i)"
      :style="{ width: sizePx, height: sizePx }"
      aria-label="rate"
    >
      <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none">
        <path
          :d="starPath"
          :fill="(currentValue >= i) ? fillColor : 'transparent'"
          :stroke="strokeColor"
          :stroke-width="strokeWidth"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{ value: number; interactive?: boolean; size?: number }>(), {
  interactive: false,
  size: 28,
})

const emit = defineEmits<{ (e: 'update:value', v: number): void }>()

const hover = ref(0)
const currentValue = computed(() => (props.interactive ? (hover.value || props.value) : props.value))

const size = computed(() => props.size)
const sizePx = computed(() => `${size.value}px`)
const gapPx = computed(() => `${Math.round(size.value * 0.15)}px`)
const strokeWidth = computed(() => Math.max(1.5, size.value * 0.08))
const fillColor = '#f5b301'
const strokeColor = '#f2c94c'

// Rounded-corner star path (slightly softer via rounded joins)
const starPath = `M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.1 6.46L12 17.9 6.2 20.4l1.1-6.46-4.7-4.58 6.5-.95L12 2.5z`

function onEnter(i: number) {
  if (props.interactive) hover.value = i
}
function onLeave() {
  if (props.interactive) hover.value = 0
}
function onClick(i: number) {
  if (props.interactive) emit('update:value', i)
}
</script>

<style scoped>
.stars { display: inline-flex; align-items: center; }
.star-btn { background: transparent; border: none; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; }
.star-btn.interactive { cursor: pointer; }
.star-btn:focus { outline: 2px solid var(--mauve-color); outline-offset: 2px; border-radius: 8px; }
</style>

