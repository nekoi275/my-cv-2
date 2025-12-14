<template>
    <div class="mouse-scroll">
        <div class="mouse">
            <div class="wheel"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.mouse-scroll {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.mouse {
    width: 30px;
    height: 50px;
    border: 3px solid currentColor;
    border-radius: 15px;
    position: relative;
    display: flex;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.mouse:hover {
    opacity: 1;
}

.wheel {
    width: 4px;
    height: 10px;
    background-color: currentColor;
    border-radius: 2px;
    position: absolute;
    top: 8px;
    animation: scroll-animation 2s infinite;
}

@keyframes scroll-animation {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    50% {
        opacity: 0.5;
        transform: translateY(12px);
    }

    100% {
        opacity: 0;
        transform: translateY(12px);
    }
}

@media (max-width: 768px) {
    .mouse-scroll {
        display: none;
    }
}
</style>
