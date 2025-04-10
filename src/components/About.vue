<script setup lang="ts">
import Teapot from '@/components/Teapot.vue'
</script>

<template>
  <section
    id="about"
    class="bg-purple-100 text-dark-50 min-[846px]:h-screen flex flex-wrap items-center justify-between max-[845px]:h-full max-[845px]:pt-24 min-[846px]:pt-0"
  >
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
    <Teapot class="m-auto animate-pour-tea"></Teapot>
  </section>
</template>

<style scoped></style>
