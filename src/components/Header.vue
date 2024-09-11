<script setup lang="ts">
const menuItems = [
  {
    scrollId: 'about',
    name: 'About me',
  },
  {
    scrollId: 'cv',
    name: 'My CV',
  },
  {
    scrollId: 'games',
    name: 'Games',
  },
  {
    scrollId: 'csspixels',
    name: 'CSS Pixels',
  },
  {
    scrollId: 'projects',
    name: 'Projects',
  },
];

function scrollTo(id: string) {
  document.getElementById(id)!.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <header
    class="bg-green-50 flex items-center justify-end text-purple-50 min-[846px]:p-6 min-[846px]:pr-6 max-[845px]:pr-5 font-black fixed top-0 left-0 right-0 z-10"
  >
    <div class="max-w-36 cursor-pointer text-center absolute top-5 left-5">
      <h3
        class="text-6xl bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent animate-change-color"
        @click="scrollTo('about')"
      >
        福
      </h3>
    </div>
    <nav>
      <ul>
        <li
          class="min-[846px]:inline-block min-[846px]:m-3 cursor-pointer hover:text-purple-100 max-[845px]:block max-[845px]:text-center"
          v-for="item in menuItems"
          @click="scrollTo(item.scrollId)"
        >
          {{ item.name }}
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped></style>
