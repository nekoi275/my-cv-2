<script setup lang="ts">
import About from '@/components/About.vue'
import Projects from '@/components/Projects.vue'
import Games from '@/components/Games.vue'
import Footer from '@/components/Footer.vue'
import Facts from '@/components/Facts.vue'
import Teapot from '@/components/Teapot.vue'
</script>

<template>
  <About></About>
  <Facts></Facts>
  <Games></Games>
  <Projects></Projects>
  <Footer></Footer>
  <section class="h-screen pt-36">
    <Teapot class="m-auto"></Teapot>
  </section>
</template>

<style scoped>
</style>
