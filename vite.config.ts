import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

/* Caminho base da aplicação.
   No GitHub Pages o site fica em  https://<usuario>.github.io/<repo>/  — ou seja,
   num subcaminho ("/Base-Corretor/"). O workflow de deploy define VITE_BASE
   automaticamente a partir do nome do repositório, então normalmente você não
   precisa mexer aqui.
   - Rodando local (dev): sempre "/".
   - Build sem VITE_BASE: cai no padrão abaixo (troque se renomear o repo).
   - Domínio próprio (CNAME): use base "/" — defina VITE_BASE=/ no deploy. */
const BASE = process.env.VITE_BASE ?? '/Base-Corretor/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
  },
}))
