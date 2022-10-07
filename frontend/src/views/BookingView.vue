<template>
  <div id="day" class="w-full max-h-full overflow-y-auto px-3 lg:px-16 lg:py-6">
    <router-link to="/planning" class="bg-blue-900 rounded-lg w-32 h-12">Retour</router-link>

    <div class="w-full flex justify-center">
      <div class="uppercase font-bold text-4xl">Réserver</div>
    </div>

    <div class="w-full flex flex-row">
      <div class="flex flex-col">
        <div>
          Heure de début

          <Datepicker v-model="startTime" timePicker minutesIncrement="15" :maxTime="{ hours: 22, minutes: 0 }"
                      :minTime="{ hours: 8, minutes: 0 }"/>
        </div>
      </div>

      <div class="flex flex-col">
        <div>
          Heure de fin

          <Datepicker v-model="endTime" timePicker minutesIncrement="15" :maxTime="{ hours: 22, minutes: 0 }"
                      :minTime="{ hours: 8, minutes: 0 }"/>
        </div>
      </div>

      <div class="w-32 h-32"
           :class="{'bg-red-900': !this.reservationIsAvailable || !this.areTimesValid, 'bg-green-900': reservationIsAvailable && this.areTimesValid}">
        Réserver
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

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
    }
  },
  created() {
    if (!this.$store.dispatch("isCurrentDaySet")) {
      this.$router.push("/planning");
    }
  },
  computed: {
    currentDay() {
      return this.$store.state.currentDay;
    },
    reservationIsAvailable() {
      const disponibilities = this.currentDay.disponibilities;
      const reservations = this.currentDay.reservations;

      // Handle the case where there is no disponibilities
      if (!disponibilities || disponibilities.length === 0) {
        return false;
      }

      // Reservation date is the same day as the one in the disponibilities
      const reservationStartDate = moment(disponibilities[0].startDate);
      reservationStartDate.hour(this.startTime.hours);
      reservationStartDate.minute(this.startTime.minutes);
      reservationStartDate.second(0);

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

      // Check that the start time or the end time is not in a reservation
      const isDuringReservation = reservations.some((reservation) => {
        const startDate = moment(reservation.startDate);
        const endDate = moment(reservation.endDate);

        return reservationStartDate.isBetween(startDate, endDate)
            || reservationEndDate.isBetween(startDate, endDate)
            || reservationStartDate.isSame(startDate, "minute")
            || reservationEndDate.isSame(endDate, "minute");
      });

      return isDuringDisponibility && !isDuringReservation;
    },
    areTimesValid() {
      const startTime = moment();
      startTime.hour(this.startTime.hours);
      startTime.minute(this.startTime.minutes);
      startTime.second(0);

      const endTime = moment();
      endTime.hour(this.endTime.hours);
      endTime.minute(this.endTime.minutes);
      endTime.second(0);

      return (!startTime.isSame(endTime, "minute") && startTime.isBefore(endTime));
    }
  }
}
</script>

<style scoped>

</style>