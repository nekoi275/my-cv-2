<script setup lang="ts">
import SpaceInvaders from "@/components/SpaceInvaders.vue";
import Sudoku from "@/components/Sudoku.vue";
</script>

<template>
    <header class="p-4 bg-pink-light">
        <button @click="$emit('back')" class="text-3xl cursor-pointer">⬅️</button>
    </header>
    <section id="facts" class="bg-green-light flex flex-row items-center justify-around p-4">
        <SpaceInvaders></SpaceInvaders>
        <Sudoku></Sudoku>
    </section>
</template>
