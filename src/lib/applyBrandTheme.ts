import site from '@/config/site.config'

/* Aplica as cores da marca definidas em site.config.ts (brand.theme) como CSS
   custom properties em runtime, sobrescrevendo os padrões de theme.css.
   Chamado uma vez em main.tsx, antes do render. */
export function applyBrandTheme(): void {
  const t = site.brand.theme
  if (!t) return
  const root = document.documentElement
  const map: Record<string, string | undefined> = {
    '--brand': t.brand,
    '--brand-strong': t.brandStrong,
    '--brand-ink': t.brandInk,
    '--accent': t.accent,
    '--accent-strong': t.accentStrong,
    '--accent-ink': t.accentInk,
  }
  for (const [prop, value] of Object.entries(map)) {
    if (value) root.style.setProperty(prop, value)
  }
}
