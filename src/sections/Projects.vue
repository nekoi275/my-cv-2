<script setup lang="ts">
import { ref } from "vue";
import MouseScroll from "@/components/MouseScroll.vue";
import scenePlaceholder from "@/assets/scene_placeholder.png";
import Garden3D from "@/components/3DGarden.vue";

const isSceneActive = ref(false);
const isModelLoaded = ref(false);
const isProjectsVisible = ref(false);

const projects = [
  { label: "REST API + Vue.js applications", url: "https://pokemon-tcg.pages.dev/" },
  { label: "Pixi.js + GSAP games", url: "https://dreamshot-test-task.pages.dev/" },
  { label: "three.js 3D scenes", url: "https://nekoi275.github.io/aframe-test" },
  { label: "Telegram mini apps", url: "https://t.me/banny_safe_bot" },
]

const initScene = () => {
  isProjectsVisible.value = false;
  isSceneActive.value = true;
  isModelLoaded.value = false;
};

const handleSceneUnload = () => {
  isModelLoaded.value = false;
  isSceneActive.value = false;
  isProjectsVisible.value = true;
};
</script>

<template>
  <section id="projects" class="bg-pink-dark relative h-screen">
    <div v-if="!isSceneActive && !isProjectsVisible" class="absolute inset-0 z-10 flex items-center justify-center">
      <img :src="scenePlaceholder" alt="Scene Placeholder" class="absolute inset-0 w-full h-full object-cover" />
      <div
        class="relative z-20 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-transform hover:scale-105"
        @click="initScene">
        <span class="text-[var(--color-dark)] text-2xl font-bold tracking-wider">Start Experience</span>
        <span class="block text-[var(--color-dark)] text-lg font-semibold tracking-wider">Scroll down to move</span>
        <MouseScroll class="text-[var(--color-dark)]" />
      </div>
    </div>

    <div v-if="isSceneActive && !isModelLoaded"
      class="absolute inset-0 z-20 flex items-center justify-center bg-pink-dark">
      <div class="text-[var(--color-dark)] text-2xl font-bold tracking-wider flex items-center">
        Loading
        <span class="dot-1">.</span>
        <span class="dot-2">.</span>
        <span class="dot-3">.</span>
      </div>
    </div>

    <Garden3D v-if="isSceneActive" @modelLoaded="isModelLoaded = true" @sceneUnload="handleSceneUnload"
      :class="{ 'opacity-0': !isModelLoaded, 'transition-opacity duration-1000': true, 'opacity-100': isModelLoaded }" />

    <div v-if="isProjectsVisible" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-pink-dark">
      <div class="flex flex-col gap-8 mb-12">
        <a v-for="project in projects" :key="project.label" :href="project.url" target="_blank"
          class="text-[var(--color-dark)] text-2xl font-bold tracking-wider border-b-2 border-transparent transition-all hover:border-b-2 hover:border-[var(--color-green-dark)] text-center">
          {{ project.label }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes dot-animation {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.dot-1 {
  animation: dot-animation 1.5s infinite 0s;
}

.dot-2 {
  animation: dot-animation 1.5s infinite 0.3s;
}

.dot-3 {
  animation: dot-animation 1.5s infinite 0.6s;
}
</style>
