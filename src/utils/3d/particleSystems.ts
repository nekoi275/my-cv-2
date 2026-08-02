import * as THREE from "three";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export class ParticleSystemsManager {
    private dummy = new THREE.Object3D();
    private readonly _up = new THREE.Vector3(0, 1, 0);
    
    private sakuraMesh?: THREE.InstancedMesh;
    private petalCount = 1500;
    private petalInfo: { position: THREE.Vector3, velocity: THREE.Vector3, rotationAxis: THREE.Vector3, rotationSpeed: number }[] = [];

    private fogMesh?: THREE.InstancedMesh;
    private fogCount = 50;
    private fogInfo: { position: THREE.Vector3, rotationZ: number }[] = [];

    private potSmokeMesh?: THREE.InstancedMesh;
    private potSmokeCount = 30;
    private potSmokeInfo: { position: THREE.Vector3, velocity: THREE.Vector3, age: number, life: number }[] = [];
    private dummySmoke = new THREE.Object3D();

    private fishList: { mesh: THREE.Object3D, velocity: THREE.Vector3, speed: number }[] = [];

    createSakuraPetals(scene: THREE.Scene) {
        const geometry = new THREE.PlaneGeometry(0.08, 0.08);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffb7c5,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });

        this.sakuraMesh = new THREE.InstancedMesh(geometry, material, this.petalCount);
        
        for (let i = 0; i < this.petalCount; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 20 + 5; 
            const z = (Math.random() - 0.5) * 40 - 15;

            this.dummy.position.set(x, y, z);
            this.dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            this.dummy.scale.setScalar(0.5 + Math.random() * 0.5);
            this.dummy.updateMatrix();
            this.sakuraMesh.setMatrixAt(i, this.dummy.matrix);

            this.petalInfo.push({
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
        scene.add(this.sakuraMesh);
    }

    private createFogTexture(): THREE.CanvasTexture {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (!context) return new THREE.CanvasTexture(canvas);

        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);

        return new THREE.CanvasTexture(canvas);
    }

    createPondFog(scene: THREE.Scene) {
        const geometry = new THREE.PlaneGeometry(8, 8);
        const material = new THREE.MeshBasicMaterial({
            map: this.createFogTexture(),
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
        });

        this.fogMesh = new THREE.InstancedMesh(geometry, material, this.fogCount);

        for (let i = 0; i < this.fogCount; i++) {
            const x = -3 + (Math.random() - 0.5) * 20;
            const z = -10 + (Math.random() - 0.5) * 15;
            const y = -1.5 + Math.random() * 0.5;

            this.dummy.position.set(x, y, z);
            this.dummy.rotation.x = -Math.PI / 2;
            const rotZ = Math.random() * 2 * Math.PI;
            this.dummy.rotation.z = rotZ;
            this.dummy.scale.setScalar(0.8 + Math.random() * 0.4);
            this.dummy.updateMatrix();
            this.fogMesh.setMatrixAt(i, this.dummy.matrix);

            this.fogInfo.push({ position: new THREE.Vector3(x, y, z), rotationZ: rotZ });
        }
        scene.add(this.fogMesh);
    }

    createPotSmoke(scene: THREE.Scene) {
        const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        const texture = this.createFogTexture();
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
        });

        this.potSmokeMesh = new THREE.InstancedMesh(geometry, material, this.potSmokeCount);
        this.potSmokeMesh.position.set(-16.95, 0.65, -30.11); 

        for (let i = 0; i < this.potSmokeCount; i++) {
            this.potSmokeInfo.push({
                position: new THREE.Vector3(0, 0, 0),
                velocity: new THREE.Vector3(0, 0, 0),
                age: Math.random() * 100,
                life: 100 + Math.random() * 50
            });
        }
        scene.add(this.potSmokeMesh);
    }

    initKoiFish(scene: THREE.Scene, gltfModel: THREE.Group) {
        const fishCount = 10;
        for (let i = 0; i < fishCount; i++) {
            const fish = SkeletonUtils.clone(gltfModel);
            fish.scale.set(0.08, 0.08, 0.08);
            const x = -3 + (Math.random() - 0.5) * 10;
            const z = -10 + (Math.random() - 0.5) * 8;
            fish.position.set(x, -2.5, z);
            fish.rotation.y = Math.random() * Math.PI * 2;
            scene.add(fish);

            const speed = 0.01 + Math.random() * 0.01;
            const angle = Math.random() * Math.PI * 2;
            this.fishList.push({ 
                mesh: fish, 
                velocity: new THREE.Vector3(Math.cos(angle) * speed, 0, Math.sin(angle) * speed), 
                speed 
            });
        }
    }

    update(cameraPosition: THREE.Vector3) {
        const now = Date.now();
        this.fishList.forEach((fishInfo) => {
            const { mesh, velocity } = fishInfo;
            mesh.position.add(velocity);
            mesh.lookAt(mesh.position.clone().add(velocity));

            let bounced = false;
            if (mesh.position.x < -13 || mesh.position.x > 7) { velocity.x = -velocity.x; bounced = true; }
            if (mesh.position.z < -17.5 || mesh.position.z > -2.5) { velocity.z = -velocity.z; bounced = true; }

            if (!bounced && Math.random() < 0.005) {
                velocity.applyAxisAngle(this._up, (Math.random() - 0.5) * 0.5);
            }
        });

        if (this.sakuraMesh) {
            for (let i = 0; i < this.petalCount; i++) {
                const info = this.petalInfo[i];
                info.position.add(info.velocity);
                info.position.x += Math.sin(now * 0.001 + i) * 0.002;
                info.position.z += Math.cos(now * 0.001 + i) * 0.002;

                if (info.position.y < -5) {
                    info.position.y = 15;
                    info.position.x = (Math.random() - 0.5) * 40;
                    info.position.z = (Math.random() - 0.5) * 40 - 15;
                }

                this.dummy.position.copy(info.position);
                this.dummy.rotateOnAxis(info.rotationAxis, info.rotationSpeed);
                this.dummy.updateMatrix();
                this.sakuraMesh.setMatrixAt(i, this.dummy.matrix);
            }
            this.sakuraMesh.instanceMatrix.needsUpdate = true;
        }

        if (this.fogMesh) {
            for (let i = 0; i < this.fogCount; i++) {
                const info = this.fogInfo[i];
                this.dummy.position.copy(info.position);
                this.dummy.rotation.x = -Math.PI / 2;
                this.dummy.rotation.z = info.rotationZ; 
                
                const time = now * 0.0002;
                this.dummy.position.x = info.position.x + Math.sin(time + i) * 0.2;
                this.dummy.position.z = info.position.z + Math.cos(time + i * 0.5) * 0.2;

                this.dummy.updateMatrix();
                this.fogMesh.setMatrixAt(i, this.dummy.matrix);
            }
            this.fogMesh.instanceMatrix.needsUpdate = true;
        }

        if (this.potSmokeMesh) {
            for (let i = 0; i < this.potSmokeCount; i++) {
                const info = this.potSmokeInfo[i];
                info.age++;
                if (info.age >= info.life) {
                    info.age = 0;
                    info.position.set(0, 0, 0);
                    info.velocity.set((Math.random() - 0.5) * 0.02, 0.01 + Math.random() * 0.02, (Math.random() - 0.5) * 0.02);
                }
                info.position.add(info.velocity);
                this.dummySmoke.position.copy(info.position);
                this.dummySmoke.lookAt(cameraPosition);
                this.dummySmoke.scale.setScalar(1 + (info.age / info.life) * 2);
                this.dummySmoke.updateMatrix();
                this.potSmokeMesh.setMatrixAt(i, this.dummySmoke.matrix);
            }
            this.potSmokeMesh.instanceMatrix.needsUpdate = true;
        }
    }

    dispose(scene: THREE.Scene) {
        if (this.sakuraMesh) {
            scene.remove(this.sakuraMesh);
            this.sakuraMesh.geometry.dispose();
            (this.sakuraMesh.material as THREE.Material).dispose();
            this.sakuraMesh = undefined;
        }

        if (this.fogMesh) {
            scene.remove(this.fogMesh);
            this.fogMesh.geometry.dispose();
            const fogMat = this.fogMesh.material as THREE.MeshBasicMaterial;
            fogMat.map?.dispose();
            fogMat.dispose();
            this.fogMesh = undefined;
        }

        if (this.potSmokeMesh) {
            scene.remove(this.potSmokeMesh);
            this.potSmokeMesh.geometry.dispose();
            const smokeMat = this.potSmokeMesh.material as THREE.MeshBasicMaterial;
            smokeMat.map?.dispose();
            smokeMat.dispose();
            this.potSmokeMesh = undefined;
        }

        this.fishList.forEach(({ mesh }) => {
            scene.remove(mesh);
            mesh.traverse(child => {
                const m = child as THREE.Mesh;
                if (m.isMesh) {
                    m.geometry?.dispose();
                    const mats = Array.isArray(m.material) ? m.material : [m.material];
                    mats.forEach(mat => mat?.dispose());
                }
            });
        });

        this.fishList = [];
        this.petalInfo = [];
        this.fogInfo = [];
        this.potSmokeInfo = [];
    }
}
