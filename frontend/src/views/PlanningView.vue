<template>
  <main class="h-[90vh] flex flex-row justify-center items-center">
    <!-- Left bar week display -->
    <div class="w-[30%] h-full">
      <WeekList />
    </div>

    <!-- Right part and day display -->
    <div class="w-[70%] max-h-full overflow-y-auto px-16 py-16">
      <!-- Day header -->
      <div class="flex flex-col w-fit ml-28">

        <!-- Day navigation -->
        <div class="flex flex-row w-36 justify-start mb-12">
          <div
              class="hover:bg-gray-200 duration-300 hover:cursor-pointer flex justify-center items-center rounded-2xl pr-1"
              @click="handlePreviousDayButtonClick">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </div>

          <div
              class="hover:bg-gray-200 duration-300 hover:cursor-pointer flex justify-center items-center rounded-xl pl-1"
              @click="handleNextDayButtonClick">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </div>
        </div>

        <!-- Day name -->
        <div>
          <span class="font-bold text-4xl mr-3">{{ this.currentDayName }}</span> <span class="text-4xl">{{ this.currentDayNumber}}</span>
        </div>
      </div>

      <div class="w-full h-fit mt-16 relative">
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
        <div class="absolute top-0 left-28 event-anchor" style="z-index: -1">
          <!-- Disponibilities -->
          <Disponibility v-for="disponibility in currentDay.disponibilities" :key="disponibility.id" :inner-padding-prop="innerPadding" :event-anchor-prop="eventAnchor" :disponibility="disponibility" />

          <!-- Reservations -->
          <Reservation v-for="reservation in currentDay.reservations" :key="reservation.id" :event-anchor-prop="eventAnchor" :inner-padding-prop="innerPadding" :reservation="reservation" />

        </div>
      </div>
    </div>

  </main>
</template>

<script lang="ts">
import Day from "../components/planning/Day.vue";
import {IPlanningLogic} from "../types";
import planningLogicManager from "../PlanningLogicManager";
import {Day as DayType} from "../types";
import WeekList from "../components/planning/WeekList.vue";
import Reservation from "../components/planning/Reservation.vue";
import Disponibility from "../components/planning/Disponibility.vue";

type PlanningData = {
  planningManager: IPlanningLogic,
  currentDay: DayType,
  eventAnchor: DOMRect | null,
  innerPadding: number
}

export default {
  name: "PlanningView",
  components: {Disponibility, Reservation, WeekList, Day},
  data(): PlanningData {
    return {
      planningManager: planningLogicManager,
      currentDay: {
        dayName: "Uh, problem",
        dayIndex: 0,
        reservations: [],
        disponibilities: []
      },
      eventAnchor: null,
      innerPadding: -1
    }
  },
  async created() {
    await this.planningManager.refreshWeek();
    this.currentDay = await this.planningManager.getCurrentDay();
  },
  methods: {
    async handlePreviousDayButtonClick() {
      this.currentDay = await this.planningManager.getPreviousDay();
    },
    async handleNextDayButtonClick() {
      this.currentDay = await this.planningManager.getNextDay();
    },
    padDate(date: Date): string {
      return `${date.getHours()}`.padStart(2, '0') + ':' + `${date.getMinutes()}`.padStart(2, '0');
    }
  },
  computed: {
    currentDayName(): string {
      return this.currentDay.dayName.split(" ")[0];
    },
    currentDayNumber(): string {
      const list = this.currentDay.dayName.split(" ").reverse();
      list.pop();

      return list.reverse().join(" ");
    }
  }
}
</script>

<style scoped>

</style>