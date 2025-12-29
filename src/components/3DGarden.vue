<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import localGardenModel from "../assets/3d/garden.glb";
import localMusic from "../assets/music.mp3";

const REMOTE_GARDEN_MODEL = "https://pub-aa00446aba67443397993f29b0708952.r2.dev/garden.glb";
const REMOTE_MUSIC = "https://pub-aa00446aba67443397993f29b0708952.r2.dev/music.mp3";

const GARDEN_MODEL_URL = import.meta.env.DEV ? localGardenModel : REMOTE_GARDEN_MODEL;
const MUSIC_URL = import.meta.env.DEV ? localMusic : REMOTE_MUSIC;


gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });


const container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number;
let mm: gsap.MatchMedia;

let sound: THREE.Audio;

const isMusicPlaying = ref(false);
const isModelReady = ref(false);
const isSceneUnloaded = ref(false);

const toggleMusic = () => {
    if (sound && sound.buffer) {
        if (sound.isPlaying) {
            sound.pause();
            isMusicPlaying.value = false;
        } else {
            sound.play();
            isMusicPlaying.value = true;
        }
    }
};

const emit = defineEmits(['modelLoaded', 'sceneUnload']);

onMounted(() => {
    if (!container.value) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#e4cbce");

    const width = container.value.clientWidth;
    const height = container.value.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(MUSIC_URL, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        if (isModelReady.value) {
            sound.play();
            isMusicPlaying.value = true;
        }
    });

    renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.value.appendChild(renderer.domElement);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    loader.load(
        GARDEN_MODEL_URL,
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.05, 0.05, 0.05);
            model.updateMatrixWorld(true);

            model.position.set(-17, -2, -33);
            scene.add(model);
            emit('modelLoaded');
            isModelReady.value = true;
            if (sound && sound.buffer && !sound.isPlaying) {
                sound.play();
                isMusicPlaying.value = true;
            }
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

    mm = gsap.matchMedia();

    const setupTimeline = (endValue: string) => {
        const tl = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
                trigger: container.value,
                start: "top top",
                end: endValue,
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    if (self.progress > 0.99) {
                        isSceneUnloaded.value = true;
                        emit('sceneUnload');
                    }
                },
                onLeave: () => {
                    isSceneUnloaded.value = true;
                    emit('sceneUnload');
                },
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
    };

    mm.add("(min-width: 800px)", () => {
        setupTimeline("+=10000");
    });

    mm.add("(max-width: 799px)", () => {
        setupTimeline("+=4000");
    });
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

    if (sound && sound.isPlaying) {
        sound.stop();
    }

    cancelAnimationFrame(animationId);

    if (mm) mm.revert();


    if (scene) {
        scene.traverse((object) => {
            if ((object as THREE.Mesh).isMesh) {
                const mesh = object as THREE.Mesh;
                mesh.geometry.dispose();
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((m) => m.dispose());
                } else {
                    mesh.material.dispose();
                }
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
    <div ref="container" class="h-screen w-full relative">
        <button v-if="!isSceneUnloaded" @click="toggleMusic" class="music-toggle-btn">
            {{ isMusicPlaying ? 'Turn Off Music' : 'Turn On Music' }}
        </button>
    </div>
</template>

<style scoped>
.music-toggle-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    font-family: inherit;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.music-toggle-btn:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}
</style>
