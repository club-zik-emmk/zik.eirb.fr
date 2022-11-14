<template>
  <div class="w-full flex flex-row justify-between px-20 h-[8vh] header">

    <div class="h-full flex items-center">
      <!-- Logo Zik -->
      <div>

      </div>


      <!-- Nav bar -->
      <nav class="py-7 flex justify-evenly items-center">
        <router-link to="/" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Accueil</router-link>
        <router-link to="/planning" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300">Planning</router-link>

        <a :href="cotisationLink" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300" v-show="!isUserAuthenticated || !isUserMember" target="_blank">Cotiser</a>

        <a href="#" class="rounded-3xl hover:bg-red-900 px-7 py-2 duration-300" v-show="isUserAuthenticated && !isUserMember">Contact</a>

        <DropdownNav v-if="isUserAuthenticated && isUserAdmin" title="Admin" :links="adminLinks"></DropdownNav>
        <DropdownNav v-if="isUserAuthenticated && isUserMember" title="Membre" :links="memberLinks"></DropdownNav>

      </nav>
    </div>

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
import {logoutUser} from "@/services/authenticationService";
import DropdownNav from "@/components/DropdownNav.vue";
import links from "@/links.json";

export default {
  name: "DesktopHeader",
  components: {DropdownNav},
  data() {
    return {
      adminLinks: links.admin,
      memberLinks: links.member,
    }
  },
  computed: {
    isUserAuthenticated() {
      return this.$store.state.user.id !== '';
    },
    isUserAdmin() {
      return this.$store.state.user.admin;
    },
    isUserMember() {
      return this.$store.state.user.member;
    },
    cotisationLink() {
      return import.meta.env.VITE_ZIK_COTISATION_LINK;
    }
  },
  methods: {
    logout() {
      logoutUser().then(() => {
        this.$store.dispatch("resetUser");
        this.$router.push("/");
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