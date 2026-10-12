<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import HistoriaSection from '@/components/reconstruccion/HistoriaSection.vue'
import PlanesSection from '@/components/reconstruccion/PlanesSection.vue'
import PasosSection from '@/components/reconstruccion/PasosSection.vue'
import TrabajosSection from '@/components/reconstruccion/TrabajosSection.vue'
import CasosSection from '@/components/reconstruccion/CasosSection.vue'
import CupoModal from '@/components/reconstruccion/CupoModal.vue'
import SalidaModal from '@/components/reconstruccion/SalidaModal.vue'
import ScrollCue from '@/components/reconstruccion/ScrollCue.vue'
import { trackStage } from '@/utils/ghl'
import { captureFbParams } from '@/utils/fbclid'
import { REEL_CHISME, planes } from '@/data/reconstruccion'
import logo from '@/assets/logos/bakano-light.png'

const modalAbierto = ref(false)
const planElegido = ref('')

function abrir(plan = '') {
  planElegido.value = plan
  modalAbierto.value = true
}

/** Barra fija de abajo: aparece al pasar el hero, para que el CTA nunca quede lejos. */
const barra = ref(false)
const alScroll = () => (barra.value = window.scrollY > window.innerHeight * 0.8)

const scrollA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/** Lo máximo que se ahorra frente al precio normal más alto ($4,000). */
const ahorro = (4000 - Math.min(...planes.map((p) => p.precio))).toLocaleString('en-US')

const confianza = [
  {
    icono: 'fa-solid fa-magnifying-glass-chart',
    texto: 'SEO + GEO: te encuentran en Google y ChatGPT',
  },
  { icono: 'fa-solid fa-credit-card', texto: 'Cobros en línea con PayPhone' },
  { icono: 'fa-brands fa-whatsapp', texto: 'Te escribimos por WhatsApp hoy' },
  { icono: 'fa-solid fa-chart-line', texto: 'Pauta manejada para más de 100 clientes' },
]

onMounted(() => {
  // Tema oscuro a nivel documento: scrollbars nativas oscuras y sin flash blanco al overscroll.
  document.documentElement.classList.add('theme-dark')
  captureFbParams()
  trackStage('reconstruccion_view', {})
  window.addEventListener('scroll', alScroll, { passive: true })
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('theme-dark')
  window.removeEventListener('scroll', alScroll)
})
</script>

<template>
  <main class="rc">
    <section class="rc__hero">
      <div class="rc__hero-in">
        <div class="rc__hero-txt">
          <img :src="logo" alt="Bakano" class="rc__logo" />
          <span class="rc__badge">Solo 30 cupos · este mes</span>
          <h1 class="rc__title">
            Nos robaron.<br />
            Y en vez de cerrar,
            <em>te hacemos tu página web.</em>
          </h1>
          <p class="rc__lead">
            Confiamos en la persona equivocada y perdimos todos los equipos de la agencia. Para
            ponernos de pie hacemos lo que mejor sabemos: <strong>trabajar</strong>. Abrimos 30
            cupos con webs que normalmente cuestan <strong>$2,000 a $4,000</strong>.
          </p>

          <div class="rc__acciones">
            <button class="rc__cta" @click="abrir()">
              Apartar mi cupo ahora <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="rc__sec" @click="scrollA('casos')">
              Ver quiénes ya están vendiendo <i class="fa-solid fa-arrow-down"></i>
            </button>
          </div>
        </div>

        <aside class="rc__ticket" aria-label="Precios de reconstrucción">
          <div class="rc__ticket-top">
            <span>Precio de reconstrucción</span>
            <span class="rc__ticket-cupos"><i class="fa-solid fa-fire"></i> 30 cupos</span>
          </div>

          <button v-for="p in planes" :key="p.id" class="rc__fila" @click="abrir(p.id)">
            <i class="fa-solid" :class="p.icono"></i>
            <span class="rc__fila-nombre">
              {{ p.nombre }}
              <s>$2,000 – $4,000</s>
            </span>
            <strong>${{ p.precio }}</strong>
          </button>

          <div class="rc__ticket-pie">
            <span><i class="fa-solid fa-piggy-bank"></i> Ahorras hasta ${{ ahorro }}</span>
            <span>Cuando se llenen, vuelve el precio normal</span>
          </div>
        </aside>
      </div>

      <ul class="rc__confianza">
        <li v-for="c in confianza" :key="c.texto">
          <i :class="c.icono"></i>
          <span>{{ c.texto }}</span>
        </li>
      </ul>

      <ScrollCue destino="historia" etiqueta="Lo que nos pasó" />
    </section>

    <HistoriaSection />
    <CasosSection @elegir="abrir" />
    <PlanesSection @elegir="abrir" />
    <PasosSection @elegir="abrir" />
    <TrabajosSection />

    <section id="contacto" class="rc__contacto">
      <div class="rc__final">
        <span class="rc__final-badge"
          ><i class="fa-solid fa-hourglass-half"></i> Últimos cupos del mes</span
        >
        <h2>Dogtown y Nicole ya se arriesgaron. ¿Y tú?</h2>
        <p>
          Web desde <strong>$500</strong> y tienda con PayPhone a <strong>$600</strong>. Cuando se
          llenen los 30 cupos vuelve la tarifa de $2,000 a $4,000.
        </p>
        <ul>
          <li><i class="fa-solid fa-check"></i> Dejas tus datos en menos de un minuto</li>
          <li><i class="fa-solid fa-check"></i> Te escribimos por WhatsApp hoy mismo</li>
          <li><i class="fa-solid fa-check"></i> Arrancamos tu web este mes</li>
        </ul>
        <button class="rc__cta rc__cta--grande" @click="abrir()">
          Quiero mi cupo ahora <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
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

    <div v-if="barra && !modalAbierto" class="rc__barra">
      <span>Web <strong>$500</strong> · Tienda <strong>$600</strong></span>
      <button @click="abrir()">Apartar cupo <i class="fa-solid fa-arrow-right"></i></button>
    </div>

    <CupoModal :abierto="modalAbierto" :plan="planElegido" @cerrar="modalAbierto = false" />
    <SalidaModal :bloqueado="modalAbierto" @apartar="abrir()" />
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

  // ---------- Hero ----------
  &__hero {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.25rem 1.25rem 2.5rem;

    @media (min-width: 768px) {
      padding: 3rem 2rem 3rem;
    }
  }

  &__hero-in {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 1120px;
    flex-direction: column;
    gap: 2.25rem;

    @media (min-width: 960px) {
      flex-direction: row;
      align-items: center;
      gap: 3.5rem;
    }
  }

  &__hero-txt {
    display: flex;
    flex: 1.15;
    flex-direction: column;
    align-items: flex-start;
  }

  &__logo {
    width: 112px;
    margin-bottom: 1.75rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 0.95rem;
    border: 1px solid rgba($BAKANO-PINK, 0.5);
    border-radius: 999px;
    background: rgba($BAKANO-PINK, 0.12);
    color: $BAKANO-PINK;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__title {
    margin: 1.2rem 0 0;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2.3rem, 10vw, 4.1rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.02;

    em {
      display: block;
      margin-top: 0.15em;
      color: $BAKANO-PINK;
      font-style: normal;
    }
  }

  &__lead {
    max-width: 50ch;
    margin: 1.3rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.75);
    font-size: 1.02rem;
    line-height: 1.65;

    strong {
      color: $BAKANO-LIGHT;
    }
    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }

  &__acciones {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.9rem;
    margin-top: 1.9rem;

    @media (min-width: 560px) {
      flex-direction: row;
      align-items: center;
      width: auto;
    }
  }

  &__cta {
    @include r.cta;
    white-space: nowrap;

    &--grande {
      width: 100%;
      margin-top: 1.75rem;
      padding: 1.2rem 2rem;
      font-size: 1.08rem;

      @media (min-width: 560px) {
        width: auto;
      }
    }
  }

  &__sec {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    padding: 0.95rem 1.4rem;
    border: 1px solid rgba(#fff, 0.14);
    border-radius: 999px;
    background: rgba(#fff, 0.04);
    color: $BAKANO-LIGHT;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;

    &:hover {
      border-color: rgba($BAKANO-PINK, 0.6);
    }
  }

  // Tarjeta de precios del hero: el dato que el usuario vino a buscar, a la vista.
  &__ticket {
    position: relative;
    display: flex;
    flex: 0.85;
    flex-direction: column;
    gap: 0.7rem;
    padding: 1.25rem;
    @include r.tarjeta;
    border-color: rgba($BAKANO-PINK, 0.35);
    border-color: rgba($BAKANO-PINK, 0.4);

    @media (min-width: 960px) {
      padding: 1.6rem;
    }
  }

  &__ticket-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.3rem;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__ticket-cupos {
    flex-shrink: 0;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    background: $BAKANO-PINK;
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  &__fila {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 14px;
    background: rgba($BAKANO-DARK, 0.7);
    color: $BAKANO-LIGHT;
    font-family: inherit;
    text-align: left;
    cursor: pointer;

    &:hover {
      border-color: $BAKANO-PINK;
    }

    > i {
      display: flex;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba($BAKANO-PINK, 0.15);
      color: $BAKANO-PINK;
    }

    strong {
      margin-left: auto;
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
    }
  }

  &__fila-nombre {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-weight: 700;
    font-size: 0.95rem;

    s {
      color: rgba($BAKANO-LIGHT, 0.4);
      font-size: 0.8rem;
      font-weight: 400;
    }
  }

  &__ticket-pie {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.3rem;
    padding-top: 0.9rem;
    border-top: 1px dashed rgba(#fff, 0.16);

    span:first-child {
      color: $BAKANO-GREEN;
      font-weight: 700;
      i {
        margin-right: 0.35rem;
      }
    }
    span:last-child {
      color: rgba($BAKANO-LIGHT, 0.5);
      font-size: 0.82rem;
    }
  }

  &__confianza {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 1120px;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 2.5rem 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      flex: 1 1 220px;
      align-items: center;
      gap: 0.7rem;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(#fff, 0.08);
      border-radius: 14px;
      background: rgba(#fff, 0.03);
      color: rgba($BAKANO-LIGHT, 0.8);
      font-size: 0.86rem;
      line-height: 1.35;
    }
    i {
      flex-shrink: 0;
      color: $BAKANO-PINK;
      font-size: 1.05rem;
    }
  }

  // ---------- Cierre ----------
  &__contacto {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3.5rem 1.25rem;

    @media (min-width: 768px) {
      padding: 5rem 2rem;
    }
  }

  &__final {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 880px;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    padding: 2.25rem 1.5rem;
    border: 1px solid rgba($BAKANO-PINK, 0.4);
    border-radius: 26px;
    background: rgba($BAKANO-PINK, 0.06);

    @media (min-width: 768px) {
      padding: 3.25rem;
    }

    h2 {
      margin: 1rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.8rem, 6.5vw, 2.8rem);
      font-weight: 800;
      letter-spacing: -0.01em;
      line-height: 1.08;
    }
    > p {
      max-width: 52ch;
      margin: 0.9rem 0 0;
      color: rgba($BAKANO-LIGHT, 0.78);
      font-size: 1.02rem;
      line-height: 1.6;
    }
    strong {
      color: $BAKANO-PINK;
    }
    ul {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      margin: 1.4rem 0 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.96rem;
    }
    li i {
      display: flex;
      width: 22px;
      height: 22px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba($BAKANO-GREEN, 0.2);
      color: $BAKANO-GREEN;
      font-size: 0.7rem;
    }
  }

  &__final-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    background: rgba(#000, 0.3);
    color: $BAKANO-LIGHT;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    i {
      color: $BAKANO-PINK;
    }
  }

  &__chisme {
    margin-top: 1.75rem;
    color: rgba($BAKANO-LIGHT, 0.55);
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

  &__barra {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 1rem max(0.7rem, env(safe-area-inset-bottom));
    border-top: 1px solid rgba($BAKANO-PINK, 0.35);
    background: $BAKANO-DARK;

    span {
      color: rgba($BAKANO-LIGHT, 0.8);
      font-size: 0.84rem;
      white-space: nowrap;
    }
    strong {
      color: $BAKANO-PINK;
    }
    button {
      flex-shrink: 0;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      @include r.cta;
    }

    @media (min-width: 768px) {
      justify-content: center;
      gap: 1.5rem;
      span {
        font-size: 0.95rem;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    // Abajo deja sitio para la barra fija del CTA.
    padding: 2.5rem 1.5rem 6rem;
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
