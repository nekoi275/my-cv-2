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
    <!-- Text Column -->
    <div class="w-full md:w-1/2 flex flex-col justify-center space-y-4 max-w-xl">
      <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-dark,#491212)] font-mono">
        {{ props.title }}
      </h2>
      <p class="text-base md:text-lg leading-relaxed text-[var(--color-dark,#491212)] opacity-85">
        {{ props.description }}
      </p>
    </div>

    <div class="w-full md:w-1/2 flex items-center justify-center max-w-2xl">
      <template v-if="props.type === 'video' && props.videoUrl">
        <div class="w-full overflow-hidden border-2 border-[var(--color-dark,#491212)] bg-black/5 shadow-md">
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
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            v-for="(link, index) in props.links"
            :key="index"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 border-2 border-[var(--color-dark,#491212)] bg-white/70 hover:bg-white transition-colors group"
          >
            <div v-if="link.image" class="w-full aspect-video mb-3 overflow-hidden border border-[var(--color-dark,#491212)]/20">
              <img :src="link.image" :alt="link.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div class="font-mono font-bold text-sm text-[var(--color-dark,#491212)] flex items-center justify-between">
              <span>{{ link.name }}</span>
              <span class="text-xs opacity-60">↗</span>
            </div>
          </a>
        </div>
      </template>

      <template v-else-if="props.type === 'canvas'">
        <div class="w-full h-[50vh] border-2 border-[var(--color-dark,#491212)] overflow-hidden relative">
          <component :is="props.canvasComponent" v-if="props.canvasComponent" />
          <slot v-else name="canvas"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
