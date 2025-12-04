<script setup lang="ts">
interface projectInfo {
  href: string;
  img: any;
  text: string;
}
defineProps<{
  projectInfo: projectInfo;
}>();
</script>

<template>
  <a :href="projectInfo.href" target="_blank"
    class="bg-pink-light rounded-md mb-4 p-4 border-2 border-green-dark text-dark block text-center hover:border-green-light shadow-lg shadow-pink-light hover:shadow-green-light">
    <img class="mb-4" :src="projectInfo.img" alt="project screenshot" />
    {{ projectInfo.text }}
  </a>
</template>

<style scoped></style>
