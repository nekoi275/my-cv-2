<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { use3DAudio } from "@/utils/3d/audioManager";
import { IndicatorManager } from "@/utils/3d/indicators";
import { ParticleSystemsManager } from "@/utils/3d/particleSystems";
import { useCameraTrack } from "@/utils/3d/cameraTrack";

const REMOTE_GARDEN_MODEL = "https://pub-aa00446aba67443397993f29b0708952.r2.dev/garden.glb";
const REMOTE_MUSIC = "https://pub-aa00446aba67443397993f29b0708952.r2.dev/music.mp3";
const REMOTE_KOI_MODEL = "https://pub-aa00446aba67443397993f29b0708952.r2.dev/koi.glb";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export interface InteractiveTarget {
    id: string;
    position: THREE.Vector3 | { x: number; y: number; z: number };
    component?: any;
    title?: string;
    [key: string]: any;
}

const props = withDefaults(defineProps<{
    targets?: InteractiveTarget[];
    paused?: boolean;
}>(), {
    targets: () => [],
    paused: false
});

const emit = defineEmits<{
    (e: 'modelLoaded'): void;
    (e: 'sceneUnload'): void;
    (e: 'indicatorClicked', target: InteractiveTarget): void;
}>();

const container = ref<HTMLDivElement | null>(null);
const isModelReady = ref(false);
const isSceneUnloaded = ref(false);

const audio = use3DAudio();
const indicators = new IndicatorManager();
const particles = new ParticleSystemsManager();
const cameraTrack = useCameraTrack();

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let cameraRig: THREE.Group;
let renderer: THREE.WebGLRenderer;
let animationId: number;
let animateRef: (() => void) | null = null;
let isPaused = false;
let wasMusicPlayingBeforePause = false;

const hoverPointer = new THREE.Vector2();
let hoverCheckScheduled = false;

watch(() => props.paused, (paused) => {
    isPaused = paused;
    if (paused) {
        cancelAnimationFrame(animationId);
        wasMusicPlayingBeforePause = audio.pauseAudio();
    } else {
        if (animateRef) animateRef();
        if (wasMusicPlayingBeforePause) {
            audio.resumeAudio();
        }
    }
});

const handlePointerDown = (e: PointerEvent) => {
    indicators.clearHoveredSprite();
    cameraTrack.onPointerDown(e, camera, container.value);
};

const handlePointerMove = (e: PointerEvent) => {
    cameraTrack.onPointerMove(e, camera);
};

const handlePointerUp = (e: PointerEvent) => {
    const wasDrag = cameraTrack.onPointerUp(container.value);

    if (!wasDrag && isModelReady.value && container.value) {
        const rect = container.value.getBoundingClientRect();
        const clickPointer = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const targetData = indicators.checkClick(clickPointer, camera, container.value);
        if (targetData) {
            emit('indicatorClicked', targetData);
        }
    }
};

const handleMouseMove = (e: MouseEvent) => {
    if (!container.value || !isModelReady.value || cameraTrack.isDragging.value) return;
    const rect = container.value.getBoundingClientRect();
    hoverPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    hoverPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    hoverCheckScheduled = true;
};

onMounted(async () => {
    if (!container.value) return;

    let GARDEN_MODEL_URL = REMOTE_GARDEN_MODEL;
    let KOI_MODEL_URL = REMOTE_KOI_MODEL;
    let MUSIC_URL = REMOTE_MUSIC;

    if (import.meta.env.DEV) {
        try {
            const gardenModule = await import("../assets/3d/garden.glb");
            GARDEN_MODEL_URL = gardenModule.default;
            
            const koiModule = await import("../assets/3d/koi.glb");
            KOI_MODEL_URL = koiModule.default;

            const musicModule = await import("../assets/music.mp3");
            MUSIC_URL = musicModule.default;
        } catch (e) {
            console.warn("Failed to load local assets, falling back to remote", e);
        }
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#e4cbce");

    const width = container.value.clientWidth;
    const height = container.value.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    cameraRig = new THREE.Group();
    cameraRig.position.set(0, 0, 5);
    cameraRig.add(camera);
    scene.add(cameraRig);

    audio.initAudio(camera, MUSIC_URL, isModelReady.value);

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
            model.position.set(-17, -2, -33);
            scene.add(model);
            model.updateMatrixWorld(true);

            emit('modelLoaded');
            isModelReady.value = true;

            if (props.targets && props.targets.length > 0) {
                props.targets.forEach(target => indicators.createIndicator(target, scene));
            }

            audio.playIfLoaded();

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        },
        undefined,
        (error) => console.error("An error happened loading the model:", error)
    );

    particles.createSakuraPetals(scene);
    particles.createPondFog(scene);
    particles.createPotSmoke(scene);

    loader.load(
        KOI_MODEL_URL,
        (gltf) => {
            particles.initKoiFish(scene, gltf.scene);
        },
        undefined,
        (error) => console.error("An error happened loading the koi model:", error)
    );

    const animate = () => {
        if (isPaused) return;
        animationId = requestAnimationFrame(animate);

        particles.update(camera.position);
        renderer.render(scene, camera);

        if (hoverCheckScheduled) {
            hoverCheckScheduled = false;
            indicators.checkHover(hoverPointer, camera, container.value, cameraTrack.isDragging.value);
        }
    };
    animateRef = animate;
    animate();

    cameraTrack.initCameraTrack(container.value, cameraRig, camera, () => {
        isSceneUnloaded.value = true;
        emit('sceneUnload');
    });

    window.addEventListener("resize", onWindowResize);
    container.value.addEventListener('pointerdown', handlePointerDown);
    container.value.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
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
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    if (container.value) {
        container.value.removeEventListener('pointerdown', handlePointerDown);
        container.value.removeEventListener('mousemove', handleMouseMove);
    }

    indicators.dispose(scene);
    particles.dispose(scene);
    audio.stopAudio();
    cameraTrack.disposeCameraTrack();
    cancelAnimationFrame(animationId);

    if (scene) {
        scene.traverse((object) => {
            if ((object as THREE.Mesh).isMesh) {
                const mesh = object as THREE.Mesh;
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
    <div 
        ref="container" 
        class="h-screen w-full relative" 
        style="touch-action: pan-y;" 
    >
        <button 
            v-if="!isSceneUnloaded" 
            @click="audio.toggleMusic" 
            class="absolute top-5 right-5 z-50 px-5 py-2.5 bg-white/80 border-0 rounded-full cursor-pointer font-bold transition-colors duration-300 shadow-md hover:bg-white text-sm"
        >
            Music: {{ audio.isMusicPlaying.value ? 'on' : 'off' }}
        </button>
    </div>
</template>