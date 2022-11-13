<template>
  <div class="h-[8vh] mobile-header">
    <div class="h-full w-full flex flex-row justify-between px-5 relative items-center">
      <!-- Logo and name -->
      <div class="flex flex-row items-center justify-evenly">
        <div>Ouais le zik</div>
      </div>

      <!-- Menu button -->
      <div class="bg-blue-900 h-fit p-2.5 rounded-lg" @click="handleButtonClick">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
      </div>
    </div>

    <!-- Menu -->
    <div class="absolute w-full z-30 flex flex-col" v-show="isMenuOpened">
      <router-link to="/" :class="menuItemClass" @click="closeMenu">Accueil</router-link>
      <router-link to="/planning" :class="menuItemClass" @click="closeMenu">Planning</router-link>

      <div>
        <div :class="menuItemClass" @click="isAdminMenuOpened = !isAdminMenuOpened">Admin</div>

        <div class="flex flex-col" v-show="isAdminMenuOpened">
          <router-link v-for="link in adminLinks" :key="link.title" :to="link.path" :class="menuItemClass"
                       @click="closeMenu">{{ link.title }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import links from "./links.json";

export default {
  name: "MobileHeader",
  data() {
    return {
      isMenuOpened: false,
      isAdminMenuOpened: false,
      adminLinks: links.admin
    }
  },
  mounted() {
    // Close menu when clicking outside
    document.addEventListener("click", this.handleClickEvent);
  },
  unmounted() {
    // Be careful to remove the listener when the component is destroyed
    document.removeEventListener("click", this.handleClickEvent);
  },
  methods: {
    handleClickEvent(event) {
      if (!event.target.closest(".mobile-header")) {
        this.closeMenu();
      }
    },
    closeMenu() {
      this.isAdminMenuOpened = false;
      this.isMenuOpened = false;
    },
    handleButtonClick() {
      if (this.isMenuOpened) {
        this.closeMenu();
      } else {
        this.isMenuOpened = true;
      }
    }
  },
  computed: {
    menuItemClass() {
      return {
        'py-5': true,
        'pl-5': true,
        'bg-black': true,
        'w-full': true,
      }
    }
  }
}
</script>

<style scoped>

</style>