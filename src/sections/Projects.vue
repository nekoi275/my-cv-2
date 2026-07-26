<script setup lang="ts">
import ReturnButton from "@/components/ReturnButton.vue";

const props = defineProps<{ isOverlay?: boolean }>();
const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>

<template>
  <section 
    id="projects-section"
    :class="[
      'min-h-screen relative text-[var(--color-dark,#491212)] p-8',
      props.isOverlay ? 'is-overlay' : ''
    ]"
  >
    <Teleport to="body" v-if="props.isOverlay">
      <ReturnButton @back="emit('back')" />
    </Teleport>
    <ReturnButton v-else @back="emit('back')" />
  </section>
</template>

<style scoped>
#projects-section.is-overlay {
  position: fixed !important;
  inset: 0 !important;
  z-index: 999999 !important;
  background-color: #e4cbce !important;
  width: 100vw !important;
  height: 100vh !important;
  padding-top: 5rem !important;
}
</style>
