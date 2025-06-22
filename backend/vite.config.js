import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(process.cwd(), 'src/server.js'),
      name: 'server',
      fileName: 'src/server',
      formats: ['es']
    },
    rollupOptions: {
      external: ['express', '@prisma/client', 'cors', 'dotenv']
    },
    target: 'node14'
  }
})