<script setup lang="ts">
defineEmits<{ (e: 'elegir', plan: string): void }>()

/** Qué pasa después de dejar los datos. Quita el miedo a "¿y luego qué?". */
const pasos = [
  {
    icono: 'fa-solid fa-hand-pointer',
    titulo: 'Apartas tu cupo',
    texto: 'Llenas el formulario en menos de un minuto y eliges web o tienda.',
  },
  {
    icono: 'fa-brands fa-whatsapp',
    titulo: 'Te escribimos hoy',
    texto: 'Por WhatsApp, para entender tu negocio y lo que necesitas vender.',
  },
  {
    icono: 'fa-solid fa-rocket',
    titulo: 'Lanzamos tu web',
    texto:
      'La diseñamos a medida, la conectamos a PayPhone si es tienda y la dejamos lista para que te encuentren en Google y ChatGPT.',
  },
]
</script>

<template>
  <section id="pasos" class="paso">
    <div class="paso__cab">
      <span class="paso__eyebrow"><b>04</b> Cómo funciona</span>
      <h2 class="paso__h2">Tres pasos y <em>tu negocio vende en línea</em></h2>
    </div>

    <ol class="paso__lista">
      <li v-for="(p, i) in pasos" :key="p.titulo" class="paso__item">
        <i :class="p.icono"></i>
        <h3>{{ i + 1 }}. {{ p.titulo }}</h3>
        <p>{{ p.texto }}</p>
      </li>
    </ol>

    <button class="paso__cta" @click="$emit('elegir', '')">
      Empezar por el paso 1 <i class="fa-solid fa-arrow-right"></i>
    </button>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/reconstruccion.scss' as r;

.paso {
  @include r.seccion;
  background: rgba(#fff, 0.02);

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

  &__lista {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 1040px;
    flex-direction: column;
    gap: 1rem;
    margin: 2.5rem 0 0;
    padding: 0;
    list-style: none;

    @media (min-width: 860px) {
      flex-direction: row;
      gap: 1.25rem;
    }
  }

  &__item {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem 1.4rem 1.6rem;
    @include r.tarjeta;

    @media (min-width: 860px) {
      align-items: center;
      text-align: center;
    }

    > i {
      position: relative;
      display: flex;
      width: 56px;
      height: 56px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: rgba($BAKANO-PINK, 0.14);
      color: $BAKANO-PINK;
      font-size: 1.3rem;
    }
    h3 {
      margin: 1.1rem 0 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem;
    }
    p {
      margin: 0.45rem 0 0;
      color: rgba($BAKANO-LIGHT, 0.7);
      font-size: 0.94rem;
      line-height: 1.55;
    }
  }

  &__cta {
    margin-top: 2.25rem;
    @include r.cta;
  }
}
</style>
