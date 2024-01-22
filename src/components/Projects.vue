<script setup lang="ts">
import Project from "@/components/Project.vue";
import Sudoku from "@/components/Sudoku.vue";
/* eslint-disable */
//@ts-ignore
import SpaceInvaders from "@/components/SpaceInvaders.vue";
/* eslint-enable */

const projects = [
  {
    href: "https://nekoi275.github.io/aframe-test/",
    img: "../assets/project_1.webp",
    text: "Web VR website based on Aframe framework.",
  },
  {
    href: "https://nekoi275.github.io/nice-shop-layout/#",
    img: "../assets/project_2.webp",
    text: "E-commerce website layout sample.",
  },
  {
    href: "https://wardrobe.pages.dev/clothes",
    img: "../assets/project_3.webp",
    text: "Personal wardrobe manager app with ability to add/edit/delete your clothes and accessories with photos and descriptions. Made with Vite - Vue (Composition API) - TS. Test user credentials: test / test12345.",
  },
  {
    href: "https://telegram-schedule.pages.dev/login",
    img: "../assets/project_4.webp",
    text: "Telegram posts scheduler for AI generated images public group. Allows to set / edit / preview posts before posting into Telegram. Made with Vite - Vue (Composition API) - TS.",
  },
];
</script>

<template>
  <section id="projects" class="bg-purple-100 pb-14 pt-32">
    <div class="flex flex-wrap items-center justify-around pl-24 pr-24">
      <SpaceInvaders></SpaceInvaders>
      <Sudoku></Sudoku>
    </div>
    <div class="masonry sm:masonry-sm md:masonry-md pl-24 pr-24">
      <Project
        class="p-4 break-inside"
        v-for="project in projects"
        :projectInfo="project"
        :key="project"
      ></Project>
    </div>
  </section>
</template>

<style scoped></style>
