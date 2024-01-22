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
  return String(new URL(img, import.meta.url)) 
}
</script>

<template>
  <div class="w-1/3 h-max">
    <a
      :href="projectInfo.href"
      target="_blank"
      class="p-4 border-2 border-purple-50 text-white-50 block text-center hover:border-green-100"
    >
      <img class="mb-4"
        :src="getImageUrl(projectInfo.img)"
        alt="project screenshot"
      />
      {{ projectInfo.text }}
    </a>
  </div>
</template>

<style scoped></style>
