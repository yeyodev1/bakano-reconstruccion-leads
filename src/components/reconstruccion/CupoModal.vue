<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import CupoForm from './CupoForm.vue'
import { REEL_CHISME } from '@/data/reconstruccion'

const props = defineProps<{ abierto: boolean; plan?: string }>()
const emit = defineEmits<{ (e: 'cerrar'): void }>()

const enviado = ref(false)
const nombre = ref('')
const interes = ref('')

const formRef = ref<InstanceType<typeof CupoForm> | null>(null)
/** Pantalla de "espera" que sale la primera vez que intenta cerrar sin enviar. */
const reteniendo = ref(false)
const yaRetenido = ref(false)

function intentarCerrar() {
  if (enviado.value) return emit('cerrar')
  // Lo que haya escrito se guarda antes de cualquier otra cosa: aunque insista en irse,
  // el contacto ya quedó en GHL para recuperarlo.
  formRef.value?.guardarSiHayDatos()
  if (!yaRetenido.value) {
    yaRetenido.value = true
    reteniendo.value = true
    return
  }
  emit('cerrar')
}

function onEnviado(n: string, i: string) {
  nombre.value = n
  interes.value = i
  enviado.value = true
}

watch(
  () => props.abierto,
  (v) => {
    document.body.style.overflow = v ? 'hidden' : ''
    if (!v) {
      enviado.value = false
      reteniendo.value = false
      yaRetenido.value = false
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cm">
      <div v-if="abierto" class="cm" @click.self="intentarCerrar">
        <div class="cm__box" role="dialog" aria-modal="true" aria-label="Asegura tu cupo">
          <button class="cm__x" aria-label="Cerrar" @click="intentarCerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="cm__scroll">
            <!-- v-show y no v-if: al volver de la pantalla de retención, lo escrito sigue ahí. -->
            <CupoForm
              v-if="!enviado"
              v-show="!reteniendo"
              ref="formRef"
              :key="String(abierto)"
              :plan="plan"
              @enviado="onEnviado"
            />

            <div v-if="reteniendo && !enviado" class="cm__retener">
              <i class="fa-solid fa-hand"></i>
              <h2>Espera. Esto no se repite.</h2>
              <p>
                Cuando se llenen los 30 cupos, esta misma web vuelve a costar
                <strong>entre $2,000 y $4,000</strong>. A Nicole Pastry Arts otra empresa le cobró
                <strong>$2,000</strong>. Tú la tienes desde <strong>$500</strong>.
              </p>
              <p>
                A Dogtown Organics le escribimos por Instagram y en menos de 24 horas ya estaba
                facturando con su tienda. ¿Cuántas ventas más vas a dejar pasar?
              </p>
              <p v-if="formRef?.tieneDatos" class="cm__guardado">
                <i class="fa-solid fa-circle-check"></i> Ya tenemos tus datos: si te vas igual te
                escribimos por WhatsApp para guardarte el cupo.
              </p>
              <button class="cm__cta" @click="reteniendo = false">
                Volver y apartar mi cupo <i class="fa-solid fa-arrow-right"></i>
              </button>
              <button class="cm__salir" @click="emit('cerrar')">
                No, prefiero pagar $2,000 después
              </button>
            </div>

            <div v-if="enviado" class="cm__ok">
              <i class="fa-solid fa-circle-check"></i>
              <h2>Listo, {{ nombre }}</h2>

              <template v-if="interes === 'ayudar'">
                <p>Gracias por el interés. El chisme completo está en el reel.</p>
                <a class="cm__cta" :href="REEL_CHISME" target="_blank" rel="noopener">
                  <i class="fa-brands fa-instagram"></i> Verlo y darnos like
                </a>
              </template>

              <template v-else>
                <p>Tu cupo quedó apartado. Te escribimos por WhatsApp hoy mismo.</p>
                <p class="cm__nota">Gracias por ayudarnos a reconstruir.</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.cm {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  // Centrado también en móvil: el modal aparece en el medio, no sube desde abajo.
  align-items: center;
  padding: 1rem;
  justify-content: center;
  // El scroll vive dentro de la caja, no aquí: una caja más alta que el overlay
  // con align-items distinto de flex-start deja su parte superior fuera de alcance.
  overflow: hidden;
  background: rgba(#000, 0.72);
  backdrop-filter: blur(4px);

  &__box {
    // Padding compartido: el pie pegajoso del formulario lo lee para sangrar igual.
    --cm-pad: 1.5rem;

    position: relative;
    display: flex;
    width: 100%;
    max-width: 460px;
    // Nunca a pantalla completa: dejar ver la página detrás ubica al usuario y se ve mejor.
    // La caja mide lo que su contenido; el tope solo aplica en pantallas muy bajas.
    max-height: 90vh;
    max-height: 90dvh; // dvh descuenta la barra del navegador móvil
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(#fff, 0.12);
    border-radius: 20px;
    background: $BAKANO-DARK;
    color: $BAKANO-LIGHT;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  &__scroll {
    flex: 1;
    overflow-y: auto;
    // Sin sangria arriba: el encabezado pegajoso del formulario aporta la suya
    // y asi puede taparse el contenido que le pasa por detras.
    padding: 0 var(--cm-pad);
    // Que el scroll no se propague a la página de atrás al llegar al tope.
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  &__x {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    z-index: 2;
    display: flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgba(#fff, 0.09);
    color: $BAKANO-LIGHT;
    cursor: pointer;
    &:hover {
      background: rgba(#fff, 0.18);
    }
  }

  &__ok {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 0 max(2.25rem, env(safe-area-inset-bottom));
    text-align: center;

    > i {
      color: $BAKANO-GREEN;
      font-size: 3rem;
    }
    h2 {
      margin: 0.9rem 0 0.5rem;
      font-family: 'Outfit', sans-serif;
      font-size: 1.55rem;
    }
    p {
      margin: 0 0 1.25rem;
      color: rgba($BAKANO-LIGHT, 0.75);
    }
  }

  &__cta {
    width: 100%;
    @include r.cta;
  }

  // Cada pantalla del modal (formulario, retención, listo) entra deslizándose.
  // Con v-show la animación se reinicia al pasar de display:none a visible, así que
  // también corre cuando vuelve al formulario desde la retención.
  &__scroll > .cf,
  &__retener,
  &__ok {
    animation: pantalla 0.2s ease;
  }

  &__retener {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 0 max(1.75rem, env(safe-area-inset-bottom));
    text-align: center;

    > i {
      color: $BAKANO-PINK;
      font-size: 2.6rem;
    }
    h2 {
      margin: 0.9rem 0 0.8rem;
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
    }
    p {
      margin: 0 0 0.9rem;
      color: rgba($BAKANO-LIGHT, 0.8);
      font-size: 0.96rem;
      line-height: 1.6;
    }
    strong {
      color: $BAKANO-PINK;
    }
    .cm__cta {
      margin-top: 0.6rem;
    }
  }

  &__guardado {
    padding: 0.75rem 0.9rem;
    border-radius: 10px;
    background: rgba($BAKANO-GREEN, 0.1);
    color: $BAKANO-LIGHT !important;
    font-size: 0.88rem !important;
    i {
      margin-right: 0.3rem;
      color: $BAKANO-GREEN;
    }
  }

  &__salir {
    margin-top: 1rem;
    padding: 0.5rem;
    border: 0;
    background: none;
    color: rgba($BAKANO-LIGHT, 0.4);
    font-family: inherit;
    font-size: 0.84rem;
    text-decoration: underline;
    cursor: pointer;
  }

  &__nota {
    color: rgba($BAKANO-LIGHT, 0.5) !important;
    font-size: 0.86rem;
    font-style: italic;
  }

  @media (min-width: 640px) {
    padding: 1.5rem;
    &__box {
      max-height: min(820px, calc(100dvh - 4rem));
    }
  }
}

.cm-enter-active,
.cm-leave-active {
  transition: opacity 0.2s ease;
}
.cm-enter-from,
.cm-leave-to {
  opacity: 0;
}

@keyframes pantalla {
  from {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cm__scroll > .cf,
  .cm__retener,
  .cm__ok {
    animation: none;
  }

  .cm-enter-active,
  .cm-leave-active {
    transition: none;
  }
}
</style>
