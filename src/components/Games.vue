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
    class="bg-purple-50 min-[846px]:h-screen flex flex-wrap items-center justify-around min-[846px]:pb-0 pl-24 pr-24 min-[846px]:pt-24 max-[845px]:h-full max-[845px]:pt-32 max-[845px]:pb-12"
  >
    <SpaceInvaders v-show="isDesktop"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
