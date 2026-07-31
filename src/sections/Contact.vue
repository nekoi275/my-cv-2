<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import gsap from "gsap";
import ReturnButton from "@/components/ReturnButton.vue";
import KoiCanvas from "@/components/KoiCanvas.vue";

const emit = defineEmits<{ (e: 'back'): void }>();

const sectionRef = ref<HTMLElement | null>(null);
const headlineChars = ref<HTMLElement[]>([]);
const bodyLines = ref<HTMLElement[]>([]);
const linkItems = ref<HTMLElement[]>([]);
const signatureRef = ref<HTMLElement | null>(null);
const dividerRef = ref<HTMLElement | null>(null);

const headlineText = "Let's create something alive.";
const headlineWords = headlineText.split(" ");

const bodyParagraphs = [
  "I don't build websites — I paint digital spaces.",
  "Every project starts with a blank canvas and a deep dive into your world, your rhythm, your industry's unspoken rules.",
  "If you have a spark of an idea that doesn't fit into a template, don't feed it to a chatbot — send it straight to me.",
];

const links = [
  {
    label: "Download résumé",
    href: "https://docs.google.com/document/d/1xcALkYF9U2flC6naGoAQtBuERRoRbpLxqMtDjlvRV4g/export?format=pdf",
    icon: "pdf",
    external: true,
    download: true,
  },
  {
    label: "valeriiadrozdova90@gmail.com",
    href: "mailto:valeriiadrozdova90@gmail.com",
    icon: "mail",
    external: false,
    download: false,
  },
  {
    label: "Photo gallery",
    href: "https://www.pexels.com/ru-ru/@valeria-drozdova-2148646707/",
    icon: "camera",
    external: true,
    download: false,
  },
];

const addCharRef = (el: any) => {
  if (el && !headlineChars.value.includes(el)) {
    headlineChars.value.push(el);
  }
};

const addBodyRef = (el: any) => {
  if (el && !bodyLines.value.includes(el)) {
    bodyLines.value.push(el);
  }
};

const addLinkRef = (el: any) => {
  if (el && !linkItems.value.includes(el)) {
    linkItems.value.push(el);
  }
};

let ctx: gsap.Context | null = null;

const playEntrance = () => {
  if (!sectionRef.value) return;

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headlineChars.value.length) {
      tl.fromTo(
        headlineChars.value,
        { y: 40, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.02,
        },
        0
      );
    }

    if (dividerRef.value) {
      tl.fromTo(
        dividerRef.value,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.inOut" },
        0.5
      );
    }

    if (bodyLines.value.length) {
      tl.fromTo(
        bodyLines.value,
        { y: 20, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
        },
        0.7
      );
    }

    if (linkItems.value.length) {
      tl.fromTo(
        linkItems.value,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        1.2
      );
    }

    if (signatureRef.value) {
      tl.fromTo(
        signatureRef.value,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.6
      );
    }
  }, sectionRef.value);
};

onMounted(() => {
  nextTick(() => {
    playEntrance();
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div
    id="contact-section"
    ref="sectionRef"
    class="fixed inset-0 z-[999999] w-screen h-screen overflow-hidden flex items-center justify-center bg-[#e4cbce] px-4 py-10 sm:px-6 sm:py-14 box-border"
  >
    <ReturnButton @back="emit('back')" />
    <KoiCanvas />

    <div class="relative z-10 max-w-[680px] w-full flex flex-col justify-center">
      <h2 class="font-mono text-[clamp(1.4rem,3.5vw,2.6rem)] font-bold text-[#491212] leading-tight tracking-tight mb-4 [perspective:600px]">
        <span
          v-for="(word, wIndex) in headlineWords"
          :key="'w-' + wIndex"
          class="inline-block whitespace-nowrap"
        >
          <span
            v-for="(char, cIndex) in word.split('')"
            :key="'c-' + cIndex"
            :ref="addCharRef"
            class="inline-block opacity-0 will-change-transform"
          >{{ char }}</span>
          <span v-if="wIndex < headlineWords.length - 1" class="inline-block">&nbsp;</span>
        </span>
      </h2>

      <div
        ref="dividerRef"
        class="w-full h-[1px] bg-gradient-to-r from-transparent via-[#491212]/25 to-transparent mb-5 origin-left scale-x-0"
      ></div>

      <div class="mb-6">
        <p
          v-for="(paragraph, i) in bodyParagraphs"
          :key="'p-' + i"
          :ref="addBodyRef"
          class="font-mono text-[clamp(0.78rem,1.4vw,0.95rem)] text-[#491212] leading-relaxed mb-2.5 last:mb-0 opacity-0 will-change-transform"
        >
          {{ paragraph }}
        </p>
      </div>

      <nav class="flex flex-col mb-5" aria-label="Contact links">
        <a
          v-for="(link, i) in links"
          :key="'l-' + i"
          :ref="addLinkRef"
          :href="link.href"
          class="group relative flex items-center gap-3 py-2.5 text-[#491212] font-mono text-[clamp(0.75rem,1.3vw,0.9rem)] font-medium no-underline opacity-0 will-change-transform transition-colors duration-300 border-b border-[#491212]/10 first:border-t first:border-[#491212]/10"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
          :download="link.download ? '' : undefined"
        >
          <span
            class="absolute left-0 -bottom-[1px] w-full h-[1px] bg-[#491212] scale-x-0 origin-right transition-transform duration-400 [transition-timing-function:cubic-bezier(0.86,0,0.07,1)] group-hover:scale-x-100 group-hover:origin-left"
          ></span>

          <span class="shrink-0 w-[1.2em] h-[1.2em] transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
            <svg v-if="link.icon === 'pdf'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 18 15 15"/>
            </svg>
            <svg v-else-if="link.icon === 'mail'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <svg v-else-if="link.icon === 'camera'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </span>

          <span class="grow">{{ link.label }}</span>

          <span
            v-if="link.external"
            class="shrink-0 w-[0.9em] h-[0.9em] opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </span>
        </a>
      </nav>

      <div ref="signatureRef" class="font-mono text-[clamp(0.85rem,1.4vw,1rem)] text-[#491212] opacity-0 will-change-transform">
        <span class="opacity-50 mr-1">—</span> Valeria
      </div>
    </div>
  </div>
</template>
