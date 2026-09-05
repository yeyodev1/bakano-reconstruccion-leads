<script setup lang="ts">
import { historia, reels } from '@/data/reconstruccion'
import ScrollCue from './ScrollCue.vue'
</script>

<template>
  <section id="historia" class="hist">
    <h2 class="hist__h2">Lo que nos pasó</h2>
    <p class="hist__sub">Lo contamos completo en video. Esta es la versión corta.</p>

    <div class="hist__timeline">
      <article v-for="h in historia" :key="h.titulo" class="hist__hito">
        <i class="fa-solid" :class="h.icono"></i>
        <div>
          <span class="hist__fecha">{{ h.fecha }}</span>
          <h3>{{ h.titulo }}</h3>
          <p>{{ h.texto }}</p>
        </div>
      </article>
    </div>

    <div class="hist__reels">
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

    <p class="hist__cierre">
      <strong>No pedimos donaciones. Pedimos trabajo.</strong> Si necesitabas una página web, este
      es el mejor momento para tenerla — y de paso nos ayudas a reponer lo que perdimos.
    </p>

    <ScrollCue destino="planes" etiqueta="Los cupos" />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.hist {
  background: rgba(#fff, 0.025);
  @include r.seccion;

  &__h2 {
    @include r.titulo;
  }
  &__sub {
    @include r.subtitulo;
  }

  &__timeline {
    display: flex;
    width: 100%;
    max-width: 560px;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__hito {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(#fff, 0.09);
    border-left: 3px solid $BAKANO-PINK;
    border-radius: 12px;
    background: rgba(#fff, 0.03);

    > i {
      flex-shrink: 0;
      margin-top: 0.35rem;
      color: $BAKANO-PINK;
      font-size: 1.05rem;
    }
    h3 {
      margin: 0.3rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.08rem;
      line-height: 1.25;
    }
    p {
      margin: 0.35rem 0 0;
      font-size: 0.96rem;
      line-height: 1.55;
      color: rgba($BAKANO-LIGHT, 0.8);
    }
  }

  &__fecha {
    color: rgba($BAKANO-LIGHT, 0.45);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__reels {
    display: flex;
    width: 100%;
    max-width: 1040px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;

    figure {
      display: flex;
      flex: 1 1 300px;
      max-width: 330px;
      flex-direction: column;
      gap: 0.6rem;
      margin: 0;
    }

    iframe {
      width: 100%;
      height: 560px;
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 14px;
      background: #fff;
    }

    figcaption {
      color: rgba($BAKANO-LIGHT, 0.6);
      font-size: 0.84rem;
      text-align: center;
    }
  }

  &__cierre {
    max-width: 46ch;
    margin: 2rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.78);
    font-size: 1rem;
    line-height: 1.65;
    text-align: center;
    strong {
      color: $BAKANO-LIGHT;
    }
  }
}
</style>
