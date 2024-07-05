<script setup lang="ts">
import Project from "@/components/Project.vue";

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
  {
    href: "https://t.me/ai_inspire_test_bot",
    img: "../assets/project_5.webp",
    text: "Telegram bot help and description webapp. Made with Vite - Vue (Composition API) - TS.",
  },
];
</script>

<template>
  <section id="projects" class="bg-purple-100 pb-14 pt-32">
    <div class="masonry sm:masonry-sm md:masonry-md min-[846px]:pl-24 min-[846px]:pr-24 max-[845px]:pl-5 max-[845px]:pr-5">
      <Project
        class="p-4 break-inside"
        v-for="project in projects"
        :projectInfo="project"
        :key="project.href"
      ></Project>
    </div>
  </section>
</template>

<style scoped></style>
