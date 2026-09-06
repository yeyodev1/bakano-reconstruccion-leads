# Contexto del proyecto — memoria de la sesión del 5-6 sep 2026

Todo lo que hace falta saber para retomar esto sin volver a preguntar. Lo que no está aquí
está en `CLAUDE.md` (arquitectura y convenciones) o en `docs/configuracion-ghl.md` (el CRM).

## Qué es esto y por qué

A Bakano —agencia de performance marketing en Guayaquil, fundada hace dos años— **le robaron
los equipos de la oficina** a inicios de septiembre de 2026. Esta landing es la campaña de
reconstrucción: vende páginas web baratas y capta los leads.

**No inventar datos de la campaña.** Todo sale del audio de tres reels de @bakano.ec,
transcrito con whisper.cpp y guardado íntegro en `docs/transcripciones-reels.md`:

| Dato | Valor |
|---|---|
| Cupos | 30, solo ese mes |
| Página Web Pro | $400 — SEO + **GEO** (posicionamiento en ChatGPT/Gemini, no solo Google) |
| Tienda Online | $500 — con pasarela **PayPhone** |
| Precio normal | "$2,000 a $4,000" |

### Decisión editorial que hay que respetar

El reel 2 cuenta que fueron **tres trabajadoras sexuales** y que **escopolaminaron** al
programador. Eso **no está en la landing** a propósito: identifica a un excolaborador real y
sería exposición legal de Bakano en su propio sitio comercial, además de que el morbo le compite
al mensaje de venta.

La landing cuenta **la traición sin el shock**: alguien de confianza consiguió la llave, metió
gente de noche, al día siguiente la oficina estaba vacía. La versión cruda está a un click —
los tres reels van embebidos en la página. El usuario aceptó este criterio.

## Arquitectura, en una línea

```
Navegador → POST /api/lead (Vercel serverless) ─┬→ Webhook GHL → workflow → contacto
                                                └→ Meta Conversions API (dedup por event_id)
```

**Por qué existe el backend.** Antes todo era frontend puro. Un bundle de Vite no puede guardar
secretos: el repo es público y el JS también. `api/lead.ts` existe para que el token de CAPI y la
URL del webhook vivan del lado servidor. Verificado en producción: **0 apariciones** del token y
del webhook en el JS público; el navegador solo conoce `/api/lead`.

Si alguien propone volver a llamar a GHL directo desde el navegador, hay que sacar el CAPI de la
ecuación — no hay forma segura de usarlo desde el cliente.

## Enlaces

| | |
|---|---|
| Producción | https://bakano-reconstruccion-leads.vercel.app |
| GitHub | https://github.com/yeyodev1/bakano-reconstruccion-leads |
| Workflow GHL | https://app.gohighlevel.com/v2/location/pEFChujwCCaMWBNbZYD1/automation/workflow/ed02a46d-c5af-4211-9799-3ddeee316199 |
| Proyecto Vercel | `proyectos-de-diego/bakano-reconstruccion-leads` (auto-deploy en push a `main`) |

Remote `vsl-legacy` apunta al repo viejo, por si hace falta algo de ahí.

## Estado real

**Funcionando y verificado end-to-end:** un POST a producción creó el contacto en GHL.

**Pendiente, y conviene no olvidarlo:**

1. **Las etiquetas no se aplican.** `api/lead.ts` las calcula y las manda en `tags`, pero el
   workflow no las consume — falta una acción *Add Tag* que lea `Inbound Webhook Trigger . Tags`.
2. Campos sin mapear en GHL: `negocio`, `origen`, `plan_nombre`, `valor`, `utm_*`.
3. Las visitas (`etapa: reconstruccion_view`) no están filtradas en el workflow. Si empiezan a
   crear contactos vacíos, añadir condición por `etapa`.
4. `interes: ayudar` debería ir a nurture, no al pipeline: esa gente vino por la historia.
5. **Borrar contactos de prueba:** `PRUEBA FINAL BORRAR`, `TEST Claude BORRAR`, `MUESTRA MAPEO`.

## Cosas que costaron descubrir

- **El trigger *Webhook entrante* de GHL es premium y cobra por ejecución.** Cada lead genera un
  cargo. Importa antes de escalar tráfico pagado.
- GHL **genera** la URL del webhook al crear el trigger; no se pega una externa. Por eso el flujo
  nuevo tiene URL propia y quedó separado del funnel VSL viejo sin tocarlo.
- GHL exige una **"referencia de mapeo"** antes de guardar el trigger: hay que mandarle una
  petición de muestra y seleccionarla en el dropdown. Sin eso no deja guardar.
- El `additionalData` de Vite **solo alcanza la hoja de entrada** de cada componente, no los
  archivos que ella carga con `@use`. Por eso `src/styles/reconstruccion.scss` importa las
  variables de color a mano.
- Vue Router en modo history necesita el rewrite de `vercel.json`; sin él, entrar directo a
  `/politicas-privacidad` daba 404.
- `libphonenumber-js` quita el 0 nacional: `0984934039` → `+593984934039`. GHL necesita el E.164.

## Secretos: dónde vive cada cosa

| Dónde | Qué | Visible para |
|---|---|---|
| `.env` local | Valores reales | Solo esta máquina (`.gitignore`) |
| `.env.example` | Plantilla vacía | Público, sin secretos |
| Vercel (Secret, Production) | Valores reales | Solo el servidor |

El Pixel `3295262687297231` **sí** es público y va en `index.html` — eso es correcto.

**Credenciales que circularon por el chat y hay que rotar:** el token de CAPI de Meta, la
contraseña de GHL, y un sync token de cmem.ai. El usuario dijo que no rotaría el de Meta; queda
advertido.

## Notas sobre el entorno del usuario

- Navegador principal: **Dia**. Chrome Dev también instalado.
- Automatizar GHL por navegador es lento y frágil: los clics necesitan **dos** pulsaciones para
  registrar, y `keyboard type` aterriza en el campo equivocado — **usar `keyboard inserttext`**.
- Para conducir Dia hace falta relanzarlo con `--remote-debugging-port`. **Cerrar ese puerto al
  terminar**: mientras esté abierto, cualquier proceso local maneja el navegador con todas las
  sesiones abiertas.
- claude-mem / cmem.ai **no está instalado** (no hay `~/.claude-mem`, ni plugin, ni skill
  `cloud-sync`). Si se retoma, instalar primero y verificar que la skill aparezca.
