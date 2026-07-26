<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'back', event: MouseEvent): void;
}>();

const handleClick = (e: MouseEvent) => {
  emit('click', e);
  emit('back', e);
};
</script>

<template>
  <button
    @click="handleClick"
    class="back-to-garden-btn"
    type="button"
  >
    ← back to garden
  </button>
</template>

<style scoped>
.back-to-garden-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1000000;
  background: transparent;
  border: none;
  color: var(--color-dark, #491212);
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding: 0.4em 0;
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.back-to-garden-btn:hover {
  opacity: 1;
  transform: translateX(-4px);
}
</style>
