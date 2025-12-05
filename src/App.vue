<script setup lang="ts">
import Projects from '@/sections/Projects.vue'
import Footer from '@/sections/Footer.vue'
import Facts from '@/sections/Facts.vue'
import TeapotSection from '@/sections/TeapotSection.vue'
</script>

<template>
  <div class="h-screen overflow-hidden">
    <TeapotSection></TeapotSection>
  </div>
  <Facts></Facts>
  <Projects></Projects>
  <Footer></Footer>
</template>

<style scoped></style>