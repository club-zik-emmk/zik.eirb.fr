<template>
  <div class="w-full flex flex-row justify-between px-20 h-[8vh] header">

    <!-- Logo Zik -->
    <div>

    </div>


    <!-- Nav bar -->
    <nav class="w-64 py-7 flex justify-evenly items-center">
      <router-link to="/" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Accueil</router-link>
      <router-link to="/planning" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Planning</router-link>
    </nav>

    <!-- Connection button -->
    <div class="py-7 flex justify-evenly items-center" v-if="isUserAuthenticated">
      <div class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300" @click="logout">Déconnexion</div>
    </div>

    <div class="py-7 flex justify-evenly items-center" v-else>
      <router-link to="/auth" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Connexion</router-link>
    </div>


  </div>
</template>

<script>
import {logoutUser} from "../services/authenticationService";

export default {
  name: "DesktopHeader",
  computed: {
    isUserAuthenticated() {
      return this.$store.state.user.id !== '';
    },
    isUserAdmin() {
      return this.$store.state.user.admin;
    },
  },
  methods: {
    logout() {
      logoutUser().then(() => {
        this.$store.dispatch("resetUser");
      })
    },
  },
}
</script>

<style scoped>
.header {
  border-bottom: solid 1px rgb(91 95 99);
}
</style>