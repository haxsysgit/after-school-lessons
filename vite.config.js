import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/after-school-lessons/',   // IMPORTANT FOR GITHUB PAGES
  plugins: [vue()]
})
