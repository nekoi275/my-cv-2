<script setup lang="ts">
export type SlideType = 'video' | 'links' | 'canvas';

export interface LinkItem {
  name: string;
  url: string;
  image?: string;
}

const props = withDefaults(defineProps<{
  title: string;
  description: string;
  type: SlideType;
  reversed?: boolean;
  videoUrl?: string;
  linkUrl?: string;
  imageUrl?: string;
  links?: LinkItem[];
  canvasComponent?: any;
}>(), {
  reversed: false,
  links: () => []
});
</script>

<template>
  <div 
    class="w-full h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-16 gap-8 md:gap-16"
    :class="{ 'md:flex-row-reverse': props.reversed }"
  >
    <div class="w-full md:w-1/2 flex flex-col justify-center space-y-4 max-w-xl">
      <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-dark,#491212)] font-mono">
        {{ props.title }}
      </h2>
      <p class="text-base md:text-lg leading-relaxed text-[var(--color-dark,#491212)] opacity-85">
        {{ props.description }}
      </p>
    </div>

    <div class="w-full md:w-1/2 flex items-center justify-center max-w-2xl">
      <template v-if="props.type === 'video' && props.videoUrl">
        <div class="w-full overflow-hidden bg-black/5 shadow-md">
          <video
            :src="props.videoUrl"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-auto max-h-[65vh] object-cover block pointer-events-none"
          ></video>
        </div>
      </template>

      <template v-else-if="props.type === 'links'">
        <a
          v-if="props.linkUrl || (props.links && props.links.length === 1)"
          :href="props.linkUrl || props.links[0]?.url"
          target="_blank"
          rel="noopener noreferrer"
          class="relative inline-block overflow-hidden group cursor-pointer max-h-[65vh]"
        >
          <img
            :src="props.imageUrl || props.links[0]?.image"
            :alt="props.title"
            class="max-w-full h-auto max-h-[65vh] block transition-all duration-300 group-hover:blur-sm"
          />
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span class="text-white mix-blend-difference font-mono text-base md:text-lg font-bold tracking-wider animate-pulse">
              open
            </span>
          </div>
        </a>

        <div v-else class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            v-for="(link, index) in props.links"
            :key="index"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 hover:bg-white transition-colors group"
          >
            <div v-if="link.image" class="w-full aspect-video mb-3 overflow-hidden">
              <img :src="link.image" :alt="link.name" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div class="font-mono font-bold text-sm text-[var(--color-dark,#491212)] flex items-center justify-between">
              <span>{{ link.name }}</span>
              <span class="text-xs opacity-60">↗</span>
            </div>
          </a>
        </div>
      </template>

      <template v-else-if="props.type === 'canvas'">
        <div class="w-full h-[50vh] overflow-hidden relative">
          <component :is="props.canvasComponent" v-if="props.canvasComponent" />
          <slot v-else name="canvas"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
