<script setup lang="ts">
import Flipcard from "@/components/FlipCard.vue";

const cards = [
  {
    heading: "Technologies",
    data: ["HTML", "CSS", "JavaScript", "Vue.js", "Node.js", "Express.js"],
  },
  {
    heading: "Education",
    data: [
      "2020 - OSF Academy JavaScript course",
      "2019 - Odessa National Polytechnic University, training course “Front-end development. JavaScript”",
      "2010-2015 - National University “Odessa law academy”",
    ],
  },
  {
    heading: "Experience",
    data: [
      "04.2020 - 12.2022 Front-end / JavaScript developer at Peoly",
      "07.2019 - 09.2019 Part-time front-end developer at AVE Startups",
    ],
  },
];
</script>

<template>
  <section
    id="cv"
    class="bg-white-50 text-white-50 h-screen flex flex-wrap items-center justify-around pt-24"
  >
    <Flipcard v-for="card in cards" :cardInfo="card" :key="card"></Flipcard>
    <a
      href="https://docs.google.com/document/d/1j-dj_t1xP2WtxRUuSa1_PIdmVqCPjOpgnDapOhp-24I/edit?usp=sharing"
      target="_blank"
      class="w-72 h-72 block bg-purple-50 text-white-50 text-center p-2 box-content"
      ><span class="pt-32 block text-2xl">Google doc CV</span></a
    >
  </section>
</template>

<style scoped></style>
