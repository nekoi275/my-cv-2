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
    class="bg-purple-50 h-screen flex flex-wrap items-center justify-around pl-24 pr-24 pt-24"
  >
    <SpaceInvaders></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
