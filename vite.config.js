import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const TYPES = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json'
}

function assetsPlugin() {
  const root = path.resolve('assets')
  return {
    name: 'mithai-assets',
    configureServer(server) {
      server.middlewares.use('/assets', (req, res, next) => {
        try {
          const rel = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '')
          const file = path.normalize(path.join(root, rel))
          if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next()
          res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          fs.createReadStream(file).pipe(res)
        } catch {
          next()
        }
      })
    },
    closeBundle() {
      fs.cpSync(root, path.resolve('dist/assets'), { recursive: true })
      for (const file of ['robots.txt', 'sitemap.xml', 'favicon.ico', 'manifest.webmanifest']) {
        const src = path.resolve(file)
        if (fs.existsSync(src)) fs.copyFileSync(src, path.resolve('dist', file))
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), assetsPlugin()],
  build: { outDir: 'dist' }
})
