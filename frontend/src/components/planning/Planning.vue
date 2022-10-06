<template>
  <!-- Right part and day display -->
  <div class="w-full max-h-full overflow-y-auto px-3 lg:px-16 lg:py-16">
    <!-- Day header -->
    <div class="flex flex-col">

      <!-- Day navigation -->
      <div class="flex flex-row w-full justify-evenly">
        <div
            class="lg:hover:bg-gray-200 duration-300 hover:cursor-pointer flex justify-center items-center rounded-2xl pr-5"
            @click="handlePreviousDayButtonClick">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </div>

        <!-- Day name -->
        <div>
          <span class="font-bold text-4xl mr-3">{{ this.currentDayName }}</span> <span class="text-4xl">{{ this.currentDayNumber}}</span>
        </div>

        <div
            class="lg:hover:bg-gray-200 duration-300 hover:cursor-pointer flex justify-center items-center rounded-xl pl-5"
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
          <div class="text-sm mb-9 hour-anchor" :anchor-value="`${hour + 7}`.padStart(2, '0') + ':00'">{{ hour + 7 }}:00</div>

          <!-- Quarter bar -->
          <div class="w-2 h-[2px] bg-gray-300 rounded-xl mb-9 hour-anchor" :anchor-value="`${hour + 7}`.padStart(2, '0') + ':15'"></div>

          <!-- Half bar -->
          <div class="w-5 h-[2px] bg-gray-300 rounded-xl mb-9 hour-anchor" :anchor-value="`${hour + 7}`.padStart(2, '0') + ':30'"></div>

          <!-- Quarter bar -->
          <div class="w-2 h-[2px] bg-gray-300 rounded-xl mb-9 hour-anchor" :anchor-value="`${hour + 7}`.padStart(2, '0') + ':45'"></div>
        </div>
      </div>

      <!-- Right part with events -->
      <div class="absolute top-0 left-14 lg:left-28 event-anchor" style="z-index: -1">
        <!-- Disponibilities -->
        <Disponibility v-for="disponibility in currentDay.disponibilities" :key="disponibility.id" :disponibility="disponibility" />

        <!-- Reservations -->
        <Reservation v-for="reservation in currentDay.reservations" :key="reservation.id" :reservation="reservation" />
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
      currentDay: {
        dayName: "Uh, problem",
        dayIndex: 0,
        reservations: [],
        disponibilities: []
      },
      planningManager: planningLogicManager,
    }
  },
  async created() {
    await this.planningManager.refreshWeek();
    this.currentDay = await this.planningManager.getCurrentDay();

    emitter.on("weekClick", async (week) => {
      await this.planningManager.setWeek(week.firstDay);
      this.currentDay = await this.planningManager.getCurrentDay();
    });
  },
  methods: {
    async handlePreviousDayButtonClick() {
      this.currentDay = await this.planningManager.getPreviousDay();
      this.$store.dispatch("resetPositions");
    },
    async handleNextDayButtonClick() {
      this.currentDay = await this.planningManager.getNextDay();
      this.$store.dispatch("resetPositions");
    },
    padDate(date) {
      return `${date.getHours()}`.padStart(2, '0') + ':' + `${date.getMinutes()}`.padStart(2, '0');
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
  }
}
</script>

<style scoped>

</style>