<template>
  <div class="w-full flex flex-row justify-between px-20 h-[8vh] bg-[#1F1F1F]">

    <div class="h-full flex items-center">
      <!-- Nav bar -->
      <nav class="py-7 flex justify-evenly items-center">

        <router-link to="/"
          class="px-5 py-2 rounded-md hover:cursor-pointer w-52 text-center hover:bg-[#404040] bg-[#2F2F2F] duration-300 hover:cursor-pointer ml-5">
          Accueil
        </router-link>

        <router-link to="/planning"
          class="px-5 py-2 rounded-md hover:cursor-pointer w-52 text-center hover:bg-[#404040] bg-[#2F2F2F] duration-300 hover:cursor-pointer ml-5">
          Planning
        </router-link>

        <a :href="cotisationLink"
          class="px-5 py-2 rounded-md hover:cursor-pointer w-52 text-center hover:bg-[#404040] bg-[#2F2F2F] duration-300 hover:cursor-pointer ml-5"
          v-show="!isUserAuthenticated || !isUserMember" target="_blank">
          Cotiser
        </a>

        <a href="#"
          class="px-5 py-2 rounded-md hover:cursor-pointer w-52 text-center hover:bg-[#404040] duration-300 hover:cursor-pointer ml-5"
          v-show="isUserAuthenticated && !isUserMember">
          Contact
        </a>

        <DropdownNav v-if="isUserAuthenticated && isUserAdmin" title="Admin" :links="adminLinks" />

        <DropdownNav v-if="isUserAuthenticated && isUserMember" title="Membre" :links="memberLinks" />

      </nav>
    </div>

    <!-- Connection button -->
    <div class="py-7 flex justify-evenly items-center" v-if="isUserAuthenticated">
      <div
        class="px-5 text-black font-semibold py-2 rounded-md hover:cursor-pointer w-52 text-center bg-[#ee5253] hover:bg-[#ff6b6b] duration-300 hover:cursor-pointer"
        @click="logout">
        Déconnexion
      </div>
    </div>

    <div class="py-7 flex justify-evenly items-center" v-else>
      <router-link to="/auth"
        class="px-5 py-2 rounded-md hover:cursor-pointer w-52 text-center hover:text-black hover:bg-[#8DD18A] duration-300 hover:cursor-pointer duration-300 hover:cursor-pointer">
        Connexion
      </router-link>
    </div>


  </div>
</template>

<script>
import { logoutUser } from "@/services/authenticationService";
import DropdownNav from "@/components/DropdownNav.vue";
import links from "@/links.json";
import axiosInstance from "@/axiosInstance";

export default {
  name: "DesktopHeader",
  components: { DropdownNav },
  data() {
    return {
      adminLinks: links.admin,
      memberLinks: links.member,
      cotisationLink: links.cotisation
    }
  },
  created() {
    // If route is different than /auth, we check if user is authenticated
    if (this.$route.path !== '/auth' || this.$route.path !== '/#/auth') {
      axiosInstance.get('/api/v1/me').catch(() => {
        this.$store.dispatch("resetUser");
        this.$router.push("/auth");
      });
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
    logoUrl() {
      return {
        '--logo-url': `url('/img/logo.svg')`
      };
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
</style>