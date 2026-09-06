# Configuración de GoHighLevel para la landing de reconstrucción

## Estado: FUNCIONANDO (verificado 2026-09-06)

El circuito completo está cerrado y probado de punta a punta:

```
Landing → /api/lead (Vercel, serverless) → Webhook GHL → Workflow → Contacto creado
                    └→ Meta Conversions API (dedup por event_id)
```

Prueba final: un POST a `https://bakano-reconstruccion-leads.vercel.app/api/lead` devolvió
`{"ok":true,"capi":true,...}` y el contacto **PRUEBA FINAL BORRAR** apareció en GHL con su teléfono.

## Lo que está montado en GHL

- **Subcuenta:** bakano (`pEFChujwCCaMWBNbZYD1`)
- **Carpeta:** `LEADS VENTA DE PAGINAS WEB Y TIENDAS ONLINE`
- **Workflow:** `New Workflow : 1788646833939` — **publicado**
  - Trigger: **Webhook entrante**
  - Acción: **Crear contacto**, con estos mapeos:

| Campo GHL | Variable del webhook |
|---|---|
| Phone | `Inbound Webhook Trigger . Telefono` |
| First name | `Inbound Webhook Trigger . Nombre` |
| Last name | `Inbound Webhook Trigger . Apellido` |

Webhook del workflow (vive en `GHL_WEBHOOK_URL`, nunca en el código):

```
https://services.leadconnectorhq.com/hooks/pEFChujwCCaMWBNbZYD1/webhook-trigger/7ad99221-8fcc-4c24-b27f-311df4b27290
```

> **Costo:** el trigger *Webhook entrante* es **premium en GHL y cobra por ejecución**.
> Cada lead que entre genera un cargo adicional. Tenerlo en cuenta al escalar tráfico.

> El funnel VSL viejo usa **otro** webhook (`b26ee589…`) y quedó intacto. Los dos flujos
> están separados de raíz, sin tocar sus automatizaciones.

## Pendientes

1. **Etiquetas.** `api/lead.ts` ya envía el campo `tags`
   (`landing-reconstruccion`, `interes-web-400` / `interes-tienda-500` / `solo-informacion`,
   `lead-caliente` / `nurture`), pero **el workflow todavía no las aplica**: falta una acción
   *Add Tag* que lea `Inbound Webhook Trigger . Tags`.
2. **Campos extra sin mapear:** `negocio` → Business Name, `origen` → Contact source,
   `plan_nombre`, `valor`, `event_id`, `fbclid`/`fbc`/`fbp`, `utm_*`.
3. **Ruteo de `interes: ayudar`:** esa gente vino por la historia, no a comprar. Conviene
   mandarla a nurture y no al pipeline de ventas.
4. **Borrar los contactos de prueba:** `PRUEBA FINAL BORRAR`, `TEST Claude BORRAR`, `MUESTRA MAPEO`.

## Payload que envía el servidor

```json
{
  "etapa": "reconstruccion_lead",
  "event_id": "lead_…",
  "nombre": "María", "apellido": "Pérez",
  "telefono": "+593984934039",
  "negocio": "Panadería La Espiga",
  "interes": "tienda",
  "plan_nombre": "Tienda Online + PayPhone",
  "valor": "500",
  "origen": "landing-reconstruccion",
  "tags": "landing-reconstruccion,interes-tienda-500,lead-caliente",
  "full_name": "María Pérez",
  "fbclid": "", "fbc": "", "fbp": "", "utm_source": "", "…": ""
}
```

Las visitas mandan `etapa: "reconstruccion_view"` sin datos personales. El workflow **no** las
filtra todavía; si empiezan a crear contactos vacíos, añade una condición por `etapa`.

## Secretos

| Dónde | Qué | Visible para |
|---|---|---|
| `.env` local | Valores reales | Solo tu máquina (`.gitignore`) |
| `.env.example` | Plantilla vacía | Público en GitHub, sin secretos |
| Vercel (Secret, Production) | Valores reales | Solo el servidor |

El token de CAPI **no está en el bundle** — verificado: 0 apariciones en el JS público.
El Pixel `3295262687297231` sí es público (va en `index.html`), y eso es correcto.
