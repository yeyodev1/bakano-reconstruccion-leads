<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Popup de intención de salida. Sale una sola vez por sesión, cuando parece que se va:
 *   - escritorio: el mouse sale por arriba de la ventana (hacia las pestañas o la X);
 *   - móvil: vuelve a la pestaña después de irse a otra app, o sube rápido hacia el inicio.
 *
 * No secuestra el botón "atrás": Google y Meta lo tratan como práctica engañosa y castiga
 * la landing en los anuncios.
 */
const props = defineProps<{ bloqueado: boolean }>()
const emit = defineEmits<{ (e: 'apartar'): void }>()

const visible = ref(false)
const CLAVE = 'bk_salida_vista'
/** No asustar a quien recién llega: el popup se arma pasados unos segundos. */
const ESPERA_MS = 8000

let armado = false
let timer = 0
let ocultoDesde = 0
let ultimoY = 0
let ultimoT = 0

function yaVisto() {
  try {
    return sessionStorage.getItem(CLAVE) === '1'
  } catch {
    return false
  }
}

function mostrar() {
  if (!armado || props.bloqueado || visible.value || yaVisto()) return
  visible.value = true
  document.body.style.overflow = 'hidden'
  try {
    sessionStorage.setItem(CLAVE, '1')
  } catch {
    // Sin storage puede volver a salir en la sesión; no pasa nada.
  }
}

function cerrar() {
  visible.value = false
  document.body.style.overflow = ''
}

function apartar() {
  cerrar()
  emit('apartar')
}

const alSalirMouse = (e: MouseEvent) => {
  if (e.clientY <= 0 && !e.relatedTarget) mostrar()
}

const alCambiarVisibilidad = () => {
  if (document.visibilityState === 'hidden') ocultoDesde = Date.now()
  else if (ocultoDesde && Date.now() - ocultoDesde > 3000) mostrar()
}

/** Subir de golpe más de media pantalla después de haber bajado es señal de que se va. */
const alScroll = () => {
  const y = window.scrollY
  const t = Date.now()
  const subio = ultimoY - y
  if (y > 400 && subio > window.innerHeight * 0.5 && t - ultimoT < 450) mostrar()
  if (t - ultimoT > 120) {
    ultimoY = y
    ultimoT = t
  }
}

onMounted(() => {
  timer = window.setTimeout(() => (armado = true), ESPERA_MS)
  document.addEventListener('mouseout', alSalirMouse)
  document.addEventListener('visibilitychange', alCambiarVisibilidad)
  window.addEventListener('scroll', alScroll, { passive: true })
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  document.removeEventListener('mouseout', alSalirMouse)
  document.removeEventListener('visibilitychange', alCambiarVisibilidad)
  window.removeEventListener('scroll', alScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sm">
      <div v-if="visible" class="sm" @click.self="cerrar">
        <div class="sm__box" role="dialog" aria-modal="true" aria-labelledby="sm-titulo">
          <button class="sm__x" aria-label="Cerrar" @click="cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <span class="sm__badge"
            ><i class="fa-solid fa-triangle-exclamation"></i> No te vayas así</span
          >
          <h2 id="sm-titulo">Te vas a ir sin tu página web de $500</h2>
          <p>
            La misma web que normalmente cuesta <strong>entre $2,000 y $4,000</strong>. Solo 30
            cupos, solo este mes. Cuando se llenen, se acabó.
          </p>

          <ul class="sm__prueba">
            <li>
              <i class="fa-solid fa-bolt"></i>
              <span
                ><strong>Dogtown Organics</strong> facturando con su tienda en menos de 24
                horas.</span
              >
            </li>
            <li>
              <i class="fa-solid fa-cake-candles"></i>
              <span>
                A <strong>Nicole Pastry Arts</strong> le habían cobrado $2,000. Hoy vende sola, sin
                WhatsApp.
              </span>
            </li>
          </ul>

          <button class="sm__cta" @click="apartar">
            Sí, quiero apartar mi cupo <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button class="sm__no" @click="cerrar">No, prefiero seguir sin vender en línea</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.sm {
  position: fixed;
  inset: 0;
  z-index: 95;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(#000, 0.8);

  &__box {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 440px;
    max-height: calc(100dvh - 2rem);
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 2.4rem 1.5rem 1.5rem;
    border: 1px solid rgba($BAKANO-PINK, 0.45);
    border-radius: 20px;
    background: $BAKANO-DARK;
    color: $BAKANO-LIGHT;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-align: center;

    h2 {
      margin: 1rem 0 0.7rem;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.45rem, 6vw, 1.8rem);
      font-weight: 800;
      line-height: 1.15;
    }
    > p {
      margin: 0;
      color: rgba($BAKANO-LIGHT, 0.8);
      font-size: 0.96rem;
      line-height: 1.6;
    }
    strong {
      color: $BAKANO-PINK;
    }
  }

  &__x {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    display: flex;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgba(#fff, 0.09);
    color: $BAKANO-LIGHT;
    cursor: pointer;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba($BAKANO-PINK, 0.15);
    color: $BAKANO-PINK;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__prueba {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 0.6rem;
    margin: 1.2rem 0 0;
    padding: 0;
    list-style: none;
    text-align: left;

    li {
      display: flex;
      gap: 0.7rem;
      padding: 0.75rem 0.9rem;
      border-radius: 11px;
      background: rgba(#fff, 0.05);
      font-size: 0.88rem;
      line-height: 1.45;
    }
    i {
      flex-shrink: 0;
      margin-top: 0.2rem;
      color: $BAKANO-GREEN;
    }
    strong {
      color: $BAKANO-LIGHT;
    }
  }

  &__cta {
    width: 100%;
    margin-top: 1.4rem;
    @include r.cta;
  }

  &__no {
    margin-top: 0.8rem;
    padding: 0.4rem;
    border: 0;
    background: none;
    color: rgba($BAKANO-LIGHT, 0.38);
    font-family: inherit;
    font-size: 0.82rem;
    text-decoration: underline;
    cursor: pointer;
  }
}

.sm-enter-active,
.sm-leave-active {
  transition: opacity 0.22s ease;
}
.sm-enter-from,
.sm-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .sm-enter-active,
  .sm-leave-active,
  .sm-enter-active .sm__box,
  .sm-leave-active .sm__box {
    transition: none;
  }
}
</style>
