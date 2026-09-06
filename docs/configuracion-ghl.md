# Configuración de GoHighLevel para la landing de reconstrucción

## Estado: FUNCIONANDO — workflow completo (configurado y verificado 2026-09-06)

El circuito completo está cerrado y probado de punta a punta:

```
Landing → /api/lead (Vercel, serverless) → Webhook GHL → Workflow → Contacto creado
                    └→ Meta Conversions API (dedup por event_id)
```

Prueba final: un POST a `https://bakano-reconstruccion-leads.vercel.app/api/lead` devolvió
`{"ok":true,"capi":true,...}` y el contacto **PRUEBA FINAL BORRAR** apareció en GHL con su teléfono.

## Lo que está montado en GHL (configurado 2026-09-06 vía extensión de Claude en Chrome)

- **Subcuenta:** bakano (`pEFChujwCCaMWBNbZYD1`)
- **Carpeta:** `LEADS VENTA DE PAGINAS WEB Y TIENDAS ONLINE`
- **Workflow:** `New Workflow : 1788646833939` — **publicado**

Webhook del workflow (vive en `GHL_WEBHOOK_URL`, nunca en el código):

```
https://services.leadconnectorhq.com/hooks/pEFChujwCCaMWBNbZYD1/webhook-trigger/7ad99221-8fcc-4c24-b27f-311df4b27290
```

### Qué hace GHL con cada POST

```
1. Trigger Inbound Webhook           (recibe cualquier payload)
2. If/Else "¿Es lead?"               etapa == "reconstruccion_lead"
      NO → FINAL. Las vistas (reconstruccion_view) entran y mueren aquí: no crean nada.
      SÍ ↓
3. Crear/actualizar contacto         dedup por teléfono (E.164)
      Phone          ← telefono
      Email          ← email          (pendiente de mapear, ver Pendientes)
      First name     ← nombre
      Last name      ← apellido
      Business Name  ← negocio
      Contact source = "landing-reconstruccion"   (fijo, no lee `origen`)
4. Añadir nota al contacto
      Título: "Lead landing-reconstruccion: {plan_nombre} (USD {valor})"
      Cuerpo: {{Inbound Webhook Trigger.Notas}}  ← la arma el servidor, ver `notas` abajo
              (antes se componía campo por campo: interes, plan, valor, negocio, origen,
              origen_url, event_id, fbclid/fbc/fbp, utm_*, tags)
5. If/Else "¿Qué le interesa?"       sobre interes
      "web"    → Add Tag [landing-reconstruccion, interes-web-400, lead-caliente]
                 → Oportunidad en pipeline "Leads (Prospeccion)", etapa "Nuevo contacto",
                   nombre "{nombre} {apellido} - {negocio} (Web 400)", valor 400, open
      "tienda" → Add Tag [landing-reconstruccion, interes-tienda-500]
                 → Oportunidad igual, "(Tienda 500)", valor 500
      otro     → FINAL  (ayudar / vacío: sin tags, sin pipeline)
```

Notas de diseño:

- **Las etiquetas las pone el workflow por rama**, con valores fijos. El campo `tags` que manda
  el servidor solo queda en la nota, por trazabilidad. Los valores de las ramas son los mismos
  que calcula `etiquetas()` en `api/lead.ts`, así que las dos fuentes coinciden.
- **El valor de la oportunidad es fijo por rama** (400 / 500). No lee `valor` del payload.
- **No hay custom fields.** La atribución (`event_id`, `fbclid`/`fbc`/`fbp`, `utm_*`) vive en la
  nota del contacto, no en campos consultables. Sirve para cruzar a mano con CAPI por
  `event_id`; no sirve para filtrar contactos por campaña desde el CRM.
- El trigger acepta **solo claves de primer nivel**, en minúsculas y con estos nombres exactos.
  No anidar ni renombrar.

> **Costo:** el trigger *Webhook entrante* es **premium en GHL y cobra por ejecución**. El filtro
> por `etapa` evita el contacto basura pero **no** el cargo: la vista ya entró al webhook. Si el
> tráfico sube, considerar no mandar `reconstruccion_view` al webhook (hoy `api/lead.ts` sí lo
> reenvía).

> El funnel VSL viejo usa **otro** webhook (`b26ee589…`) y quedó intacto.

### Verificación (2026-09-06, tras la configuración)

- Vercel producción tiene `GHL_WEBHOOK_URL`, `META_PIXEL_ID`, `META_CAPI_TOKEN` (tipo Secret).
  `META_CAPI_TEST_CODE` no está: los eventos de CAPI van a producción, no a Test Events.
- `POST /api/lead` con `etapa: reconstruccion_view` → `{"ok":true,"etapa":"reconstruccion_view"}`.
  `GET` → 405. El endpoint está vivo y solo acepta POST.
- El flujo de lead completo ya se había probado de punta a punta antes de esta configuración
  (`{"ok":true,"capi":true}` y contacto creado); la estructura del payload no cambió.

## Pendientes

0. **Mapear `email` → Email en "Crear contacto".** El formulario ya lo pide (obligatorio) y el
   servidor lo manda en minúsculas; también va hasheado a CAPI como `em`. Hasta que se mapee,
   solo queda en la nota.
1. **Rama `tienda` sin `lead-caliente`.** La extensión la dejó incompleta: hoy pone
   `landing-reconstruccion, interes-tienda-500` y falta la tercera etiqueta. Una tienda de $500
   es tan caliente como una web de $400.
2. **Rama `otro` (ayudar) sin etiquetas.** Debería poner `landing-reconstruccion,
   solo-informacion, nurture`. Hoy termina sin nada, así que esa gente no se puede segmentar
   para nurture — que era el punto.
3. **Custom fields** para `event_id`, `fbclid`, `fbc`, `fbp`, `utm_*` si en algún momento hace
   falta filtrar por campaña desde el CRM. Hoy están solo en la nota.
4. **Confirmar que se borraron los contactos de prueba:** `PRUEBA FINAL BORRAR`,
   `TEST Claude BORRAR`, `MUESTRA MAPEO`. La extensión no lo reportó.

## Payload que envía el servidor

```json
{
  "etapa": "reconstruccion_lead",
  "event_id": "lead_…",
  "nombre": "María", "apellido": "Pérez",
  "telefono": "+593984934039",
  "email": "maria@tunegocio.com",
  "negocio": "Panadería La Espiga",
  "interes": "tienda",
  "plan_nombre": "Tienda Online + PayPhone",
  "valor": "500",
  "origen": "landing-reconstruccion",
  "tags": "landing-reconstruccion,interes-tienda-500,lead-caliente",
  "full_name": "María Pérez",
  "notas": "🧾 Lead landing-reconstruccion\n🎯 Interés: 🛒 Tienda Online + PayPhone\n📦 Plan: … | 💵 USD 500\n🏪 Negocio: …\n📍 Origen: …\n🔗 URL: …\n🆔 Event ID: …\n📊 Meta: fbclid=… | fbc=… | fbp=—\n📣 UTM: source=… | medium=… | …\n🏷️ Tags servidor: …",
  "fbclid": "", "fbc": "", "fbp": "", "utm_source": "", "…": ""
}
```

**`notas`** es la nota completa ya armada por el servidor (`nota()` en `api/lead.ts`), con saltos
de línea y emojis para dar jerarquía. La acción *Añadir nota* del workflow puede usar solo
`{{Inbound Webhook Trigger.Notas}}` en vez de componerla campo por campo. Los vacíos van como `—`.
Solo viaja en los leads, no en las vistas.

Las visitas mandan `etapa: "reconstruccion_view"` sin datos personales. El workflow las corta en
el primer If/Else: entran al trigger (y cobran) pero no crean contacto.

## Secretos

| Dónde | Qué | Visible para |
|---|---|---|
| `.env` local | Valores reales | Solo tu máquina (`.gitignore`) |
| `.env.example` | Plantilla vacía | Público en GitHub, sin secretos |
| Vercel (Secret, Production) | Valores reales | Solo el servidor |

El token de CAPI **no está en el bundle** — verificado: 0 apariciones en el JS público.
El Pixel `3295262687297231` sí es público (va en `index.html`), y eso es correcto.
