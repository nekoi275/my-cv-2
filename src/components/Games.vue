<script setup lang="ts">
import Sudoku from "@/components/Sudoku.vue";
/* eslint-disable */
//@ts-ignore
import SpaceInvaders from "@/components/SpaceInvaders.vue";
import { computed } from "vue";
/* eslint-enable */
const isDesktop = computed(() => {
  return window.innerWidth >= 1000
})
</script>

<template>
  <section
    id="games"
    class="bg-purple-50 h-screen flex flex-wrap items-center justify-around pl-24 pr-24 pt-24"
  >
    <SpaceInvaders v-show="isDesktop"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
