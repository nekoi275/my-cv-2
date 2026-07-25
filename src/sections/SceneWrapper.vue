<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import Garden3D from "@/components/3DGarden.vue";
import { gsap } from "gsap";

const isSceneActive = ref(false);
const isModelLoaded = ref(false);
const isContactVisible = ref(false);
const isUnloading = ref(false);
const scenePlaceholder = ref<string>("");
const sectionRef = ref<HTMLElement | null>(null);
const instructionRows = ref<HTMLElement[]>([]);

const isCopied = ref(false);

const CONTACT_EMAIL = "valeriiadrozdova90@gmail.com";

const turbulenceState = { scale: 0 };

let rippleAnimTl: gsap.core.Timeline | null = null;
let feTurbulenceEl: SVGFETurbulenceElement | null = null;
let feDisplacementEl: SVGFEDisplacementMapElement | null = null;

const playEmergeAnimation = () => {
  if (!instructionRows.value.length) return;

  feTurbulenceEl = document.querySelector('#water-turbulence') as SVGFETurbulenceElement;
  feDisplacementEl = document.querySelector('#water-displacement') as SVGFEDisplacementMapElement;

  if (rippleAnimTl) {
    rippleAnimTl.kill();
  }

  turbulenceState.scale = 80;

  gsap.set(instructionRows.value, {
    y: 40,
    opacity: 0,
    filter: 'url(#water-filter)',
  });

  rippleAnimTl = gsap.timeline();

  rippleAnimTl.to(turbulenceState, {
    scale: 0,
    duration: 2.2,
    ease: 'power2.out',
    onUpdate: () => {
      if (feDisplacementEl) {
        feDisplacementEl.setAttribute('scale', String(turbulenceState.scale));
      }
    }
  }, 0);

  rippleAnimTl.to({}, {
    duration: 2.2,
    ease: 'power2.out',
    onUpdate: function() {
      if (feTurbulenceEl) {
        const p = this.progress();
        const freq = 0.08 - p * 0.07;
        feTurbulenceEl.setAttribute('baseFrequency', `${freq} ${freq * 1.4}`);
      }
    }
  }, 0);

  rippleAnimTl.to(instructionRows.value, {
    y: 0,
    opacity: 1,
    duration: 1.1,
    ease: 'back.out(1.4)',
    stagger: 0.18,
  }, 0.1);

  rippleAnimTl.to(instructionRows.value, {
    filter: 'none',
    duration: 0.01,
  }, 2.2);
};

const playSubmergeAnimation = (onComplete: () => void) => {
  if (!instructionRows.value.length) {
    onComplete();
    return;
  }

  feTurbulenceEl = document.querySelector('#water-turbulence') as SVGFETurbulenceElement;
  feDisplacementEl = document.querySelector('#water-displacement') as SVGFEDisplacementMapElement;

  if (rippleAnimTl) {
    rippleAnimTl.kill();
  }

  turbulenceState.scale = 0;

  gsap.set(instructionRows.value, { filter: 'url(#water-filter)' });

  const tl = gsap.timeline({ onComplete });

  tl.to(turbulenceState, {
    scale: 90,
    duration: 0.9,
    ease: 'power2.in',
    onUpdate: () => {
      if (feDisplacementEl) {
        feDisplacementEl.setAttribute('scale', String(turbulenceState.scale));
      }
    }
  }, 0);

  tl.to(instructionRows.value, {
    y: -30,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.in',
    stagger: { each: 0.1, from: 'end' },
  }, 0);
};

const initScene = () => {
  playSubmergeAnimation(() => {
    isContactVisible.value = false;
    isSceneActive.value = true;
    isModelLoaded.value = false;
    isUnloading.value = false;
  });
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

  nextTick(() => {
    setTimeout(() => {
      playEmergeAnimation();
    }, 300);
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (rippleAnimTl) {
    rippleAnimTl.kill();
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
    
    <svg class="water-svg-filter" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="water-filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="linearRGB">
          <feTurbulence
            id="water-turbulence"
            type="turbulence"
            baseFrequency="0.08 0.11"
            numOctaves="3"
            seed="7"
            stitchTiles="stitch"
            result="turbulenceOut"
          />
          <feDisplacementMap
            id="water-displacement"
            in="SourceGraphic"
            in2="turbulenceOut"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <div v-if="!isSceneActive && !isContactVisible" ref="instructionsRef" class="absolute inset-0 z-10 flex items-center justify-center">
      <img v-if="scenePlaceholder" :src="scenePlaceholder" alt="Scene Placeholder" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/20"></div>
      
      <div 
        @click="initScene" 
        class="gate-anchor cursor-pointer"
      >
        <div class="instructions-glow" aria-hidden="true">
          <div class="glow-blob glow-blob--a"></div>
          <div class="glow-blob glow-blob--b"></div>
        </div>

        <div class="instructions-panel">
          <div class="instructions-box">
            <div
              v-for="(item, i) in [
                'Click here to start',
                'Scroll to move forward',
                'Drag mouse to look around',
              ]"
              :key="i"
              :ref="el => { if (el) instructionRows[i] = el as HTMLElement }"
              class="instruction-row"
            >
              <span class="instruction-dot"></span>
              <span class="instruction-text">{{ item }}</span>
            </div>
          </div>
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

.contact-title {
  font-size: clamp(3.5rem, 8vw, 7rem);
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

.water-svg-filter {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

.gate-anchor {
  position: absolute;
  top: 53%;
  left: 48%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.instructions-panel {
  position: relative;
  width: clamp(340px, 58vh, 620px);
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  mask-image: radial-gradient(
    circle at 50% 50%,
    black 50%,
    rgba(0,0,0,0.5) 68%,
    transparent 82%
  );
  -webkit-mask-image: radial-gradient(
    circle at 50% 50%,
    black 50%,
    rgba(0,0,0,0.5) 68%,
    transparent 82%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.instructions-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow-blob {
  position: absolute;
  border-radius: 60% 40% 55% 45% / 45% 55% 40% 60%;
  filter: blur(32px);
  will-change: border-radius, transform;
}

.glow-blob--a {
  inset: -25% -20%;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(255, 255, 255, 0.55) 0%,
    transparent 68%
  );
  animation: blob-drift 7s ease-in-out infinite;
}

.glow-blob--b {
  inset: -20% -25%;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(230, 230, 230, 0.35) 0%,
    transparent 62%
  );
  filter: blur(42px);
  border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%;
  animation: blob-drift 9s ease-in-out infinite reverse;
  animation-delay: -3.5s;
}

@keyframes blob-drift {
  0%   { border-radius: 60% 40% 55% 45% / 45% 55% 40% 60%; transform: scale(1)    rotate(0deg);  }
  25%  { border-radius: 50% 50% 65% 35% / 55% 45% 65% 35%; transform: scale(1.05) rotate(4deg); }
  50%  { border-radius: 40% 60% 45% 55% / 60% 40% 55% 45%; transform: scale(0.96) rotate(-3deg); }
  75%  { border-radius: 55% 45% 35% 65% / 40% 60% 45% 55%; transform: scale(1.04) rotate(5deg); }
  100% { border-radius: 60% 40% 55% 45% / 45% 55% 40% 60%; transform: scale(1)    rotate(0deg);  }
}

.instructions-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  position: relative;
  z-index: 1;
  text-align: center;
}

.instruction-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: visible;
  opacity: 0;
  transform: translateY(40px);
  will-change: transform, opacity, filter;
}

.instruction-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background-color: var(--color-dark);
}

.instruction-text {
  color: var(--color-dark);
  font-weight: 500;
  font-family: monospace;
}
</style>