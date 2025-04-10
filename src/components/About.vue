<script setup lang="ts">
import Teapot from "@/components/Teapot.vue";
</script>

<template>
  <section
    id="about"
    class="bg-purple-100 text-dark-50 min-[846px]:h-screen text-center"
  >
    <Teapot
      class="absolute animate-move-teapot top-[30%] left-[30%] z-20"
    ></Teapot>
    <div
      id="tea-pouring"
      class="absolute rounded-full bg-green-100 w-24 left-[43%] top-[10px] z-20 animate-pour"
    ></div>
    <p class="block w-2/5 text-xl m-auto z-10 relative hidden">
      <span>Hi,</span>
      <span> I’m</span>
      <span> Valeria</span>
      <span> (a.k.a</span>
      <span> Nekoi),</span>
      <span> a</span>
      <span> junior</span>
      <span> front-end</span>
      <span> developer</span>
      <span> with</span>
      <span> a</span>
      <span> passion</span>
      <span> for</span>
      <span> crafting</span>
      <span> interactive</span>
      <span> and</span>
      <span> visually</span>
      <span> appealing</span>
      <span> websites.</span>
      <br />
      <span>I</span>
      <span> love</span>
      <span> experimenting</span>
      <span> with</span>
      <span> creative</span>
      <span> effects</span>
      <span> and</span>
      <span> animations</span>
      <span> to</span>
      <span> bring</span>
      <span> designs</span>
      <span> to</span>
      <span> life.</span>
      <br />
      <span>When</span>
      <span> I’m</span>
      <span> not</span>
      <span> coding,</span>
      <span> you’ll</span>
      <span> find</span>
      <span> me</span>
      <span> drawing</span>
      <span> or</span>
      <span> capturing</span>
      <span> moments</span>
      <span> through</span>
      <span> photography—</span>
      <span> two</span>
      <span> hobbies</span>
      <span> that</span>
      <span> fuel</span>
      <span> my</span>
      <span> creativity</span>
      <span> and</span>
      <span> attention</span>
      <span> to</span>
      <span> detail.</span>
      <br />
      <span>I</span>
      <span> enjoy</span>
      <span> blending</span>
      <span> technical</span>
      <span> skills</span>
      <span> with</span>
      <span> artistic</span>
      <span> expression</span>
      <span> to</span>
      <span> build</span>
      <span> unique</span>
      <span> digital</span>
      <span> experiences.</span>
    </p>
    <div
      id="tea-poured"
      class="absolute bg-green-50 left-0 right-0 bottom-0 z-0 animate-grow"
    ></div>
  </section>
</template>

<style scoped></style>
