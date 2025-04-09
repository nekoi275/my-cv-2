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
    class="bg-green-50 min-[1000px]:h-screen flex flex-wrap items-center justify-around min-[846px]:pb-0 min-[846px]:pl-24 min-[846px]:pr-24 min-[846px]:pt-24 max-[845px]:h-full max-[845px]:pt-32 max-[845px]:pb-12"
  >
    <SpaceInvaders class="min-[846px]:block min-[846px]:mb-10 max-[845px]:hidden"></SpaceInvaders>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
