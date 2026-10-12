<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import PhoneField from './PhoneField.vue'
import { trackStage, generateEventId, guardarParcial } from '@/utils/ghl'
import { getStoredFbParams } from '@/utils/fbclid'
import { etiquetaPlan, valorPlan, planes, INVERSION_MINIMA } from '@/data/reconstruccion'

const props = defineProps<{ plan?: string }>()
const emit = defineEmits<{ (e: 'enviado', nombre: string, interes: string): void }>()

/**
 * Formulario corto a propósito: primero un toque (qué necesita), después tres datos.
 * Nombre y apellido van en un solo campo; el negocio ya no se pide (era opcional y
 * alargaba el modal). GHL y CAPI siguen recibiendo `nombre` y `apellido` por separado.
 */
const form = ref({
  nombreCompleto: '',
  telefono: '',
  email: '',
  interes: props.plan ?? '',
  inversion: false,
})
const enviando = ref(false)
const enviado = ref(false)
const error = ref('')
/** Se activa al primer intento de enviar: desde ahí se marca lo que falta. */
const intentado = ref(false)

const soloChisme = computed(() => form.value.interes === 'ayudar')

// Suficiente para atajar typos evidentes; la validación real la hace GHL al deduplicar.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** "María José Pérez" → nombre "María", apellido "José Pérez". */
const partes = computed(() => {
  const [nombre = '', ...resto] = form.value.nombreCompleto.trim().split(/\s+/)
  return { nombre, apellido: resto.join(' ') }
})

const faltaNombre = computed(() => form.value.nombreCompleto.trim().length < 2)
const faltaTelefono = computed(() => form.value.telefono === '')
const faltaEmail = computed(() => !EMAIL_RE.test(form.value.email.trim()))
const faltaInversion = computed(() => !soloChisme.value && !form.value.inversion)

/** Lo primero que falta, en el orden del formulario. Vacío si está todo. */
const faltante = computed(() => {
  if (!form.value.interes) return 'Elige si quieres web o tienda'
  if (faltaNombre.value) return 'Escribe tu nombre'
  if (faltaTelefono.value) return 'Escribe un WhatsApp válido'
  if (faltaEmail.value) return 'Escribe un correo válido'
  if (faltaInversion.value) return 'Confirma que tienes la inversión mínima'
  return ''
})

const precio = (id: string) => `$${planes.find((p) => p.id === id)?.precio ?? ''}`

const opciones = [
  { id: 'web', icono: 'fa-globe', texto: 'Página web', precio: precio('web') },
  { id: 'tienda', icono: 'fa-cart-shopping', texto: 'Tienda online', precio: precio('tienda') },
]

const datos = () => ({
  nombre: partes.value.nombre,
  apellido: partes.value.apellido,
  telefono: form.value.telefono,
  email: form.value.email.trim().toLowerCase(),
  negocio: '',
  interes: form.value.interes,
  plan_nombre: etiquetaPlan(form.value.interes),
  valor: valorPlan(form.value.interes),
  inversion_confirmada: form.value.inversion ? 'si' : 'no',
  origen: 'landing-reconstruccion',
  ...getStoredFbParams(),
})

/** Firma de lo último que se guardó como parcial, para no mandar dos veces lo mismo. */
let ultimoParcial = ''

/**
 * Si el usuario dejó al menos un teléfono o un correo y no envió, lo guardamos igual para
 * recuperarlo por WhatsApp. Se llama al cerrar el modal y al salir de la página.
 */
function guardarSiHayDatos() {
  if (enviado.value) return
  const d = datos()
  if (!d.telefono && !EMAIL_RE.test(d.email)) return
  const firma = JSON.stringify(d)
  if (firma === ultimoParcial) return
  ultimoParcial = firma
  guardarParcial(d)
}

const alOcultar = () => {
  if (document.visibilityState === 'hidden') guardarSiHayDatos()
}

onMounted(() => {
  window.addEventListener('pagehide', guardarSiHayDatos)
  document.addEventListener('visibilitychange', alOcultar)
})

onBeforeUnmount(() => {
  guardarSiHayDatos()
  window.removeEventListener('pagehide', guardarSiHayDatos)
  document.removeEventListener('visibilitychange', alOcultar)
})

const tieneDatos = computed(() => form.value.telefono !== '' || form.value.email.trim() !== '')

defineExpose({ guardarSiHayDatos, tieneDatos })

watch(
  () => props.plan,
  (p) => {
    if (p) form.value.interes = p
  },
)

async function enviar() {
  if (enviando.value) return
  // El botón nunca está gris: si falta algo, se dice qué en vez de dejar al usuario adivinando.
  if (faltante.value) {
    intentado.value = true
    return
  }
  enviando.value = true
  error.value = ''
  const event_id = generateEventId('lead')
  const plan = form.value.interes
  try {
    await trackStage('reconstruccion_lead', { event_id, ...datos() })
    enviado.value = true
    ;(window as any).fbq?.(
      'track',
      soloChisme.value ? 'Contact' : 'Lead',
      {},
      { eventID: event_id },
    )
    emit('enviado', partes.value.nombre, plan)
  } catch {
    error.value = 'No se pudo enviar. Escríbenos por WhatsApp y te atendemos igual.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="cf">
    <div class="cf__enc">
      <h2>Aparta tu cupo</h2>
      <p class="cf__sub">Toma menos de un minuto. Te escribimos por WhatsApp hoy mismo.</p>
    </div>

    <p class="cf__paso"><b>1</b> ¿Qué necesitas?</p>
    <div class="cf__opciones" :class="{ 'is-falta': intentado && !form.interes }">
      <label v-for="o in opciones" :key="o.id" :class="{ 'is-on': form.interes === o.id }">
        <input v-model="form.interes" type="radio" :value="o.id" />
        <i class="fa-solid" :class="o.icono"></i>
        <span>{{ o.texto }}</span>
        <strong>{{ o.precio }}</strong>
      </label>
    </div>


    <p class="cf__paso"><b>2</b> ¿A dónde te escribimos?</p>

    <label class="cf__campo" :class="{ 'is-falta': intentado && faltaNombre }">
      Nombre y apellido
      <input
        v-model="form.nombreCompleto"
        type="text"
        autocomplete="name"
        placeholder="María Pérez"
      />
    </label>

    <PhoneField v-model="form.telefono" />

    <label class="cf__campo" :class="{ 'is-falta': intentado && faltaEmail }">
      Correo
      <input
        v-model="form.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        autocapitalize="off"
        spellcheck="false"
        placeholder="maria@tunegocio.com"
      />
    </label>

    <Transition name="despliegue">
      <label
        v-if="form.interes && !soloChisme"
        class="cf__inversion"
        :class="{ 'is-on': form.inversion, 'is-falta': intentado && faltaInversion }"
      >
        <input v-model="form.inversion" type="checkbox" />
        <i class="fa-solid" :class="form.inversion ? 'fa-square-check' : 'fa-square'"></i>
        <span>
          Tengo <strong>al menos ${{ INVERSION_MINIMA }}</strong> para invertir y quiero arrancar
          este mes.
        </span>
      </label>
    </Transition>

    <div class="cf__pie">
      <Transition name="texto">
        <p v-if="intentado && faltante" class="cf__falta">
          <i class="fa-solid fa-circle-exclamation"></i> {{ faltante }}
        </p>
      </Transition>

      <button class="cf__cta" :disabled="enviando" @click="enviar">
        <i v-if="enviando" class="fa-solid fa-spinner fa-spin"></i>
        {{ enviando ? 'Enviando…' : 'Reservar mi cupo' }}
        <i v-if="!enviando" class="fa-solid fa-arrow-right"></i>
      </button>

      <p v-if="error" class="cf__error">{{ error }}</p>
    </div>

    <p class="cf__legal">Al escribir tus datos aceptas que te contactemos. Nada de spam.</p>
    <button class="cf__ayudar" :class="{ 'is-on': soloChisme }" @click="form.interes = 'ayudar'">
      <i v-if="soloChisme" class="fa-solid fa-check"></i> Solo quiero ayudar o saber el chisme
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

$ROJO: #ff8095;

.cf {
  display: flex;
  flex-direction: column;

  // Encabezado pegado arriba: al bajar dentro del modal no se pierde el contexto.
  &__enc {
    position: sticky;
    top: 0;
    z-index: 1;
    margin: 0 calc(var(--cm-pad, 1.5rem) * -1);
    // A la derecha, sitio para la X (36px + su separación).
    padding: 1.6rem calc(var(--cm-pad, 1.5rem) + 2.4rem) 0.9rem var(--cm-pad, 1.5rem);
    border-bottom: 1px solid rgba(#fff, 0.08);
    background: $BAKANO-DARK;
  }

  h2 {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    font-size: 1.45rem;
  }

  &__sub {
    margin: 0.3rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.88rem;
  }

  &__paso {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin: 1.3rem 0 0.65rem;
    font-size: 0.95rem;
    font-weight: 700;

    b {
      display: flex;
      width: 22px;
      height: 22px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: $BAKANO-PINK;
      color: #fff;
      font-size: 0.75rem;
    }
  }

  // Dos opciones lado a lado: un toque y listo.
  &__opciones {
    display: flex;
    gap: 0.6rem;

    label {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      padding: 0.85rem 0.9rem;
      border: 1px solid rgba(#fff, 0.14);
      border-radius: 12px;
      background: rgba(#fff, 0.04);
      cursor: pointer;
      transition:
        border-color 0.15s ease,
        background 0.15s ease;

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
        margin-bottom: 0.25rem;
        color: $BAKANO-PINK;
      }
      span {
        font-size: 0.9rem;
        font-weight: 600;
      }
      strong {
        color: $BAKANO-PINK;
        font-family: 'Outfit', sans-serif;
        font-size: 1.35rem;
      }
    }

    &.is-falta label {
      border-color: $ROJO;
    }
  }

  // Va al final, justo antes del botón: es lo último que confirma antes de reservar.
  &__inversion {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    margin-top: 1.1rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid rgba($BAKANO-PINK, 0.5);
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.88rem;
    line-height: 1.45;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;

    &.is-on {
      border-color: $BAKANO-GREEN;
      background: rgba($BAKANO-GREEN, 0.08);
      i {
        color: $BAKANO-GREEN;
      }
    }
    &.is-falta {
      border-color: $ROJO;
    }
    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    i {
      flex-shrink: 0;
      margin-top: 0.1rem;
      color: $BAKANO-PINK;
      font-size: 1.15rem;
    }
    strong {
      color: $BAKANO-PINK;
    }
  }

  &__campo {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.9rem;
    font-size: 0.86rem;
    font-weight: 600;

    input {
      min-width: 0;
      @include r.campo;
    }
    &.is-falta input {
      border-color: $ROJO;
    }
  }

  // El botón siempre visible abajo, aunque el formulario no quepa.
  &__pie {
    position: sticky;
    bottom: 0;
    margin: 1.3rem calc(var(--cm-pad, 1.5rem) * -1) 0;
    padding: 0.9rem var(--cm-pad, 1.5rem);
    border-top: 1px solid rgba(#fff, 0.08);
    background: $BAKANO-DARK;
  }

  &__falta {
    margin: 0 0 0.7rem;
    color: $ROJO;
    font-size: 0.88rem;
    font-weight: 600;
    text-align: center;
  }

  &__cta {
    width: 100%;
    @include r.cta;
  }

  &__error {
    margin: 0.7rem 0 0;
    color: $ROJO;
    font-size: 0.86rem;
    text-align: center;
  }

  &__legal {
    margin: 0.2rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.42);
    font-size: 0.76rem;
    text-align: center;
  }

  &__ayudar {
    display: block;
    margin: 0.3rem auto max(1rem, env(safe-area-inset-bottom));
    padding: 0.3rem;
    border: 0;
    background: none;
    color: rgba($BAKANO-LIGHT, 0.45);
    font-family: inherit;
    font-size: 0.78rem;
    text-decoration: underline;
    cursor: pointer;

    &.is-on {
      color: $BAKANO-PINK;
      text-decoration: none;
    }
  }
}

// Checkbox de inversión: aparece con un fundido corto.
.despliegue-enter-active,
.despliegue-leave-active,
.texto-enter-active,
.texto-leave-active {
  transition: opacity 0.15s ease;
}
.despliegue-enter-from,
.despliegue-leave-to,
.texto-enter-from,
.texto-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .despliegue-enter-active,
  .despliegue-leave-active,
  .texto-enter-active,
  .texto-leave-active,
  .cf__opciones label,
  .cf__inversion {
    transition: none;
  }
}
</style>
