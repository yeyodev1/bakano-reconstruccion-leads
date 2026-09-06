<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PhoneField from './PhoneField.vue'
import { trackStage, generateEventId } from '@/utils/ghl'
import { getStoredFbParams } from '@/utils/fbclid'
import { etiquetaPlan, valorPlan } from '@/data/reconstruccion'

const props = defineProps<{ plan?: string }>()
const emit = defineEmits<{ (e: 'enviado', nombre: string, interes: string): void }>()

const form = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  negocio: '',
  interes: props.plan ?? '',
})
const enviando = ref(false)
const error = ref('')

const soloChisme = computed(() => form.value.interes === 'ayudar')

// Suficiente para atajar typos evidentes; la validación real la hace GHL al deduplicar.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const valido = computed(
  () =>
    form.value.nombre.trim().length > 1 &&
    form.value.apellido.trim().length > 1 &&
    form.value.telefono !== '' &&
    EMAIL_RE.test(form.value.email.trim()) &&
    form.value.interes !== '',
)

const opciones = [
  { id: 'web', icono: 'fa-globe', texto: 'Página Web Pro', precio: '$400' },
  { id: 'tienda', icono: 'fa-cart-shopping', texto: 'Tienda Online + PayPhone', precio: '$500' },
  { id: 'ayudar', icono: 'fa-heart', texto: 'Solo quiero ayudar o saber el chisme', precio: '' },
]

watch(
  () => props.plan,
  (p) => {
    if (p) form.value.interes = p
  },
)

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
      apellido: form.value.apellido.trim(),
      telefono: form.value.telefono,
      email: form.value.email.trim().toLowerCase(),
      negocio: form.value.negocio.trim(),
      interes: plan,
      plan_nombre: etiquetaPlan(plan),
      valor: valorPlan(plan),
      origen: 'landing-reconstruccion',
      ...getStoredFbParams(),
    })
    ;(window as any).fbq?.(
      'track',
      soloChisme.value ? 'Contact' : 'Lead',
      {},
      { eventID: event_id },
    )
    emit('enviado', form.value.nombre.trim(), plan)
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
      <h2>Asegura tu cupo</h2>
      <p class="cf__sub">Te escribimos por WhatsApp hoy mismo.</p>
    </div>

    <div class="cf__fila">
      <label>Tu nombre <input v-model="form.nombre" type="text" placeholder="María" /></label>
      <label>Tu apellido <input v-model="form.apellido" type="text" placeholder="Pérez" /></label>
    </div>

    <PhoneField v-model="form.telefono" />

    <label class="cf__campo">
      Tu correo
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

    <label class="cf__campo">
      Tu negocio <span>(opcional)</span>
      <input v-model="form.negocio" type="text" placeholder="Ej. Panadería La Espiga" />
    </label>

    <p class="cf__pregunta">¿Qué te interesa?</p>
    <div class="cf__opciones">
      <label v-for="o in opciones" :key="o.id" :class="{ 'is-on': form.interes === o.id }">
        <input v-model="form.interes" type="radio" :value="o.id" />
        <i class="fa-solid" :class="o.icono"></i>
        <span>
          {{ o.texto }}
          <strong v-if="o.precio">{{ o.precio }}</strong>
        </span>
      </label>
    </div>

    <div class="cf__pie">
      <button class="cf__cta" :disabled="!valido || enviando" @click="enviar">
        <i v-if="enviando" class="fa-solid fa-spinner fa-spin"></i>
        {{ enviando ? 'Enviando…' : soloChisme ? 'Enviar' : 'Reservar mi cupo' }}
      </button>

      <p v-if="error" class="cf__error">{{ error }}</p>
      <p class="cf__legal">Al enviar aceptas que te contactemos. Nada de spam.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.cf {
  display: flex;
  flex-direction: column;

  // El encabezado se queda pegado arriba: al bajar dentro del modal, el titulo y
  // el subtitulo se iban de largo y la caja quedaba sin contexto, con la X
  // flotando sobre un campo cualquiera.
  &__enc {
    position: sticky;
    top: 0;
    z-index: 1;
    // Sangra el ancho completo de la caja para tapar lo que pasa por detras.
    margin: 0 calc(var(--cm-pad, 1.5rem) * -1);
    // A la derecha, sitio para la X (36px + su separacion).
    padding: 2rem calc(var(--cm-pad, 1.5rem) + 2.4rem) 0.7rem var(--cm-pad, 1.5rem);
    background: $BAKANO-DARK;

    // Mismo difuminado que el pie, en espejo.
    &::after {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      height: 1.4rem;
      background: linear-gradient(to bottom, $BAKANO-DARK, rgba($BAKANO-DARK, 0));
      content: '';
      pointer-events: none;
    }
  }

  h2 {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    font-size: 1.55rem;
  }

  &__sub {
    margin: 0.45rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.62);
    font-size: 0.92rem;
  }

  &__fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    label {
      flex: 1 1 140px;
    }
  }

  &__fila label,
  &__campo {
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
    input {
      min-width: 0;
      @include r.campo;
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

  // El formulario es largo: en pantallas bajas el botón quedaba fuera de vista y
  // parecía que no había forma de enviar. Pegado abajo, siempre está a la mano.
  &__pie {
    position: sticky;
    bottom: 0;
    margin: 0 calc(var(--cm-pad, 1.5rem) * -1);
    padding: 0.9rem var(--cm-pad, 1.5rem) max(1rem, env(safe-area-inset-bottom));
    background: $BAKANO-DARK;

    // Difumina el contenido que pasa por detrás en vez de cortarlo en seco.
    &::before {
      position: absolute;
      top: -1.6rem;
      right: 0;
      left: 0;
      height: 1.6rem;
      background: linear-gradient(to bottom, rgba($BAKANO-DARK, 0), $BAKANO-DARK);
      content: '';
      pointer-events: none;
    }
  }

  &__cta {
    width: 100%;
    @include r.cta;
  }

  &__error {
    margin-top: 0.85rem;
    color: #ff8095;
    font-size: 0.86rem;
    text-align: center;
  }

  &__legal {
    margin: 0.7rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.42);
    font-size: 0.76rem;
    text-align: center;
  }

  // Portátiles bajos y móviles pequeños: mismo formulario, menos aire.
  @media (max-height: 760px) {
    &__enc {
      padding-top: 1.4rem;
      padding-bottom: 0.55rem;
    }

    h2 {
      font-size: 1.3rem;
    }

    &__sub {
      margin-top: 0.3rem;
    }

    &__fila label,
    &__campo {
      margin-top: 0.8rem;
    }

    &__pregunta {
      margin: 1.1rem 0 0.55rem;
    }

    &__opciones {
      gap: 0.45rem;
      margin-bottom: 1rem;

      label {
        padding: 0.72rem 0.9rem;
      }
    }

    &__legal {
      margin-top: 0.5rem;
    }
  }
}
</style>
