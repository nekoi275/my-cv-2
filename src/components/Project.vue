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
  <a
    :href="projectInfo.href"
    target="_blank"
    class="bg-purple-50 rounded-md mb-4 p-4 border-2 border-green-100 text-dark-50 block text-center hover:border-green-50 shadow-lg shadow-purple-50 hover:shadow-green-50"
  >
    <img
      class="mb-4"
      :src="projectInfo.img"
      alt="project screenshot"
    />
    {{ projectInfo.text }}
  </a>
</template>

<style scoped></style>
