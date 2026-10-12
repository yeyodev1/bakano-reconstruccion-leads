<script setup lang="ts">
import { historia, reels } from '@/data/reconstruccion'
</script>

<template>
  <section id="historia" class="hist">
    <div class="hist__in">
      <div class="hist__col">
        <div class="hist__cab">
          <span class="hist__eyebrow"><b>01</b> Lo que nos pasó</span>
          <h2 class="hist__h2">Perdimos los equipos. <em>No las ganas.</em></h2>
          <p class="hist__sub">La versión corta. La completa la contamos en video.</p>
        </div>

        <ol class="hist__timeline">
          <li
            v-for="(h, i) in historia"
            :key="h.titulo"
            class="hist__hito"
            :class="{ 'is-hoy': i === historia.length - 1 }"
          >
            <span class="hist__punto"><i class="fa-solid" :class="h.icono"></i></span>
            <div>
              <span class="hist__fecha">{{ h.fecha }}</span>
              <h3>{{ h.titulo }}</h3>
              <p>{{ h.texto }}</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="hist__reels">
        <span class="hist__reels-tit">
          <i class="fa-brands fa-instagram"></i> Míralo en video
        </span>
        <div class="hist__carril">
          <figure v-for="r in reels" :key="r.code">
            <iframe
              :src="`https://www.instagram.com/reel/${r.code}/embed/`"
              :title="r.pie"
              loading="lazy"
              allowtransparency="true"
              allowfullscreen
              scrolling="no"
            ></iframe>
            <figcaption>{{ r.pie }}</figcaption>
          </figure>
        </div>
      </div>
    </div>

    <p class="hist__cierre">
      <i class="fa-solid fa-quote-left"></i>
      <span>
        <strong>No pedimos donaciones. Pedimos trabajo.</strong> Si necesitabas una página web, este
        es el mejor momento para tenerla, y de paso nos ayudas a reponer lo que perdimos.
      </span>
    </p>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.hist {
  @include r.seccion;

  // Todo en una sola columna, de arriba hacia abajo: historia y luego los videos.
  &__in {
    display: flex;
    width: 100%;
    max-width: 1040px;
    flex-direction: column;
    gap: 2.5rem;
  }

  &__col {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
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

  // Línea vertical que une los hitos: se lee como una historia, no como una lista.
  &__timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    margin: 2rem 0 0;
    padding: 0;
    list-style: none;

    &::before {
      position: absolute;
      top: 8px;
      bottom: 8px;
      left: 19px;
      width: 2px;
      background: rgba(#fff, 0.12);
      content: '';
    }
  }

  &__hito {
    position: relative;
    display: flex;
    gap: 1.1rem;

    h3 {
      margin: 0.25rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      line-height: 1.25;
    }
    p {
      margin: 0.35rem 0 0;
      color: rgba($BAKANO-LIGHT, 0.72);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    &.is-hoy {
      .hist__punto {
        border-color: $BAKANO-PINK;
        background: $BAKANO-PINK;
        color: #fff;
      }
      h3 {
        color: $BAKANO-PINK;
      }
    }
  }

  &__punto {
    position: relative;
    display: flex;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(#fff, 0.18);
    border-radius: 50%;
    background: $BAKANO-DARK;
    color: rgba($BAKANO-LIGHT, 0.85);
    font-size: 0.9rem;
  }

  &__fecha {
    color: rgba($BAKANO-LIGHT, 0.45);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__reels {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 0.9rem;
  }

  &__reels-tit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;

    > i {
      color: $BAKANO-PINK;
      font-size: 1.1rem;
    }
    small {
      margin-left: auto;
      color: rgba($BAKANO-LIGHT, 0.45);
      font-size: 0.78rem;
      font-weight: 400;
    }
  }

  // Los reels van uno debajo de otro en móvil; en escritorio caben los tres en fila,
  // sin scroll lateral: nada se esconde a un costado.
  &__carril {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    @media (min-width: 960px) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 1rem;
    }

    figure {
      display: flex;
      width: 100%;
      max-width: 340px;
      flex-direction: column;
      gap: 0.55rem;
      margin: 0;

      @media (min-width: 960px) {
        flex: 1;
      }
    }

    iframe {
      width: 100%;
      height: 560px;
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 16px;
      background: #fff;
    }

    figcaption {
      color: rgba($BAKANO-LIGHT, 0.6);
      font-size: 0.85rem;
      text-align: center;
    }
  }

  &__cierre {
    display: flex;
    max-width: 760px;
    gap: 1rem;
    margin: 3rem 0 0;
    padding: 1.4rem 1.5rem;
    border-left: 3px solid $BAKANO-PINK;
    border-radius: 0 16px 16px 0;
    background: rgba($BAKANO-PINK, 0.07);
    color: rgba($BAKANO-LIGHT, 0.8);
    font-size: 1.02rem;
    line-height: 1.6;

    > i {
      flex-shrink: 0;
      margin-top: 0.2rem;
      color: $BAKANO-PINK;
      font-size: 1.3rem;
    }
    strong {
      color: $BAKANO-LIGHT;
    }
  }
}
</style>
