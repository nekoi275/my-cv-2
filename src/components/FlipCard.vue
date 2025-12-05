<script setup lang="ts">
import { onMounted, ref } from "vue";

export interface CardLink {
  name: string;
  url: string;
}

export interface cardInfo {
  heading: string;
  data?: string;
  links?: CardLink[];
  img?: any;
  altText?: string;
}

const props = defineProps<{
  cardInfo: cardInfo;
}>();

const selectedLink = ref<CardLink | null>(null);
const showDropdown = ref(false);

const selectLink = (link: CardLink) => {
  selectedLink.value = link;
  showDropdown.value = false;
};

onMounted(() => {
  if (props.cardInfo.links && props.cardInfo.links.length > 0) {
    selectedLink.value = props.cardInfo.links[0];
  }
});
</script>

<template>
  <div class="flip-card">
    <div class="flip-card-inner shadow-lg shadow-dark">
      <div class="flip-card-front">
        <h3 class="text-xl">{{ cardInfo.heading }}</h3>
        <p class="pt-2">{{ cardInfo.data }}</p>
      </div>
      <div class="flip-card-back text-center">
        <div v-if="cardInfo.links && cardInfo.links.length > 0">
          <div v-if="cardInfo.links.length === 1" class="pb-2">
            <a :href="cardInfo.links[0].url" class="block text-center" target="_blank">
              {{ cardInfo.links[0].name }}
              <img v-if="cardInfo.img" :src="cardInfo.img" :alt="cardInfo.altText" class="max-w-48 max-h-48 m-auto pt-2"
                width="200" height="200" />
            </a>
          </div>
          <div v-else class="relative">
            <button @click="showDropdown = !showDropdown"
              class="bg-pink-dark hover:bg-green-light px-4 py-2 rounded-md mb-2">
              {{ selectedLink?.name || "Select link" }}
              <span class="ml-1">▼</span>
            </button>
            <div v-if="showDropdown" class="absolute z-10 bg-pink-light shadow-md rounded-md w-full">
              <a v-for="link in cardInfo.links" :key="link.url" :href="link.url" target="_blank"
                @click="selectLink(link)" class="block px-4 py-2 hover:bg-green-light cursor-pointer">
                {{ link.name }}
              </a>
            </div>
            <a v-if="selectedLink" :href="selectedLink.url" class="block text-center" target="_blank">
              <img v-if="cardInfo.img" :src="cardInfo.img" alt="fact image" class="max-w-48 max-h-48 m-auto pt-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
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
