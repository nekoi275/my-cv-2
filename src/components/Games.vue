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
    class="bg-green-50 flex flex-wrap items-center justify-around h-screen min-[1280px]:h-full min-[1280px]:p-3 min-[1400px]:h-screen max-[1400px]:p-0"
  >
    <SpaceInvaders class="min-[768px]:block min-[846px]:mb-10 max-[768px]:hidden"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
