<script setup lang="ts">
import Sudoku from "@/components/Sudoku.vue";
/* eslint-disable */
//@ts-ignore
import SpaceInvaders from "@/components/SpaceInvaders.vue";
/* eslint-enable */
</script>

<template>
  <section id="games"
    class="bg-green-light flex flex-wrap items-center justify-around h-screen min-[1280px]:h-full min-[1280px]:p-3 min-[1400px]:h-screen max-[1400px]:p-0">
    <SpaceInvaders class="min-[1280px]:block max-[1280px]:hidden"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
