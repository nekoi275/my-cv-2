<script setup lang="ts">
import SpaceInvaders from "@/components/SpaceInvaders.vue";
import Sudoku from "@/components/Sudoku.vue";
import ReturnButton from "@/components/ReturnButton.vue";

const emit = defineEmits(['back']);

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <ReturnButton @back="emit('back')" />
        <section class="bg-green-light flex flex-row flex-wrap gap-4 items-center justify-around flex-grow py-4">
            <SpaceInvaders></SpaceInvaders>
            <Sudoku></Sudoku>
        </section>
    </div>
</template>
