<script setup lang="ts">
import { planes } from '@/data/reconstruccion'

defineEmits<{ (e: 'elegir', plan: string): void }>()

/** Ahorro frente al tope del precio normal ($4,000), con separador de miles. */
const ahorro = (precio: number) => (4000 - precio).toLocaleString('en-US')
</script>

<template>
  <section id="planes" class="plan">
    <div class="plan__cab">
      <span class="plan__eyebrow"><b>03</b> Los cupos</span>
      <h2 class="plan__h2">Elige el tuyo. <em>Son solo 30.</em></h2>
      <p class="plan__sub">
        Estos trabajos valen entre $2,000 y $4,000. Los dejamos a precio de reconstrucción para
        recuperar los equipos. Cuando se acaben los cupos, vuelve la tarifa normal.
      </p>
    </div>

    <div class="plan__cards">
      <article
        v-for="p in planes"
        :key="p.id"
        class="plan__card"
        :class="{ 'is-top': p.id === 'tienda' }"
      >
        <span v-if="p.id === 'tienda'" class="plan__cinta">
          <i class="fa-solid fa-bolt"></i> Para vender en línea
        </span>

        <div class="plan__head">
          <span class="plan__icon"><i class="fa-solid" :class="p.icono"></i></span>
          <h3>{{ p.nombre }}</h3>
        </div>

        <div class="plan__precio">
          <s>$2,000 – $4,000</s>
          <div>
            <small>$</small><strong>{{ p.precio }}</strong>
          </div>
          <span class="plan__ahorro">Ahorras hasta ${{ ahorro(p.precio) }}</span>
        </div>

        <ul>
          <li v-for="item in p.incluye" :key="item">
            <i class="fa-solid fa-check"></i><span>{{ item }}</span>
          </li>
        </ul>

        <button class="plan__cta" @click="$emit('elegir', p.id)">
          Apartar este cupo <i class="fa-solid fa-arrow-right"></i>
        </button>
      </article>
    </div>

    <div class="plan__nota">
      <span><i class="fa-solid fa-hourglass-half"></i> Solo este mes y solo 30 proyectos</span>
      <span><i class="fa-brands fa-whatsapp"></i> Te escribimos hoy mismo</span>
      <span><i class="fa-solid fa-pen-ruler"></i> Diseño a medida, mobile first</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.plan {
  @include r.seccion;

  &__cab {
    display: flex;
    max-width: 680px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__eyebrow {
    @include r.eyebrow;
  }

  &__h2 {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.8rem, 7vw, 2.7rem);
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.08;
    em {
      color: $BAKANO-PINK;
      font-style: normal;
    }
  }

  &__sub {
    @include r.subtitulo;
  }

  &__cards {
    display: flex;
    width: 100%;
    max-width: 880px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    gap: 1.25rem;
    margin-top: 2.5rem;
  }

  &__card {
    position: relative;
    display: flex;
    flex: 1 1 300px;
    flex-direction: column;
    gap: 1.1rem;
    padding: 1.75rem 1.5rem;
    @include r.tarjeta;

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      margin: 0 0 0.5rem;
      padding: 1.1rem 0 0;
      border-top: 1px solid rgba(#fff, 0.08);
      list-style: none;
    }
    li {
      display: flex;
      gap: 0.7rem;
      font-size: 0.95rem;
      line-height: 1.45;
    }
    li i {
      display: flex;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin-top: 0.05rem;
      border-radius: 50%;
      background: rgba($BAKANO-GREEN, 0.18);
      color: $BAKANO-GREEN;
      font-size: 0.66rem;
    }

    // La tienda va destacada solo con el borde rosado.
    &.is-top {
      border-color: $BAKANO-PINK;

      .plan__icon {
        background: $BAKANO-PINK;
        color: #fff;
      }
    }
  }

  &__cinta {
    position: absolute;
    top: -0.85rem;
    left: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    background: $BAKANO-PINK;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    h3 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
    }
  }

  &__icon {
    display: flex;
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: rgba($BAKANO-PINK, 0.15);
    color: $BAKANO-PINK;
    font-size: 1.1rem;
  }

  &__precio {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    s {
      color: rgba($BAKANO-LIGHT, 0.4);
      font-size: 0.95rem;
    }
    div {
      display: flex;
      align-items: flex-start;
    }
    small {
      margin-top: 0.4rem;
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
    }
    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 4rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
    }
  }

  &__ahorro {
    align-self: flex-start;
    margin-top: 0.35rem;
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    background: rgba($BAKANO-GREEN, 0.15);
    color: $BAKANO-GREEN;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &__cta {
    width: 100%;
    margin-top: auto;
    @include r.cta;
  }

  &__nota {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem 1.5rem;
    margin-top: 2rem;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.86rem;

    i {
      margin-right: 0.35rem;
      color: $BAKANO-PINK;
    }
  }
}
</style>
