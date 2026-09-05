<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

const CDN = 'https://res.cloudinary.com/mrp1wwq1/image/upload/f_auto,q_auto,c_fill,g_auto'
const equipo = [
  `${CDN},w_600,h_800/bakano/sesion-karen/dsc06994.jpg`,
  `${CDN},w_600,h_800/bakano/sesion-karen/dsc06685.jpg`,
  `${CDN},w_600,h_800/bakano/sesion-karen/dsc07037.jpg`,
]

const trabajos = [
  { img: boloncity, nombre: 'Bolón City', rubro: 'Restaurante · pedidos online', url: 'https://boloncity.com/' },
  { img: courierbox, nombre: 'Courier Box', rubro: 'Logística · courier internacional', url: 'https://courierboxlogistics.com/' },
  { img: teque, nombre: 'Teque Cruncheese', rubro: 'Food · marca de producto', url: 'https://tequecruncheese.com/' },
  { img: sorbito, nombre: 'Sorbito de Verdad', rubro: 'Ecommerce · sorbetes', url: 'https://sorbitodeverdad.com/' },
  { img: andersson, nombre: 'Andersson Boscán', rubro: 'Marca personal · periodismo', url: 'https://anderssonboscan.ec/' },
  { img: yeyodev, nombre: 'yeyo.dev', rubro: 'Portafolio · desarrollo', url: 'https://yeyo.dev/' },
  { img: bakano, nombre: 'Bakano', rubro: 'Agencia · sitio corporativo', url: 'https://bakano.ec/' },
]

const planes = [
  {
    id: 'web',
    icono: 'fa-globe',
    nombre: 'Página Web Pro',
    precio: 400,
    incluye: [
      'Diseño a medida, mobile first',
      'Optimizada para SEO',
      'Optimizada para IA: ChatGPT, Gemini, Google',
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
      'Pasarela de pagos integrada',
      'Gestión de pedidos',
    ],
  },
]

const historia = [
  { icono: 'fa-house-crack', fecha: 'Hace 3 días', texto: 'Nos robaron. Jamás pensamos que pasaría.' },
  { icono: 'fa-hands-praying', fecha: 'Ese mismo día', texto: 'Vamos a salir de esta.' },
  { icono: 'fa-hammer', fecha: 'Hoy', texto: 'Reconstruyendo. Abrimos 30 cupos para levantar el equipo de trabajo.' },
]

const form = ref({ nombre: '', telefono: '', negocio: '', interes: '' })
const enviando = ref(false)
const enviado = ref(false)
const error = ref('')

const valido = computed(
  () => form.value.nombre.trim().length > 1 && form.value.telefono.trim().length >= 9 && form.value.interes !== '',
)

const scrollA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

async function enviar() {
  if (!valido.value || enviando.value) return
  enviando.value = true
  error.value = ''
  const event_id = generateEventId('lead')
  try {
    await trackStage('reconstruccion_lead', {
      event_id,
      nombre: form.value.nombre.trim(),
      telefono: form.value.telefono.trim(),
      negocio: form.value.negocio.trim(),
      interes: form.value.interes,
      ...getStoredFbParams(),
    })
    ;(window as any).fbq?.('track', form.value.interes === 'ayudar' ? 'Contact' : 'Lead', {}, { eventID: event_id })
    enviado.value = true
  } catch {
    error.value = 'No se pudo enviar. Escríbenos por WhatsApp y te atendemos igual.'
  } finally {
    enviando.value = false
  }
}

onMounted(() => {
  captureFbParams()
  trackStage('reconstruccion_view', {})
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
        Somos Bakano, agencia de performance marketing en Guayaquil. Entraron a nuestra oficina y se
        llevaron los equipos con los que trabajamos. Para volver a levantarnos abrimos 30 cupos con
        trabajos de calidad de <strong>$2,000+</strong> a precio de reconstrucción.
      </p>
      <button class="rc__cta" @click="scrollA('planes')">
        Ver los cupos y precios <i class="fa-solid fa-arrow-down"></i>
      </button>
      <p class="rc__nota">Cada sitio que creamos nos ayuda a ponernos de pie nuevamente.</p>
    </section>

    <!-- HISTORIA -->
    <section class="rc__historia">
      <h2 class="rc__h2">Qué pasó</h2>
      <div class="rc__timeline">
        <article v-for="h in historia" :key="h.texto" class="rc__hito">
          <i class="fa-solid" :class="h.icono"></i>
          <div>
            <span class="rc__fecha">{{ h.fecha }}</span>
            <p>{{ h.texto }}</p>
          </div>
        </article>
      </div>
      <div class="rc__fotos">
        <img v-for="(f, i) in equipo" :key="i" :src="f" alt="Equipo Bakano" loading="lazy" />
      </div>
      <p class="rc__lead rc__lead--center">
        No pedimos donaciones. Pedimos trabajo. Si necesitabas una página web, este es el mejor
        momento para tenerla — y de paso nos ayudas a reponer lo que perdimos.
      </p>
    </section>

    <!-- PLANES -->
    <section id="planes" class="rc__planes">
      <h2 class="rc__h2">Los cupos</h2>
      <p class="rc__sub">Precio de reconstrucción. Cuando se acaben los 30, vuelve la tarifa normal.</p>
      <div class="rc__cards">
        <article v-for="p in planes" :key="p.id" class="rc__card">
          <i class="fa-solid rc__cardIcon" :class="p.icono"></i>
          <h3>{{ p.nombre }}</h3>
          <div class="rc__precio">
            <s>$2,000+</s>
            <strong>${{ p.precio }}</strong>
          </div>
          <ul>
            <li v-for="item in p.incluye" :key="item">
              <i class="fa-solid fa-check"></i><span>{{ item }}</span>
            </li>
          </ul>
          <button class="rc__cta rc__cta--card" @click="form.interes = p.id; scrollA('contacto')">
            Quiero este cupo
          </button>
        </article>
      </div>
    </section>

    <!-- PORTAFOLIO -->
    <section class="rc__trabajos">
      <h2 class="rc__h2">Esto es lo que hacemos</h2>
      <p class="rc__sub">Sitios reales, en línea ahora mismo. Ábrelos y compruébalo.</p>
      <div class="rc__grid">
        <a v-for="t in trabajos" :key="t.nombre" :href="t.url" target="_blank" rel="noopener" class="rc__trabajo">
          <img :src="t.img" :alt="t.nombre" loading="lazy" />
          <div class="rc__trabajoInfo">
            <strong>{{ t.nombre }}</strong>
            <span>{{ t.rubro }}</span>
          </div>
        </a>
      </div>
    </section>

    <!-- CONTACTO -->
    <section id="contacto" class="rc__contacto">
      <div v-if="!enviado" class="rc__form">
        <h2 class="rc__h2">Asegura tu cupo</h2>
        <p class="rc__sub">Te escribimos por WhatsApp hoy mismo.</p>

        <label>Tu nombre <input v-model="form.nombre" type="text" placeholder="Ej. María Pérez" /></label>
        <label>WhatsApp <input v-model="form.telefono" type="tel" inputmode="tel" placeholder="09 9999 9999" /></label>
        <label>Tu negocio <span>(opcional)</span><input v-model="form.negocio" type="text" placeholder="Ej. Panadería La Espiga" /></label>

        <p class="rc__pregunta">¿Qué te interesa?</p>
        <div class="rc__opciones">
          <label :class="{ 'is-on': form.interes === 'web' }">
            <input v-model="form.interes" type="radio" value="web" />
            <i class="fa-solid fa-globe"></i>
            <span>Página Web Pro <strong>$400</strong></span>
          </label>
          <label :class="{ 'is-on': form.interes === 'tienda' }">
            <input v-model="form.interes" type="radio" value="tienda" />
            <i class="fa-solid fa-cart-shopping"></i>
            <span>Tienda Online <strong>$500</strong></span>
          </label>
          <label :class="{ 'is-on': form.interes === 'ayudar' }">
            <input v-model="form.interes" type="radio" value="ayudar" />
            <i class="fa-solid fa-heart"></i>
            <span>Solo quiero ayudar o saber más</span>
          </label>
        </div>

        <button class="rc__cta rc__cta--full" :disabled="!valido || enviando" @click="enviar">
          <i v-if="enviando" class="fa-solid fa-spinner fa-spin"></i>
          {{ enviando ? 'Enviando…' : 'Enviar y reservar mi cupo' }}
        </button>
        <p v-if="error" class="rc__error">{{ error }}</p>
        <p class="rc__legal">Al enviar aceptas que te contactemos. Nada de spam.</p>
      </div>

      <div v-else class="rc__ok">
        <i class="fa-solid fa-circle-check"></i>
        <h2>Listo, {{ form.nombre.split(' ')[0] }}</h2>
        <p>Tu cupo quedó apartado. Te escribimos por WhatsApp hoy mismo.</p>
        <p class="rc__nota">Gracias por ayudarnos a reconstruir.</p>
      </div>
    </section>

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

  &__logo { width: 118px; margin-bottom: 1.5rem; }

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

  &__hero { text-align: center; padding-top: 2.5rem; }

  &__title {
    margin: 1.25rem 0 0;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 8.5vw, 3.4rem);
    line-height: 1.12;
    em { color: $BAKANO-PINK; font-style: normal; }
  }

  &__lead {
    max-width: 46ch;
    margin: 1.25rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.78);
    font-size: 1rem;
    line-height: 1.65;
    strong { color: $BAKANO-LIGHT; }
    &--center { text-align: center; margin-top: 2rem; }
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
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba($BAKANO-PINK, 0.42); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
    &--card { width: 100%; margin-top: auto; }
    &--full { width: 100%; }
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
  &__historia { background: rgba(#fff, 0.025); }

  &__timeline { display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 560px; margin-top: 2rem; }

  &__hito {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(#fff, 0.09);
    border-left: 3px solid $BAKANO-PINK;
    border-radius: 12px;
    background: rgba(#fff, 0.03);
    > i { flex-shrink: 0; margin-top: 0.2rem; color: $BAKANO-PINK; font-size: 1.05rem; }
    p { margin: 0.25rem 0 0; font-size: 1rem; line-height: 1.5; }
  }

  &__fecha {
    color: rgba($BAKANO-LIGHT, 0.45);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__fotos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    max-width: 560px;
    margin-top: 1.75rem;
    img { flex: 1 1 150px; max-width: 180px; aspect-ratio: 3 / 4; border-radius: 12px; object-fit: cover; }
  }

  /* Planes */
  &__cards { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.1rem; width: 100%; max-width: 780px; margin-top: 2rem; }

  &__card {
    display: flex;
    flex: 1 1 300px;
    flex-direction: column;
    gap: 0.65rem;
    padding: 1.75rem 1.5rem;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 18px;
    background: rgba(#fff, 0.04);
    h3 { margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.3rem; }
    ul { display: flex; flex-direction: column; gap: 0.6rem; margin: 0.5rem 0 1.5rem; padding: 0; list-style: none; }
    li { display: flex; gap: 0.65rem; font-size: 0.93rem; line-height: 1.45; }
    li i { flex-shrink: 0; margin-top: 0.25rem; color: $BAKANO-GREEN; font-size: 0.82rem; }
  }

  &__cardIcon { color: $BAKANO-PINK; font-size: 1.6rem; }

  &__precio {
    display: flex;
    align-items: baseline;
    gap: 0.7rem;
    s { color: rgba($BAKANO-LIGHT, 0.4); font-size: 1rem; }
    strong { font-family: 'Outfit', sans-serif; font-size: 2.6rem; line-height: 1; color: $BAKANO-PINK; }
  }

  /* Portafolio */
  &__grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; width: 100%; max-width: 980px; margin-top: 2rem; }

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
    transition: transform 0.2s ease, border-color 0.2s ease;
    &:hover { transform: translateY(-4px); border-color: rgba($BAKANO-PINK, 0.55); }
    img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }
  }

  &__trabajoInfo {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.9rem 1.1rem;
    strong { font-family: 'Outfit', sans-serif; font-size: 1.02rem; }
    span { color: rgba($BAKANO-LIGHT, 0.55); font-size: 0.84rem; }
  }

  /* Contacto */
  &__contacto { background: rgba($BAKANO-PINK, 0.07); }

  &__form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 460px;
    > label {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 1.1rem;
      font-size: 0.88rem;
      font-weight: 600;
      span { color: rgba($BAKANO-LIGHT, 0.45); font-weight: 400; }
    }
    input[type='text'], input[type='tel'] {
      padding: 0.95rem 1rem;
      border: 1px solid rgba(#fff, 0.16);
      border-radius: 11px;
      background: rgba(#fff, 0.05);
      color: $BAKANO-LIGHT;
      font-family: inherit;
      font-size: 1rem;
      &:focus { border-color: $BAKANO-PINK; outline: none; }
      &::placeholder { color: rgba($BAKANO-LIGHT, 0.32); }
    }
  }

  &__pregunta { margin: 1.75rem 0 0.75rem; font-size: 0.88rem; font-weight: 600; }

  &__opciones {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-bottom: 1.75rem;
    label {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem 1.1rem;
      border: 1px solid rgba(#fff, 0.14);
      border-radius: 12px;
      background: rgba(#fff, 0.04);
      cursor: pointer;
      transition: border-color 0.16s ease, background 0.16s ease;
      &.is-on { border-color: $BAKANO-PINK; background: rgba($BAKANO-PINK, 0.14); }
      input { position: absolute; opacity: 0; pointer-events: none; }
      i { color: $BAKANO-PINK; font-size: 1.05rem; }
      span { font-size: 0.94rem; }
      strong { color: $BAKANO-PINK; }
    }
  }

  &__error { margin-top: 0.9rem; color: #ff8095; font-size: 0.88rem; text-align: center; }
  &__legal { margin-top: 1rem; color: rgba($BAKANO-LIGHT, 0.42); font-size: 0.78rem; text-align: center; }

  &__ok {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    i { color: $BAKANO-GREEN; font-size: 3.2rem; }
    h2 { margin: 1rem 0 0.5rem; font-family: 'Outfit', sans-serif; font-size: 1.9rem; }
    p { margin: 0; color: rgba($BAKANO-LIGHT, 0.75); }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 2.5rem 1.5rem 3rem;
    border-top: 1px solid rgba(#fff, 0.08);
    text-align: center;
    img { width: 92px; opacity: 0.75; }
    p { margin: 0; color: rgba($BAKANO-LIGHT, 0.45); font-size: 0.82rem; }
    nav { display: flex; gap: 1.25rem; }
    a { color: rgba($BAKANO-LIGHT, 0.55); font-size: 0.82rem; text-decoration: none; &:hover { color: $BAKANO-PINK; } }
  }

  @media (min-width: 768px) {
    section { padding: 5rem 2rem; }
    &__hero { padding-top: 4rem; }
    &__lead { font-size: 1.08rem; }
  }
}
</style>
