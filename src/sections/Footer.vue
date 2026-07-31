<script setup lang="ts">
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());

</script>

<template>
  <footer class="w-full bg-pink-light text-center text-dark p-1 text-[12px] fixed bottom-0 z-10">
    <div>
      <span class="text-dark">Built with: Vue.js, three.js, GSAP, Tailwind CSS - {{ currentYear }}. Music and models under CC0 license</span>
    </div>
  </footer>
</template>

<style scoped></style>
