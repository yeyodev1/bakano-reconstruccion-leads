<script setup lang="ts">
import { planes } from '@/data/reconstruccion'
import ScrollCue from './ScrollCue.vue'

defineEmits<{ (e: 'elegir', plan: string): void }>()
</script>

<template>
  <section id="planes" class="plan">
    <h2 class="plan__h2">Los cupos</h2>
    <p class="plan__sub">
      Estos trabajos valen entre $2,000 y $4,000. Los dejamos a precio de reconstrucción para
      recuperar los equipos. Cuando se acaben los 30 cupos, vuelve la tarifa normal.
    </p>

    <div class="plan__cards">
      <article v-for="p in planes" :key="p.id" class="plan__card">
        <i class="fa-solid plan__icon" :class="p.icono"></i>
        <h3>{{ p.nombre }}</h3>
        <div class="plan__precio">
          <s>$2,000 – $4,000</s>
          <strong>${{ p.precio }}</strong>
        </div>
        <ul>
          <li v-for="item in p.incluye" :key="item">
            <i class="fa-solid fa-check"></i><span>{{ item }}</span>
          </li>
        </ul>
        <button class="plan__cta" @click="$emit('elegir', p.id)">Quiero este cupo</button>
      </article>
    </div>

    <ScrollCue destino="trabajos" etiqueta="Nuestro trabajo" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.plan {
  @include r.seccion;

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }

  &__cards {
    display: flex;
    width: 100%;
    max-width: 780px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.1rem;
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

  &__icon {
    color: $BAKANO-PINK;
    font-size: 1.6rem;
  }

  &__precio {
    display: flex;
    align-items: baseline;
    gap: 0.7rem;
    s {
      color: rgba($BAKANO-LIGHT, 0.4);
      font-size: 0.95rem;
    }
    strong {
      color: $BAKANO-PINK;
      font-family: 'Outfit', sans-serif;
      font-size: 2.6rem;
      line-height: 1;
    }
  }

  &__cta {
    width: 100%;
    margin-top: auto;
    @include r.cta;
  }
}
</style>
