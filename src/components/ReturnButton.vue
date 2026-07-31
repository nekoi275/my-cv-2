<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'back', event: MouseEvent): void;
}>();

const handleClick = (e: MouseEvent) => {
  emit('click', e);
  emit('back', e);
  router.push('/');
};
</script>

<template>
  <button
    @click="handleClick"
    class="fixed top-6 left-6 z-[1000000] bg-transparent border-0 text-[var(--color-dark,#491212)] font-mono text-[0.85rem] font-semibold tracking-wider cursor-pointer py-1.5 px-0 opacity-70 hover:opacity-100"
    type="button"
  >
    back to garden
  </button>
</template>
