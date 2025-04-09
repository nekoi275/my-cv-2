<script setup lang="ts">
import Project from "@/components/Project.vue";

const projects = [
  {
    href: "https://nekoi275.github.io/aframe-test/",
    img: "../assets/project_1.webp",
    text: "Web VR website based on Aframe framework.",
  },
  {
    href: "https://nekoi275.github.io/nice-shop-layout/#",
    img: "../assets/project_2.webp",
    text: "E-commerce website layout sample.",
  },
  {
    href: "https://wardrobe.pages.dev/clothes",
    img: "../assets/project_3.webp",
    text: "Personal wardrobe manager app with ability to add/edit/delete your clothes and accessories with photos and descriptions. Made with Vite - Vue (Composition API) - TS. Test user credentials: test / test12345.",
  },
  {
    href: "https://telegram-schedule.pages.dev/login",
    img: "../assets/project_4.webp",
    text: "Telegram posts scheduler for AI generated images public group. Allows to set / edit / preview posts before posting into Telegram. Made with Vite - Vue (Composition API) - TS.",
  },
  {
    href: "https://t.me/ai_inspire_test_bot",
    img: "../assets/project_5.webp",
    text: "Telegram bot help and description webapp. Made with Vite - Vue (Composition API) - TS.",
  },
];
</script>

<template>
  <section id="projects" class="bg-purple-100 pb-14 pt-32">
    <div
      class="masonry sm:masonry-sm md:masonry-md min-[846px]:pl-24 min-[846px]:pr-24 max-[845px]:pl-5 max-[845px]:pr-5"
    >
      <Project
        class="p-4 break-inside"
        v-for="project in projects"
        :projectInfo="project"
        :key="project.href"
      ></Project>
      <div class="p-4 mt-4 border-2 border-purple-50 text-white-50 block text-center shadow-lg shadow-purple-50 h-64 break-inside">
        <p class="mb-5">
          Pixel art drawn purely with CSS: 1px x 1px div + box-shadow property.
        </p>
        <div class="pixel-art ml-28"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#projects {
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
.pixel-art {
  width: 1px;
  height: 1px;
  transform: scale(8);
  box-shadow: 4px 0 var(--p1), 5px 0 var(--p1), 6px 0 var(--p1), 17px 0 var(--g1),
  3px 1px var(--p1), 4px 1px var(--p1), 5px 1px var(--p1), 6px 1px var(--p3), 7px 1px var(--p2), 11px 1px var(--g1), 12px 1px var(--g1), 16px 1px var(--g1), 17px 1px var(--g1),
  2px 2px var(--p1), 3px 2px var(--p1), 4px 2px var(--p2), 5px 2px var(--p3), 6px 2px var(--p2), 7px 2px var(--p1), 8px 2px var(--p2), 10px 2px var(--g1), 11px 2px var(--g2), 12px 2px var(--g1), 13px 2px var(--g1), 15px 2px var(--g1), 16px 2px var(--g1), 17px 2px var(--g1),
  2px 3px var(--p1), 3px 3px var(--p2), 4px 3px var(--p2), 5px 3px var(--p3), 6px 3px var(--p3), 7px 3px var(--p1), 8px 3px var(--p2), 8px 3px var(--p2), 9px 3px var(--g3), 11px 3px var(--g2), 12px 3px var(--g2), 13px 3px var(--g1), 15px 3px var(--g1), 16px 3px var(--g2), 17px 3px var(--g1),
  2px 4px var(--p1), 3px 4px var(--p4), 4px 4px var(--p2), 5px 4px var(--p2), 6px 4px var(--p3), 7px 4px var(--p2), 8px 4px var(--p2), 9px 4px var(--g3), 11px 4px var(--g1), 12px 4px var(--g2), 13px 4px var(--g2), 15px 4px var(--g2), 16px 4px var(--g2),
  3px 5px var(--g1), 4px 5px var(--p4), 5px 5px var(--p2), 6px 5px var(--p3), 7px 5px var(--p2), 8px 5px var(--p2), 9px 5px var(--g3), 12px 5px var(--g1), 13px 5px var(--g2), 14px 5px var(--g3), 17px 5px var(--g2), 18px 5px var(--g2), 19px 5px var(--g2), 20px 5px var(--g2),
  3px 6px var(--g1), 4px 6px var(--p4), 5px 6px var(--p4), 6px 6px var(--p2), 7px 6px var(--g1), 8px 6px var(--p2), 9px 6px var(--g3), 10px 6px var(--g2), 12px 6px var(--g2), 13px 6px var(--g3), 14px 6px var(--g2), 15px 6px var(--g2), 16px 6px var(--g2), 17px 6px var(--g2), 18px 6px var(--g2), 19px 6px var(--g1),
  4px 7px var(--g1), 5px 7px var(--p4), 6px 7px var(--p4), 7px 7px var(--g1), 8px 7px var(--g3), 9px 7px var(--g3), 10px 7px var(--g2), 13px 7px var(--g3), 15px 7px var(--g2), 16px 7px var(--g1), 17px 7px var(--g1), 18px 7px var(--g1),
  5px 8px var(--g1), 6px 8px var(--p4), 7px 8px var(--g1), 8px 8px var(--g2), 9px 8px var(--g2), 10px 8px var(--g3), 12px 8px var(--g3), 14px 8px var(--b1), 15px 8px var(--b1),
  6px 9px var(--g1), 7px 9px var(--g1), 8px 9px var(--g1), 9px 9px var(--g2), 11px 9px var(--g3), 13px 9px var(--b1), 14px 9px var(--b2), 15px 9px var(--b1), 16px 9px var(--b1),
  2px 10px var(--p3), 3px 10px var(--p4), 4px 10px var(--p4), 7px 10px var(--g1), 8px 10px var(--g1), 9px 10px var(--g1), 10px 10px var(--b1), 11px 10px var(--b1), 13px 10px var(--b1), 14px 10px var(--b2), 15px 10px var(--b2), 16px 10px var(--b1), 18px 10px var(--b1), 19px 10px var(--b1),
  1px 11px var(--p1), 2px 11px var(--p2), 3px 11px var(--p3), 4px 11px var(--p4), 5px 11px var(--p4), 6px 11px var(--g1), 8px 11px var(--g1), 9px 11px var(--b1), 10px 11px var(--b2), 11px 11px var(--b2), 12px 11px var(--b1), 13px 11px var(--b2), 14px 11px var(--b2), 15px 11px var(--b2), 16px 11px var(--b4), 17px 11px var(--b1), 18px 11px var(--b4), 19px 11px var(--b4), 20px 11px var(--b1),
  1px 12px var(--p1), 2px 12px var(--p2), 3px 12px var(--p3), 4px 12px var(--g1), 5px 12px var(--g1), 6px 12px var(--g3), 7px 12px var(--g3), 8px 12px var(--g3), 9px 12px var(--b1), 10px 12px var(--b1), 11px 12px var(--b2), 12px 12px var(--b2), 13px 12px var(--b2), 14px 12px var(--b4), 15px 12px var(--b3), 16px 12px var(--b3), 17px 12px var(--b3), 18px 12px var(--b5), 19px 12px var(--b5), 20px 12px var(--b4),
  1px 13px var(--p1), 2px 13px var(--p1), 3px 13px var(--p2), 4px 13px var(--p2), 5px 13px var(--g3), 6px 13px var(--g3), 7px 13px var(--g3), 8px 13px var(--g3), 9px 13px var(--g3), 10px 13px var(--b1), 11px 13px var(--b1), 12px 13px var(--b2), 13px 13px var(--b3), 14px 13px var(--y1), 15px 13px var(--y3), 16px 13px var(--b5), 17px 13px var(--b5), 18px 13px var(--b5), 19px 13px var(--b4), 20px 13px var(--b4),
  2px 14px var(--p1), 3px 14px var(--p1), 4px 14px var(--p1), 5px 14px var(--p1), 8px 14px var(--g3), 9px 14px var(--g2), 10px 14px var(--g2), 11px 14px var(--b1), 12px 14px var(--b1), 13px 14px var(--b3), 14px 14px var(--y2), 15px 14px var(--b3), 16px 14px var(--b3), 17px 14px var(--b4), 18px 14px var(--b4), 19px 14px var(--b4),
  7px 15px var(--g3), 8px 15px var(--g1), 9px 15px var(--g2), 12px 15px var(--b5), 13px 15px var(--b3), 14px 15px var(--b4), 15px 15px var(--b3), 16px 15px var(--b3), 17px 15px var(--b5),
  4px 16px var(--g1), 5px 16px var(--g1), 6px 16px var(--g1), 7px 16px var(--g3), 8px 16px var(--g1), 11px 16px var(--b4), 12px 16px var(--b5), 13px 16px var(--b3), 14px 16px var(--b4), 15px 16px var(--b3), 16px 16px var(--b3), 17px 16px var(--b3), 18px 16px var(--b5),
  3px 17px var(--g1), 4px 17px var(--g1), 6px 17px var(--g3), 7px 17px var(--g1), 8px 17px var(--g1), 10px 17px var(--b4), 11px 17px var(--b4), 12px 17px var(--b5), 13px 17px var(--b5), 14px 17px var(--b2), 15px 17px var(--b3), 16px 17px var(--b3), 17px 17px var(--b5), 18px 17px var(--b5),
  2px 18px var(--g1), 3px 18px var(--g1), 4px 18px var(--g1), 6px 18px var(--g3), 7px 18px var(--g1), 10px 18px var(--b4), 11px 18px var(--b4), 12px 18px var(--b5), 13px 18px var(--b4), 14px 18px var(--b2), 15px 18px var(--b4), 16px 18px var(--b5), 17px 18px var(--b5), 18px 18px var(--b5),
  2px 19px var(--g1), 3px 19px var(--g1), 7px 19px var(--g1), 11px 19px var(--b4), 12px 19px var(--b4), 15px 19px var(--b4), 16px 19px var(--b4), 17px 19px var(--b4)
}
</style>
