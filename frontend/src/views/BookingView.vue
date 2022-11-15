<template>
  <div class="h-[92vh] w-full flex justify-center">
    <div id="day"
         class="w-full lg:w-1/3 h-full overflow-y-auto px-3 lg:px-16 lg:py-6 flex flex-col justify-between py-7">
      <div class="w-full flex flex-col">
        <router-link to="/planning"
                     class="bg-blue-900 rounded-lg w-32 lg:w-42 h-12 flex flex-row justify-evenly items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>

          <span>Retour</span>
        </router-link>

        <div class="w-full flex flex-col items-center justify-center my-7">
          <div class="uppercase font-bold text-4xl">Réserver</div>
          <div class="text-xl">{{this.currentDay.dayName}}</div>
        </div>

        <div class="flex flex-col mb-7">
          <div>
            Heure de début

            <Datepicker v-model="startTime" timePicker minutesIncrement="15" :maxTime="{ hours: 22, minutes: 0 }"
                        :minTime="{ hours: 8, minutes: 0 }"/>
          </div>
        </div>

        <div class="flex flex-col mb-7">
          <div>
            Heure de fin

            <Datepicker v-model="endTime" timePicker minutesIncrement="15" :maxTime="{ hours: 22, minutes: 0 }"
                        :minTime="{ hours: 8, minutes: 0 }"/>
          </div>
        </div>

        <div class="flex flex-col">
          <div>
            Intitulé
            <input type="text" v-model="title" required class="h-10 rounded-md text-black px-3 w-full">
          </div>
        </div>
      </div>

      <div class="w-full flex justify-center">
        <div class="w-full py-4 flex justify-center rounded-lg duration-300"
             :class="{
          'bg-red-900': !isReservationValid,
          'bg-green-900': this.isReservationValid,
          'hover:cursor-pointer': this.isReservationValid,
          'hover:bg-green-800': this.isReservationValid,
        }"
        @click="onBookingButtonClick">
          <span>Réserver</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axiosInstance from "@/axiosInstance";

export default {
  name: "BookingView",
  data() {
    return {
      startTime: {
        hours: new Date(0, 0, 0, 8).getHours(),
        minutes: new Date(0, 0, 0, 0, 0).getMinutes(),
      },
      endTime: {
        hours: new Date(0, 0, 0, 8).getHours(),
        minutes: new Date(0, 0, 0, 0, 15).getMinutes(),
      },
      title: ""
    }
  },
  created() {
    if (!this.$store.dispatch("isCurrentDaySet")) {
      this.$router.push("/planning");
    }
  },
  methods: {
    onBookingButtonClick() {
      if (!this.isReservationValid) {
        return;
      }

      const day = moment(this.currentDay.isoString).format("YYYY-MM-DD");

      // Format to "YYYY-MM-DD HH:mm:ss"
      const formattedStartTime = `${day} ${this.startTime.hours.toString().padStart(2, "0")}:${this.startTime.minutes.toString().padStart(2, "0")}:00`;
      const formattedEndTime = `${day} ${this.endTime.hours.toString().padStart(2, "0")}:${this.endTime.minutes.toString().padStart(2, "0")}:00`;

      axiosInstance.post("/api/v1/reservations", {
        title: this.title,
        startDate: formattedStartTime,
        endDate: formattedEndTime,
        ownerId: this.$store.state.user.id,
      }).then(() => {
        this.$router.push("/planning");
      }).catch((error) => {
        console.log(error);
      });
    }
  },
  computed: {
    isUserAdmin() {
      return this.$store.state.user.admin;
    },
    currentDay() {
      return this.$store.state.currentDay;
    },
    reservationIsAvailable() {
      const disponibilities = this.currentDay.disponibilities || [];
      const reservations = this.currentDay.reservations || [];

      // Handle the case where there is no disponibilities
      if (disponibilities.length === 0) {
        return false;
      }

      // Create the Moment objects
      const reservationStartDate = moment(disponibilities[0].startDate);
      reservationStartDate.hour(this.startTime.hours);
      reservationStartDate.minute(this.startTime.minutes);
      reservationStartDate.second(0);

      // Create the Moment objects
      const reservationEndDate = moment(disponibilities[0].startDate);
      reservationEndDate.hour(this.endTime.hours);
      reservationEndDate.minute(this.endTime.minutes);
      reservationEndDate.second(0);

      // Check if the reservation is during a disponibility
      const isDuringDisponibility = disponibilities.some((disponibility) => {
        const startDate = moment(disponibility.startDate);
        const endDate = moment(disponibility.endDate);

        return reservationStartDate.isBetween(startDate, endDate)
            && reservationEndDate.isBetween(startDate, endDate)
            && !reservationStartDate.isSame(startDate, "minute")
            && !reservationEndDate.isSame(endDate, "minute");
      });

      // Check that the current reservation doesn't overlap with another one
      const isDuringReservation = reservations.some((reservation) => {
        const startDate = moment(reservation.startDate);
        const endDate = moment(reservation.endDate);

        return (reservationStartDate.isBetween(startDate, endDate) || reservationStartDate.isSameOrBefore(startDate))
            && (reservationEndDate.isBetween(startDate, endDate) || reservationEndDate.isSameOrAfter(endDate));
      });

      // Check that the span of the reservation is less or equal to 3 hours
      const isSpanValid = reservationEndDate.diff(reservationStartDate, "hours") <= 3;

      return isDuringDisponibility && !isDuringReservation && (isSpanValid || this.isUserAdmin);
    },
    areTimesValid() {
      // Create the Moment objects
      const startTime = moment();
      startTime.hour(this.startTime.hours);
      startTime.minute(this.startTime.minutes);
      startTime.second(0);

      // Create the Moment objects
      const endTime = moment();
      endTime.hour(this.endTime.hours);
      endTime.minute(this.endTime.minutes);
      endTime.second(0);

      // Check that the start and end times are different
      // and that the end time is after the start time
      return (!startTime.isSame(endTime, "minute") && startTime.isBefore(endTime));
    },
    isReservationValid() {
      return this.reservationIsAvailable
          && this.areTimesValid
          && this.title !== "";
    }
  }
}
</script>

<style scoped>

</style>