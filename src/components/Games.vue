<script setup lang="ts">
import { computed } from "vue";
import Sudoku from "@/components/Sudoku.vue";
/* eslint-disable */
//@ts-ignore
import SpaceInvaders from "@/components/SpaceInvaders.vue";
/* eslint-enable */
const isDesktop = computed(() => {
  return window.innerWidth >= 1000
})
</script>

<template>
  <section
    id="games"
    class="bg-purple-50 lg:h-screen flex flex-wrap items-center justify-around lg:pb-0 pl-24 pr-24 lg:pt-24 md:h-full sm:h-full md:pt-32 sm:pt-32 md:pb-12 sm:pb-12"
  >
    <SpaceInvaders v-show="isDesktop"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
