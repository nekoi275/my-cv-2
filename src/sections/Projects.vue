<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ReturnButton from "@/components/ReturnButton.vue";
import MouseScroll from "@/components/MouseScroll.vue";
import Project, { type SlideType, type LinkItem } from "@/components/Project.vue";

import dentalVideo from "@/assets/projects/project_dental.mp4";
import glassVideo from "@/assets/projects/project_glass.mp4";

const props = defineProps<{ isOverlay?: boolean }>();
const emit = defineEmits<{ (e: 'back'): void }>();

interface SlideConfig {
  id: string;
  title: string;
  description: string;
  type: SlideType;
  reversed?: boolean;
  videoUrl?: string;
  links?: LinkItem[];
  canvasComponent?: any;
}

const slides: SlideConfig[] = [
  {
    id: "dental",
    title: "Dental Care Platform",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    type: "video",
    videoUrl: dentalVideo,
    reversed: false,
  },
  {
    id: "glass",
    title: "Glassmorphic 3D Interface",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "video",
    videoUrl: glassVideo,
    reversed: true,
  }
];

const currentSlideIndex = ref(0);
const slidesTrackRef = ref<HTMLElement | null>(null);
let isAnimating = false;

const bgColors = ["#cde2bd", "#eadbdc"];

const getBgColor = (index: number) => {
  return bgColors[index % bgColors.length];
};

const goToSlide = (index: number) => {
  if (index < 0 || index >= slides.length || isAnimating) return;
  isAnimating = true;
  currentSlideIndex.value = index;

  if (slidesTrackRef.value) {
    gsap.to(slidesTrackRef.value, {
      xPercent: -100 * index,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating = false;
      }
    });
  } else {
    isAnimating = false;
  }
};

const onWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaY) < 10 || isAnimating) return;
  if (e.deltaY > 0) {
    if (currentSlideIndex.value < slides.length - 1) {
      goToSlide(currentSlideIndex.value + 1);
    }
  } else {
    if (currentSlideIndex.value > 0) {
      goToSlide(currentSlideIndex.value - 1);
    }
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
      if (delta > 0 && currentSlideIndex.value < slides.length - 1) {
        goToSlide(currentSlideIndex.value + 1);
      } else if (delta < 0 && currentSlideIndex.value > 0) {
        goToSlide(currentSlideIndex.value - 1);
      }
    }
  }
};

onMounted(() => {
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
        v-for="(slide, index) in slides" 
        :key="slide.id"
        class="w-screen h-full flex-shrink-0 flex items-center justify-center relative"
        :style="{ backgroundColor: getBgColor(index) }"
      >
        <Project
          :title="slide.title"
          :description="slide.description"
          :type="slide.type"
          :reversed="slide.reversed"
          :videoUrl="slide.videoUrl"
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
