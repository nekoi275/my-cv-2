<script setup lang="ts">
import SpaceInvaders from "@/components/SpaceInvaders.vue";
import Sudoku from "@/components/Sudoku.vue";
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="p-4 bg-pink-light">
            <button @click="$emit('back')" class="text-3xl cursor-pointer">⬅️</button>
        </header>
        <section class="bg-green-light flex flex-row flex-wrap gap-4 items-center justify-around flex-grow">
            <SpaceInvaders></SpaceInvaders>
            <Sudoku></Sudoku>
        </section>
    </div>
</template>
