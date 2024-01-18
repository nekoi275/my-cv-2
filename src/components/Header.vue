<script setup lang="ts">
const menuItems = ['About me', 'My CV', 'Projects']
</script>

<template>
  <header class="bg-green-50 flex items-center justify-end text-purple-50 p-6 font-black fixed top-0 left-0 right-0 z-10">
    <div class="max-w-36 cursor-pointer text-center absolute top-5 left-5">
      <h3 class="text-6xl bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent animate-change-color">福</h3>
    </div>
    <nav>
      <ul>
        <li class="inline-block m-3 cursor-pointer hover:text-purple-100" v-for="item in menuItems">{{ item }}</li>
      </ul>
    </nav>
    <button class="ml-2 bg-purple-50 text-purple-100 hover:bg-purple-100 hover:text-purple-50 p-2 rounded-3xl cursor-pointer font-light">Change theme</button>
  </header>
</template>

<style scoped>
</style>
