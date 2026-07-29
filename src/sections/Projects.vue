<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ReturnButton from "@/components/ReturnButton.vue";
import MouseScroll from "@/components/MouseScroll.vue";
import Project, { type SlideType, type LinkItem } from "@/components/Project.vue";

import dentalVideo from "@/assets/projects/project_dental.mp4";
import glassVideo from "@/assets/projects/project_glass.mp4";
import memeImage from "@/assets/projects/project_meme.webp";
import jewelryImage from "@/assets/projects/project_jewelry.webp";
import skiiVideo from "@/assets/projects/project_skii.mp4";
import weddingImage from "@/assets/projects/project_wedding.webp";
import motionImage from "@/assets/projects/project_motion.webp";

const props = defineProps<{ isOverlay?: boolean }>();
const emit = defineEmits<{ (e: 'back'): void }>();

interface SlideConfig {
  id: string;
  title: string;
  description: string;
  type: SlideType;
  videoUrl?: string;
  linkUrl?: string;
  imageUrl?: string;
  links?: LinkItem[];
  canvasComponent?: any;
}

const slides: SlideConfig[] = [
  {
    id: "dental",
    title: "Dental scans viewer",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    type: "video",
    videoUrl: dentalVideo,
  },
  {
    id: "glass",
    title: "Glass constructions configurator",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "video",
    videoUrl: glassVideo,
  },
  {
    id: "memesearch",
    title: "AI-powered meme search engine",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Fast and intelligent search engine for discovering memes and visual content across the web.",
    type: "links",
    linkUrl: "https://memesearch.org/",
    imageUrl: memeImage,
  },
  {
    id: "jewelry",
    title: "Jewelry configurator",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    type: "links",
    linkUrl: "https://memesearch.org/",
    imageUrl: jewelryImage,
  },
  {
    id: "skii",
    title: "Skii training simulator",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    type: "video",
    videoUrl: skiiVideo,
  },
  {
    id: "wedding",
    title: "Video recording app for wedding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    type: "links",
    linkUrl: "https://memesearch.org/",
    imageUrl: weddingImage,
  },
  {
    id: "motion",
    title: "Motion detection game",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    type: "links",
    linkUrl: "https://memesearch.org/",
    imageUrl: motionImage,
  }
];

const displaySlides = computed(() => {
  if (slides.length === 0) return [];
  const last = slides[slides.length - 1];
  const first = slides[0];
  return [
    { ...last, virtualKey: `clone-prev-${last.id}`, realIndex: slides.length - 1 },
    ...slides.map((s, idx) => ({ ...s, virtualKey: `real-${s.id}`, realIndex: idx })),
    { ...first, virtualKey: `clone-next-${first.id}`, realIndex: 0 }
  ];
});

let activeVirtualIndex = 1;
const slidesTrackRef = ref<HTMLElement | null>(null);
let isAnimating = false;

const bgColors = ["#cde2bd", "#eadbdc"];

const getBgColor = (realIndex: number) => {
  return bgColors[realIndex % bgColors.length];
};

const goToNext = () => {
  if (isAnimating || !slidesTrackRef.value) return;
  isAnimating = true;
  activeVirtualIndex++;

  gsap.to(slidesTrackRef.value, {
    xPercent: -100 * activeVirtualIndex,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      if (activeVirtualIndex === displaySlides.value.length - 1) {
        activeVirtualIndex = 1;
        gsap.set(slidesTrackRef.value, { xPercent: -100 * activeVirtualIndex });
      }
      isAnimating = false;
    }
  });
};

const goToPrev = () => {
  if (isAnimating || !slidesTrackRef.value) return;
  isAnimating = true;
  activeVirtualIndex--;

  gsap.to(slidesTrackRef.value, {
    xPercent: -100 * activeVirtualIndex,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      if (activeVirtualIndex === 0) {
        activeVirtualIndex = displaySlides.value.length - 2;
        gsap.set(slidesTrackRef.value, { xPercent: -100 * activeVirtualIndex });
      }
      isAnimating = false;
    }
  });
};

const onWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaY) < 10 || isAnimating) return;
  if (e.deltaY > 0) {
    goToNext();
  } else {
    goToPrev();
  }
};

let touchStartY = 0;
let touchStartX = 0;

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }
};

const onTouchEnd = (e: TouchEvent) => {
  if (e.changedTouches.length > 0) {
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const deltaX = touchStartX - e.changedTouches[0].clientX;
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    if (Math.abs(delta) > 30) {
      if (delta > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }
};

onMounted(() => {
  if (slidesTrackRef.value) {
    gsap.set(slidesTrackRef.value, { xPercent: -100 * activeVirtualIndex });
  }
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchend", onTouchEnd);
});
</script>

<template>
  <section 
    id="projects-section"
    class="fixed inset-0 w-screen h-screen overflow-hidden z-[999999]"
  >
    <Teleport to="body" v-if="props.isOverlay">
      <ReturnButton @back="emit('back')" />
    </Teleport>
    <ReturnButton v-else @back="emit('back')" />

    <div 
      ref="slidesTrackRef" 
      class="h-full flex flex-nowrap w-full"
    >
      <div 
        v-for="slide in displaySlides" 
        :key="slide.virtualKey"
        class="w-screen h-full flex-shrink-0 flex items-center justify-center relative"
        :style="{ backgroundColor: getBgColor(slide.realIndex) }"
      >
        <Project
          :title="slide.title"
          :description="slide.description"
          :type="slide.type"
          :reversed="slide.realIndex % 2 !== 0"
          :videoUrl="slide.videoUrl"
          :linkUrl="slide.linkUrl"
          :imageUrl="slide.imageUrl"
          :links="slide.links"
          :canvasComponent="slide.canvasComponent"
        />
      </div>
    </div>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <MouseScroll />
    </div>
  </section>
</template>
