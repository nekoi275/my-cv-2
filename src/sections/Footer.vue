<script setup lang="ts">
import { computed, ref } from "vue";

const currentYear = computed(() => new Date().getFullYear());
const emailCopied = ref(false);
const email = "valeriiadrozdova90@gmail.com";

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(email);
    emailCopied.value = true;
    setTimeout(() => {
      emailCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy email:", err);
  }
};
</script>

<template>
  <footer class="w-full bg-pink-light text-center text-dark p-1 text-[12px] fixed bottom-0 z-10">
    <div>
      <span class="text-dark">Built with: Vue.js, three.js, GSAP, Tailwind CSS - {{ currentYear }}</span>
    </div>
  </footer>
</template>

<style scoped></style>
