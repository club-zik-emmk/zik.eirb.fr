<template>
  <main class="h-[92vh] flex flex-row justify-center items-center">
    <!-- Left bar week display -->
    <div class="h-full" :class="weekListClass" v-show="isWeekListOpen">
      <WeekList />
    </div>

    <div class="w-full lg:w-[70%] h-full">
      <Planning />
    </div>
  </main>
</template>

<script>
import WeekList from "../components/planning/WeekList.vue";
import Planning from "../components/planning/Planning.vue";
import {emitter} from "../emitter";

export default {
  name: "PlanningView",
  components: {Planning, WeekList},
  created() {
    if (!this.isMobile) {
      this.$store.dispatch("openWeekList");
    } else {
      this.$store.dispatch("closeWeekList");
    }

    emitter.on("closeWeekList", () => {
      this.$store.dispatch("closeWeekList");
    });

    emitter.on("openWeekList", () => {
      this.$store.dispatch("openWeekList");
    });
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
    weekListClass() {
      return {
        'w-full': this.isMobile && this.isWeekListOpen,
        'w-[30%]': !this.isMobile,
        'absolute': this.isMobile,
        'top-0': this.isMobile,
        'left-0': this.isMobile,
        'z-10': this.isMobile && this.isWeekListOpen,
      }
    },
    isWeekListOpen() {
      return this.$store.state.isWeekListOpen;
    }
  }
}
</script>

<style scoped>

</style>