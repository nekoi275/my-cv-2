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
  <footer class="w-full bg-purple-50 text-center text-dark-50 pt-3 pb-3 text-xs">
    <div>
      <span class="text-dark-50">Built with: Vue 3, Tailwind CSS - {{ currentYear }}</span>
    </div>
    <div class="mt-1">
      <button @click="copyEmail" class="text-dark-50 hover:text-green-100 cursor-pointer">
        {{ emailCopied ? '💌 Email copied 💌' : '✉️ Contact me ✉️' }}
      </button>
    </div>
  </footer>
</template>

<style scoped></style>
