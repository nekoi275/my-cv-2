<script setup lang="ts">
import Flipcard from "@/components/FlipCard.vue";
import type { cardInfo } from "@/components/FlipCard.vue";

const cards: cardInfo[] = [
  {
    heading: "My CV",
    data: "Check out my CV — I’m eager to learn, grow, and contribute to your team with fresh ideas and enthusiasm.",
    links: [
      {
        name: "Google doc CV",
        url: "https://docs.google.com/document/d/1xcALkYF9U2flC6naGoAQtBuERRoRbpLxqMtDjlvRV4g/edit?tab=t.0#heading=h.m96rc670hd9p",
      },
    ],
  },
  {
    heading: "My drawings",
    data: "Soft strokes, serene colors—where cats nap, birds perch, and flowers sway in quiet harmony. A touch of Zen in every sketch.",
    links: [
      { name: "DeviantArt", url: "https://www.deviantart.com/nekoi275" },
      { name: "Doodle Addicts", url: "https://www.doodleaddicts.com/nekoi" },
      { name: "Pixiv", url: "https://www.pixiv.net/en/users/114240685" },
    ]
  },
  {
    heading: "My photography",
    data: "Need high-quality, free photos? Browse my gallery and download stunning shots which may becomes great visuals for your projects!",
    links: [
      {
        name: "Pexels",
        url: "https://www.pexels.com/ru-ru/@2148646707/gallery",
      },
    ]
  }
];
</script>

<template>
  <section id="facts" class="bg-pink-light flex flex-wrap items-center justify-around h-full p-6">
    <Flipcard v-for="card in cards" :cardInfo="card" :key="card.heading" class="mb-4"></Flipcard>
  </section>
</template>
