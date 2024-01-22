<script setup lang="ts">
import Project from '@/components/Project.vue';
import Sudoku from '@/components/Sudoku.vue';
import SpaceInvaders from '@/components/SpaceInvaders.vue';

const projects = [
  {
    href: 'https://nekoi275.github.io/aframe-test/',
    img: '../assets/project_1.webp',
    text: 'Web VR website based on Aframe framework.'
  },
  {
    href: 'https://nekoi275.github.io/nice-shop-layout/#',
    img: '../assets/project_2.webp',
    text: 'E-commerce website layout sample.'
  },
  {
    href: 'https://wardrobe.pages.dev/clothes',
    img: '../assets/project_3.webp',
    text: 'Personal wardrobe manager app with ability to add/edit/delete your clothes and accessories with photos and descriptions. Made with Vite - Vue (Composition API) - TS. Test user credentials: test / test12345.'
  },
  {
    href: 'https://telegram-schedule.pages.dev/login',
    img: '../assets/project_4.webp',
    text: 'Telegram posts scheduler for AI generated images public group. Allows to set / edit / preview posts before posting into Telegram. Made with Vite - Vue (Composition API) - TS.'
  }
];
</script>

<template>
  <section id="projects" class="bg-purple-100 pb-14 pt-24">
    <SpaceInvaders></SpaceInvaders>
    <Project v-for="project in projects" :projectInfo="project" :key="project"></Project>
    <Sudoku></Sudoku>
  </section>
</template>

<style scoped></style>
