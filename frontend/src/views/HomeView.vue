<template>
  <main class="h-[92vh] overflow-hidden w-full">
    <!-- Photo showcase -->
    <div class="wrapper relative">
      <section>
      </section>
      <section>
      </section>
      <section>
      </section>
      <section></section>
      <section></section>

      <div class="h-full w-full absolute top-o left-0 bg-black opacity-50 z-10"></div>
      <div class="w-full h-full absolute top-0 left-0 z-20 flex items-center justify-center">

        <div class="flex flex-col justify-center items-center">
          <!-- Logo Zik -->
          <div>

          </div>

          <!-- Description -->
          <div class="uppercase text-4xl font-bold">
            Ouais le zik
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomeView"
}
</script>

<style lang="scss" scoped>
/* https://codepen.io/hexagoncircle/pen/yOwvQV */

$section-amount: 5;
// Try messing with the rotate value
$section-rotate: 15;

$mq-desktop: "min-width: 630px";

* {
  box-sizing: border-box;
}

.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: translate3d(0, 0, 0);
  @media ($mq-desktop) {
    flex-direction: row;
    width: 100% + ($section-rotate * 2);
    margin-left: percentage($section-rotate) * -.01;
  }
}

section {
  flex: 1;
  position: relative;
  width: 100%;
  min-height: 20vh;
  overflow: hidden;
  z-index: 1;

  transition:
      flex-grow .2s,
      opacity .2s;

  img {
    transform: skewX(-15deg);
  }

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    transition:
        transform .2s,
        width .2s;
  }
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0;
    transition: opacity .2s;
  }
  @media ($mq-desktop) {
    width: 20%;
    height: 100vh;
    margin-right: -1px;
    transform:
        skewX(#{$section-rotate}deg)
        translateZ(0);
    &:before {
      left: -100%;
      width: 400%;
      transform: skewX(-#{$section-rotate}deg);
    }
  }
  @for $i from 1 through $section-amount {
    &:nth-child(#{$i}) {
      &:before {
        background-color: darken(red, $i * 5);
        background-image: url('/00#{$i}.jpg');
        background-repeat: no-repeat;
        .hide-images & {
          background-image: none;
        }
      }
    }
    &:first-child,
    &:last-child {
      &:before {
        background-color: darken(red, 30%);
      }
      &:after {
        opacity: .5;
      }
      article {
        display: none;
      }
    }
  }
}

article {
  position: relative;
  padding: 24px;
  width: 100%;
  height: 100%;
  text-align: center;
  color: white;
  z-index: 1;
  transition:
      opacity .2s,
      transform .2s;
  @media ($mq-desktop) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0; right: 0; left: 0;
    margin: auto;
    opacity: 0;
    transform:
        translateY(24px)
        skewX(-#{$section-rotate}deg);
  }
}

h2 {
  font-size: 32px;
  margin-bottom: 12px;
}

</style>