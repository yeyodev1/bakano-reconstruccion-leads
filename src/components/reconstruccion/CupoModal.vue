<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import CupoForm from './CupoForm.vue'
import { REEL_CHISME } from '@/data/reconstruccion'

const props = defineProps<{ abierto: boolean; plan?: string }>()
const emit = defineEmits<{ (e: 'cerrar'): void }>()

const enviado = ref(false)
const nombre = ref('')
const interes = ref('')

function onEnviado(n: string, i: string) {
  nombre.value = n
  interes.value = i
  enviado.value = true
}

watch(
  () => props.abierto,
  (v) => {
    document.body.style.overflow = v ? 'hidden' : ''
    if (!v) enviado.value = false
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cm">
      <div v-if="abierto" class="cm" @click.self="emit('cerrar')">
        <div class="cm__box" role="dialog" aria-modal="true" aria-label="Asegura tu cupo">
          <button class="cm__x" aria-label="Cerrar" @click="emit('cerrar')">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <CupoForm v-if="!enviado" :key="String(abierto)" :plan="plan" @enviado="onEnviado" />

          <div v-else class="cm__ok">
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
  align-items: flex-end;
  justify-content: center;
  overflow-y: auto;
  background: rgba(#000, 0.72);
  backdrop-filter: blur(4px);

  &__box {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 460px;
    flex-direction: column;
    padding: 2rem 1.5rem 2.25rem;
    border: 1px solid rgba(#fff, 0.12);
    border-radius: 20px 20px 0 0;
    background: $BAKANO-DARK;
    color: $BAKANO-LIGHT;
    font-family: 'Plus Jakarta Sans', sans-serif;
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
    padding: 1rem 0 0;
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

.cm-enter-active,
.cm-leave-active {
  transition: opacity 0.25s ease;
  .cm__box {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
}
.cm-enter-from,
.cm-leave-to {
  opacity: 0;
  .cm__box {
    transform: translateY(28px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cm-enter-active,
  .cm-leave-active {
    transition: none;
    .cm__box {
      transition: none;
    }
  }
  .cm-enter-from .cm__box,
  .cm-leave-to .cm__box {
    transform: none;
  }
}
</style>
