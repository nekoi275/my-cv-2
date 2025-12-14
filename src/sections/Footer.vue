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
  <footer class="w-full bg-pink-light text-center text-dark pt-3 pb-3 text-xs">
    <div>
      <span class="text-dark">Built with: Vue 3, three.js, gsap, Tailwind CSS - {{ currentYear }}</span>
    </div>
    <div class="mt-1">
      <button @click="copyEmail" class="text-dark hover:text-green-dark cursor-pointer">
        {{ emailCopied ? '💌 Email copied 💌' : '✉️ Contact me ✉️' }}
      </button>
    </div>
    <div class="mt-1 hidden lg:block">
      <a href="#" @click.prevent="$emit('show-easter-egg')"
        class="text-dark hover:text-green-dark cursor-pointer no-underline">
        Easter egg
      </a>
    </div>
  </footer>
</template>

<style scoped></style>
