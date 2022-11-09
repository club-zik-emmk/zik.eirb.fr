<template>
  <!-- Right part and day display -->
  <div id="day" class="w-full px-3 lg:px-16 lg:py-6 relative" :class="isLoading ? 'h-[92vh] overflow-hidden' : 'max-h-full overflow-y-auto'">
    <div class="w-full h-full" v-show="isLoading">
      <div class="w-full h-full absolute top-0 left-0 bg-black opacity-50"></div>
      <div class="w-full h-full flex justify-center items-center absolute top-0 left-0">
        <scale-loader :loading="isLoading"></scale-loader>
      </div>
    </div>

    <!-- Day header -->
    <div class="flex flex-col" v-show="!isLoading">

      <!-- Actions -->
      <div class="mb-12 flex flex-row w-full flex flex-row justify-between lg:justify-end pt-5 lg:pt-0">
        <div class="bg-red-900 rounded-lg rounded-lg w-32 h-12 flex flex-row items-center justify-evenly px-3" v-show="this.isMobile" @click="openWeekList">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>

          Semaines
        </div>

        <router-link to="/book" class="bg-green-400 rounded-lg w-32 h-12 flex flex-row items-center justify-evenly px-3" v-if="isUserMember">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

          Réserver
        </router-link>
      </div>

      <!-- Day navigation -->
      <div class="flex flex-row w-full justify-evenly h-28 items-center lg:h-fit">
        <div
            class="hover:cursor-pointer flex justify-center items-center rounded-2xl mr-5 p-2"
            @click="handlePreviousDayButtonClick">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </div>

        <!-- Day name -->
        <div>
          <span class="font-bold text-4xl mr-3">{{ this.currentDayName }}</span> <span
            class="text-4xl">{{ this.currentDayNumber }}</span>
        </div>

        <div
            class="hover:cursor-pointer flex justify-center items-center rounded-xl ml-5 p-2"
            @click="handleNextDayButtonClick">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="w-full h-fit mt-8 lg:mt-16 relative">
      <!-- Left bar with hours -->
      <div class="w-28">
        <!-- Hour -->
        <div v-for="hour in 15" :key="hour">
          <div class="text-sm mb-9 hour-anchor" :anchor-value="`${hour + 7}`.padStart(2, '0') + ':00'">{{
              hour + 7
            }}:00
          </div>

          <!-- Quarter bar -->
          <div class="w-2 h-[2px] bg-gray-300 rounded-xl mb-9 hour-anchor"
               :anchor-value="`${hour + 7}`.padStart(2, '0') + ':15'"></div>

          <!-- Half bar -->
          <div class="w-5 h-[2px] bg-gray-300 rounded-xl mb-9 hour-anchor"
               :anchor-value="`${hour + 7}`.padStart(2, '0') + ':30'"></div>

          <!-- Quarter bar -->
          <div class="w-2 h-[2px] bg-gray-300 rounded-xl mb-9 hour-anchor"
               :anchor-value="`${hour + 7}`.padStart(2, '0') + ':45'"></div>
        </div>
      </div>

      <!-- Right part with events -->
      <div class="absolute top-0 left-14 lg:left-28 event-anchor" style="z-index: -1">
        <!-- Disponibilities -->
        <Disponibility v-for="disponibility in currentDay.disponibilities" :key="disponibility.id"
                       :disponibility="disponibility"/>

        <!-- Reservations -->
        <Reservation v-for="reservation in currentDay.reservations" :key="reservation.id" :reservation="reservation"/>
      </div>
    </div>
  </div>
</template>

<script>
import planningLogicManager from "../../PlanningLogicManager";
import {emitter} from "../../emitter";
import Reservation from "./Reservation.vue";
import Disponibility from "./Disponibility.vue";

export default {
  name: "Planning",
  components: {
    Disponibility,
    Reservation,
  },
  data() {
    return {
      planningManager: planningLogicManager,
      isLoading: true
    }
  },
  async created() {
    this.$store.dispatch('resetCurrentDay');

    this.planningManager.resetToToday();
    await this.planningManager.refreshWeek();
    this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());

    this.isLoading = false;

    emitter.on("weekClick", async (week) => {
      this.isLoading = true; // Display spinner

      // Set to first day of week
      await this.planningManager.setWeek(week.firstDay);
      this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());

      this.isLoading = false; // Hide spinner
    });
  },
  methods: {
    async handlePreviousDayButtonClick() {
      this.$store.dispatch("setCurrentDay", await this.planningManager.getPreviousDay());
      this.$store.dispatch("resetPositions");
    },
    async handleNextDayButtonClick() {
      this.$store.dispatch("setCurrentDay", await this.planningManager.getNextDay());
      this.$store.dispatch("resetPositions");
    },
    padDate(date) {
      return `${date.getHours()}`.padStart(2, '0') + ':' + `${date.getMinutes()}`.padStart(2, '0');
    },
    openWeekList() {
      this.$store.dispatch("openWeekList");
    }
  },
  computed: {
    currentDayName() {
      return this.currentDay.dayName.split(" ")[0];
    },
    currentDayNumber() {
      const list = this.currentDay.dayName.split(" ").reverse();
      list.pop();

      return list.reverse().join(" ");
    },
    isMobile() {
      return document.documentElement.clientWidth < 768;
    },
    currentDay() {
      return this.$store.state.currentDay;
    },
    isUserMember() {
      return this.$store.state.user.member;
    }
  },
  unmounted() {
    this.$store.dispatch('resetPositions');
  }
}
</script>

<style scoped>

</style>