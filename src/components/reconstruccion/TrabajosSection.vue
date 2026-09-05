<script setup lang="ts">
import { trabajos } from '@/data/reconstruccion'
import ScrollCue from './ScrollCue.vue'
</script>

<template>
  <section id="trabajos" class="job">
    <h2 class="job__h2">Esto es lo que hacemos</h2>
    <p class="job__sub">Sitios reales, en línea ahora mismo. Ábrelos y compruébalo.</p>

    <div class="job__grid">
      <a
        v-for="t in trabajos"
        :key="t.nombre"
        :href="t.url"
        target="_blank"
        rel="noopener"
        class="job__item"
      >
        <img :src="t.img" :alt="`Sitio web de ${t.nombre}`" loading="lazy" />
        <div class="job__info">
          <strong>{{ t.nombre }}</strong>
          <span>{{ t.rubro }}</span>
        </div>
      </a>
    </div>

    <ScrollCue destino="contacto" etiqueta="Asegura tu cupo" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.job {
  @include r.seccion;

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }

  &__grid {
    display: flex;
    width: 100%;
    max-width: 980px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__item {
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
    transition:
      transform 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      border-color: rgba($BAKANO-PINK, 0.55);
    }
    img {
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      object-position: top;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.9rem 1.1rem;
    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 1.02rem;
    }
    span {
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.84rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__item {
      transition: none;
      &:hover {
        transform: none;
      }
    }
  }
}
</style>
