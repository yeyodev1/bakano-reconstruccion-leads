<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { trackStage, generateEventId } from '@/utils/ghl'
import { captureFbParams, getStoredFbParams } from '@/utils/fbclid'
import logo from '@/assets/logos/bakano-light.png'

import courierbox from '@/assets/portfolio/courierbox.png'
import yeyodev from '@/assets/portfolio/yeyodev.png'
import bakano from '@/assets/portfolio/bakano.png'
import andersson from '@/assets/portfolio/andersson.png'
import sorbito from '@/assets/portfolio/sorbito.png'
import teque from '@/assets/portfolio/teque.png'
import boloncity from '@/assets/portfolio/boloncity.png'

const reels = [
  { code: 'DcwigJrTN8t', pie: 'Llegamos a la oficina y esto encontramos' },
  { code: 'DcwjngQtS3d', pie: 'La historia completa de cómo casi cerramos' },
  { code: 'DczGaijPjfq', pie: 'Los 30 cupos: web $400, tienda $500' },
]

const trabajos = [
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

const planes = [
  {
    id: 'web',
    icono: 'fa-globe',
    nombre: 'Página Web Pro',
    precio: 400,
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
    precio: 500,
    incluye: [
      'Todo lo de la Página Web Pro',
      'Catálogo de productos administrable',
      'Pasarela de pagos PayPhone integrada',
      'Gestión de pedidos',
    ],
  },
]

const historia = [
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

const REEL_CHISME = 'https://www.instagram.com/reel/DcwigJrTN8t/'

const form = ref({ nombre: '', telefono: '', negocio: '', interes: '' })
const abierto = ref(false)
const enviando = ref(false)
const enviado = ref(false)
const error = ref('')

const soloChisme = computed(() => form.value.interes === 'ayudar')

const valido = computed(
  () =>
    form.value.nombre.trim().length > 1 &&
    form.value.telefono.trim().length >= 9 &&
    form.value.interes !== '',
)

/** Normaliza a E.164 con Ecuador por defecto — GHL necesita el + para WhatsApp. */
function telefonoE164(raw: string): string {
  const parsed = parsePhoneNumberFromString(raw.trim(), 'EC')
  return parsed?.isValid() ? parsed.number : raw.trim()
}

const scrollA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

function abrir(plan = '') {
  if (plan) form.value.interes = plan
  abierto.value = true
  document.body.style.overflow = 'hidden'
}

function cerrar() {
  abierto.value = false
  document.body.style.overflow = ''
  if (enviado.value) {
    enviado.value = false
    form.value = { nombre: '', telefono: '', negocio: '', interes: '' }
  }
}

async function enviar() {
  if (!valido.value || enviando.value) return
  enviando.value = true
  error.value = ''
  const event_id = generateEventId('lead')
  const plan = form.value.interes
  try {
    await trackStage('reconstruccion_lead', {
      event_id,
      nombre: form.value.nombre.trim(),
      telefono: telefonoE164(form.value.telefono),
      negocio: form.value.negocio.trim(),
      interes: plan,
      plan_nombre:
        plan === 'web'
          ? 'Pagina Web Pro'
          : plan === 'tienda'
            ? 'Tienda Online + PayPhone'
            : 'Solo informacion',
      valor: plan === 'web' ? '400' : plan === 'tienda' ? '500' : '0',
      origen: 'landing-reconstruccion',
      ...getStoredFbParams(),
    })
    ;(window as any).fbq?.(
      'track',
      soloChisme.value ? 'Contact' : 'Lead',
      {},
      { eventID: event_id },
    )
    enviado.value = true
  } catch {
    error.value = 'No se pudo enviar. Escríbenos por WhatsApp y te atendemos igual.'
  } finally {
    enviando.value = false
  }
}

/** Entrada del hero + reveals por scroll. Se salta entero si el usuario pidió menos movimiento. */
function animar() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.registerPlugin(ScrollTrigger)

  gsap
    .timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
    .from('.rc__logo', { y: -16, opacity: 0 })
    .from('.rc__badge', { y: 12, opacity: 0 }, '-=0.45')
    .from('.rc__title', { y: 26, opacity: 0, duration: 0.85 }, '-=0.4')
    .from('.rc__lead', { y: 20, opacity: 0 }, '-=0.55')
    .from('.rc__hero .rc__cta', { y: 18, opacity: 0, scale: 0.96 }, '-=0.5')
    .from('.rc__nota', { opacity: 0 }, '-=0.35')

  const reveal = (sel: string, stagger = 0.12) =>
    gsap.utils.toArray<HTMLElement>(sel).forEach((el) => {
      gsap.from(el, {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })

  reveal('.rc__h2')
  reveal('.rc__historia .rc__sub')
  reveal('.rc__hito')
  reveal('.rc__reels figure')
  reveal('.rc__planes .rc__sub')
  reveal('.rc__card')
  reveal('.rc__trabajos .rc__sub')
  reveal('.rc__trabajo')
  reveal('.rc__contacto > *')
}

onMounted(async () => {
  captureFbParams()
  trackStage('reconstruccion_view', {})
  await nextTick()
  animar()
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
  document.body.style.overflow = ''
})
</script>

<template>
  <main class="rc">
    <!-- HERO -->
    <section class="rc__hero">
      <img :src="logo" alt="Bakano" class="rc__logo" />
      <span class="rc__badge"><i class="fa-solid fa-fire"></i> Solo 30 cupos · este mes</span>
      <h1 class="rc__title">
        Nos robaron.<br />
        Y en vez de cerrar,<br />
        <em>te vamos a hacer tu página web.</em>
      </h1>
      <p class="rc__lead">
        Confiamos en la persona equivocada y perdimos todos los equipos de la agencia. Para volver a
        ponernos de pie hacemos lo único que sabemos hacer bien: trabajar. Abrimos
        <strong>30 cupos</strong> con proyectos que normalmente cuestan
        <strong>$2,000 a $4,000</strong> — a <strong>$400</strong> la página web y
        <strong>$500</strong> la tienda online con PayPhone.
      </p>
      <button class="rc__cta" @click="scrollA('planes')">
        Ver los cupos y precios <i class="fa-solid fa-arrow-down"></i>
      </button>
      <p class="rc__nota">Cada sitio que creamos nos ayuda a ponernos de pie nuevamente.</p>
    </section>

    <!-- HISTORIA -->
    <section class="rc__historia">
      <h2 class="rc__h2">Lo que nos pasó</h2>
      <p class="rc__sub">Lo contamos completo en video. Esta es la versión corta.</p>
      <div class="rc__timeline">
        <article v-for="h in historia" :key="h.texto" class="rc__hito">
          <i class="fa-solid" :class="h.icono"></i>
          <div>
            <span class="rc__fecha">{{ h.fecha }}</span>
            <h3>{{ h.titulo }}</h3>
            <p>{{ h.texto }}</p>
          </div>
        </article>
      </div>
      <div class="rc__reels">
        <figure v-for="r in reels" :key="r.code">
          <iframe
            :src="`https://www.instagram.com/reel/${r.code}/embed/`"
            :title="r.pie"
            loading="lazy"
            allowtransparency="true"
            allowfullscreen
            scrolling="no"
          ></iframe>
          <figcaption>{{ r.pie }}</figcaption>
        </figure>
      </div>
      <p class="rc__lead rc__lead--center">
        <strong>No pedimos donaciones. Pedimos trabajo.</strong> Si necesitabas una página web, este
        es el mejor momento para tenerla — y de paso nos ayudas a reponer lo que perdimos.
      </p>
    </section>

    <!-- PLANES -->
    <section id="planes" class="rc__planes">
      <h2 class="rc__h2">Los cupos</h2>
      <p class="rc__sub">
        Estos trabajos valen entre $2,000 y $4,000. Los dejamos a precio de reconstrucción para
        recuperar los equipos. Cuando se acaben los 30 cupos, vuelve la tarifa normal.
      </p>
      <div class="rc__cards">
        <article v-for="p in planes" :key="p.id" class="rc__card">
          <i class="fa-solid rc__cardIcon" :class="p.icono"></i>
          <h3>{{ p.nombre }}</h3>
          <div class="rc__precio">
            <s>$2,000 – $4,000</s>
            <strong>${{ p.precio }}</strong>
          </div>
          <ul>
            <li v-for="item in p.incluye" :key="item">
              <i class="fa-solid fa-check"></i><span>{{ item }}</span>
            </li>
          </ul>
          <button class="rc__cta rc__cta--card" @click="abrir(p.id)">Quiero este cupo</button>
        </article>
      </div>
    </section>

    <!-- PORTAFOLIO -->
    <section class="rc__trabajos">
      <h2 class="rc__h2">Esto es lo que hacemos</h2>
      <p class="rc__sub">Sitios reales, en línea ahora mismo. Ábrelos y compruébalo.</p>
      <div class="rc__grid">
        <a
          v-for="t in trabajos"
          :key="t.nombre"
          :href="t.url"
          target="_blank"
          rel="noopener"
          class="rc__trabajo"
        >
          <img :src="t.img" :alt="t.nombre" loading="lazy" />
          <div class="rc__trabajoInfo">
            <strong>{{ t.nombre }}</strong>
            <span>{{ t.rubro }}</span>
          </div>
        </a>
      </div>
    </section>

    <!-- CONTACTO -->
    <!-- CTA FINAL -->
    <section id="contacto" class="rc__contacto">
      <h2 class="rc__h2">Asegura tu cupo</h2>
      <p class="rc__sub">Déjanos tus datos y te escribimos por WhatsApp hoy mismo.</p>
      <button class="rc__cta" @click="abrir()">
        Quiero mi cupo <i class="fa-solid fa-arrow-right"></i>
      </button>
      <a class="rc__chisme" :href="REEL_CHISME" target="_blank" rel="noopener">
        ¿Solo viniste por el chisme? Míralo y déjanos un like <i class="fa-brands fa-instagram"></i>
      </a>
    </section>

    <!-- MODAL -->
    <Teleport to="body">
      <Transition name="rcm">
        <div v-if="abierto" class="rcm" @click.self="cerrar">
          <div class="rcm__box" role="dialog" aria-modal="true">
            <button class="rcm__x" aria-label="Cerrar" @click="cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>

            <div v-if="!enviado" class="rcm__form">
              <h2>Asegura tu cupo</h2>
              <p class="rcm__sub">Te escribimos por WhatsApp hoy mismo.</p>

              <label
                >Tu nombre <input v-model="form.nombre" type="text" placeholder="Ej. María Pérez"
              /></label>
              <label
                >WhatsApp
                <input
                  v-model="form.telefono"
                  type="tel"
                  inputmode="tel"
                  placeholder="09 9999 9999"
              /></label>
              <label
                >Tu negocio <span>(opcional)</span
                ><input v-model="form.negocio" type="text" placeholder="Ej. Panadería La Espiga"
              /></label>

              <p class="rcm__pregunta">¿Qué te interesa?</p>
              <div class="rcm__opciones">
                <label :class="{ 'is-on': form.interes === 'web' }">
                  <input v-model="form.interes" type="radio" value="web" />
                  <i class="fa-solid fa-globe"></i>
                  <span>Página Web Pro <strong>$400</strong></span>
                </label>
                <label :class="{ 'is-on': form.interes === 'tienda' }">
                  <input v-model="form.interes" type="radio" value="tienda" />
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span>Tienda Online + PayPhone <strong>$500</strong></span>
                </label>
                <label :class="{ 'is-on': form.interes === 'ayudar' }">
                  <input v-model="form.interes" type="radio" value="ayudar" />
                  <i class="fa-solid fa-heart"></i>
                  <span>Solo quiero ayudar o saber el chisme</span>
                </label>
              </div>

              <button class="rc__cta rc__cta--full" :disabled="!valido || enviando" @click="enviar">
                <i v-if="enviando" class="fa-solid fa-spinner fa-spin"></i>
                {{ enviando ? 'Enviando…' : soloChisme ? 'Enviar' : 'Reservar mi cupo' }}
              </button>
              <p v-if="error" class="rcm__error">{{ error }}</p>
              <p class="rcm__legal">Al enviar aceptas que te contactemos. Nada de spam.</p>
            </div>

            <div v-else class="rcm__ok">
              <i class="fa-solid fa-circle-check"></i>
              <h2>Listo, {{ form.nombre.split(' ')[0] }}</h2>
              <template v-if="soloChisme">
                <p>Gracias por el interés. El chisme completo está en el reel.</p>
                <a class="rc__cta rc__cta--full" :href="REEL_CHISME" target="_blank" rel="noopener">
                  <i class="fa-brands fa-instagram"></i> Verlo y darnos like
                </a>
              </template>
              <template v-else>
                <p>Tu cupo quedó apartado. Te escribimos por WhatsApp hoy mismo.</p>
                <p class="rcm__nota">Gracias por ayudarnos a reconstruir.</p>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <footer class="rc__footer">
      <img :src="logo" alt="Bakano" />
      <p>Bakano · Agencia de Performance Marketing · Guayaquil, Ecuador</p>
      <nav>
        <RouterLink to="/politicas-privacidad">Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso legal</RouterLink>
      </nav>
    </footer>
  </main>
</template>

<style scoped lang="scss">
.rc {
  display: flex;
  flex-direction: column;
  background: $BAKANO-DARK;
  color: $BAKANO-LIGHT;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3.5rem 1.5rem;
  }

  &__logo {
    width: 118px;
    margin-bottom: 1.5rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 1rem;
    border: 1px solid rgba($BAKANO-PINK, 0.5);
    border-radius: 999px;
    background: rgba($BAKANO-PINK, 0.12);
    color: $BAKANO-PINK;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__hero {
    text-align: center;
    padding-top: 2.5rem;
  }

  &__title {
    margin: 1.25rem 0 0;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 8.5vw, 3.4rem);
    line-height: 1.12;
    em {
      color: $BAKANO-PINK;
      font-style: normal;
    }
  }

  &__lead {
    max-width: 46ch;
    margin: 1.25rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.78);
    font-size: 1rem;
    line-height: 1.65;
    strong {
      color: $BAKANO-LIGHT;
    }
    &--center {
      text-align: center;
      margin-top: 2rem;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 1.75rem;
    padding: 1.05rem 1.9rem;
    border: 0;
    border-radius: 999px;
    background: $BAKANO-PINK;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.02rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba($BAKANO-PINK, 0.42);
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    &--card {
      width: 100%;
      margin-top: auto;
    }
    &--full {
      width: 100%;
    }
  }

  &__nota {
    margin-top: 1.5rem;
    color: rgba($BAKANO-LIGHT, 0.5);
    font-size: 0.88rem;
    font-style: italic;
  }

  &__h2 {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(1.6rem, 6vw, 2.4rem);
    text-align: center;
    margin: 0;
  }

  &__sub {
    max-width: 44ch;
    margin: 0.7rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.62);
    text-align: center;
    font-size: 0.95rem;
  }

  /* Historia */
  &__historia {
    background: rgba(#fff, 0.025);
  }

  &__timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 560px;
    margin-top: 2rem;
  }

  &__hito {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(#fff, 0.09);
    border-left: 3px solid $BAKANO-PINK;
    border-radius: 12px;
    background: rgba(#fff, 0.03);
    h3 {
      margin: 0.3rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.08rem;
      line-height: 1.25;
    }
    > i {
      flex-shrink: 0;
      margin-top: 0.2rem;
      color: $BAKANO-PINK;
      font-size: 1.05rem;
    }
    p {
      margin: 0.25rem 0 0;
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  &__fecha {
    color: rgba($BAKANO-LIGHT, 0.45);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__reels {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    max-width: 1040px;
    margin-top: 2rem;
    figure {
      display: flex;
      flex: 1 1 300px;
      max-width: 330px;
      flex-direction: column;
      gap: 0.6rem;
      margin: 0;
    }
    iframe {
      width: 100%;
      height: 560px;
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 14px;
      background: #fff;
    }
    figcaption {
      color: rgba($BAKANO-LIGHT, 0.6);
      font-size: 0.84rem;
      text-align: center;
    }
  }

  /* Planes */
  &__cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.1rem;
    width: 100%;
    max-width: 780px;
    margin-top: 2rem;
  }

  &__card {
    display: flex;
    flex: 1 1 300px;
    flex-direction: column;
    gap: 0.65rem;
    padding: 1.75rem 1.5rem;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 18px;
    background: rgba(#fff, 0.04);
    h3 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
    }
    ul {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin: 0.5rem 0 1.5rem;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      gap: 0.65rem;
      font-size: 0.93rem;
      line-height: 1.45;
    }
    li i {
      flex-shrink: 0;
      margin-top: 0.25rem;
      color: $BAKANO-GREEN;
      font-size: 0.82rem;
    }
  }

  &__cardIcon {
    color: $BAKANO-PINK;
    font-size: 1.6rem;
  }

  &__precio {
    display: flex;
    align-items: baseline;
    gap: 0.7rem;
    s {
      color: rgba($BAKANO-LIGHT, 0.4);
      font-size: 1rem;
    }
    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 2.6rem;
      line-height: 1;
      color: $BAKANO-PINK;
    }
  }

  /* Portafolio */
  &__grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    max-width: 980px;
    margin-top: 2rem;
  }

  &__trabajo {
    display: flex;
    flex: 1 1 300px;
    max-width: 460px;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 14px;
    background: rgba(#fff, 0.04);
    color: inherit;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease;
    &:hover {
      transform: translateY(-4px);
      border-color: rgba($BAKANO-PINK, 0.55);
    }
    img {
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      object-position: top;
    }
  }

  &__trabajoInfo {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.9rem 1.1rem;
    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 1.02rem;
    }
    span {
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.84rem;
    }
  }

  /* Contacto */
  &__contacto {
    background: rgba($BAKANO-PINK, 0.07);
  }

  &__chisme {
    margin-top: 1.5rem;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.88rem;
    text-decoration: none;
    text-align: center;
    i {
      margin-left: 0.3rem;
      color: $BAKANO-PINK;
    }
    &:hover {
      color: $BAKANO-LIGHT;
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 2.5rem 1.5rem 3rem;
    border-top: 1px solid rgba(#fff, 0.08);
    text-align: center;
    img {
      width: 92px;
      opacity: 0.75;
    }
    p {
      margin: 0;
      color: rgba($BAKANO-LIGHT, 0.45);
      font-size: 0.82rem;
    }
    nav {
      display: flex;
      gap: 1.25rem;
    }
    a {
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.82rem;
      text-decoration: none;
      &:hover {
        color: $BAKANO-PINK;
      }
    }
  }

  @media (min-width: 768px) {
    section {
      padding: 5rem 2rem;
    }
    &__hero {
      padding-top: 4rem;
    }
    &__lead {
      font-size: 1.08rem;
    }
  }
}

/* Modal — teleportado a body, por eso no anida bajo .rc */
.rcm {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background: rgba(#000, 0.72);
  backdrop-filter: blur(4px);
  overflow-y: auto;

  &__box {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 460px;
    padding: 2rem 1.5rem 2.25rem;
    border: 1px solid rgba(#fff, 0.12);
    border-radius: 20px 20px 0 0;
    background: $BAKANO-DARK;
    color: $BAKANO-LIGHT;
    font-family: 'Plus Jakarta Sans', sans-serif;
    h2 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.55rem;
    }
  }

  &__x {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: rgba(#fff, 0.09);
    color: $BAKANO-LIGHT;
    font-size: 1rem;
    cursor: pointer;
    &:hover {
      background: rgba(#fff, 0.18);
    }
  }

  &__sub {
    margin: 0.45rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.62);
    font-size: 0.92rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    > label {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 1.05rem;
      font-size: 0.86rem;
      font-weight: 600;
      span {
        color: rgba($BAKANO-LIGHT, 0.45);
        font-weight: 400;
      }
    }
    input[type='text'],
    input[type='tel'] {
      padding: 0.9rem 1rem;
      border: 1px solid rgba(#fff, 0.16);
      border-radius: 11px;
      background: rgba(#fff, 0.05);
      color: $BAKANO-LIGHT;
      font-family: inherit;
      font-size: 1rem;
      &:focus {
        border-color: $BAKANO-PINK;
        outline: none;
      }
      &::placeholder {
        color: rgba($BAKANO-LIGHT, 0.32);
      }
    }
  }

  &__pregunta {
    margin: 1.6rem 0 0.7rem;
    font-size: 0.86rem;
    font-weight: 600;
  }

  &__opciones {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 1.6rem;
    label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.95rem 1rem;
      border: 1px solid rgba(#fff, 0.14);
      border-radius: 12px;
      background: rgba(#fff, 0.04);
      cursor: pointer;
      transition:
        border-color 0.16s ease,
        background 0.16s ease;
      &.is-on {
        border-color: $BAKANO-PINK;
        background: rgba($BAKANO-PINK, 0.14);
      }
      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      i {
        color: $BAKANO-PINK;
        font-size: 1.02rem;
      }
      span {
        font-size: 0.92rem;
      }
      strong {
        color: $BAKANO-PINK;
      }
    }
  }

  &__error {
    margin-top: 0.85rem;
    color: #ff8095;
    font-size: 0.86rem;
    text-align: center;
  }
  &__legal {
    margin-top: 0.9rem;
    color: rgba($BAKANO-LIGHT, 0.42);
    font-size: 0.76rem;
    text-align: center;
  }

  &__ok {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0 0;
    text-align: center;
    > i {
      color: $BAKANO-GREEN;
      font-size: 3rem;
    }
    h2 {
      margin: 0.9rem 0 0.5rem;
    }
    p {
      margin: 0 0 1.25rem;
      color: rgba($BAKANO-LIGHT, 0.75);
    }
  }

  &__nota {
    color: rgba($BAKANO-LIGHT, 0.5) !important;
    font-size: 0.86rem;
    font-style: italic;
  }

  @media (min-width: 640px) {
    align-items: center;
    padding: 1.5rem;
    &__box {
      border-radius: 20px;
    }
  }
}

/* Transición del modal */
.rcm-enter-active,
.rcm-leave-active {
  transition: opacity 0.25s ease;
  .rcm__box {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
}
.rcm-enter-from,
.rcm-leave-to {
  opacity: 0;
  .rcm__box {
    transform: translateY(28px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rcm-enter-active,
  .rcm-leave-active {
    transition: none;
    .rcm__box {
      transition: none;
    }
  }
  .rcm-enter-from,
  .rcm-leave-to .rcm__box {
    transform: none;
  }
}
</style>
