<script setup lang="ts">
import Sudoku from "@/components/Sudoku.vue";
/* eslint-disable */
//@ts-ignore
import SpaceInvaders from "@/components/SpaceInvaders.vue";
/* eslint-enable */
</script>

<template>
  <section
    id="games"
    class="bg-green-50 flex flex-wrap items-center justify-around h-screen"
  >
    <SpaceInvaders class="min-[846px]:block min-[846px]:mb-10 max-[845px]:hidden"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
