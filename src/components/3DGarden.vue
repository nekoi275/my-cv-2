<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
}>(), {
    targets: () => []
});

const container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let cameraRig: THREE.Group;
let renderer: THREE.WebGLRenderer;
let animationId: number;
let mm: gsap.MatchMedia;

let sound: THREE.Audio;
let sakuraMesh: THREE.InstancedMesh;
const petalCount = 1500;
const dummy = new THREE.Object3D();
const petalInfo: { position: THREE.Vector3, velocity: THREE.Vector3, rotationAxis: THREE.Vector3, rotationSpeed: number }[] = [];

let fogMesh: THREE.InstancedMesh;
const fogCount = 50;
const fogInfo: { position: THREE.Vector3, rotationZ: number }[] = [];

const raycaster = new THREE.Raycaster();
const hoverPointer = new THREE.Vector2();
let allIndicatorMeshes: THREE.Object3D[] = [];
let indicatorGroups: THREE.Group[] = [];
let wasPointerDrag = false;
let hoverCheckScheduled = false;

const isMusicPlaying = ref(false);
const isModelReady = ref(false);
const isSceneUnloaded = ref(false);

const canLookAround = ref(false);
const isDragging = ref(false);
const prevPointer = { x: 0, y: 0 };

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

const emit = defineEmits<{
    (e: 'modelLoaded'): void;
    (e: 'sceneUnload'): void;
    (e: 'indicatorClicked', target: InteractiveTarget): void;
}>();

const onPointerDown = (e: PointerEvent) => {
    wasPointerDrag = false;
    if (!canLookAround.value) return;
    isDragging.value = true;
    gsap.killTweensOf(camera.rotation);
    prevPointer.x = e.clientX;
    prevPointer.y = e.clientY;
    if (container.value) container.value.style.cursor = 'grabbing';
};

const onPointerMove = (e: PointerEvent) => {
    if (!isDragging.value || !canLookAround.value) return;

    const deltaX = e.clientX - prevPointer.x;
    if (Math.abs(deltaX) > 15) wasPointerDrag = true;

    prevPointer.x = e.clientX;
    prevPointer.y = e.clientY;

    camera.rotation.y -= deltaX * 0.003;
    const limit = Math.PI / 3;
    camera.rotation.y = Math.max(-limit, Math.min(limit, camera.rotation.y));
};

const onPointerUp = (e: PointerEvent) => {
    if (isDragging.value) {
        isDragging.value = false;
        if (container.value) container.value.style.cursor = '';
    }

    if (!wasPointerDrag && allIndicatorMeshes.length > 0 && isModelReady.value && container.value) {
        const rect = container.value.getBoundingClientRect();
        hoverPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        hoverPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(hoverPointer, camera);
        
        const intersects = raycaster.intersectObjects(allIndicatorMeshes, true);
        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            const targetData = hitObject.userData?.target as InteractiveTarget;
            if (targetData) {
                emit('indicatorClicked', targetData);
            }
        }
    }
};

const onMouseMove = (e: MouseEvent) => {
    if (!container.value || allIndicatorMeshes.length === 0 || !isModelReady.value || isDragging.value) return;
    const rect = container.value.getBoundingClientRect();
    hoverPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    hoverPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    hoverCheckScheduled = true;
};

const createIndicator = (target: InteractiveTarget) => {
    const group = new THREE.Group();
    const pos = target.position instanceof THREE.Vector3 
        ? target.position.clone() 
        : new THREE.Vector3(target.position.x, target.position.y, target.position.z);

    group.position.copy(pos);

    const hitGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { target };
    group.add(hitMesh);
    allIndicatorMeshes.push(hitMesh);

    const innerGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.userData = { target };
    group.add(inner);
    allIndicatorMeshes.push(inner);

    const crystalGeo = new THREE.OctahedronGeometry(0.2, 0);
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, wireframe: true });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.userData = { target };
    group.add(crystalMesh);
    allIndicatorMeshes.push(crystalMesh);

    scene.add(group);
    indicatorGroups.push(group);

    gsap.to(crystalMesh.rotation, { y: Math.PI * 2, duration: 3.5, repeat: -1, ease: 'none' });
    gsap.to(innerMat, { opacity: 0.35, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(inner.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(group.position, { y: pos.y + 0.18, duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
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
            model.position.set(-17, -2, -33);
            scene.add(model);
            model.updateMatrixWorld(true);

            emit('modelLoaded');
            isModelReady.value = true;

            if (props.targets && props.targets.length > 0) {
                props.targets.forEach(target => createIndicator(target));
            }

            if (sound && sound.buffer && !sound.isPlaying) {
                sound.play();
                isMusicPlaying.value = true;
            }
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        },
        undefined,
        (error) => console.error("An error happened loading the model:", error)
    );

    const createSakuraPetals = () => {
        const geometry = new THREE.PlaneGeometry(0.08, 0.08);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffb7c5,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });

        sakuraMesh = new THREE.InstancedMesh(geometry, material, petalCount);
        
        for (let i = 0; i < petalCount; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 20 + 5; 
            const z = (Math.random() - 0.5) * 40 - 15;

            dummy.position.set(x, y, z);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            dummy.scale.setScalar(0.5 + Math.random() * 0.5);
            dummy.updateMatrix();
            sakuraMesh.setMatrixAt(i, dummy.matrix);

            petalInfo.push({
                position: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    -0.005 - Math.random() * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                rotationAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                rotationSpeed: Math.random() * 0.02 + 0.01
            });
        }
        scene.add(sakuraMesh);
    };

    const createFogTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (!context) return new THREE.Texture();

        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);

        return new THREE.CanvasTexture(canvas);
    };

    const createPondFog = () => {
        const geometry = new THREE.PlaneGeometry(8, 8);
        const material = new THREE.MeshBasicMaterial({
            map: createFogTexture(),
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
        });

        fogMesh = new THREE.InstancedMesh(geometry, material, fogCount);

        for (let i = 0; i < fogCount; i++) {
            const x = -3 + (Math.random() - 0.5) * 20;
            const z = -10 + (Math.random() - 0.5) * 15;
            const y = -1.5 + Math.random() * 0.5;

            dummy.position.set(x, y, z);
            dummy.rotation.x = -Math.PI / 2;
            const rotZ = Math.random() * 2 * Math.PI;
            dummy.rotation.z = rotZ;
            dummy.scale.setScalar(0.8 + Math.random() * 0.4);
            dummy.updateMatrix();
            fogMesh.setMatrixAt(i, dummy.matrix);

            fogInfo.push({ position: new THREE.Vector3(x, y, z), rotationZ: rotZ });
        }
        scene.add(fogMesh);
    };

    createSakuraPetals();
    createPondFog();

    let potSmokeMesh: THREE.InstancedMesh;
    const potSmokeCount = 30;
    const potSmokeInfo: { position: THREE.Vector3, velocity: THREE.Vector3, age: number, life: number }[] = [];
    const dummySmoke = new THREE.Object3D();

    const createPotSmoke = () => {
        const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        const texture = createFogTexture();
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
        });

        potSmokeMesh = new THREE.InstancedMesh(geometry, material, potSmokeCount);
        potSmokeMesh.position.set(-16.95, 0.65, -30.11); 

        for (let i = 0; i < potSmokeCount; i++) {
            potSmokeInfo.push({
                position: new THREE.Vector3(0, 0, 0),
                velocity: new THREE.Vector3(0, 0, 0),
                age: Math.random() * 100,
                life: 100 + Math.random() * 50
            });
        }
        scene.add(potSmokeMesh);
    };
    createPotSmoke();

    const fishList: { mesh: THREE.Object3D, velocity: THREE.Vector3, speed: number }[] = [];
    const fishCount = 10;
    
    loader.load(
        KOI_MODEL_URL,
        (gltf) => {
            const model = gltf.scene;
            for (let i = 0; i < fishCount; i++) {
                const fish = SkeletonUtils.clone(model);
                fish.scale.set(0.08, 0.08, 0.08);
                const x = -3 + (Math.random() - 0.5) * 10;
                const z = -10 + (Math.random() - 0.5) * 8;
                fish.position.set(x, -2.5, z);
                fish.rotation.y = Math.random() * Math.PI * 2;
                scene.add(fish);

                const speed = 0.01 + Math.random() * 0.01;
                const angle = Math.random() * Math.PI * 2;
                fishList.push({ mesh: fish, velocity: new THREE.Vector3(Math.cos(angle) * speed, 0, Math.sin(angle) * speed), speed });
            }
        },
        undefined,
        (error) => console.error("An error happened loading the koi model:", error)
    );

    const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        fishList.forEach((fishInfo) => {
            const { mesh, velocity } = fishInfo;
            mesh.position.add(velocity);
            mesh.lookAt(mesh.position.clone().add(velocity));

            let bounced = false;
            if (mesh.position.x < -13 || mesh.position.x > 7) { velocity.x = -velocity.x; bounced = true; }
            if (mesh.position.z < -17.5 || mesh.position.z > -2.5) { velocity.z = -velocity.z; bounced = true; }

            if (!bounced && Math.random() < 0.005) {
                velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.5);
            }
        });

        if (sakuraMesh) {
            for (let i = 0; i < petalCount; i++) {
                const info = petalInfo[i];
                info.position.add(info.velocity);
                info.position.x += Math.sin(Date.now() * 0.001 + i) * 0.002;
                info.position.z += Math.cos(Date.now() * 0.001 + i) * 0.002;

                if (info.position.y < -5) {
                    info.position.y = 15;
                    info.position.x = (Math.random() - 0.5) * 40;
                    info.position.z = (Math.random() - 0.5) * 40 - 15;
                }

                dummy.position.copy(info.position);
                dummy.rotateOnAxis(info.rotationAxis, info.rotationSpeed);
                dummy.updateMatrix();
                sakuraMesh.setMatrixAt(i, dummy.matrix);
            }
            sakuraMesh.instanceMatrix.needsUpdate = true;
        }

        if (fogMesh) {
             for (let i = 0; i < fogCount; i++) {
                const info = fogInfo[i];
                dummy.position.copy(info.position);
                dummy.rotation.x = -Math.PI / 2;
                dummy.rotation.z = info.rotationZ; 
                
                const time = Date.now() * 0.0002;
                dummy.position.x = info.position.x + Math.sin(time + i) * 0.2;
                dummy.position.z = info.position.z + Math.cos(time + i * 0.5) * 0.2;

                dummy.updateMatrix();
                fogMesh.setMatrixAt(i, dummy.matrix);
            }
            fogMesh.instanceMatrix.needsUpdate = true;
        }

        if (potSmokeMesh) {
            for (let i = 0; i < potSmokeCount; i++) {
                const info = potSmokeInfo[i];
                info.age++;
                if (info.age >= info.life) {
                    info.age = 0;
                    info.position.set(0, 0, 0);
                    info.velocity.set((Math.random() - 0.5) * 0.02, 0.01 + Math.random() * 0.02, (Math.random() - 0.5) * 0.02);
                }
                info.position.add(info.velocity);
                dummySmoke.position.copy(info.position);
                dummySmoke.lookAt(camera.position);
                dummySmoke.scale.setScalar(1 + (info.age / info.life) * 2);
                dummySmoke.updateMatrix();
                potSmokeMesh.setMatrixAt(i, dummySmoke.matrix);
            }
            potSmokeMesh.instanceMatrix.needsUpdate = true;
        }

        renderer.render(scene, camera);

        if (hoverCheckScheduled && allIndicatorMeshes.length > 0 && !isDragging.value) {
            hoverCheckScheduled = false;
            raycaster.setFromCamera(hoverPointer, camera);
            const hits = raycaster.intersectObjects(allIndicatorMeshes, true);
            if (container.value) {
                container.value.style.cursor = hits.length > 0 ? 'pointer' : '';
            }
        }
    };
    animate();

    window.addEventListener("resize", onWindowResize);

    container.value.addEventListener('pointerdown', onPointerDown);
    container.value.addEventListener('mousemove', onMouseMove);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    mm = gsap.matchMedia();

    const setupTimeline = (endValue: string) => {
        let lastScrollProgress = 0;

        const tl = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
                id: "gardenScroll",
                trigger: container.value,
                start: "top top",
                end: endValue,
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    if (self.progress >= 0.005) {
                        if (!canLookAround.value) {
                            canLookAround.value = true;
                        }
                    } else {
                        if (canLookAround.value) {
                            canLookAround.value = false;
                            if (isDragging.value) {
                                isDragging.value = false;
                                if (container.value) container.value.style.cursor = '';
                            }
                            gsap.to(camera.rotation, {
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out",
                                overwrite: "auto"
                            });
                        }
                    }

                    if (Math.abs(self.progress - lastScrollProgress) > 0.0001) {
                        if (canLookAround.value && !isDragging.value && Math.abs(camera.rotation.y) > 0.001) {
                            gsap.to(camera.rotation, {
                                y: 0,
                                duration: 1.5,
                                ease: "power2.out",
                                overwrite: "auto"
                            });
                        }
                    }
                    lastScrollProgress = self.progress;

                    if (self.progress > 0.99 && !isSceneUnloaded.value) {
                        isSceneUnloaded.value = true;
                        emit('sceneUnload');
                    }
                },
                onLeave: (self) => {
                    if (self.progress >= 0.95 && !isSceneUnloaded.value) {
                        isSceneUnloaded.value = true;
                        emit('sceneUnload');
                    }
                },
                onLeaveBack: () => {
                    canLookAround.value = false;
                    gsap.to(camera.rotation, { y: 0, duration: 0.5, overwrite: true });
                }
            },
        });

        const steps = [
            { pos: { z: -1 } },
            { rot: { y: -1 } },
            { pos: { x: 2.5, z: -5.5 }, rot: { y: -1 } },
            { pos: { x: 5, z: -10 } },
            { pos: { x: 7, z: -13.5 }, rot: { y: 0 } },
            { pos: { x: 9, z: -17 }, rot: { y: 1 } },
            { pos: { x: 4, z: -20 } },
            { pos: { x: 1.5, z: -24 }, rot: { y: 0.75 } },
            { pos: { x: 1.5, z: -24 }, rot: { y: 0.75 } },
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
            { pos: { x: -18.5, y: 1, z: -24 }, rot: { y: 2.75 } },
            { pos: { x: -20, y: 0, z: -20 }, rot: { y: 2.5 } },
            { pos: { x: -20, y: 0, z: -16 }, rot: { y: 2.5 } },
            { pos: { x: -21, y: 0, z: -14 }, rot: { y: 3 } },
            { pos: { x: -21, y: 0, z: -10 }, rot: { y: 3 } },
            { pos: { x: -21, y: 0, z: -8 }, rot: { y: 4 } },
            { pos: { x: -19, y: 0, z: -4 }, rot: { y: 4.5 } },
            { pos: { x: -14.5, y: 0, z: -3 }, rot: { y: 4.5 } },
            { pos: { x: -10, y: 0, z: -2 }, rot: { y: 4.5 } },
            { pos: { x: -5.5, y: 0, z: -2 }, rot: { y: 4.5 } },
            { pos: { x: -1, y: 0, z: -2 }, rot: { y: 4.5 } },
            { pos: { x: -0.5, y: 0, z: -2 }, rot: { y: 3.85 } },
            { pos: { x: 0, y: 0, z: -2 }, rot: { y: 3.2 } },
            { pos: { x: 0, y: 0, z: 2 }, rot: { y: 3.2 } },
        ];

        steps.forEach((step) => {
            if (step.pos) {
                tl.to(cameraRig.position, step.pos);
            }
            if (step.rot) {
                tl.to(cameraRig.rotation, step.rot, step.pos ? "<" : undefined);
            }
        });
    };

    mm.add("(min-width: 800px)", () => setupTimeline("+=10000"));
    mm.add("(max-width: 799px)", () => setupTimeline("+=4000"));
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
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (container.value) {
        container.value.removeEventListener('pointerdown', onPointerDown);
        container.value.removeEventListener('mousemove', onMouseMove);
    }

    indicatorGroups.forEach(group => {
        gsap.killTweensOf(group.position);
        group.children.forEach(c => {
            gsap.killTweensOf(c.rotation);
            gsap.killTweensOf(c.scale);
            if ((c as THREE.Mesh).material) {
                const mat = (c as THREE.Mesh).material;
                if (Array.isArray(mat)) mat.forEach(m => { gsap.killTweensOf(m); m.dispose(); });
                else { gsap.killTweensOf(mat); mat.dispose(); }
            }
            if ((c as THREE.Mesh).geometry) {
                (c as THREE.Mesh).geometry.dispose();
            }
        });
        scene?.remove(group);
    });
    indicatorGroups = [];
    allIndicatorMeshes = [];

    if (sound && sound.isPlaying) sound.stop();
    cancelAnimationFrame(animationId);
    if (mm) mm.revert();

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
            @click="toggleMusic" 
            class="absolute top-5 right-5 z-50 px-5 py-2.5 bg-white/80 border-0 rounded-full cursor-pointer font-bold transition-all duration-300 shadow-md hover:bg-white hover:scale-105 text-sm"
        >
            Music: {{ isMusicPlaying ? 'on' : 'off' }}
        </button>
    </div>
</template>