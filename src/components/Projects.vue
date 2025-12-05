<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Project from "@/components/Project.vue";
import projectAr from "@/assets/project_ar.webp";
import projectLayout from "@/assets/project_layout.webp";
import projectCv1 from "@/assets/project_cv1.webp";
import projectPokemon from "@/assets/project_pokemon.webp";
import projectSafe from "@/assets/project_safe.webp";
import projectBanny from "@/assets/project_banny.webp";
import garden from "@/assets/3d/garden.glb";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    href: "https://pokemon-tcg.pages.dev",
    img: projectPokemon,
    text: "Vue 3 + Tailwind CSS + Pokemon TCG API",
  },
  {
    href: "https://dreamshot-test-task.pages.dev",
    img: projectSafe,
    text: "Pixijs + GSAP",
  },
  {
    href: "https://nekoi275.github.io/aframe-test",
    img: projectAr,
    text: "Aframe",
  },
  {
    href: "https://nekoi275.github.io/nice-shop-layout/#",
    img: projectLayout,
    text: "HTML + CSS + JS",
  },
  {
    href: "https://t.me/banny_safe_bot",
    img: projectBanny,
    text: "Vue 3 + Telegram bot",
  },
  {
    href: "https://nekoi275.github.io",
    img: projectCv1,
    text: "Vue 3 + Tailwind CSS",
  },
];

const container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number;
let ctx: gsap.Context;

onMounted(() => {
  if (!container.value) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#e4cbce");

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load(
    garden,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.05, 0.05, 0.05);
      model.updateMatrixWorld(true);

      model.position.set(-17, -2, -33);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("An error happened loading the model:", error);
    }
  );

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", onWindowResize);

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.value,
        start: "top top",
        end: "+=7000",
        scrub: 1,
        pin: true,
      },
    });

    // 1.
    tl.to(camera.position, { z: -1, duration: 1 });

    // 2.
    tl.to(camera.rotation, { y: -1, duration: 1 });

    // 3.
    tl.to(camera.position, { x: 5, z: -10, duration: 1 });

    // 4.
    tl.to(camera.position, { x: 9, z: -17, duration: 1 })
      .to(camera.rotation, { y: 1, duration: 1 }, "<");

    // 5.
    tl.to(camera.position, { x: 4, z: -20, duration: 1 });

    // 6.
    tl.to(camera.position, { x: -1, z: -28, duration: 1 })
      .to(camera.rotation, { y: 0.5, duration: 1 }, "<");

    // 7.
    tl.to(camera.position, { x: -3, y: 1.2, z: -32, duration: 1 })
      .to(camera.rotation, { y: 1.2, duration: 1 }, "<");

    // 8.
    tl.to(camera.position, { x: -6, y: 2, z: -32, duration: 1 })
      .to(camera.rotation, { y: 1.4, duration: 1 }, "<");

    // 9.
    tl.to(camera.position, { x: -11, y: 2, z: -32, duration: 1 });

    // 10.
    tl.to(camera.position, { x: -14, y: 2, z: -30, duration: 1 })
      .to(camera.rotation, { y: 1.4, duration: 1 }, "<");

    // 11.
    tl.to(camera.position, { x: -17, y: 2, z: -32, duration: 1 })
      .to(camera.rotation, { y: 1, duration: 1 }, "<");

    // 12.
    tl.to(camera.position, { x: -17, y: 2, z: -32, duration: 1 })
      .to(camera.rotation, { y: 2, duration: 1 }, "<");

    // 13.
    tl.to(camera.position, { x: -19, y: 2, z: -32, duration: 1 })
      .to(camera.rotation, { y: 3, duration: 1 }, "<");

    // 14.
    tl.to(camera.position, { x: -19, y: 2, z: -30, duration: 1 })
      .to(camera.rotation, { y: 4, duration: 1 }, "<");

    // 15.
    tl.to(camera.position, { x: -17, y: 2, z: -28, duration: 1 })
      .to(camera.rotation, { y: 3, duration: 1 }, "<");
  }, container.value);
});

const onWindowResize = () => {
  if (!container.value || !camera || !renderer) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
  }
  if (ctx) ctx.revert();
});
</script>

<template>
  <section id="projects" class="bg-pink-dark relative">
    <div ref="container" class="h-screen w-full"></div>
    <!-- <div class="masonry sm:masonry-sm md:masonry-md z-20 relative">
      <Project class="p-4 break-inside" v-for="project in projects" :projectInfo="project" :key="project.href">
      </Project>
    </div> -->
  </section>
</template>

<style scoped></style>
