import courierbox from '@/assets/portfolio/courierbox.png'
import yeyodev from '@/assets/portfolio/yeyodev.png'
import bakano from '@/assets/portfolio/bakano.png'
import andersson from '@/assets/portfolio/andersson.png'
import sorbito from '@/assets/portfolio/sorbito.png'
import teque from '@/assets/portfolio/teque.png'
import boloncity from '@/assets/portfolio/boloncity.png'
import dogtown from '@/assets/portfolio/dogtown.png'
import nicole from '@/assets/portfolio/nicole.png'

export type PlanId = 'web' | 'tienda' | 'ayudar'

export interface Plan {
  id: Exclude<PlanId, 'ayudar'>
  icono: string
  nombre: string
  precio: number
  incluye: string[]
}

/** Reel al que mandamos a quien solo viene por la historia. */
export const REEL_CHISME = 'https://www.instagram.com/reel/DcwigJrTN8t/'

export const reels = [
  { code: 'DcwigJrTN8t', pie: 'Llegamos a la oficina y esto encontramos' },
  { code: 'DcwjngQtS3d', pie: 'La historia completa de cómo casi cerramos' },
  { code: 'DczGaijPjfq', pie: 'Por qué abrimos los 30 cupos' },
]

/** Inversión mínima que el lead confirma al enviar: el precio de entrada, la Página Web Pro. */
export const INVERSION_MINIMA = 500

/**
 * Clientes que ya se arriesgaron, contados en los reels de @yeyo.dev.
 * Todo lo que dice cada caso sale del audio del video: no agregar cifras que no estén ahí.
 */
export const casos = [
  {
    code: 'DeST9nlTGWl',
    img: dogtown,
    nombre: 'Dogtown Organics',
    rubro: 'Comida natural para mascotas',
    url: 'https://dogtownorganics.com/',
    stat: '<24h',
    statLabel: 'de un mensaje de Instagram a facturar',
    titulo: 'De un mensaje de Instagram a facturar al día siguiente',
    texto:
      'La dueña buscaba proveedor de cajas en sus historias. Le escribimos ofreciéndole una tienda en línea, nos dijo que sí y nos dio los accesos esa misma noche. Al día siguiente ya estaba vendiendo.',
  },
  {
    code: 'DeXuA2NzhvI',
    img: nicole,
    nombre: 'Nicole Pastry Arts',
    rubro: 'Pastelería de autor · Guayaquil',
    url: 'https://nicole.com.ec/',
    stat: '$2,000',
    statLabel: 'les cobró otra empresa por su tienda anterior',
    titulo: 'Les habían cobrado $2,000 por una tienda que no estaba a la altura',
    texto:
      'Hoy tienen una tienda completa: el cliente entra, elige su cake, paga, reserva y lo retira o lo recibe en casa. Todo sin escribir por WhatsApp.',
  },
]

export const trabajos = [
  {
    img: dogtown,
    nombre: 'Dogtown Organics',
    rubro: 'Ecommerce · comida para mascotas',
    url: 'https://dogtownorganics.com/',
  },
  {
    img: nicole,
    nombre: 'Nicole Pastry Arts',
    rubro: 'Ecommerce · pastelería de autor',
    url: 'https://nicole.com.ec/',
  },
  {
    img: boloncity,
    nombre: 'Bolón City',
    rubro: 'Restaurante · pedidos online',
    url: 'https://boloncity.com/',
  },
  {
    img: courierbox,
    nombre: 'Courier Box',
    rubro: 'Logística · courier internacional',
    url: 'https://courierboxlogistics.com/',
  },
  {
    img: teque,
    nombre: 'Teque Cruncheese',
    rubro: 'Food · marca de producto',
    url: 'https://tequecruncheese.com/',
  },
  {
    img: sorbito,
    nombre: 'Sorbito de Verdad',
    rubro: 'Ecommerce · sorbetes',
    url: 'https://sorbitodeverdad.com/',
  },
  {
    img: andersson,
    nombre: 'Andersson Boscán',
    rubro: 'Marca personal · periodismo',
    url: 'https://anderssonboscan.ec/',
  },
  { img: yeyodev, nombre: 'yeyo.dev', rubro: 'Portafolio · desarrollo', url: 'https://yeyo.dev/' },
  {
    img: bakano,
    nombre: 'Bakano',
    rubro: 'Agencia · sitio corporativo',
    url: 'https://bakano.ec/',
  },
]

export const planes: Plan[] = [
  {
    id: 'web',
    icono: 'fa-globe',
    nombre: 'Página Web Pro',
    precio: 500,
    incluye: [
      'Diseño a medida, mobile first',
      'SEO para Google',
      'GEO: posicionamiento en ChatGPT, Gemini y otros LLM',
      'Formulario de contacto y WhatsApp',
    ],
  },
  {
    id: 'tienda',
    icono: 'fa-cart-shopping',
    nombre: 'Tienda Online Completa',
    precio: 600,
    incluye: [
      'Todo lo de la Página Web Pro',
      'Catálogo de productos administrable',
      'Pasarela de pagos PayPhone integrada',
      'Gestión de pedidos',
    ],
  },
]

/** Narrativa sacada del audio de los reels — ver docs/transcripciones-reels.md */
export const historia = [
  {
    icono: 'fa-rocket',
    fecha: 'Hace dos años',
    titulo: 'Fundamos Bakano',
    texto:
      'Una agencia de performance marketing. Los clientes estaban satisfechos, los procesos operaban con normalidad y habíamos logrado juntar un equipo de confianza.',
  },
  {
    icono: 'fa-user-slash',
    fecha: 'O eso creíamos',
    titulo: 'Alguien del equipo usó esa confianza',
    texto:
      'Un colaborador consiguió la llave de la oficina y metió de noche a personas que no conocíamos. Engañó al más joven del grupo: nuestro programador estrella.',
  },
  {
    icono: 'fa-house-crack',
    fecha: 'A la mañana siguiente',
    titulo: 'La oficina estaba vacía',
    texto:
      'Laptops, iPads, luces, micrófonos, equipos. Meses de trabajo. Todo lo que habíamos comprado para hacer crecer este negocio, se fue.',
  },
  {
    icono: 'fa-fire-flame-curved',
    fecha: 'Hoy',
    titulo: 'No nos medimos por cómo caemos',
    texto:
      'Perdimos los equipos, pero no el talento ni las ganas. Nos toca volver a levantar esta agencia — y lo vamos a hacer trabajando.',
  },
]

export const etiquetaPlan = (p: string) =>
  p === 'web' ? 'Pagina Web Pro' : p === 'tienda' ? 'Tienda Online + PayPhone' : 'Solo informacion'

export const valorPlan = (p: string) => (p === 'web' ? '500' : p === 'tienda' ? '600' : '0')
