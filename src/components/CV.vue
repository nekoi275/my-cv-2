<script setup lang="ts">
import Flipcard from '@/components/FlipCard.vue';

const cards = [
  {
    heading: 'Technologies',
    data: ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'Node.js', 'Express.js'],
  },
  {
    heading: 'Education',
    data: [
      '2020 - OSF Academy JavaScript course',
      '2019 - Odessa National Polytechnic University, training course “Front-end development. JavaScript”',
      '2010-2015 - Odessa law academy',
    ],
  },
  {
    heading: 'Experience',
    data: [
      '04.2020 - 12.2022 Front-end / JavaScript developer at Peoly',
      '07.2019 - 09.2019 Part-time front-end developer at AVE Startups',
    ],
  },
]
</script>

<template>
  <section
    id="cv"
    class="bg-white-50 text-white-50 min-[846px]:h-screen flex flex-wrap items-center justify-around min-[846px]:pt-24 max-[845px]:h-full max-[845px]:pt-32 max-[845px]:pb-12 min-[846px]:pb-0"
  >
    <Flipcard v-for="card in cards" :cardInfo="card" :key="card.heading" class="min-[846px]:m-0 max-[845px]:m-5"></Flipcard>
    <a
      href="https://docs.google.com/document/d/1j-dj_t1xP2WtxRUuSa1_PIdmVqCPjOpgnDapOhp-24I/edit?usp=sharing"
      target="_blank"
      class="w-72 h-72 block bg-purple-50 text-white-50 text-center p-2 box-content min-[846px]:m-0 max-[845px]:m-5"
      ><span class="pt-32 block text-2xl">Google doc CV</span></a
    >
  </section>
</template>

<style scoped></style>
