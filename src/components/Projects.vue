<script setup lang="ts">
import Project from "@/components/Project.vue";
import projectsBg from "@/assets/projects_bg.webp";
import projectAr from "@/assets/project_ar.webp";
import projectLayout from "@/assets/project_layout.webp";
import projectWardrobe from "@/assets/project_wardrobe.webp";
import projectTgschedule from "@/assets/project_tgschedule.webp";
import projectBothelp from "@/assets/project_bothelp.webp";
import projectCv1 from "@/assets/project_cv1.webp";
import projectPokemon from "@/assets/project_pokemon.webp";
import projectSafe from "@/assets/project_safe.webp";
import projectBanny from "@/assets/project_banny.webp";

const projects = [
  {
    href: "https://pokemon-tcg.pages.dev",
    img: projectPokemon,
    text: "Demo website based on Pokemon TCG API. Made with Vue 3.",
  },
  {
    href: "https://dreamshot-test-task.pages.dev",
    img: projectSafe,
    text: "Pixijs and GSAP sample game. Check your browser console to find a combination to unlock the safe. Tap on left (counterclockwise) or right (clockwise) side of the handle following the combination.",
  },
  {
    href: "https://nekoi275.github.io/aframe-test",
    img: projectAr,
    text: "Web VR website made with Aframe framework.",
  },
  {
    href: "https://nekoi275.github.io/nice-shop-layout/#",
    img: projectLayout,
    text: "E-commerce website layout sample.",
  },
  {
    href: "https://wardrobe.pages.dev/clothes",
    img: projectWardrobe,
    text: "Personal wardrobe manager app with ability to add/edit/delete your clothes and accessories with photos and descriptions. Made with Vue 3. Test user credentials: test / test12345.",
  },
  {
    href: "https://t.me/ai_inspire_test_bot",
    img: projectBothelp,
    text: "Telegram bot help and description mini app. Made with Vue 3.",
  },
    {
    href: "https://t.me/banny_safe_bot",
    img: projectBanny,
    text: "Telegram bot help and description mini app. Made with Vue 3.",
  },
  {
    href: "https://nekoi275.github.io",
    img: projectCv1,
    text: "Previous version of my website. Made with Vue 3.",
  },
  {
    href: "https://telegram-schedule.pages.dev/login",
    img: projectTgschedule,
    text: "Telegram posts scheduler for AI generated images public group. Allows to set / edit / preview posts before posting into Telegram. Made with Vue 3.",
  },
];
</script>

<template>
  <section id="projects" class="bg-purple-100 p-6 relative">
    <div class="masonry sm:masonry-sm md:masonry-md z-20 relative">
      <Project
        class="p-4 break-inside"
        v-for="project in projects"
        :projectInfo="project"
        :key="project.href"
      ></Project>
    </div>
    <div
      :style="{ backgroundImage: `url(${projectsBg})` }"
      class="absolute top-0 left-0 w-full h-full bg-cover opacity-25 z-0"
    ></div>
  </section>
</template>

<style scoped></style>
