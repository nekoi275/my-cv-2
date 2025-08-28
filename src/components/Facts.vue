<script setup lang="ts">
import Flipcard from "@/components/FlipCard.vue";
import type { cardInfo } from "@/components/FlipCard.vue";
import factCv from "@/assets/fact_cv.gif";
import factDrawings from "@/assets/fact_drawings.webp";
import factPhotos from "@/assets/fact_photos.webp";
import factNFT from "@/assets/fact_nft.webp";

const cards: cardInfo[] = [
  {
    heading: "My CV",
    data: "Exploring the world of code with passion! Check out my CV — I’m eager to learn, grow, and contribute to your team with fresh ideas and enthusiasm.",
    links: [
      {
        name: "Google doc CV",
        url: "https://docs.google.com/document/d/1xcALkYF9U2flC6naGoAQtBuERRoRbpLxqMtDjlvRV4g/edit?tab=t.0#heading=h.m96rc670hd9p",
      },
    ],
    img: factCv,
  },
  {
    heading: "My drawings",
    data: "Soft strokes, serene colors—where cats nap, birds perch, and flowers sway in quiet harmony. A touch of Zen in every sketch.",
    links: [
      { name: "DeviantArt", url: "https://www.deviantart.com/nekoi275" },
      { name: "Doodle Addicts", url: "https://www.doodleaddicts.com/nekoi" },
      { name: "Pixiv", url: "https://www.pixiv.net/en/users/114240685" },
    ],
    img: factDrawings,
  },
  {
    heading: "My photography",
    data: "Need high-quality, free photos? Browse my gallery and download stunning shots which may becomes great visuals for your projects!",
    links: [
      {
        name: "Pexels",
        url: "https://www.pexels.com/ru-ru/@2148646707/gallery",
      },
    ],
    img: factPhotos,
  },
  {
    heading: "My NFT collection",
    data: "Sweet, vibrant, and full of whimsy! Meet my Fruit Animals—a playful fusion of juicy fruits and adorable creatures.",
    links: [
      {
        name: "OpenSea",
        url: "https://opensea.io/collection/fruit-animals-2",
      },
    ],
    img: factNFT,
  },
  {
    heading:
      "Pixel art drawn purely with CSS: 1px x 1px div + box-shadow property.",
    isPixelArt: true,
  },
  {
    heading: "Contact me",
    data: "I'm currently looking for my next job or project, and I welcome any messages specifically about that. Feel free to get in touch if you have something in mind.",
    links: [
      { name: "E-mail", url: "mailto:valeriiadrozdova90@gmail.com" },
      { name: "Linkedin", url: "https://www.linkedin.com/in/valeriia-drozdova-81761a380" },
      { name: "Telegram", url: "https://t.me/nekoi275" },
    ],
    isEnvelope: true,
  }
];
</script>

<template>
  <section
    id="facts"
    class="bg-purple-50 flex flex-wrap items-center justify-around h-full p-6"
  >
    <Flipcard
      v-for="card in cards"
      :cardInfo="card"
      :key="card.heading"
      class="mb-4"
    ></Flipcard>
  </section>
</template>

<style scoped>
#facts {
  --p1: #d53259;
  --p2: #f84f7d;
  --p3: #fd7fa8;
  --p4: #f9c0d3;
  --g1: #86b455;
  --g2: #597b2c;
  --g3: #4b5d23;
  --b1: #a1c3e0;
  --b2: #cad5e6;
  --b3: #35395c;
  --b4: #6e8db1;
  --b5: #4a6490;
  --y1: #f1ce32;
  --y2: #e2b844;
  --y3: #c8862e;
}
</style>
