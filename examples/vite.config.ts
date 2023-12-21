import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import postcssNesting from 'postcss-nesting';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': '/src',
      '@@': '/src/components',
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
})
