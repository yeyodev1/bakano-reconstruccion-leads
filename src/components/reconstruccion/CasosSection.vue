<script setup lang="ts">
import { casos } from '@/data/reconstruccion'

defineEmits<{ (e: 'elegir', plan: string): void }>()
</script>

<template>
  <section id="casos" class="caso">
    <div class="caso__cab">
      <span class="caso__eyebrow"><b>02</b> Ellos ya se arriesgaron</span>
      <h2 class="caso__h2">Mientras tú lo piensas, <em>ellos ya están vendiendo</em></h2>
      <p class="caso__sub">
        Negocios de Guayaquil que confiaron en nosotros. Míralos contarlo y entra a sus tiendas:
        están en línea ahora mismo.
      </p>
    </div>

    <div class="caso__lista">
      <article
        v-for="(c, i) in casos"
        :key="c.code"
        class="caso__card"
        :class="{ 'is-inv': i % 2 }"
      >
        <div class="caso__video">
          <iframe
            :src="`https://www.instagram.com/p/${c.code}/embed/`"
            :title="`Caso ${c.nombre}`"
            loading="lazy"
            allowtransparency="true"
            allowfullscreen
            scrolling="no"
          ></iframe>
        </div>

        <div class="caso__cuerpo">
          <span class="caso__cliente">
            <i class="fa-solid fa-store"></i> {{ c.nombre }} · {{ c.rubro }}
          </span>

          <div class="caso__stat">
            <strong>{{ c.stat }}</strong>
            <span>{{ c.statLabel }}</span>
          </div>

          <h3>{{ c.titulo }}</h3>
          <p>{{ c.texto }}</p>

          <!-- Captura dentro de un marco de navegador: se entiende que es un sitio real. -->
          <a class="caso__web" :href="c.url" target="_blank" rel="noopener">
            <span class="caso__barra">
              <i></i><i></i><i></i>
              <span>{{ c.url.replace('https://', '').replace(/\/$/, '') }}</span>
            </span>
            <img :src="c.img" :alt="`Tienda en línea de ${c.nombre}`" loading="lazy" />
            <span class="caso__ver">
              Ver su tienda en vivo <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </span>
          </a>
        </div>
      </article>
    </div>

    <div class="caso__remate">
      <div class="caso__vs">
        <div>
          <span>Otra empresa</span>
          <s>$2,000</s>
        </div>
        <i class="fa-solid fa-arrow-right"></i>
        <div class="is-bk">
          <span>Bakano, este mes</span>
          <strong>$500 – $600</strong>
        </div>
      </div>
      <p>
        Una tienda mejor por una fracción del precio. La diferencia es que tú llegaste a tiempo.
      </p>
      <button class="caso__cta" @click="$emit('elegir', 'tienda')">
        Quiero una tienda como estas <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.caso {
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
    color: $BAKANO-GREEN;
    b {
      border-color: rgba($BAKANO-GREEN, 0.5);
      background: rgba($BAKANO-GREEN, 0.1);
    }
  }

  &__h2 {
    max-width: 20ch;
    margin: 0;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.8rem, 7vw, 2.7rem);
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.08;
    em {
      color: $BAKANO-GREEN;
      font-style: normal;
    }
  }

  &__sub {
    max-width: 52ch;
    margin: 0.8rem 0 0;
    color: rgba($BAKANO-LIGHT, 0.62);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  &__lista {
    display: flex;
    width: 100%;
    max-width: 1120px;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2.25rem;
  }

  &__card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @include r.tarjeta;

    @media (min-width: 860px) {
      flex-direction: row;
      align-items: stretch;

      &.is-inv {
        flex-direction: row-reverse;
      }
    }
  }

  &__video {
    display: flex;
    justify-content: center;
    padding: 1rem 1rem 0;
    background: rgba(#000, 0.25);

    @media (min-width: 860px) {
      flex: 0 0 360px;
      align-items: center;
      padding: 1.25rem;
    }

    iframe {
      width: 100%;
      max-width: 340px;
      height: 560px;
      border: 0;
      border-radius: 16px;
      background: #fff;
    }
  }

  &__cuerpo {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1.5rem 1.25rem 1.6rem;

    @media (min-width: 860px) {
      justify-content: center;
      padding: 2.25rem 2.5rem;
    }

    h3 {
      margin: 0.2rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.25rem, 4.5vw, 1.55rem);
      line-height: 1.2;
    }
    > p {
      margin: 0;
      color: rgba($BAKANO-LIGHT, 0.75);
      font-size: 0.98rem;
      line-height: 1.6;
    }
  }

  &__cliente {
    color: rgba($BAKANO-LIGHT, 0.55);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    i {
      margin-right: 0.3rem;
      color: $BAKANO-PINK;
    }
  }

  // El número grande es lo primero que se lee: resume el caso en un vistazo.
  &__stat {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem 0.8rem;

    strong {
      color: $BAKANO-PINK;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2.8rem, 12vw, 4rem);
      font-weight: 800;
      line-height: 1;
    }
    span {
      max-width: 22ch;
      color: rgba($BAKANO-LIGHT, 0.7);
      font-size: 0.92rem;
      line-height: 1.35;
    }
  }

  &__web {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-top: 0.6rem;
    border: 1px solid rgba(#fff, 0.12);
    border-radius: 14px;
    background: #0f0c16;
    color: $BAKANO-LIGHT;
    text-decoration: none;

    &:hover {
      border-color: $BAKANO-PINK;
    }

    img {
      width: 100%;
      aspect-ratio: 16 / 8;
      object-fit: cover;
      object-position: top;
    }
  }

  &__barra {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.55rem 0.8rem;
    border-bottom: 1px solid rgba(#fff, 0.08);

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(#fff, 0.2);
    }
    span {
      overflow: hidden;
      margin-left: 0.5rem;
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.76rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__ver {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0.9rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    i {
      color: $BAKANO-PINK;
      font-size: 0.8rem;
    }
  }

  &__remate {
    display: flex;
    width: 100%;
    max-width: 640px;
    flex-direction: column;
    align-items: center;
    margin-top: 2.5rem;
    text-align: center;

    > p {
      margin: 1rem 0 0;
      color: rgba($BAKANO-LIGHT, 0.78);
      font-size: 1.02rem;
    }
  }

  // Comparación de precio lado a lado: más clara que una frase con tres cifras.
  &__vs {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    > div {
      display: flex;
      flex: 1;
      max-width: 220px;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem 0.75rem;
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 16px;
      background: rgba(#fff, 0.03);
    }
    span {
      color: rgba($BAKANO-LIGHT, 0.55);
      font-size: 0.78rem;
    }
    s {
      color: rgba($BAKANO-LIGHT, 0.45);
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
    }
    strong {
      color: $BAKANO-PINK;
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
    }
    > i {
      color: $BAKANO-PINK;
    }
    .is-bk {
      border-color: rgba($BAKANO-PINK, 0.5);
      background: rgba($BAKANO-PINK, 0.1);
    }
  }

  &__cta {
    margin-top: 1.5rem;
    @include r.cta;
  }
}
</style>
