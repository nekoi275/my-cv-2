import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css-plugin',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        let modifiedHtml = html;
        for (const [fileName, file] of Object.entries(ctx.bundle)) {
          if (fileName.endsWith('.css') && file.type === 'asset' && typeof file.source === 'string') {
            if (fileName.includes('index')) {
              const cssContent = file.source;
              const linkRegex = new RegExp(`<link[^>]*href="[^"]*${fileName}"[^>]*>`, 'g');
              if (modifiedHtml.match(linkRegex)) {
                modifiedHtml = modifiedHtml.replace(linkRegex, `<style>${cssContent}</style>`);
                delete ctx.bundle[fileName];
              }
            }
          }
        }
        return modifiedHtml;
      }
    }
  };
}

export default defineConfig({
  plugins: [vue(), inlineCssPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  },
  assetsInclude: [
    '**/*glb'
  ],
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    sourcemap: true,
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  }
})
