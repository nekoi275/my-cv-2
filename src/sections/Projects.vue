<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import garden from "@/assets/3d/garden.glb";
import sakura from "@/assets/3d/sakura.glb";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { href: "https://pokemon-tcg.pages.dev" },
  { href: "https://dreamshot-test-task.pages.dev" },
  { href: "https://nekoi275.github.io/aframe-test" },
  { href: "https://nekoi275.github.io/nice-shop-layout/#" },
  { href: "https://t.me/banny_safe_bot" },
  { href: "https://nekoi275.github.io" },
];

const container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number;
let ctx: gsap.Context;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const projectMeshes: THREE.Group[] = [];

const onMouseMove = (event: MouseEvent) => {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  if (camera) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(projectMeshes, true);

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }
};

const onClick = () => {
  if (camera) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(projectMeshes, true);

    if (intersects.length > 0) {
      let object = intersects[0].object;
      while (object.parent && object.parent.type !== 'Scene') {
        if (object.userData.href) {
          window.open(object.userData.href, "_blank");
          return;
        }
        object = object.parent;
      }
      if (object.userData.href) {
        window.open(object.userData.href, "_blank");
      }
    }
  }
};

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
    sakura,
    (gltf) => {
      const sakuraModel = gltf.scene;

      const createProjectModel = (project: any, position: THREE.Vector3) => {
        const model = sakuraModel.clone();
        model.position.copy(position);
        model.rotation.y = Math.random() * Math.PI * 2;
        model.rotation.z = Math.random() * Math.PI * 2;
        model.scale.set(0.2, 0.2, 0.2);

        model.userData = { href: project.href };

        scene.add(model);
        projectMeshes.push(model);
      };

      // 1. Pokemon
      createProjectModel(projects[0], new THREE.Vector3(0, 0, -5));

      // 2. Safe
      createProjectModel(projects[1], new THREE.Vector3(9, 0, -12));

      // 3. AR
      createProjectModel(projects[2], new THREE.Vector3(9, 0, -18));

      // 4. Layout
      createProjectModel(projects[3], new THREE.Vector3(1, 0, -22));

      // 5. Banny
      createProjectModel(projects[4], new THREE.Vector3(0, 0, -30));

      // 6. CV
      createProjectModel(projects[5], new THREE.Vector3(-12, 2, -33));
    },
    undefined,
    (error) => {
      console.error("An error happened loading the sakura model:", error);
    }
  );


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

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", onClick);

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
        end: "+=10000",
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

    // 16.
    tl.to(camera.position, { x: -20, y: 0, z: -20, duration: 1 })
      .to(camera.rotation, { y: 2.5, duration: 1 }, "<");

    // 17.
    tl.to(camera.position, { x: -20, y: 0, z: -16, duration: 1 })
      .to(camera.rotation, { y: 2.5, duration: 1 }, "<");

    // 18.
    tl.to(camera.position, { x: -21, y: 0, z: -14, duration: 1 })
      .to(camera.rotation, { y: 3, duration: 1 }, "<");

    // 19.
    tl.to(camera.position, { x: -21, y: 0, z: -10, duration: 1 })
      .to(camera.rotation, { y: 3, duration: 1 }, "<");

    // 20.
    tl.to(camera.position, { x: -21, y: 0, z: -8, duration: 1 })
      .to(camera.rotation, { y: 4, duration: 1 }, "<");

    // 21.
    tl.to(camera.position, { x: -19, y: 0, z: -4, duration: 1 })
      .to(camera.rotation, { y: 4.5, duration: 1 }, "<");

    // 22.
    tl.to(camera.position, { x: -10, y: 0, z: -2, duration: 1 })
      .to(camera.rotation, { y: 4.5, duration: 1 }, "<");

    // 23.
    tl.to(camera.position, { x: -1, y: 0, z: -2, duration: 1 })
      .to(camera.rotation, { y: 4.5, duration: 1 }, "<");

    // 23.
    tl.to(camera.position, { x: 0, y: 0, z: -2, duration: 1 })
      .to(camera.rotation, { y: 3.2, duration: 1 }, "<");

    // 24.
    tl.to(camera.position, { x: 0, y: 0, z: 2, duration: 1 })
      .to(camera.rotation, { y: 3.2, duration: 1 }, "<");
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
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("click", onClick);

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
