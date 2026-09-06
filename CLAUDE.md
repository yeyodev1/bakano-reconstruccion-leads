# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
pnpm dev          # Vite dev server (5173, cae a 5174 si está ocupado)
pnpm type-check   # vue-tsc --build (solo chequeo)
pnpm build        # type-check + vite build en paralelo (run-p)
pnpm preview      # sirve el build
pnpm format       # prettier --write src/
```

No hay test runner, ESLint ni CI en este repo. `pnpm type-check` es la única compuerta de calidad — córrelo antes de dar por terminado un cambio.

## Qué es este repo

Landing de captación de leads de **Bakano** (agencia de performance marketing, Guayaquil).

**Contexto vigente:** a Bakano le robaron los equipos de la oficina (sep 2026). La landing raíz (`/`) es la campaña de reconstrucción: vende páginas web a precio rebajado y capta leads. **No hay VSL en el flujo principal** — el funnel VSL viejo sigue en el repo pero movido a `/registro-vsl-tr`.

Los datos de la campaña vienen de los reels de @bakano.ec y no deben inventarse ni inflarse:

| Dato | Valor |
|---|---|
| Cupos | 30, solo este mes |
| Página Web Pro | $400 — SEO para Google + **GEO** (ChatGPT, Gemini y otros LLM) |
| Tienda Online Completa | $500 — pasarela **PayPhone** integrada |
| Precio normal | "$2,000 a $4,000" |

La transcripción real de los tres reels está en `docs/transcripciones-reels.md`; el porqué de cada
decisión de copy, en `docs/CONTEXTO.md`. **Léelos antes de tocar el mensaje.**

No nombres ni insinúes quién cometió el robo, y no traslades a la landing el detalle morboso del
reel 2 (trabajadoras sexuales, escopolamina): identifica a un excolaborador real y es exposición
legal. La copy se queda en la traición, no en el shock.

## Arquitectura

Vue 3 + Vite 7 + TS, SCSS, `vue-router`. Sin Pinia en la landing nueva (el funnel viejo sí usa un store).

**Rutas** (`src/router/index.ts`) — dos flujos independientes conviviendo:

- `/` → `ReconstruccionView.vue` — **la landing activa**. Página única: hero → historia → planes → portafolio → formulario. Sin guards, sin pasos.
- `/registro-vsl-tr` → funnel VSL legado: `FunnelView` → `/ver-video` → `/agendar` → `/cita-confirmada`, con `/sin-espacio` como rama de descalificación y `/calificar` como página suelta.
- `/politicas-privacidad`, `/aviso-legal` — legales.

El SEO **no** se define en los componentes: vive en el `meta` de cada ruta y el hook `afterEach` del router lo escribe en el `<head>` (title, description, og:*, canonical). Para cambiar el SEO de una página, edita su `meta` en el router.

Archivos obsoletos, no usar: `HomeView.vue`, `ThankYouView.vue`, `ToolsView.vue`.

### El backend (`api/lead.ts`)

Hay **una** función serverless. Vercel convierte cualquier archivo de `/api` en un endpoint HTTP;
no hay servidor que levantar ni deploy aparte.

```
Navegador → POST /api/lead ─┬→ Webhook GHL → workflow → contacto
                            └→ Meta Conversions API (dedup por event_id)
```

Existe por una razón concreta: **el bundle de Vite es público y el repo también**. Cualquier
secreto importado desde `src/` queda a la vista. El token de CAPI y la URL del webhook viven en
variables de entorno del servidor (`.env` local, Secrets en Vercel) y **nunca** llegan al
navegador — verificado: 0 apariciones en el JS de producción.

`api/lead.ts` también decide las **etiquetas** del contacto según `interes`. Ojo: hoy las envía
pero el workflow de GHL todavía no las aplica (ver `docs/configuracion-ghl.md`).

Variables requeridas — plantilla en `.env.example`:
`GHL_WEBHOOK_URL`, `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_CAPI_TEST_CODE` (opcional).

`api/**/*.ts` se type-checkea vía `tsconfig.node.json`.

### Despliegue

Vercel, proyecto `bakano-reconstruccion-leads`, conectado a GitHub: **cada push a `main`
redespliega**. `vercel.json` tiene el rewrite de SPA — sin él, entrar directo a una ruta interna
da 404.

### Cómo salen los leads

`trackStage(etapa, data)` en `src/utils/ghl.ts` postea a `/api/lead`, **no a GHL**. Un lead que falla
**sí lanza** para que el usuario vea el error; las etapas de simple visita se tragan los fallos,
porque el tracking nunca debe romper la UX.

`ReconstruccionView` emite dos etapas: `reconstruccion_view` al montar y `reconstruccion_lead` al enviar el formulario.

### Atribución de Meta

El Pixel `3295262687297231` ya está inicializado en `index.html` (script inline + `noscript`). No lo dupliques en componentes.

`src/utils/fbclid.ts` captura `fbclid`, `_fbc`, `_fbp` y los UTMs a `sessionStorage` bajo `bk_fb`. El patrón, en orden:

1. `captureFbParams()` en el `onMounted` de la vista de entrada.
2. `getStoredFbParams()` al enviar, y esparcirlo en el payload de `trackStage`.
3. `generateEventId()` produce un `event_id` que va **tanto** al webhook como al `eventID` de `fbq` — así Meta deduplica el evento del browser contra el server-side. Si mandas uno sin el otro, los eventos se cuentan doble.

`fbq` no está tipado; el repo usa `;(window as any).fbq?.(...)` — respeta el punto y coma inicial, hace falta porque no hay semicolons.

El **access token de CAPI es secreto de servidor**: nunca en el bundle de Vite ni en el repo. Todo lo que entra a `src/` es público.

### Convenciones

- **Sin punto y coma**, comillas simples, ancho 100 (Prettier).
- **Sin emojis en el código ni la UI** — íconos FontAwesome 6 vía CDN: `<i class="fa-solid fa-...">`.
- **Flex, no grid.** Mobile-first: escribe el estilo base para móvil y usa `@media (min-width: 768px)` para subir. Verifica que no haya scroll horizontal.
- Las variables SCSS de marca (`$BAKANO-PINK`, `$BAKANO-DARK`, `$BAKANO-LIGHT`, `$BAKANO-PURPLE`, `$BAKANO-GREEN`) se **auto-inyectan** en todo bloque `<style lang="scss">` vía `additionalData` en `vite.config.ts`. No pongas `@use` en los componentes.
- Alias `@` → `./src`, funciona en imports TS y en rutas SCSS.
- Tipografía: Outfit (títulos, 800), Plus Jakarta Sans (cuerpo), Space Grotesk (CTAs), Manrope (UI).

### Imágenes

- `src/assets/portfolio/*.png` — capturas reales de los sitios del portafolio (1280×900). Regenerarlas con `agent-browser set viewport 1280 900` + `open` + `screenshot`.
- Las fotos del equipo se sirven desde el Cloudinary de Bakano (cloud `mrp1wwq1`, carpeta `bakano/sesion-karen/`) con transformaciones `f_auto,q_auto,c_fill,g_auto` en la URL. Es el mismo CDN que usa bakano.ec.

### Notas de Vite

`server.allowedHosts` trae un host de ngrok fijo — agrega el tuyo ahí para probar por túnel.
