<template>
  <div class="w-full flex flex-row justify-between px-20 h-[10vh]">

    <!-- Logo Zik -->
    <div>

    </div>


    <!-- Nav bar -->
    <nav class="w-64 py-7 flex justify-evenly items-center">
      <router-link to="/" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Accueil</router-link>
      <router-link to="/planning" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Planning</router-link>
    </nav>

    <!-- Connection button -->
    <div class="py-7 flex justify-evenly items-center">
      <router-link to="/login" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Connexion</router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: "DesktopHeader"
}
</script>

<style scoped>

</style>