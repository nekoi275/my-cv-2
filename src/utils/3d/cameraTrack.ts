import { ref } from "vue";
import * as THREE from "three";
import { gsap } from "gsap";

export const cameraWaypoints = [
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

export function useCameraTrack() {
    const canLookAround = ref(false);
    const isDragging = ref(false);
    const prevPointer = { x: 0, y: 0 };
    let wasPointerDrag = false;
    let mm: gsap.MatchMedia | null = null;
    let isSceneUnloaded = false;

    const onPointerDown = (e: PointerEvent, camera: THREE.Camera, container: HTMLElement | null) => {
        wasPointerDrag = false;
        if (!canLookAround.value) return;
        isDragging.value = true;
        gsap.killTweensOf(camera.rotation);
        prevPointer.x = e.clientX;
        prevPointer.y = e.clientY;
        if (container) container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent, camera: THREE.Camera) => {
        if (!isDragging.value || !canLookAround.value) return;

        const deltaX = e.clientX - prevPointer.x;
        if (Math.abs(deltaX) > 15) wasPointerDrag = true;

        prevPointer.x = e.clientX;
        prevPointer.y = e.clientY;

        camera.rotation.y -= deltaX * 0.003;
        const limit = Math.PI / 3;
        camera.rotation.y = Math.max(-limit, Math.min(limit, camera.rotation.y));
    };

    const onPointerUp = (container: HTMLElement | null): boolean => {
        const didDrag = wasPointerDrag;
        if (isDragging.value) {
            isDragging.value = false;
            if (container) container.style.cursor = '';
        }
        return didDrag;
    };

    const setupTimeline = (
        container: HTMLElement, 
        cameraRig: THREE.Group, 
        camera: THREE.Camera, 
        endValue: string,
        onSceneUnload: () => void
    ) => {
        let lastScrollProgress = 0;

        const tl = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
                id: "gardenScroll",
                trigger: container,
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
                                container.style.cursor = '';
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

                    if (self.progress > 0.99 && !isSceneUnloaded) {
                        isSceneUnloaded = true;
                        onSceneUnload();
                    }
                },
                onLeave: (self) => {
                    if (self.progress >= 0.95 && !isSceneUnloaded) {
                        isSceneUnloaded = true;
                        onSceneUnload();
                    }
                },
                onLeaveBack: () => {
                    canLookAround.value = false;
                    gsap.to(camera.rotation, { y: 0, duration: 0.5, overwrite: true });
                }
            },
        });

        cameraWaypoints.forEach((step) => {
            if (step.pos) {
                tl.to(cameraRig.position, step.pos);
            }
            if (step.rot) {
                tl.to(cameraRig.rotation, step.rot, step.pos ? "<" : undefined);
            }
        });
    };

    const initCameraTrack = (
        container: HTMLElement, 
        cameraRig: THREE.Group, 
        camera: THREE.Camera,
        onSceneUnload: () => void
    ) => {
        mm = gsap.matchMedia();
        mm.add("(min-width: 800px)", () => setupTimeline(container, cameraRig, camera, "+=10000", onSceneUnload));
        mm.add("(max-width: 799px)", () => setupTimeline(container, cameraRig, camera, "+=4000", onSceneUnload));
    };

    const disposeCameraTrack = () => {
        if (mm) {
            mm.revert();
            mm = null;
        }
    };

    return {
        canLookAround,
        isDragging,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        initCameraTrack,
        disposeCameraTrack
    };
}
