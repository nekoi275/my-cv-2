<script setup lang="ts">
import Projects from '@/components/Projects.vue'
import Games from '@/components/Games.vue'
import Footer from '@/components/Footer.vue'
import Facts from '@/components/Facts.vue'
import TeapotSection from '@/components/TeapotSection.vue'
</script>

<template>
  <div class="h-screen overflow-hidden">
    <TeapotSection></TeapotSection>
  </div>
    <Facts></Facts>
  <Games></Games>
  <Projects></Projects>
  <Footer></Footer>
</template>

<style scoped>
</style>
