<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import MouseScroll from "@/components/MouseScroll.vue";
import Garden3D from "@/components/3DGarden.vue";

const isSceneActive = ref(false);
const isModelLoaded = ref(false);
const isContactVisible = ref(false);
const isUnloading = ref(false);
const scenePlaceholder = ref<string>("");
const sectionRef = ref<HTMLElement | null>(null);

const isCopied = ref(false);

const CONTACT_EMAIL = "valeriiadrozdova90@gmail.com";

const initScene = () => {
  isContactVisible.value = false;
  isSceneActive.value = true;
  isModelLoaded.value = false;
  isUnloading.value = false;
};

const handleSceneUnload = () => {
  if (isUnloading.value) return;
  isUnloading.value = true;
  setTimeout(() => {
    isSceneActive.value = false;
    isContactVisible.value = true;
    isUnloading.value = false;
  }, 1000);
};

const copyEmail = () => {
  navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  });
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !scenePlaceholder.value) {
          import("@/assets/scene_placeholder.webp").then((module) => {
            scenePlaceholder.value = module.default;
          });
          if (observer) {
            observer.disconnect();
          }
        }
      });
    },
    {
      rootMargin: "200px",
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <section 
    ref="sectionRef" 
    id="projects" 
    class="bg-pink-dark relative"
    :class="{ 'h-screen overflow-hidden': !isSceneActive, 'min-h-screen': isSceneActive }"
  >
    
    <div v-if="!isSceneActive && !isContactVisible" class="absolute inset-0 z-10 flex items-center justify-center">
      <img v-if="scenePlaceholder" :src="scenePlaceholder" alt="Scene Placeholder" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/20"></div>
      
      <div 
        @click="initScene" 
        class="start-card relative z-20 cursor-pointer p-8 md:p-10 bg-white border-2 border-[var(--color-dark)]"
      >
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-dark)] mb-4">
          Enter the Garden
        </h2>
        
        <div class="space-y-2 mb-8 text-[var(--color-dark)] font-medium">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-[var(--color-dark)]"></span>
            <span>Click here to start</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-[var(--color-dark)]"></span>
            <span>Scroll to move forward</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-[var(--color-dark)]"></span>
            <span>Drag mouse to look around</span>
          </div>
        </div>

        <div class="flex justify-center text-[var(--color-dark)]">
          <MouseScroll />
        </div>
      </div>
    </div>

    <div v-if="isSceneActive && !isModelLoaded" class="absolute inset-0 z-20 flex items-center justify-center bg-pink-dark">
      <div class="text-[var(--color-dark)] text-2xl font-bold tracking-wider flex items-center">
        Loading
        <span class="dot-1">.</span>
        <span class="dot-2">.</span>
        <span class="dot-3">.</span>
      </div>
    </div>

    <Garden3D 
      v-if="isSceneActive" 
      @modelLoaded="isModelLoaded = true" 
      @sceneUnload="handleSceneUnload"
      :class="{ 'opacity-0': !isModelLoaded, 'transition-opacity duration-1000': true, 'opacity-100': isModelLoaded }" 
    />

    <Transition name="fade">
      <div v-if="isUnloading" class="absolute inset-0 z-40 bg-white"></div>
    </Transition>

    <div v-if="isContactVisible" class="absolute inset-0 z-30 flex items-center justify-center bg-pink-dark p-4">
      <div class="contact-wrapper relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        
        <div class="md:col-span-7 relative z-10">
          <h2 class="contact-title text-[var(--color-dark)]">
            Have an<br>
            <span class="italic font-light">idea?</span>
          </h2>
          
          <div class="mt-6 max-w-md text-[var(--color-dark)] text-lg font-medium leading-relaxed">
            <p>
              The garden is explored, but the journey of creation is just beginning. 
            </p>
            <p class="mt-3 opacity-80">
              If you have a vision for a web experience, a game, or an app, let's bring it to life. Drop a line about your project, and let's create something beautiful together.
            </p>
          </div>
        </div>

        <!-- "Открытка" с имейлом -->
        <div class="md:col-span-5 relative">
          <div class="email-card relative bg-white p-8 md:p-10 border-2 border-[var(--color-dark)] shadow-[12px_12px_0px_var(--color-dark)]">
            <div class="tape"></div>
            
            <span class="block text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">
              Reach out via email
            </span>
            
            <a 
              :href="`mailto:${CONTACT_EMAIL}`" 
              class="block text-xl md:text-2xl font-bold text-[var(--color-dark)] hover:underline break-all mb-8"
            >
              {{ CONTACT_EMAIL }}
            </a>

            <button 
              @click="copyEmail" 
              class="copy-btn w-full py-3 border-2 border-[var(--color-dark)] bg-[var(--color-green-light)] text-[var(--color-dark)] font-bold uppercase tracking-wider transition-all hover:bg-[var(--color-dark)] hover:text-[var(--color-green-light)]"
            >
              {{ isCopied ? 'Copied to clipboard!' : 'Copy email address' }}
            </button>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
@keyframes dot-animation {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.dot-1 { animation: dot-animation 1.5s infinite 0s; }
.dot-2 { animation: dot-animation 1.5s infinite 0.3s; }
.dot-3 { animation: dot-animation 1.5s infinite 0.6s; }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.start-card {
  box-shadow: 10px 10px 0px var(--color-dark);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 14px 14px 0px var(--color-dark);
}

.contact-title {
  font-size: clamp(3.5rem, 8vw, 7rem); /* Огромный текст */
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.email-card {
  transform: rotate(-2deg);
  transition: transform 0.4s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.email-card:hover {
  transform: rotate(0deg);
}

.tape {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  width: 120px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.6);
  border-left: 2px dashed rgba(0, 0, 0, 0.1);
  border-right: 2px dashed rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  backdrop-filter: blur(2px);
}
</style>