import { createHash } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Punto único de entrada de los leads de la landing.
 *
 * Existe para que los secretos NO viajen al navegador: el bundle de Vite es público
 * (y el repo también), así que el token de CAPI y la URL del webhook viven aquí,
 * en variables de entorno del servidor.
 *
 * Hace tres cosas y ninguna puede tumbar a las otras:
 *   1. Reenvía el lead al webhook de GoHighLevel.
 *   2. Manda el evento a la Conversions API de Meta, deduplicado por `event_id`.
 *   3. Responde al navegador si el lead quedó registrado en GHL.
 */

const GHL_WEBHOOK = process.env.GHL_WEBHOOK_URL ?? ''
const PIXEL_ID = process.env.META_PIXEL_ID ?? ''
const CAPI_TOKEN = process.env.META_CAPI_TOKEN ?? ''
const CAPI_TEST_CODE = process.env.META_CAPI_TEST_CODE ?? ''

/** Meta exige SHA-256 en hex minúscula sobre el valor ya normalizado. */
const hash = (v: string) => createHash('sha256').update(v.trim().toLowerCase()).digest('hex')

/** Para `ph` Meta quiere sólo dígitos: sin `+`, espacios ni guiones. */
const hashPhone = (v: string) => {
  const digits = v.replace(/\D/g, '')
  return digits ? createHash('sha256').update(digits).digest('hex') : ''
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Etiquetas que GHL debe aplicar al contacto, decididas aquí y no en el navegador. */
function etiquetas(interes: string): string[] {
  const base = ['landing-reconstruccion']
  if (interes === 'web') return [...base, 'interes-web-400', 'lead-caliente']
  if (interes === 'tienda') return [...base, 'interes-tienda-500', 'lead-caliente']
  return [...base, 'solo-informacion', 'nurture']
}

/** Nombre legible del interés, con el mismo ícono que usa la landing. */
const INTERES: Record<string, string> = {
  web: '🌐 Página Web Pro',
  tienda: '🛒 Tienda Online + PayPhone',
  ayudar: '❤️ Solo quiere ayudar / saber el chisme',
}

/** Valor a mostrar en la nota: un guion largo en vez de un hueco cuando viene vacío. */
const o = (v: string) => v || '—'

/**
 * Nota lista para pegar en el contacto de GHL. Va en la clave `notas` del webhook para que
 * la acción "Añadir nota" del workflow use una sola variable en vez de armarla campo a campo.
 * Los emojis son deliberados: son la única forma de dar jerarquía en una nota de texto plano.
 */
function nota(d: Record<string, string>, tags: string[], event_id: string): string {
  const utm = ['source', 'medium', 'campaign', 'content', 'term', 'id']
    .map((k) => `${k}=${o(d[`utm_${k}`])}`)
    .join(' | ')
  return [
    `🧾 Lead landing-reconstruccion`,
    `🎯 Interés: ${INTERES[d.interes] ?? o(d.interes)}`,
    `📦 Plan: ${o(d.plan_nombre)} | 💵 USD ${o(d.valor)}`,
    `🏪 Negocio: ${o(d.negocio)}`,
    `📍 Origen: ${o(d.origen)}`,
    `🔗 URL: ${o(d.origen_url)}`,
    `🆔 Event ID: ${event_id}`,
    `📊 Meta: fbclid=${o(d.fbclid)} | fbc=${o(d.fbc)} | fbp=${o(d.fbp)}`,
    `📣 UTM: ${utm}`,
    `🏷️ Tags servidor: ${tags.join(', ')}`,
  ].join('\n')
}

async function enviarAGhl(payload: Record<string, unknown>): Promise<boolean> {
  if (!GHL_WEBHOOK) return false
  try {
    const r = await fetch(GHL_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return r.ok
  } catch {
    return false
  }
}

async function enviarACapi(
  body: Record<string, string>,
  eventName: string,
  eventId: string,
  ip: string,
  ua: string,
): Promise<boolean> {
  if (!PIXEL_ID || !CAPI_TOKEN) return false

  const user_data: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: ua,
  }
  if (body.telefono) user_data.ph = [hashPhone(body.telefono)]
  if (body.nombre) user_data.fn = [hash(body.nombre)]
  if (body.apellido) user_data.ln = [hash(body.apellido)]
  // fbc y fbp van en claro: Meta los quiere sin hashear.
  if (body.fbc) user_data.fbc = body.fbc
  if (body.fbp) user_data.fbp = body.fbp

  const evento: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId, // mismo id que dispara el pixel del navegador → Meta deduplica
    action_source: 'website',
    event_source_url: body.origen_url || 'https://web.bakano.ec/',
    user_data,
    custom_data: {
      currency: 'USD',
      value: Number(body.valor || 0),
      content_name: body.plan_nombre || 'Solo informacion',
    },
  }

  const payload: Record<string, unknown> = { data: [evento], access_token: CAPI_TOKEN }
  if (CAPI_TEST_CODE) payload.test_event_code = CAPI_TEST_CODE

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!r.ok) console.error('CAPI rechazó el evento:', r.status, await r.text())
    return r.ok
  } catch (e) {
    console.error('CAPI no respondió:', e)
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const b = (req.body ?? {}) as Record<string, unknown>
  const etapa = str(b.etapa) || 'reconstruccion_lead'
  const event_id = str(b.event_id) || `evt_${Date.now()}`

  const datos: Record<string, string> = {}
  for (const k of [
    'nombre', 'apellido', 'telefono', 'negocio', 'interes', 'plan_nombre',
    'valor', 'origen', 'origen_url', 'fbclid', 'fbc', 'fbp',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
  ]) {
    datos[k] = str(b[k])
  }

  // Las visitas sólo se registran: no son contactos ni eventos de conversión.
  if (etapa !== 'reconstruccion_lead') {
    await enviarAGhl({ etapa, event_id, ...datos })
    return res.status(200).json({ ok: true, etapa })
  }

  if (!datos.nombre || !datos.telefono) {
    return res.status(400).json({ ok: false, error: 'Faltan nombre o telefono' })
  }

  const tags = etiquetas(datos.interes)
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
  const ua = String(req.headers['user-agent'] ?? '')

  const [ghlOk, capiOk] = await Promise.all([
    enviarAGhl({
      etapa,
      event_id,
      ...datos,
      tags: tags.join(','), // GHL mapea mejor una cadena separada por comas
      full_name: `${datos.nombre} ${datos.apellido}`.trim(),
      notas: nota(datos, tags, event_id),
    }),
    enviarACapi(datos, datos.interes === 'ayudar' ? 'Contact' : 'Lead', event_id, ip, ua),
  ])

  // El lead sólo se da por bueno si GHL lo recibió; CAPI es atribución, no captura.
  return res.status(ghlOk ? 200 : 502).json({ ok: ghlOk, capi: capiOk, tags, event_id })
}
