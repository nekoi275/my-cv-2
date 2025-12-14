<script setup lang="ts">
import Projects from '@/sections/Projects.vue'
import Footer from '@/sections/Footer.vue'
import Facts from '@/sections/Facts.vue'
import TeapotSection from '@/sections/TeapotSection.vue'
import Games from '@/sections/Games.vue'
import { ref } from 'vue'

const showGames = ref(false)
</script>

<template>
  <div v-if="!showGames">
    <div class="h-screen overflow-hidden">
      <TeapotSection></TeapotSection>
    </div>
    <Facts></Facts>
    <Projects></Projects>
  </div>
  <Games v-else @back="showGames = false"></Games>
  <Footer @show-easter-egg="showGames = true"></Footer>
</template>

<style scoped></style>