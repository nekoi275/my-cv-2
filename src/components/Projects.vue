<script setup lang="ts">
import Project from "@/components/Project.vue";
import projectsBg from '@/assets/projects_bg.webp';
import project1 from '@/assets/project_1.webp';
import project2 from '@/assets/project_2.webp';
import project3 from '@/assets/project_3.webp';
import project4 from '@/assets/project_4.webp';
import project5 from '@/assets/project_5.webp';
import project6 from '@/assets/project_6.webp';

const projects = [
  {
    href: "https://nekoi275.github.io/aframe-test/",
    img: project1,
    text: "Web VR website made with Aframe framework.",
  },
  {
    href: "https://nekoi275.github.io/nice-shop-layout/#",
    img: project2,
    text: "E-commerce website layout sample.",
  },
  {
    href: "https://wardrobe.pages.dev/clothes",
    img: project3,
    text: "Personal wardrobe manager app with ability to add/edit/delete your clothes and accessories with photos and descriptions. Made with Vue 3. Test user credentials: test / test12345.",
  },
  {
    href: "https://telegram-schedule.pages.dev/login",
    img: project4,
    text: "Telegram posts scheduler for AI generated images public group. Allows to set / edit / preview posts before posting into Telegram. Made with Vue 3.",
  },
  {
    href: "https://t.me/ai_inspire_test_bot",
    img: project5,
    text: "Telegram bot help and description webapp. Made with Vue 3.",
  },
  {
    href: "https://nekoi275.github.io/",
    img: project6,
    text: "Previous version of my website. Made with Vue 3.",
  },
];
</script>

<template>
  <section id="projects" class="bg-purple-100 p-6 relative">
    <div
      class="masonry sm:masonry-sm md:masonry-md z-20 relative"
    >
      <Project
        class="p-4 break-inside"
        v-for="project in projects"
        :projectInfo="project"
        :key="project.href"
      ></Project>
    </div>
    <div :style="{ backgroundImage: `url(${projectsBg})` }" class="absolute top-0 left-0 w-full h-full bg-cover opacity-25 z-0"></div>
  </section>
</template>

<style scoped></style>
