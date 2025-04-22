<script setup lang="ts">
import Teapot from "@/components/Teapot.vue";
</script>

<template>
  <section
    id="about"
    class="bg-purple-100 text-dark-50 h-screen relative overflow-hidden"
  >
    <Teapot
      class="absolute animate-move-teapot max-[480px]:top-0% min-[768px]:top-[30%] left-[33%] z-20"
    ></Teapot>
<!--     <div
      id="tea-pouring"
      class="absolute rounded-full bg-green-100 left-[46%] z-0 h-[100%] opacity-1 w-[3%] min-[1920px]:top-[-0.87vh] min-[1680px]:top-[8.1vh] min-[1600px]:top-[11.1vh] min-[1536px]:top-[11.2vh] min-[1520px]:top-[11.2vh] min-[1440px]:top-[12.3vh] min-[1366px]:top-[12vh] min-[1280px]:top-[12vh]"
    ></div> -->
    <div
      id="tea-pouring"
      class="absolute rounded-full bg-green-100 left-[46%] min-[1920px]:top-[-0.87vh] min-[1680px]:top-[8.1vh] min-[1600px]:top-[11.1vh] min-[1536px]:top-[11.2vh] min-[1520px]:top-[11.2vh] min-[1440px]:top-[12.3vh] min-[1366px]:top-[12vh] min-[1280px]:top-[12vh] z-0 animate-pour"
    ></div>
    <div
      id="tea-poured"
      class="absolute bg-green-100 left-0 right-0 bottom-0 z-0 animate-grow"
    ></div>
    <p
      class="block absolute min-[1280px]:p-3 min-[1300px]:p-6 p-6 z-10 animate-grow-text"
    >
      <span class="inline-block opacity-0 animate-words1"
        >Hi,<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >I’m<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >Valeria<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >(a.k.a Nekoi),<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >a junior<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >front-end<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >developer<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >with a passion<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >for crafting<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >interactive and<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >visually<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1"
        >appealing<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words1">websites.</span>
      <br />
      <span class="inline-block opacity-0 animate-words2"
        >I love<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2"
        >experimenting with<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2"
        >creative<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2"
        >effects and<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2"
        >animations<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2"
        >to bring<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2"
        >designs<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words2">to life.</span>
      <br />
      <span class="inline-block opacity-0 animate-words3"
        >When<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >I’m not<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >coding,<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >you’ll<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >find me<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >drawing or<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >capturing<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >moments<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >through<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >photography —<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >two hobbies<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >that fuel<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >my creativity<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3"
        >and attention<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words3">to detail.</span>
      <br />
      <span class="inline-block opacity-0 animate-words4"
        >I enjoy<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >blending<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >technical<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >skills with<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >artistic<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >expression<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >to build<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >unique<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4"
        >digital<span>&nbsp;</span></span
      >
      <span class="inline-block opacity-0 animate-words4">experiences.</span>
    </p>
  </section>
</template>

<style scoped></style>
