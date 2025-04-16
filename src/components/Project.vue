<script setup lang="ts">
interface projectInfo {
  href: string;
  img: string;
  text: string;
}
defineProps<{
  projectInfo: projectInfo;
}>();

function getImageUrl(img: string) {
  return String(new URL(img, import.meta.url));
}
</script>

<template>
  <a
    :href="projectInfo.href"
    target="_blank"
    class="bg-purple-50 rounded-md m-10 p-4 border-2 border-green-100 text-dark-50 block text-center hover:border-green-50 shadow-lg shadow-purple-50 hover:shadow-green-50"
  >
    <img
      class="mb-4"
      :src="getImageUrl(projectInfo.img)"
      alt="project screenshot"
    />
    {{ projectInfo.text }}
  </a>
</template>

<style scoped></style>
