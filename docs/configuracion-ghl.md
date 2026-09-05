# Configuración de GoHighLevel para la landing de reconstrucción

## Estado verificado

- El webhook responde **HTTP 200**. Los datos salen de la landing y GHL los recibe.
- Lo que **no** está verificado: que un workflow los convierta en contactos. Eso sólo se ve dentro de la cuenta.

Webhook actual (hardcodeado en `src/utils/ghl.ts`):

```
https://services.leadconnectorhq.com/hooks/pEFChujwCCaMWBNbZYD1/webhook-trigger/b26ee589-52a8-4240-893c-7d1aaa53696a
```

> **Ojo:** es el mismo webhook del funnel VSL viejo. Si el workflow existente no filtra por `etapa`,
> los leads de esta landing van a caer en las automatizaciones del VSL (correos de "agenda tu cita
> estratégica"), que no aplican aquí. Ver "Separar los dos flujos" abajo.

## Payload real

Capturado del envío real del formulario, no inventado:

```json
{
  "etapa": "reconstruccion_lead",
  "event_id": "lead_1788645173428_iu3woypj2np",
  "nombre": "TEST Claude",
  "apellido": "BORRAR",
  "telefono": "+593984934039",
  "negocio": "Panaderia Prueba",
  "interes": "tienda",
  "plan_nombre": "Tienda Online + PayPhone",
  "valor": "500",
  "origen": "landing-reconstruccion",
  "fbclid": "",
  "fbc": "",
  "fbp": "fb.0.1788641818212.777188499693955081",
  "utm_source": "", "utm_medium": "", "utm_campaign": "",
  "utm_content": "", "utm_term": "", "utm_id": ""
}
```

Al cargar la página se dispara además un evento liviano con `etapa: "reconstruccion_view"` y
`event_id`, sin datos personales. Sirve para medir visitas; **no debe crear contactos**.

## Mapeo de campos

| Campo del payload | Campo en GHL | Notas |
|---|---|---|
| `nombre` | First Name | |
| `apellido` | Last Name | |
| `telefono` | Phone | Ya viene en E.164 (`+593…`). No lo reformatees. |
| `negocio` | Company Name | Opcional, puede llegar vacío |
| `interes` | Tag | `web` · `tienda` · `ayudar` |
| `plan_nombre` | Custom field | Legible para el vendedor |
| `valor` | Opportunity value | `400` · `500` · `0` |
| `origen` | Source | Siempre `landing-reconstruccion` |
| `etapa` | — | Filtro del workflow, no es dato de contacto |
| `event_id` | Custom field | Deduplicación con Meta |
| `fbclid`, `fbc`, `fbp`, `utm_*` | Custom fields | Atribución de Meta Ads; llegan vacíos en tráfico directo |

## Pasos

1. **Verificar si ya llegan.** Busca en Contacts los dos leads **"TEST Claude BORRAR"**.
   - Si aparecen → ya hay un workflow escuchando; sólo falta mapear los campos nuevos
     (`apellido`, `plan_nombre`, `valor`, `interes`).
   - Si no aparecen → el webhook recibe pero nadie lo escucha: hay que crear el workflow.
   - En cualquier caso, **bórralos** al terminar.

2. **Crear o editar el workflow.**
   - Trigger: **Inbound Webhook**, usando la URL de arriba.
   - Filtro: `etapa` **es igual a** `reconstruccion_lead` (así los `reconstruccion_view` no crean contactos).
   - Acción: **Create/Update Contact** con el mapeo de la tabla.
   - Acción: **Add Tag** → el valor de `interes`.

3. **Separar los dos flujos.** Al workflow viejo del VSL agrégale el filtro inverso
   (`etapa` **no es igual a** `reconstruccion_lead`), o pídele a soporte de GHL un webhook nuevo
   dedicado a esta landing y cámbialo en `src/utils/ghl.ts`.

4. **Rutear según interés.**
   - `web` y `tienda` → pipeline de ventas, con `valor` como monto de la oportunidad.
   - `ayudar` → **lista de nurture, no al pipeline.** Esa gente vino por la historia, no a comprar;
     meterla al pipeline ensucia la tasa de cierre.

5. **Campos personalizados.** Créalos antes de mapear, si no existen:
   `plan_nombre`, `valor`, `interes`, `event_id`, `fbclid`, `fbc`, `fbp`, `utm_source`,
   `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`.

## Pendientes de seguridad

- **El repo es público y el webhook está hardcodeado** en `src/utils/ghl.ts`. Cualquiera puede
  inyectar leads falsos. Mover a `VITE_GHL_WEBHOOK` en `.env` reduce la exposición casual, pero
  **no la elimina**: cualquier variable `VITE_*` termina en el bundle del navegador y es visible.
  La solución real es un endpoint propio que reciba el POST y reenvíe a GHL con la URL del lado
  servidor.
- **El access token de CAPI** que circuló por chat debe rotarse en Meta Business. No está en el
  código y no debe estarlo: va del lado servidor.

## Meta Pixel

El pixel `3295262687297231` ya está en `index.html`. El formulario dispara `Lead` (o `Contact` si
el interés es `ayudar`) con el mismo `event_id` que va al webhook, para que Meta deduplique el
evento del navegador contra el server-side si algún día activas CAPI.
