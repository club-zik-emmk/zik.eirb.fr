<template>
  <main class="h-[92vh] overflow-hidden w-full">
    <!-- Photo showcase -->
    <div class="wrapper relative w-full h-full" :style="backgroundStyle">
      <div class="h-full w-full absolute top-o left-0 bg-black opacity-20"></div>
      <div class="w-full h-full absolute top-0 left-0 z-10 flex items-center justify-center">

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
  name: "HomeView",
  computed: {
    backgroundStyle() {
      let directory = '';
      let randomNumber = -1;

      if (this.isMobile) {
        directory = 'mobile';

        // Generate a random number between 00 and 01 (included)
        randomNumber = Math.floor(Math.random() * 2);
      } else {
        directory = 'desktop';

        // Generate a random number between 00 and 03 (included)
        randomNumber = Math.floor(Math.random() * 4);
      }

      return {
        '--url': `url('/img/${directory}/cover_${randomNumber.toString().padStart(2, '0')}.webp')`
      };
    },
    isMobile() {
      return window.innerWidth < 768;
    },
  },
}
</script>

<style>
.wrapper {
  background-image: var(--url);
  background-size: cover;
  background-repeat: no-repeat;
}
</style>