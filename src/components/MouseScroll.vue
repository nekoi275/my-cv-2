<template>
    <div class="mouse-scroll flex justify-center items-center p-5 max-md:hidden">
        <div class="mouse">
            <div class="wheel"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
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
</style>
