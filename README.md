# Base · Site para Corretor(a) de Imóveis

Base reutilizável de site imobiliário — **React + TypeScript + Vite, CSS puro** (CSS
Modules + variáveis CSS), **sem Tailwind** e **sem backend**. Feita para você
duplicar a pasta, trocar cores/textos/imagens e entregar um site pronto por
cliente.

- Site público **dark**, com foco em mostrar os imóveis: home editorial, listagem
  com filtros, página do imóvel com galeria em tela cheia, vídeo
  (YouTube/Vimeo/MP4), mapa, favoritos, contato via WhatsApp.
- **Área restrita (`/admin`)**: login, painel com CRUD de imóveis, upload de fotos
  (redimensionadas no navegador), vídeos por link, destaque/situação, prévia do
  cartão em tempo real, export/import de backup em JSON.
- Persistência: `localStorage` do navegador (semeado com 6 imóveis de exemplo).
  Ideal para demonstração. A camada de dados já está isolada para trocar por uma
  API real depois (ver o fim deste arquivo).

---

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
```

Outros comandos:

```bash
npm run build    # gera dist/ (checa tipos antes)
npm run preview  # serve o build de produção
npm run lint     # só a checagem de tipos (tsc)
```

Requer Node 18+.

### Acesso ao painel (demonstração)

- URL: `/admin`
- Usuário: `admin` · Senha: `imoveis2025`
- Troque em `src/config/site.config.ts` → `admin`.

> A autenticação é **local** (fica no `sessionStorage`). Serve para demo. Para
> produção de verdade, veja "Ligando um backend".

---

## Personalizar para um novo cliente

Na prática você mexe em **3 arquivos** (+ imagens):

### 1. `src/config/site.config.ts` — textos, contatos, seções

Nome, CRECI, telefone/WhatsApp, e-mail, endereço, redes sociais, textos do hero,
"sobre" (versão curta), serviços, regiões de atuação, CTA e **o login do painel**.

Campo `brand.theme` (opcional): sobrescreve as cores da marca em tempo de execução
sem tocar no CSS. Ex.:

```ts
theme: {
  brand: '#14324a',
  brandStrong: '#0e2537',
  accent: '#c99a3f',
}
```

### 2. `src/styles/theme.css` — cores, fontes, medidas

Site **dark-only**. Todas as variáveis da identidade visual ficam em `:root`. No
fim do arquivo há **presets prontos** ("Carvão & Cobre", "Azul Meia-Noite") —
basta descomentar um bloco.

Para trocar as **fontes**: altere o `<link>` do Google Fonts em `index.html` e os
valores de `--font-display` / `--font-sans` no `theme.css`.

### 3. `index.html` — título, descrição e imagem de compartilhamento

`<title>`, `<meta name="description">`, `<meta property="og:image">` e o
`<link>` das fontes.

### Imagens

- **Institucionais** (hero, retrato, regiões): URLs em `site.config.ts`. Hoje
  apontam para o Unsplash só como referência — troque pelas fotos reais.
- **Ícone / favicon**: `public/favicon.svg` e `public/og-image.svg`.
- **Imóveis**: cadastrados pelo painel (`/admin`). Os exemplos iniciais estão em
  `src/data/seedProperties.ts`.

### Checklist rápido por cliente

- [ ] `site.config.ts`: nome, CRECI, WhatsApp (só dígitos, com DDI), e-mail,
      endereço, redes, textos, **senha do painel**
- [ ] `theme.css`: `--brand`, `--accent` (ou um preset)
- [ ] `index.html`: title, description, og:image
- [ ] Trocar `favicon.svg` / `og-image.svg`
- [ ] Fotos institucionais (hero, retrato, regiões)
- [ ] Entrar em `/admin` e cadastrar os imóveis reais (ou importar um JSON)
- [ ] `npm run build` e publicar

---

## Estrutura

```
src/
  config/site.config.ts     # ← textos, contatos, login (personalizar)
  styles/theme.css           # ← cores, fontes, medidas (personalizar)
  styles/global.css          # reset + classes utilitárias
  data/seedProperties.ts     # imóveis de exemplo
  types/property.ts          # modelo de dados
  lib/
    store.ts                 # camada de dados (localStorage) + hooks React
    auth.tsx                 # login local do painel
    applyBrandTheme.ts       # aplica brand.theme do site.config em runtime
    favorites.tsx            # favoritos (localStorage)
    filters.ts               # lógica de filtro/ordenação da listagem
    image.ts                 # redimensiona/compacta fotos no navegador
    contact.ts               # links de WhatsApp / e-mail
    propertyView.ts          # helpers de exibição (embeds de vídeo etc.)
    format.ts, slugify.ts, hooks.ts, usePageMeta.ts
  components/
    layout/                  # Navbar, Footer, SiteLayout
    home/                    # Hero, seções da home
    property/                # PropertyCard, Gallery, Lightbox, Filters, Map…
    contact/ContactForm.tsx
    admin/                   # Field, TagInput, ImageManager, VideoManager
    ui/                      # SmartImage, Reveal, Modal
    icons.tsx                # ícones SVG inline (sem dependência)
  pages/
    HomePage, ListingsPage, PropertyDetailPage, AboutPage, ContactPage, NotFoundPage
    admin/                   # AdminLayout, LoginPage, DashboardPage,
                             # PropertyEditorPage, AdminConfigPage, RequireAuth
```

### Rotas

| Rota | Página |
| --- | --- |
| `/` | Home |
| `/imoveis` | Listagem + filtros (`?q=`, `?finalidade=`, `?tipo=`, `?dorms=`, `?ate=`, `?ordem=`, `?favoritos=1`) |
| `/imoveis/:slug` | Página do imóvel |
| `/sobre`, `/contato` | Institucionais |
| `/admin/login` | Login do painel |
| `/admin` | Painel (protegido) |
| `/admin/imoveis/novo`, `/admin/imoveis/:id` | Editor de imóvel |
| `/admin/config` | Backup e ajustes |

---

## Publicar (site estático)

Qualquer host de estáticos serve. Já vão inclusos os arquivos de fallback de SPA:

- **Netlify**: `public/_redirects`
- **Vercel**: `vercel.json`
- **Apache/Nginx/outros**: redirecione todas as rotas para `/index.html`.

```bash
npm run build      # saída em dist/
```

> Sem backend, os imóveis cadastrados vivem **apenas no navegador em que foram
> cadastrados**. Para uma demo, cadastre no mesmo navegador que vai gravar o vídeo,
> ou use **Ajustes → Exportar/Importar backup** para levar os dados de uma máquina
> para outra.

---

## Ligando um backend de verdade (quando o cliente fechar)

A UI **não precisa mudar**. Toda a leitura/escrita passa por
`PropertyRepository` em `src/lib/store.ts`:

1. Implemente uma nova classe `ApiPropertyRepository` com os mesmos métodos
   (`list`, `getBySlug`, `getById`, `create`, `update`, `remove`, …) chamando o
   seu endpoint (`fetch('/api/properties')`, etc.).
2. Troque a linha `export const repo = localRepo` para apontar para a nova
   implementação.
3. Troque o `login` em `src/lib/auth.tsx` por uma chamada real (ex.:
   `POST /api/login` devolvendo um cookie httpOnly / JWT) e ajuste `RequireAuth`.
4. Uploads de imagem: em vez de `data:` URL (base64), envie o arquivo para o seu
   storage e guarde a URL retornada (`ImageManager` já aceita URL).

Sugestão de stack (comentada no `.env.example`): Node + Vite no front, um servidor
leve (Hono/Express) no Render e **Turso/libSQL** para o banco.
# Base-Corretor
