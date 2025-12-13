<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import gsap from "gsap";
import Teapot from "@/components/Teapot.vue";
import MouseScroll from "@/components/MouseScroll.vue";

const sectionRef = ref<HTMLElement | null>(null);
const teapotRef = ref<HTMLElement | null>(null);
const pourRef = ref<HTMLElement | null>(null);
const words1Ref = ref<HTMLElement[]>([]);
const words2Ref = ref<HTMLElement[]>([]);
const words3Ref = ref<HTMLElement[]>([]);
const words4Ref = ref<HTMLElement[]>([]);

const addToRefs = (el: any, arr: HTMLElement[]) => {
  if (el && !arr.includes(el)) {
    arr.push(el);
  }
};

let ctx: gsap.Context;

onMounted(() => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
    });

    tl.to(teapotRef.value, {
      rotation: -50,
      duration: 3,
    }, 0);

    const pourTl = gsap.timeline();
    pourTl
      .to(pourRef.value, { height: "100%", width: "2%", duration: 1, ease: "linear" })
      .to(pourRef.value, { width: "3%", duration: 0.6, ease: "linear" })
      .to(pourRef.value, { width: "3%", duration: 0.8, ease: "linear" })
      .to(pourRef.value, { width: "2%", duration: 0.6, ease: "linear" })
      .to(pourRef.value, { width: "0%", duration: 1, ease: "linear" });

    tl.add(pourTl, 2.5);

    const wordGroups = [words1Ref, words2Ref, words3Ref, words4Ref];

    wordGroups.forEach((group, index) => {
      tl.fromTo(group.value,
        {
          y: 50,
          scale: 0.8,
          opacity: 0,
          filter: "blur(10px)"
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          stagger: 0.05,
          ease: "power2.out"
        },
        6.5 + (index * 0.8)
      );
    });

    tl.to(sectionRef.value, {
      y: "-90vh",
      duration: 4,
      ease: "power1.out"
    }, 4);

  }, sectionRef.value!);
});

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
  <section id="teapot-section" ref="sectionRef" class="bg-pink-dark pt-20 relative text-dark h-2screen overflow-hidden">
    <div ref="teapotRef" class="relative left-1/2 z-20 will-change-transform origin-center inline-block">
      <Teapot />
    </div>

    <div id="tea-pouring" ref="pourRef" class="rounded-full bg-green-dark relative m-auto z-0 w-0 h-0"></div>

    <div id="tea-poured" class="absolute bg-green-dark left-0 right-0 bottom-0 h-[70vh] p-6 z-0">
      <p ref="textContainerRef" class="block z-10 will-change-transform transform-gpu origin-top-left">
        <span
          v-for="(text, index) in ['Hi,', 'I’m', 'Valeria', '(a.k.a Nekoi),', 'a web-developer', 'with a passion', 'for crafting', 'interactive and', 'visually', 'appealing', 'websites.']"
          :key="'w1-' + index" :ref="(el: any) => addToRefs(el, words1Ref)"
          class="inline-block opacity-0 will-change-transform transform-gpu mr-1">{{ text }}</span>

        <br />

        <span
          v-for="(text, index) in ['I enjoy', 'blending', 'technical', 'skills with', 'artistic', 'expression', 'to build', 'unique', 'digital', 'experiences.']"
          :key="'w2-' + index" :ref="(el: any) => addToRefs(el, words2Ref)"
          class="inline-block opacity-0 will-change-transform transform-gpu mr-1">{{ text }}</span>

        <br />

        <span
          v-for="(text, index) in ['When', 'I’m not', 'coding,', 'you’ll', 'find me', 'drawing or', 'capturing', 'moments', 'through', 'photography —', 'two hobbies', 'that fuel', 'my creativity.']"
          :key="'w3-' + index" :ref="(el: any) => addToRefs(el, words3Ref)"
          class="inline-block opacity-0 will-change-transform transform-gpu mr-1">{{ text }}</span>
      </p>
      <MouseScroll class="absolute bottom-12 right-1/2 translate-x-1/2" />
    </div>
  </section>
</template>
