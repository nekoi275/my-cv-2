<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, markRaw } from "vue";
import Garden3D, { type InteractiveTarget } from "@/components/3DGarden.vue";
import TeapotSection from "@/sections/TeapotSection.vue";
import Projects from "@/sections/Projects.vue";
import * as THREE from "three";
import { gsap } from "gsap";
import scenePlaceholder from "@/assets/scene_placeholder.webp";

const isSceneActive = ref(false);
const isModelLoaded = ref(false);
const isUnloading = ref(false);
const isFinished = ref(false);
const activeTarget = ref<InteractiveTarget | null>(null);
const instructionRows = ref<HTMLElement[]>([]);
let savedScrollY = 0;

const interactiveTargets: InteractiveTarget[] = [
  {
    id: "teapot",
    position: new THREE.Vector3(7.2, 0.1, -4.5),
    component: markRaw(TeapotSection),
    title: "About Me"
  },
  {
    id: "projects",
    position: new THREE.Vector3(5.0, 0.1, -11.0),
    component: markRaw(Projects),
    title: "Projects"
  }
];

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
    isFinished.value = false;
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
    isFinished.value = true;
    isUnloading.value = false;
  }, 1000);
};

const handleIndicatorClicked = (target: InteractiveTarget) => {
  savedScrollY = window.scrollY;
  document.body.style.overflow = 'hidden';
  activeTarget.value = target;
};

const closeOverlay = () => {
  activeTarget.value = null;
  document.body.style.overflow = '';
  nextTick(() => {
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  });
};

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      playEmergeAnimation();
    }, 300);
  });
});

onUnmounted(() => {
  if (rippleAnimTl) {
    rippleAnimTl.kill();
  }
});
</script>

<template>
  <section 
    ref="sectionRef" 
    id="projects" 
    class="bg-pink-dark relative min-h-screen"
    :class="{ 'h-screen overflow-hidden': !isModelLoaded && !isFinished, 'min-h-screen': isModelLoaded || isFinished }"
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

    <Transition name="fade">
      <div 
        v-if="(!isSceneActive || !isModelLoaded) && !isFinished" 
        class="absolute top-0 left-0 w-full h-screen z-10 flex items-center justify-center overflow-hidden"
      >
        <img :src="scenePlaceholder" alt="Scene Placeholder" class="absolute top-0 left-0 w-full h-screen object-cover" />
        <div class="absolute top-0 left-0 w-full h-screen bg-black/20"></div>
        
        <div 
          v-if="!isSceneActive"
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
                  'Scroll to move',
                  'Drag mouse to look around',
                  'Click on the interactive signs',
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

        <div v-else-if="!isModelLoaded" class="gate-anchor">
          <div class="instructions-glow" aria-hidden="true">
            <div class="glow-blob glow-blob--a"></div>
            <div class="glow-blob glow-blob--b"></div>
          </div>
          <div class="instructions-panel">
            <div class="text-[var(--color-dark)] text-xl font-bold tracking-wider flex items-center font-mono">
              Loading
              <span class="dot-1">.</span>
              <span class="dot-2">.</span>
              <span class="dot-3">.</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Garden3D 
      v-if="isSceneActive" 
      :targets="interactiveTargets"
      @modelLoaded="isModelLoaded = true" 
      @sceneUnload="handleSceneUnload"
      @indicatorClicked="handleIndicatorClicked"
      :class="{ 'opacity-0': !isModelLoaded, 'transition-opacity duration-1000': true, 'opacity-100': isModelLoaded }" 
    />

    <Teleport to="body">
      <Transition name="teapot-overlay">
        <div 
          v-if="activeTarget && activeTarget.component" 
          class="fixed inset-0 z-[999999] overflow-hidden bg-[#e4cbce]"
        >
          <component
            :is="activeTarget.component"
            :isOverlay="true"
            @back="closeOverlay"
          />
        </div>
      </Transition>
    </Teleport>

    <Transition name="fade">
      <div v-if="isUnloading" class="absolute inset-0 z-40 bg-white"></div>
    </Transition>

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

.teapot-overlay-enter-active {
  transition: opacity 0.45s ease;
}
.teapot-overlay-leave-active {
  transition: opacity 0.35s ease;
}
.teapot-overlay-enter-from,
.teapot-overlay-leave-to {
  opacity: 0;
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