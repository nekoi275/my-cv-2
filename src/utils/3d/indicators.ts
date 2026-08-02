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
    return target.title ?? target.id;
}

export class IndicatorManager {
    public indicatorGroups: THREE.Group[] = [];
    public allIndicatorMeshes: THREE.Object3D[] = [];
    public hoveredSprite: THREE.Sprite | null = null;
    public gardenModel: THREE.Object3D | null = null;
    private raycaster = new THREE.Raycaster();

    private filterRaycastHits(hits: THREE.Intersection[]): THREE.Intersection[] {
        return hits.filter(hit => {
            const obj = hit.object;
            if (obj instanceof THREE.Sprite || obj instanceof THREE.Points || obj instanceof THREE.Line) return false;
            if (!obj.visible) return false;
            const mat = (obj as THREE.Mesh).material;
            if (mat) {
                const m = Array.isArray(mat) ? mat[0] : mat;
                if (!m.visible && !this.allIndicatorMeshes.includes(obj)) return false;
            }
            return true;
        });
    }

    setGardenModel(model: THREE.Object3D) {
        this.gardenModel = model;
    }

    createIndicator(target: InteractiveTarget, scene: THREE.Scene) {
        const group = new THREE.Group();
        const pos = target.position instanceof THREE.Vector3 
            ? target.position.clone() 
            : new THREE.Vector3(target.position.x, target.position.y, target.position.z);

        group.position.copy(pos);

        const hitGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
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
        
        const objectsToTest = this.gardenModel 
            ? [this.gardenModel, ...this.allIndicatorMeshes] 
            : this.allIndicatorMeshes;

        const validHits = this.filterRaycastHits(this.raycaster.intersectObjects(objectsToTest, true));

        if (validHits.length > 0) {
            const firstHitObj = validHits[0].object;
            if (this.allIndicatorMeshes.includes(firstHitObj)) {
                container.style.cursor = 'pointer';
                const sprite = firstHitObj.userData?.sprite as THREE.Sprite | undefined;

                if (sprite && sprite !== this.hoveredSprite) {
                    if (this.hoveredSprite) {
                        gsap.to(this.hoveredSprite.material, { opacity: 0, duration: 0.3, overwrite: 'auto' });
                    }
                    this.hoveredSprite = sprite;
                    gsap.to(sprite.material, { opacity: 1, duration: 0.3, overwrite: 'auto' });
                }
                return;
            }
        }

        container.style.cursor = '';
        if (this.hoveredSprite) {
            gsap.to(this.hoveredSprite.material, { opacity: 0, duration: 0.3, overwrite: 'auto' });
            this.hoveredSprite = null;
        }
    }

    checkClick(
        clickPointer: THREE.Vector2,
        camera: THREE.Camera,
        container: HTMLElement | null
    ): InteractiveTarget | null {
        if (!container || this.allIndicatorMeshes.length === 0) return null;

        this.raycaster.setFromCamera(clickPointer, camera);
        
        const objectsToTest = this.gardenModel 
            ? [this.gardenModel, ...this.allIndicatorMeshes] 
            : this.allIndicatorMeshes;

        const validHits = this.filterRaycastHits(this.raycaster.intersectObjects(objectsToTest, true));

        if (validHits.length > 0) {
            const firstHitObj = validHits[0].object;
            if (this.allIndicatorMeshes.includes(firstHitObj)) {
                return (firstHitObj.userData?.target as InteractiveTarget) || null;
            }
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
                    const mats = Array.isArray(mat) ? mat : [mat];
                    mats.forEach(m => {
                        gsap.killTweensOf(m);
                        (m as THREE.MeshBasicMaterial | THREE.SpriteMaterial).map?.dispose();
                        m.dispose();
                    });
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
        this.gardenModel = null;
    }
}
