import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this app from a /Excel_Study/ subpath; Vercel (and
  // other hosts) serve it from the domain root, so only pin the subpath
  // when building on GitHub Actions.
  base: process.env.GITHUB_ACTIONS ? '/Excel_Study/' : '/',
})