<template>
  <main class="h-[92vh] overflow-hidden w-full">
    <!-- Photo showcase -->
    <div class="wrapper relative w-full h-full" :style="backgroundStyle">
      <div class="h-full w-full absolute top-0 left-0 bg-black opacity-20"></div>
      <div class="w-full h-full absolute top-0 left-0 flex lg:items-center justify-center overflow-auto py-5 text-center"
        style="z-index: 1;">

        <div class="w-[80%] text-wrapper py-5 px-2 rounded-lg h-fit lg:flex lg:flex-col lg:items-center">
          <!-- Logo Zik -->
          <div v-show="!isMobile" class="logo" :style="logoUrl"></div>

          <!-- Description -->
          <div class="flex flex-col">
            <span class="uppercase text-5xl font-bold">
              Le Zik
            </span>
            <span class="uppercase text-xl font-bold text-[#cccccc]">
              de l'enseirb-matmeca
            </span>
          </div>

          <!-- Separator -->
          <div class="w-1/3 my-5 flex flex-row items-center" v-show="!isMobile">
            <div class="flex-1 h-[0.025rem] bg-[#cccccc]"></div>
            <div class="w-1 bg-[#cccccc] ml-2 h-1 rounded-lg"></div>
            <div class="w-2 bg-[#cccccc] mx-2 h-2 rounded-lg"></div>
            <div class="w-1 bg-[#cccccc] mr-2 h-1 rounded-lg"></div>
            <div class="flex-1 h-[0.025rem] bg-[#cccccc]"></div>
          </div>

          <div class="lg:w-1/2 mt-5 text-sm lg:text-md">
            <p class="mb-5">
              Depuis près d'un demi-siècle, le Club Zik de l'ENSEIRB-MATMECA fait vivre le coeur musical de notre belle
              école. Bienvenue à vous tous, chers musiciens, musiciennes et chers Enseirbiens. Le Club Zik organise vos
              évènements musicaux sur le campus, anime vos soirées, a fait et fera bouger des générations
              d'Enseirbien.ne.s !
            </p>
            <p class="mb-5">
              Tu veux remplir les plus grandes salles de l'ENSEIRB-MATMECA ? Animer les grandes soirées de ton école
              avec tes musiques préférées ? Faire des prestations à l'extérieur ? Ou tout simplement répéter avec ta
              bande de potes ?
              Le Club Zik est fait pour toi ! Il te mettra à disposition une riche salle de répétition : claviers,
              guitares, basses, batteries, percussions, micros et bien plus encore... Mais également du matériel de
              sonorisation : enceintes, tables de mixage, amplificateurs, etc.
              Au Zik, tout est possible jeune Enseirbien.ne !
              Que tu aimes le Rock, la Pop, la Funk, la Variété Française, le Métal ou le Blues, le Zik et
              ses musiciens de talent t’attendent !
            </p>
            <p class="mb-5">
              Allez, file galopin ! File vers les portes du Zik qui n’attendent que toi !
            </p>
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
        '--background-url': `url('/img/${directory}/cover_${randomNumber.toString().padStart(2, '0')}.webp')`
      };
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    logoUrl() {
      return {
        '--logo-url': `url('/img/logo.svg')`
      };
    }
  },
}
</script>

<style>
.wrapper {
  background-image: var(--background-url);
  background-size: cover;
  background-repeat: no-repeat;

  z-index: 0;
}

.logo {
  background-image: var(--logo-url);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  width: 20rem;
  height: 20rem;
}

.text-wrapper {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>