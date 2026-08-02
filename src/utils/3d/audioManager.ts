import { ref } from "vue";
import * as THREE from "three";

export function use3DAudio() {
    let sound: THREE.Audio | null = null;
    let wasPlayingBeforePause = false;
    const isMusicPlaying = ref(false);

    const initAudio = (camera: THREE.PerspectiveCamera, musicUrl: string) => {
        const listener = new THREE.AudioListener();
        camera.add(listener);

        sound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        
        audioLoader.load(musicUrl, (buffer) => {
            if (!sound) return;
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
        });
    };

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

    const pauseAudio = () => {
        wasPlayingBeforePause = !!(sound && sound.isPlaying);
        if (sound && sound.isPlaying) {
            sound.pause();
            isMusicPlaying.value = false;
        }
    };

    const resumeAudio = () => {
        if (sound && sound.buffer && !sound.isPlaying) {
            sound.play();
            isMusicPlaying.value = true;
        }
    };

    const resumeIfWasPlaying = () => {
        if (wasPlayingBeforePause) {
            resumeAudio();
        }
    };

    const playIfLoaded = () => {
        if (sound && sound.buffer && !sound.isPlaying) {
            sound.play();
            isMusicPlaying.value = true;
        }
    };

    const stopAudio = () => {
        if (sound && sound.isPlaying) {
            sound.stop();
        }
        isMusicPlaying.value = false;
    };

    return {
        isMusicPlaying,
        initAudio,
        toggleMusic,
        pauseAudio,
        resumeAudio,
        resumeIfWasPlaying,
        playIfLoaded,
        stopAudio
    };
}
