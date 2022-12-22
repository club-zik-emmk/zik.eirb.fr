<template>
  <!-- Right part and day display -->
  <div id="day" class="w-full lg:px-16 lg:py-6 relative" :class="dayClasses">
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
        <div class="hover:bg-[#404040] bg-[#2F2F2F] rounded-lg rounded-lg w-32 h-12 flex flex-row items-center justify-evenly px-3"
             v-show="this.isMobile" @click="openWeekList">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>

          Semaines
        </div>

        <router-link to="/book" class="text-black font-semibold bg-[#8DD18A] hover:bg-[#b1d1af] duration-300 hover:cursor-pointer rounded-lg w-32 h-12 flex flex-row items-center justify-evenly px-3"
                     v-if="isUserMember">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
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
        <div class="w-[50%] text-center">
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

    <div class="w-full h-fit mt-8 lg:mt-16 flex flex-row flex-nowrap" :class="(isMobile && (selectedReservation !== null)) ? '' : 'relative'">
      <!-- Left bar with hours -->
      <div class="w-28">
        <!-- Hour -->
        <div v-for="hour in 15" :key="hour">
          <div class="h-[1rem] mb-[3rem] flex items-center">
            <span class="text-sm">{{ hour + 7 }}:00</span>
          </div>

          <!-- Quarter bar -->
          <div class="w-2 h-[0.25rem] bg-gray-300 rounded-xl mb-[3rem]"></div>

          <!-- Half bar -->
          <div class="w-5 h-[0.25rem] bg-gray-300 rounded-xl mb-[3rem]"></div>

          <!-- Quarter bar -->
          <div class="w-2 h-[0.25rem] bg-gray-300 rounded-xl mb-[3rem]"></div>
        </div>
      </div>

      <!-- Right part with events -->
      <div class="absolute top-0 left-14 lg:left-28">
        <!-- Disponibilities -->
        <Disponibility
            v-for="disponibility in currentDay.disponibilities"
            :key="disponibility.id"
            :disponibility="disponibility"
        />

        <!-- Reservations -->
        <Reservation
            v-for="reservation in currentDay.reservations"
            :key="reservation.id"
            :reservation="reservation"
            @click="handleReservationSelection(reservation)"
        />
      </div>

      <!-- Selected reservation -->
      <SelectedReservation
        v-if="selectedReservation"
        :reservation="selectedReservation"
        />
    </div>
  </div>
</template>

<script>
import planningLogicManager from "../../PlanningLogicManager";
import {emitter} from "../../emitter";
import Reservation from "./Reservation.vue";
import Disponibility from "./Disponibility.vue";
import SelectedReservation from "./SelectedReservation.vue";
import experimentalPlanningLogicManager from "@/ExperimentalPlanningLogicManager";

export default {
  name: "Planning",
  components: {
    SelectedReservation,
    Disponibility,
    Reservation,
  },
  data() {
    return {
      planningManager: experimentalPlanningLogicManager,
      isLoading: true,
      selectedReservation: null,
    }
  },
  async created() {
    this.$store.dispatch('resetCurrentDay');
    this.$store.dispatch("setLastCacheRefresh", -1);

    this.planningManager.resetToToday();
    await this.planningManager.refreshWeek();

    this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());

    this.isLoading = false;

    emitter.on('refreshDay', async () => {
      await this.planningManager.refreshWeek();
      this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());
    });

    // Handle the week selection of the left bar
    emitter.on("weekClick", async (week) => {
      this.isLoading = true; // Display spinner

      // Set to first day of week
      await this.planningManager.setWeek(week.firstDay);
      this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());

      this.isLoading = false; // Hide spinner
    });

    // Close selected reservation when on mobile
    emitter.on("closeSelectedReservation", () => {
      this.selectedReservation = null;
    }); 

    emitter.on('hardResetPlaning', async () => {
      this.isLoading = true; // Display spinner

      this.$store.dispatch("setLastCacheRefresh", -1);
      await this.planningManager.refreshWeek();
      // this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());

      this.isLoading = false; // Hide spinner
    });
  },
  methods: {
    async handlePreviousDayButtonClick() {
      this.$store.dispatch("setCurrentDay", await this.planningManager.getPreviousDay());
    },
    async handleNextDayButtonClick() {
      this.$store.dispatch("setCurrentDay", await this.planningManager.getNextDay());
    },
    padDate(date) {
      return `${date.getHours()}`.padStart(2, '0') + ':' + `${date.getMinutes()}`.padStart(2, '0');
    },
    openWeekList() {
      this.$store.dispatch("openWeekList");
    },
    handleReservationSelection(reservation) {
      console.log(reservation);
      this.selectedReservation = reservation;
    },
  },
  computed: {
    dayClasses() {
      return {
        'h-[92vh] overflow-hidden': this.isLoading || (this.isMobile && (this.selectedReservation !== null)),
        'max-h-full overflow-y-auto px-3': !this.isLoading && (!this.isMobile || this.selectedReservation === null),
      }
    },
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
      console.log(`Planning.vue: currentDay(): `, this.$store.state.currentDay);
      return this.$store.state.currentDay;
    },
    isUserMember() {
      return this.$store.state.user.member;
    }
  }
}
</script>

<style scoped>

</style>