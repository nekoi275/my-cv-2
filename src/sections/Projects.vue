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
    class="min-h-screen relative text-[var(--color-dark,#491212)] p-8 w-full bg-[#e4cbce] pt-20"
  >
    <Teleport to="body" v-if="props.isOverlay">
      <ReturnButton @back="emit('back')" />
    </Teleport>
    <ReturnButton v-else @back="emit('back')" />
  </section>
</template>
