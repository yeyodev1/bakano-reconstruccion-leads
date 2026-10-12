<script setup lang="ts">
import { trabajos, casos } from '@/data/reconstruccion'

/** Los clientes que tienen caso en video van primero y más grandes. */
const destacados = new Set(casos.map((c) => c.url))

const dominio = (url: string) => url.replace('https://', '').replace(/\/$/, '')
</script>

<template>
  <section id="trabajos" class="job">
    <div class="job__cab">
      <span class="job__eyebrow"><b>05</b> Nuestro trabajo</span>
      <h2 class="job__h2">Sitios reales, <em>en línea ahora mismo</em></h2>
      <p class="job__sub">No son plantillas ni maquetas. Ábrelos y compruébalo tú mismo.</p>
    </div>

    <div class="job__grid">
      <a
        v-for="t in trabajos"
        :key="t.nombre"
        :href="t.url"
        target="_blank"
        rel="noopener"
        class="job__item"
        :class="{ 'is-top': destacados.has(t.url) }"
      >
        <span class="job__barra">
          <i></i><i></i><i></i>
          <span>{{ dominio(t.url) }}</span>
        </span>
        <span class="job__shot">
          <img :src="t.img" :alt="`Sitio web de ${t.nombre}`" loading="lazy" />
          <span v-if="destacados.has(t.url)" class="job__tag">Caso reciente</span>
        </span>
        <span class="job__info">
          <span>
            <strong>{{ t.nombre }}</strong>
            <small>{{ t.rubro }}</small>
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.job {
  @include r.seccion;

  &__cab {
    display: flex;
    width: 100%;
    max-width: 1120px;
    flex-direction: column;
    align-items: flex-start;
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
    margin: 0.7rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.6);
    font-size: 0.98rem;
  }

  &__grid {
    display: flex;
    width: 100%;
    max-width: 1120px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2.25rem;
  }

  &__item {
    display: flex;
    flex: 1 1 280px;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(#fff, 0.1);
    border-radius: 16px;
    background: #120e1a;
    color: inherit;
    text-decoration: none;

    &:hover {
      border-color: rgba($BAKANO-PINK, 0.6);
    }

    // En escritorio van de a tres; sin tope, la que queda sola en la última fila se estira
    // a todo el ancho y su captura se vuelve gigante.
    @media (min-width: 900px) {
      max-width: calc((100% - 2rem) / 3);
    }

    // Los casos con video ocupan media fila cada uno en escritorio.
    &.is-top {
      flex-basis: 420px;
      max-width: none;
      border-color: rgba($BAKANO-PINK, 0.35);
    }
  }

  &__barra {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.55rem 0.8rem;
    border-bottom: 1px solid rgba(#fff, 0.07);

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(#fff, 0.18);
    }
    span {
      overflow: hidden;
      margin-left: 0.5rem;
      color: rgba($BAKANO-LIGHT, 0.5);
      font-size: 0.74rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__shot {
    position: relative;
    display: block;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      object-position: top;
    }
  }

  &__tag {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    background: $BAKANO-PINK;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.95rem 1.1rem;

    > span {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    strong {
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
    }
    small {
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.82rem;
    }
    > i {
      color: rgba($BAKANO-LIGHT, 0.35);
      font-size: 0.85rem;
    }
  }
}
</style>
