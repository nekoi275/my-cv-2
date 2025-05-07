<script setup lang="ts">
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="w-full bg-purple-50 h-14 text-center text-dark-50 pt-3 pb-3 text-xs">
    <span class="text-green-600">Built with: </span>Vue 3, Tailwind CSS - <span class="text-green-600">{{ currentYear }}</span>
  </footer>
</template>

<style scoped></style>
