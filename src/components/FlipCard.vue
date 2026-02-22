<script setup lang="ts">
import PixelArt from "@/components/PixelArt.vue";

export interface CardLink {
  name: string;
  url: string;
}

export interface cardInfo {
  heading: string;
  data?: string;
  links?: CardLink[];
}

defineProps<{
  cardInfo: cardInfo;
}>();
</script>

<template>
  <article class="flip-card">
    <div class="flip-card-inner shadow-lg shadow-dark">
      <div class="flip-card-front">
        <h3 class="text-xl">{{ cardInfo.heading }}</h3>
        <p class="pt-2">{{ cardInfo.data }}</p>
        <PixelArt v-if="cardInfo.links && cardInfo.links.length > 1" class="relative mt-6 ml-18" />
      </div>
      <div class="flip-card-back text-center">
        <div v-if="cardInfo.links && cardInfo.links.length > 0">
          <div v-if="cardInfo.links.length === 1" class="pb-2">
            <a :href="cardInfo.links[0].url" class="block text-center" target="_blank"
              :aria-label="`Visit ${cardInfo.links[0].name}`">
              {{ cardInfo.links[0].name }}
              <PixelArt class="relative mt-6 ml-18" />
            </a>
          </div>
          <div v-else class="links-list">
            <a v-for="link in cardInfo.links" :key="link.url" :href="link.url" target="_blank"
              class="block px-4 py-2 hover:bg-green-light rounded-md"
              :aria-label="`Visit ${link.name}`">
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.flip-card {
  background-color: transparent;
  width: 18rem;
  height: 18rem;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-front {
  background-color: #a7c191;
  color: #491212;
  text-align: center;
}

.flip-card-back {
  background-color: #e4cbce;
  color: #491212;
  transform: rotateY(180deg);
  text-align: left;
}
</style>
