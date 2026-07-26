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
      props.isOverlay ? 'fixed inset-0 z-[999999] bg-[#e4cbce] w-screen h-screen pt-20' : 'bg-pink-dark'
    ]"
  >
    <Teleport to="body" v-if="props.isOverlay">
      <ReturnButton @back="emit('back')" />
    </Teleport>
    <ReturnButton v-else @back="emit('back')" />
  </section>
</template>
