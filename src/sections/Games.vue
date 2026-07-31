<script setup lang="ts">
import SpaceInvaders from "@/components/SpaceInvaders.vue";
import Sudoku from "@/components/Sudoku.vue";
import ReturnButton from "@/components/ReturnButton.vue";

const emit = defineEmits<{ (e: 'back'): void }>();
</script>

<template>
    <div class="min-h-screen w-full relative bg-[var(--color-pink-light,#eadbdc)] flex flex-col overflow-y-auto">
        <ReturnButton @back="emit('back')" />

        <section class="bg-[var(--color-green-light,#cde2bd)] flex flex-col lg:flex-row items-center justify-center gap-8 flex-grow pt-20 pb-16 px-4 sm:px-8 w-full max-w-full overflow-y-auto">
            <SpaceInvaders />
            <Sudoku />
        </section>
    </div>
</template>
