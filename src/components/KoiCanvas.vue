<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const REMOTE_KOI_MODEL = "https://pub-aa00446aba67443397993f29b0708952.r2.dev/koi.glb";

const canvasContainer = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationFrameId: number;
let koiFish: THREE.Group | null = null;

const speed = 0.014;
let headingAngle = 0;
let time = 0;

const getViewportBounds = () => {
  if (!camera) return { maxX: 6, maxY: 3 };
  const vFOV = THREE.MathUtils.degToRad(camera.fov);
  const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
  const visibleWidth = visibleHeight * camera.aspect;
  const marginX = 1.5;
  const marginY = 1.0;
  return {
    maxX: visibleWidth / 2 - marginX,
    maxY: visibleHeight / 2 - marginY,
  };
};

const onWindowResize = () => {
  if (!canvasContainer.value || !camera || !renderer) return;
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(async () => {
  if (!canvasContainer.value) return;

  let KOI_MODEL_URL = REMOTE_KOI_MODEL;
  if (import.meta.env.DEV) {
    try {
      const koiModule = await import("../assets/3d/koi.glb");
      KOI_MODEL_URL = koiModule.default;
    } catch (e) {
      console.warn("Failed to load local koi asset, using remote fallback", e);
    }
  }

  scene = new THREE.Scene();

  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
  directionalLight.position.set(5, 8, 5);
  scene.add(directionalLight);

  const softFillLight = new THREE.DirectionalLight(0xffb7c5, 0.8);
  softFillLight.position.set(-5, -5, 2);
  scene.add(softFillLight);

  const loader = new GLTFLoader();
  loader.load(
    KOI_MODEL_URL,
    (gltf) => {
      koiFish = gltf.scene;
      koiFish.scale.set(0.15, 0.15, 0.15);

      const bounds = getViewportBounds();
      headingAngle = 0;
      koiFish.position.set(-bounds.maxX + 0.5, -0.5, 0);
      scene.add(koiFish);
    },
    undefined,
    (err) => console.error("Error loading koi fish model:", err)
  );

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    time += 0.02;

    if (koiFish) {
      const bounds = getViewportBounds();

      const wander = Math.sin(time * 0.7) * 0.008 + Math.cos(time * 0.4) * 0.005;
      headingAngle += wander;

      let boundarySteerNeeded = false;
      let targetAngle = headingAngle;

      if (koiFish.position.x > bounds.maxX) {
        targetAngle = Math.PI;
        boundarySteerNeeded = true;
      } else if (koiFish.position.x < -bounds.maxX) {
        targetAngle = 0;
        boundarySteerNeeded = true;
      }

      if (koiFish.position.y > bounds.maxY) {
        targetAngle = -Math.PI / 2;
        boundarySteerNeeded = true;
      } else if (koiFish.position.y < -bounds.maxY) {
        targetAngle = Math.PI / 2;
        boundarySteerNeeded = true;
      }

      if (boundarySteerNeeded) {
        let angleDiff = targetAngle - headingAngle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        headingAngle += angleDiff * 0.035;
      }

      const vx = Math.cos(headingAngle) * speed;
      const vy = Math.sin(headingAngle) * speed * 0.6;
      const vz = Math.cos(time * 0.6) * 0.002;

      koiFish.position.x += vx;
      koiFish.position.y += vy;
      koiFish.position.z += vz;

      const lookTarget = new THREE.Vector3(
        koiFish.position.x + vx,
        koiFish.position.y + vy,
        koiFish.position.z + vz
      );
      koiFish.lookAt(lookTarget);

      koiFish.rotation.z = 0;
      koiFish.rotation.x = 0;
    }

    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener("resize", onWindowResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  cancelAnimationFrame(animationFrameId);

  if (scene) {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material.dispose();
      }
    });
  }

  if (renderer) {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
});
</script>

<template>
  <div ref="canvasContainer" class="absolute inset-0 w-full h-full pointer-events-none z-0"></div>
</template>
