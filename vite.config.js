import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  base: '/vue-coursework-frontend/', // IMPORTANT: set base path for GitHub Pages deployment
  plugins: [vue()],
})
