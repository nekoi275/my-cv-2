<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import garden from "@/assets/3d/garden.glb";

gsap.registerPlugin(ScrollTrigger);

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
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: container.value,
        start: "top top",
        end: "+=10000",
        scrub: 1,
        pin: true,
      },
    });

    const steps = [
      { pos: { z: -1 } },
      { rot: { y: -1 } },
      { pos: { x: 5, z: -10 } },
      { pos: { x: 9, z: -17 }, rot: { y: 1 } },
      { pos: { x: 4, z: -20 } },
      { pos: { x: -1, z: -28 }, rot: { y: 0.5 } },
      { pos: { x: -3, y: 1.2, z: -32 }, rot: { y: 1.2 } },
      { pos: { x: -6, y: 2, z: -32 }, rot: { y: 1.4 } },
      { pos: { x: -11, y: 2, z: -32 } },
      { pos: { x: -14, y: 2, z: -30 }, rot: { y: 1.4 } },
      { pos: { x: -17, y: 2, z: -32 }, rot: { y: 1 } },
      { pos: { x: -17, y: 2, z: -32 }, rot: { y: 2 } },
      { pos: { x: -19, y: 2, z: -32 }, rot: { y: 3 } },
      { pos: { x: -19, y: 2, z: -30 }, rot: { y: 4 } },
      { pos: { x: -17, y: 2, z: -28 }, rot: { y: 3 } },
      { pos: { x: -20, y: 0, z: -20 }, rot: { y: 2.5 } },
      { pos: { x: -20, y: 0, z: -16 }, rot: { y: 2.5 } },
      { pos: { x: -21, y: 0, z: -14 }, rot: { y: 3 } },
      { pos: { x: -21, y: 0, z: -10 }, rot: { y: 3 } },
      { pos: { x: -21, y: 0, z: -8 }, rot: { y: 4 } },
      { pos: { x: -19, y: 0, z: -4 }, rot: { y: 4.5 } },
      { pos: { x: -10, y: 0, z: -2 }, rot: { y: 4.5 } },
      { pos: { x: -1, y: 0, z: -2 }, rot: { y: 4.5 } },
      { pos: { x: 0, y: 0, z: -2 }, rot: { y: 3.2 } },
      { pos: { x: 0, y: 0, z: 2 }, rot: { y: 3.2 } },
    ];

    steps.forEach((step) => {
      if (step.pos) {
        tl.to(camera.position, step.pos);
      }
      if (step.rot) {
        tl.to(camera.rotation, step.rot, step.pos ? "<" : undefined);
      }
    });
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
  </section>
</template>

<style scoped></style>
