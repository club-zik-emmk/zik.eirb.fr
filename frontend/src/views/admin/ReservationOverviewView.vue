<template>
  <div class="w-full h-[92vh] pb-5" id="reservation-overview">

    <div class="h-[10%] w-full bg-red-900 flex items-center justify-center">
      <div class="flex flex-row items-center">

        <div
            class=""
            @click="handlePreviousWeekClick"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </div>

        <span>Truc</span>

        <div
            class="hover:cursor-pointer"
            @click="handleNextWeekClick"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="h-[90%] w-full flex flex-row">
      <!-- Graduation -->
      <div class="h-full px-5 w-18">

        <!-- Ugly padding -->
        <div class="h-[5.882352941%]"></div>

        <!-- From 7:00 to 23:00 -->
        <div v-for="hour in 16" :key="hour" class="h-[5.882352941%]">
          <span class="text-sm">{{ hour + 7 }}:00</span>
        </div>
      </div>

      <!-- Planning -->
      <div class="flex flex-row h-full flex-1 mt-[0.7%] pr-2">

        <div v-for="dayIndex in 6"
             class="h-full flex-1 relative border-r-[1px] border-black last:border-0 relative">

          <div class="absolute w-full flex items-center justify-center h-[5.882352941%]">
            <span>{{ this.days[dayIndex - 1] }}</span>
          </div>

          <div v-for="hour in 16" :key="hour" class="h-[5.882352941%] border-b-2 border-black"></div>

          <div
              v-for="element in this.reservations[dayIndex]"
              :key="element.startDate"
              :style="getReservationStyle(element)"
              class="reservation w-full absolute bg-blue-300">
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import planningLogicManager from "@/PlanningLogicManager";
import experimentalPlanningLogicManager from "@/ExperimentalPlanningLogicManager";

export default {
  name: "ReservationOverviewView",
  data() {
    return {
      planningManager: experimentalPlanningLogicManager,
    }
  },
  async created() {
    this.$store.dispatch('resetCurrentDay');
    this.$store.dispatch('setLastCacheRefresh', -1);

    this.planningManager.resetToToday();
    await this.planningManager.refreshWeek();

    this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());
  },
  computed: {
    reservations() {
      return this.planningManager.getReservations();
    },
    days() {
      return [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ]
    }
  },
  methods: {
    getReservationStyle(reservation) {
      // Moment.js clone startDate and get the day at 08:00am
      const startDate = reservation.startDate.clone().set({hour: 8, minute: 0, second: 0, millisecond: 0});

      return {
        '--nb-quarter-hours': reservation.endDate.diff(reservation.startDate, 'minutes') / 15,
        '--diff-start-day': reservation.startDate.diff(startDate, 'minutes') / 15,
      }
    },
    async handlePreviousWeekClick() {
      await this.planningManager.getPreviousWeek();
      this.$store.dispatch("setCurrentDay", this.planningManager.getCurrentDay());
    },
    async handleNextWeekClick() {
      await this.planningManager.getNextWeek();
      this.$store.dispatch("setCurrentDay", this.planningManager.getCurrentDay());
    }
  }
}
</script>

<style scoped>
.reservation {
  height: calc(var(--nb-quarter-hours) * 1.470588235%);
  top: calc(var(--diff-start-day) * 1.470588235% + 5.882352941%);
}

.reservation:first-of-type {
  margin-top: 5.882352941%;
}
</style>