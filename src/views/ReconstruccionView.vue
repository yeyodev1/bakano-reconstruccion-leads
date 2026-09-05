<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import HistoriaSection from '@/components/reconstruccion/HistoriaSection.vue'
import PlanesSection from '@/components/reconstruccion/PlanesSection.vue'
import TrabajosSection from '@/components/reconstruccion/TrabajosSection.vue'
import CupoModal from '@/components/reconstruccion/CupoModal.vue'
import ScrollCue from '@/components/reconstruccion/ScrollCue.vue'
import ScrollProgress from '@/components/reconstruccion/ScrollProgress.vue'
import { trackStage } from '@/utils/ghl'
import { captureFbParams } from '@/utils/fbclid'
import { REEL_CHISME } from '@/data/reconstruccion'
import logo from '@/assets/logos/bakano-light.png'

const modalAbierto = ref(false)
const planElegido = ref('')

function abrir(plan = '') {
  planElegido.value = plan
  modalAbierto.value = true
}

const scrollA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

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

  const reveal = (sel: string) =>
    gsap.utils.toArray<HTMLElement>(sel).forEach((el) => {
      gsap.from(el, {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })

  reveal('.hist__h2, .hist__sub, .hist__hito, .hist__reels figure, .hist__cierre')
  reveal('.plan__h2, .plan__sub, .plan__card')
  reveal('.job__h2, .job__sub, .job__item')
  reveal('.rc__contacto > *')
}

onMounted(async () => {
  // Tema oscuro a nivel documento: scrollbars nativas oscuras y sin flash blanco al overscroll.
  document.documentElement.classList.add('theme-dark')
  captureFbParams()
  trackStage('reconstruccion_view', {})
  await nextTick()
  animar()
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('theme-dark')
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <main class="rc">
    <ScrollProgress />

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

      <ScrollCue destino="historia" etiqueta="Lo que nos pasó" />
    </section>

    <HistoriaSection />
    <PlanesSection @elegir="abrir" />
    <TrabajosSection />

    <section id="contacto" class="rc__contacto">
      <h2 class="rc__h2">Asegura tu cupo</h2>
      <p class="rc__sub">Déjanos tus datos y te escribimos por WhatsApp hoy mismo.</p>
      <button class="rc__cta" @click="abrir()">
        Quiero mi cupo <i class="fa-solid fa-arrow-right"></i>
      </button>
      <a class="rc__chisme" :href="REEL_CHISME" target="_blank" rel="noopener">
        ¿Solo viniste por el chisme? Míralo y déjanos un like
        <i class="fa-brands fa-instagram"></i>
      </a>
    </section>

    <footer class="rc__footer">
      <img :src="logo" alt="Bakano" />
      <p>Bakano · Agencia de Performance Marketing · Guayaquil, Ecuador</p>
      <nav>
        <RouterLink to="/politicas-privacidad">Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso legal</RouterLink>
      </nav>
    </footer>

    <CupoModal :abierto="modalAbierto" :plan="planElegido" @cerrar="modalAbierto = false" />
  </main>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.rc {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: $BAKANO-DARK;
  color: $BAKANO-LIGHT;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &__hero,
  &__contacto {
    @include r.seccion;
  }
  &__hero {
    padding-top: 2.5rem;
    text-align: center;
  }

  &__contacto {
    background: rgba($BAKANO-PINK, 0.07);
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

  &__title {
    margin: 1.25rem 0 0;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 8.5vw, 3.4rem);
    font-weight: 800;
    line-height: 1.12;
    em {
      color: $BAKANO-PINK;
      font-style: normal;
    }
  }

  &__lead {
    max-width: 48ch;
    margin: 1.25rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.78);
    font-size: 1rem;
    line-height: 1.65;
    strong {
      color: $BAKANO-LIGHT;
    }
    @media (min-width: 768px) {
      font-size: 1.08rem;
    }
  }

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }
  &__cta {
    margin-top: 1.75rem;
    @include r.cta;
  }

  &__nota {
    margin-top: 1.5rem;
    color: rgba($BAKANO-LIGHT, 0.5);
    font-size: 0.88rem;
    font-style: italic;
  }

  &__chisme {
    margin-top: 1.5rem;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.88rem;
    text-align: center;
    text-decoration: none;
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
}
</style>
