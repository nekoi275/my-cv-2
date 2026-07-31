import * as THREE from "three";
import { gsap } from "gsap";
import type { InteractiveTarget } from "@/components/3DGarden.vue";

function isMobileDevice(): boolean {
    return typeof window !== 'undefined' && (window.innerWidth < 800 || matchMedia('(max-width: 799px)').matches);
}

export function createTextSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');

    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = 'bold 22px monospace, sans-serif';
        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
        const paddingHorizontal = 28;
        const pillWidth = Math.min(textWidth + paddingHorizontal * 2, 490);
        const pillHeight = 52;
        const pillX = (canvas.width - pillWidth) / 2;
        const pillY = (canvas.height - pillHeight) / 2;

        context.beginPath();
        if (typeof context.roundRect === 'function') {
            context.roundRect(pillX, pillY, pillWidth, pillHeight, 14);
        } else {
            context.rect(pillX, pillY, pillWidth, pillHeight);
        }
        context.fillStyle = 'rgba(255, 255, 255, 0.92)';
        context.fill();

        context.lineWidth = 2;
        context.strokeStyle = 'rgba(73, 18, 18, 0.85)';
        context.stroke();

        context.fillStyle = '#491212';
        context.font = 'bold 22px monospace, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const isMobile = isMobileDevice();
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: isMobile ? 1 : 0,
        depthTest: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2.4, 0.6, 1);
    sprite.position.set(0, -0.65, 0);
    return sprite;
}

export function getIndicatorTitle(target: InteractiveTarget): string {
    if (target.title) return target.title;

    switch (target.id) {
        case 'teapot':
            return 'About me';
        case 'games':
            return 'Games';
        case 'projects':
        default:
            return 'Projects, case studies, demos';
    }
}

export class IndicatorManager {
    public indicatorGroups: THREE.Group[] = [];
    public allIndicatorMeshes: THREE.Object3D[] = [];
    public hoveredSprite: THREE.Sprite | null = null;
    private raycaster = new THREE.Raycaster();

    createIndicator(target: InteractiveTarget, scene: THREE.Scene) {
        const group = new THREE.Group();
        const pos = target.position instanceof THREE.Vector3 
            ? target.position.clone() 
            : new THREE.Vector3(target.position.x, target.position.y, target.position.z);

        group.position.copy(pos);

        const hitGeo = new THREE.SphereGeometry(1.0, 16, 16);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        group.add(hitMesh);
        this.allIndicatorMeshes.push(hitMesh);

        const innerGeo = new THREE.SphereGeometry(0.32, 24, 24);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        group.add(inner);
        this.allIndicatorMeshes.push(inner);

        const crystalGeo = new THREE.OctahedronGeometry(0.2, 0);
        const crystalMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, wireframe: true });
        const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
        group.add(crystalMesh);
        this.allIndicatorMeshes.push(crystalMesh);

        const textLabel = getIndicatorTitle(target);
        const sprite = createTextSprite(textLabel);
        group.add(sprite);

        hitMesh.userData = { target, sprite };
        inner.userData = { target, sprite };
        crystalMesh.userData = { target, sprite };

        scene.add(group);
        this.indicatorGroups.push(group);

        gsap.to(crystalMesh.rotation, { y: Math.PI * 2, duration: 3.5, repeat: -1, ease: 'none' });
        gsap.to(innerMat, { opacity: 0.35, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(inner.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(group.position, { y: pos.y + 0.18, duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    checkHover(
        hoverPointer: THREE.Vector2,
        camera: THREE.Camera,
        container: HTMLElement | null,
        isDragging: boolean
    ) {
        if (!container || this.allIndicatorMeshes.length === 0 || isDragging || isMobileDevice()) return;

        this.raycaster.setFromCamera(hoverPointer, camera);
        const hits = this.raycaster.intersectObjects(this.allIndicatorMeshes, true);

        if (hits.length > 0) {
            container.style.cursor = 'pointer';
            const hitObj = hits[0].object;
            const sprite = hitObj.userData?.sprite as THREE.Sprite | undefined;

            if (sprite && sprite !== this.hoveredSprite) {
                if (this.hoveredSprite) {
                    gsap.to(this.hoveredSprite.material, { opacity: 0, duration: 0.3, overwrite: 'auto' });
                }
                this.hoveredSprite = sprite;
                gsap.to(sprite.material, { opacity: 1, duration: 0.3, overwrite: 'auto' });
            }
        } else {
            container.style.cursor = '';
            if (this.hoveredSprite) {
                gsap.to(this.hoveredSprite.material, { opacity: 0, duration: 0.3, overwrite: 'auto' });
                this.hoveredSprite = null;
            }
        }
    }

    checkClick(
        clickPointer: THREE.Vector2,
        camera: THREE.Camera,
        container: HTMLElement | null
    ): InteractiveTarget | null {
        if (!container || this.allIndicatorMeshes.length === 0) return null;

        this.raycaster.setFromCamera(clickPointer, camera);
        const intersects = this.raycaster.intersectObjects(this.allIndicatorMeshes, true);

        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            return (hitObject.userData?.target as InteractiveTarget) || null;
        }
        return null;
    }

    clearHoveredSprite() {
        if (isMobileDevice()) return;
        if (this.hoveredSprite) {
            gsap.to(this.hoveredSprite.material, { opacity: 0, duration: 0.2, overwrite: 'auto' });
            this.hoveredSprite = null;
        }
    }

    dispose(scene: THREE.Scene) {
        this.indicatorGroups.forEach(group => {
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
        this.indicatorGroups = [];
        this.allIndicatorMeshes = [];
        this.hoveredSprite = null;
    }
}
