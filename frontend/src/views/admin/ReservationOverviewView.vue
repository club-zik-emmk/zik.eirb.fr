<template>
  <div class="w-full h-[92vh] flex flex-row pb-5 pt-16" id="reservation-overview" :style="reservationOverviewStyle">
      <!-- Graduation -->
      <div class="h-full px-5 w-18">
        <!-- From 7:00 to 23:00 -->
        <div v-for="hour in 16" :key="hour" class="h-[6.25%]">
          <span class="text-sm">{{ hour + 7 }}:00</span>
        </div>
      </div>

      <!-- Planning -->
      <div class="flex flex-row h-full flex-1 mt-[0.7%] pr-2">

        <div v-for="dayIndex in 6" class="h-full bg-red-900 flex-1 relative border-r-[1px] border-black last:border-0 relative">
          <div class="absolute -top-[2rem] w-full flex items-center justify-center">
            <span>{{this.days[dayIndex - 1]}}</span>
          </div>
          <div v-for="hour in 16" :key="hour" class="h-[6.25%] border-b-2 border-black"></div>

          <div
              v-for="element in this.reservations[dayIndex]"
              :key="element.startDate"
              :style="getReservationStyle(element)"
              class="reservation w-full absolute bg-blue-300">
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import planningLogicManager from "@/PlanningLogicManager";

export default {
  name: "ReservationOverviewView",
  data() {
    return {
      planningManager: planningLogicManager,
    }
  },
  async created() {
    this.$store.dispatch('resetCurrentDay');

    this.planningManager.resetToToday();
    await this.planningManager.refreshWeek();

    this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());
    console.log(this.reservations)
  },
  computed: {
    reservations() {
      return this.planningManager.getReservations().reduce((acc, reservation) => {
        if (!acc[reservation.startDate.day()]) {
          acc[reservation.startDate.day()] = [reservation];
        } else {
          acc[reservation.startDate.day()].push(reservation);
        }

        return acc;
      }, new Array(7));
    },
    currentWeek() {
      return this.planningManager.getCurrentWeek();
    },
    reservationOverviewStyle() {
      // Get the height of #reservation-overview
      const reservationOverview = document.getElementById("reservation-overview");

      return {
        '--height': 1
      }
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

      const diffStartDay = reservation.startDate.diff(reservation.startDate.clone().startOf('day'), 'minutes') / 15;
      return {
        '--nb-quarter-hours': reservation.endDate.diff(reservation.startDate, 'minutes') / 15,
        '--diff-start-day': reservation.startDate.diff(startDate, 'minutes') / 15,
      }
    }
  }
}
</script>

<style scoped>
.reservation {
  height: calc(var(--nb-quarter-hours) * 1.5625%);
  top: calc(var(--diff-start-day) * 1.5625%);
}
</style>