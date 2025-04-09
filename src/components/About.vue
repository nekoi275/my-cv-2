<script setup lang="ts">
import Teapot from '@/components/Teapot.vue'
</script>

<template>
  <section
    id="about"
    class="bg-purple-100 text-dark-50 min-[846px]:h-screen flex flex-wrap items-center justify-between max-[845px]:h-full max-[845px]:pt-24 min-[846px]:pt-0"
  >
    <!-- <img
      class="min-[846px]:h-screen min-[846px]:w-2/3 opacity-60 z-0 max-[845px]:w-full max-[845px]:h-full"
      src="../assets/top-section-photo.jpg"
    /> -->
    <ul class="min-[846px]:w-1/3 max-[845px]:w-full p-5 pl-9 leading-10 hidden">
      <li>
        <h3
          class="text-6xl bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent animate-change-color"
        >
          福
        </h3>
      </li>
      <li>Name: Drozdova Valeria</li>
      <li>Nickname: Nekoi</li>
      <li>
        <a href="https://github.com/nekoi275" target="_blank">Github</a>
      </li>
      <li>
        <a href="https://www.codewars.com/users/nekoi275" target="_blank"
          >Code Wars</a
        >
      </li>
      <li><a href="mailto:nekoi275@gmail.com">E-mail me</a></li>
      <li>
        <a
          href="https://docs.google.com/document/d/1xcALkYF9U2flC6naGoAQtBuERRoRbpLxqMtDjlvRV4g/edit?usp=sharing"
          target="_blank"
          >My CV</a
        >
      </li>
    </ul>
    <Teapot class="m-auto"></Teapot>
<!--     <div
      class="min-[846px]:block max-[845px]:hidden absolute inset-x-1/2 bottom-8 w-6 h-10 rounded-3xl border-2 border-green-50 z-10 before:absolute before:w-1 before:h-2 before:bg-green-50 before:left-2 before:top-2 before:animate-wheel translate-x-1/2"
    ></div> -->
  </section>
</template>

<style scoped></style>
