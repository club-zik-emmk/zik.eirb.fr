<template>
  <!-- Header -->
  <MobileHeader v-if="isMobile"/>
  <DesktopHeader v-else/>

  <router-view></router-view>
</template>

<script>
import DesktopHeader from "@/components/headers/DesktopHeader.vue";
import MobileHeader from "@/components/headers/MobileHeader.vue";


export default {
  name: 'App',
  components: {MobileHeader, DesktopHeader},
  data() {
    return {}
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #F9FBFB;

  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;

  position: relative;
}

html, body {
  margin: 0;
  height: 100%;
}
</style>
