<template>
  <div class="h-[8vh] mobile-header bg-[#1F1F1F]">
    <div class="h-full w-full flex flex-row justify-between px-5 relative items-center">
      <!-- Logo and name -->
      <div class="flex flex-row items-center justify-evenly">
        <div>Le Zik</div>
      </div>

      <!-- Menu button -->
      <div class="bg-[#2F2F2F] h-fit p-2.5 rounded-lg" @click="handleButtonClick">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
    </div>

    <!-- Menu -->
    <div class="absolute w-full flex flex-col menu-item" v-show="isMenuOpened">
      <router-link to="/" :class="menuItemClass" @click="closeMenu">Accueil</router-link>
      <router-link v-if="isUserAuthenticated" to="/planning" :class="menuItemClass" @click="closeMenu">Planning</router-link>

      <a :href="this.cotisationLink" :class="menuItemClass" target="_blank"
        v-show="!isUserAuthenticated || !isUserMember">Cotiser</a>

      <div v-if="isUserAdmin">
        <div :class="menuItemClass" @click="isAdminMenuOpened = !isAdminMenuOpened">Admin</div>

        <div class="flex flex-col" v-show="isAdminMenuOpened">
          <router-link v-for="link in adminLinks" :key="link.title" :to="link.path" :class="submenuItemClass"
            @click="closeMenu">{{ link.title }}</router-link>
        </div>
      </div>

      <div v-if="isUserMember">
        <div :class="menuItemClass" @click="isMemberMenuOpened = !isMemberMenuOpened">Membre</div>

        <div class="flex flex-col" v-show="isMemberMenuOpened">
          <router-link v-for="link in memberLinks" :key="link.title" :to="link.path" :class="submenuItemClass"
            @click="closeMenu">{{ link.title }}</router-link>
        </div>
      </div>

      <!-- Connection button -->
      <div :class="lastItemClass" class="bg-[#ee5253] text-black" @click="logout" v-if="isUserAuthenticated">
        Déconnexion
      </div>

      <router-link to="/auth" v-else :class="lastItemClass">Connexion</router-link>
    </div>
  </div>
</template>

<script>
import links from "@/links.json";
import axiosInstance from "@/axiosInstance";
import { logoutUser } from "@/services/authenticationService";

export default {
  name: "MobileHeader",
  data() {
    return {
      isMenuOpened: false,
      isAdminMenuOpened: false,
      isMemberMenuOpened: false,
      adminLinks: links.admin,
      memberLinks: links.member,
      cotisationLink: links.cotisation,
    }
  },
  created() {
    // If route is different than /auth, we check if user is authenticated
    if (this.routeName !== 'Authentification') {
      axiosInstance.get('/api/v1/me').catch(() => {
        this.$store.dispatch("resetUser");
        this.$router.push("/auth");
      });
    }

    // On any <a> click, we close the menu
    document.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', this.closeMenu);
    });

    // On any <router-link> click, we close the menu
    document.querySelectorAll('router-link').forEach((a) => {
      a.addEventListener('click', this.closeMenu);
    });
  },
  mounted() {
    // Close menu when clicking outside
    document.addEventListener("click", this.handleClickEvent);
  },
  unmounted() {
    // Be careful to remove the listener when the component is destroyed
    document.removeEventListener("click", this.handleClickEvent);

    // Remove the listener on <a> click
    document.querySelectorAll('a').forEach((a) => {
      a.removeEventListener('click', this.closeMenu);
    });

    // Remove the listener on <router-link> click
    document.querySelectorAll('router-link').forEach((a) => {
      a.removeEventListener('click', this.closeMenu);
    });
  },
  methods: {
    handleClickEvent(event) {
      if (!event.target.closest(".mobile-header")) {
        this.closeMenu();
      }
    },
    closeMenu() {
      this.isAdminMenuOpened = false;
      this.isMemberMenuOpened = false;
      this.isMenuOpened = false;
    },
    handleButtonClick() {
      if (this.isMenuOpened) {
        this.closeMenu();
      } else {
        this.isMenuOpened = true;
      }
    },
    logout() {
      logoutUser().then(() => {
        this.$store.dispatch("resetUser");
        this.$router.push("/");
      })
    },
  },
  computed: {
    routeName() {
      return this.$store.state.route;
    },
    menuItemClass() {
      return {
        'py-5 pl-5 bg-[#1F1F1F] w-full': true,
      }
    },
    submenuItemClass() {
      return {
        'py-5 pl-10 bg-[#2F2F2F] w-full': true,
      }
    },
    lastItemClass() {
      return {
        'border-b-[#707070] border-b-[1px] py-5 pl-5 bg-[#1F1F1F] w-full': true,
      }
    },
    isUserAuthenticated() {
      return this.$store.state.user.id !== '';
    },
    isUserAdmin() {
      return this.$store.state.user.admin;
    },
    isUserMember() {
      return this.$store.state.user.member;
    },
  }
}
</script>

<style scoped>
.menu-item {
  z-index: 10000;
}
</style>