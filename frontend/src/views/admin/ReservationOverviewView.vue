<template>
  <div class="w-full h-[92vh] pb-5 relative" id="reservation-overview">

    <!-- Overlay -->
    <div class="w-full h-full absolute top-0 flex items-center justify-center" style="z-index: 1;"
      v-show="shouldOverlayBeDisplayed">

      <!-- Loading spinner -->
      <div class="h-full w-full flex items-center justify-center bg-[#101010]" v-show="this.loading && !this.isMobile">
        <scale-loader :loading="this.loading"></scale-loader>
      </div>

      <!-- Selected reservation -->
      <div class="w-1/3 h-[80%] rounded-xl px-5 pb-5 bg-[#2F2F2F] shadow-2xl shadow-black"
        id="selectedReservation"
        v-if="this.selectedReservation">

        <!-- Menu -->
        <div class="py-5 w-full">
          <div class="p-2 bg-[#3F3F3F] w-fit rounded-lg mr-3 hover:cursor-pointer hover:bg-[#5f5f5f] duration-300"
            @click="clearSelectedReservation">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <div class="w-full flex flex-col">
          <span class="font-semibold mb-2">#{{ selectedReservation.id }}</span>
          <span class="text-2xl font-bold mb-2">{{ selectedReservation.title }}</span>
          <span class="text-sm mb-2">Réservé par <span class="font-bold">{{ selectedReservation.ownerId }}</span></span>
          <span class="mb-2">
            De {{ selectedReservation.startDate.format("HH:mm") }} à {{ selectedReservation.endDate.format("HH:mm") }}
          </span>

          <ul v-show="selectedReservation.users.length > 0" class="list-disc pl-5 mt-2">
            <li v-for="user in selectedReservation.users" :key="user" class="font-semibold">
              {{ user }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Error message if the user is on mobile -->
      <div class="h-full w-full flex items-center justify-center bg-[#101010]" v-show="this.isMobile">
        <span class="font-2xl font-bold text-white">Cette page n'est pas disponible sur mobile</span>
      </div>

    </div>

    <div class="h-[10%] w-full flex items-center justify-center">
      <div class="flex flex-row items-center">

        <div class="hover:cursor-pointer" @click="handlePreviousWeekClick">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </div>

        <span class="px-1 w-64 flex justify-center">{{ weekString }}</span>

        <div class="hover:cursor-pointer" @click="handleNextWeekClick">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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
      <div class="flex flex-row h-full flex-1 mt-[0.7%] mr-2 overflow-hidden rounded-lg" style="z-index: 0;"
        v-if="this.reservations">

        <div v-for="dayIndex in 6"
          class="h-full flex-1 relative border-r-[1px] border-black last:border-0 relative bg-[#1f1f1f]">

          <div class="absolute w-full flex items-center justify-center h-[5.882352941%] bg-[#2F2F2F]">
            <span>{{ this.days[dayIndex - 1] }}</span>
          </div>

          <div v-for="hour in 16" :key="hour" class="h-[5.882352941%] border-b-2 border-black"></div>

          <div v-for="element in this.reservations[dayIndex]" :key="element.startDate"
            :style="getReservationStyle(element)"
            class="reservation w-full absolute bg-[#ee5253] duration-300 hover:cursor-pointer" :class="{
              'bg-[#ED916F] hover:bg-[#eab19d]': element.ownerId === 'ADMIN',
              'bg-[#AD86FF] hover:bg-[#cab2ff]': element.ownerId !== 'ADMIN'
            }" @click="this.handleReservationClick(element)"></div>

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
      weekString: "",
      loading: true,
      selectedReservation: null
    }
  },
  async created() {
    this.$store.dispatch('resetCurrentDay');
    this.$store.dispatch('setLastCacheRefresh', -1);

    this.planningManager.resetToToday();
    await this.planningManager.refreshWeek();

    this.$store.dispatch("setCurrentDay", await this.planningManager.getCurrentDay());

    // Refresh the week string
    this.refreshWeekString(this.planningManager.getCurrentWeek());

    this.loading = false;
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
    },
    shouldOverlayBeDisplayed() {
      return this.selectedReservation || this.loading || this.isMobile;
    },
    isMobile() {
      return window.innerWidth < 768;
    },
  },
  methods: {
    getReservationStyle(reservation) {
      // Moment.js clone startDate and get the day at 08:00am
      const startDate = reservation.startDate.clone().set({ hour: 8, minute: 0, second: 0, millisecond: 0 });

      return {
        '--nb-quarter-hours': reservation.endDate.diff(reservation.startDate, 'minutes') / 15,
        '--diff-start-day': reservation.startDate.diff(startDate, 'minutes') / 15,
      }
    },
    async handlePreviousWeekClick() {
      await this.planningManager.getPreviousWeek();
      this.$store.dispatch("setCurrentDay", this.planningManager.getCurrentDay());

      // Refresh the week string
      this.refreshWeekString(this.planningManager.getCurrentWeek());
    },
    async handleNextWeekClick() {
      await this.planningManager.getNextWeek();
      this.$store.dispatch("setCurrentDay", this.planningManager.getCurrentDay());

      // Refresh the week string
      this.refreshWeekString(this.planningManager.getCurrentWeek());
    },
    refreshWeekString(momentObject) {
      // If today is Sunday, we need to get the previous week
      if (momentObject.day() === 0) {
        momentObject = momentObject.clone().subtract(1, 'week');
      }

      // Get the first day of the week (Monday)
      const firstDay = momentObject.clone().startOf('week').add(1, 'day');

      // Get the last day of the week
      const lastDay = momentObject.clone().endOf('week');

      const monthes = {
        0: "Janvier",
        1: "Février",
        2: "Mars",
        3: "Avril",
        4: "Mai",
        5: "Juin",
        6: "Juillet",
        7: "Août",
        8: "Septembre",
        9: "Octobre",
        10: "Novembre",
        11: "Décembre",
      };

      this.weekString = `${firstDay.format('DD')} - ${lastDay.format('DD')} ${monthes[firstDay.month()]} ${firstDay.format('YYYY')}`
    },
    handleReservationClick(reservation) {
      this.selectedReservation = reservation;
    },
    clearSelectedReservation() {
      this.selectedReservation = null;
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

/* Pop-up animation for #selectedReservation */
#selectedReservation {
  animation: fadeIn 0.1s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>