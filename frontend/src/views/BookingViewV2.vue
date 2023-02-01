<template>
  <div class="h-[92vh] w-full flex justify-center lg:py-2">
    <div id="day"
      class="w-full lg:w-1/3 h-full overflow-y-auto px-3 lg:px-12 lg:py-6 flex flex-col justify-between py-7 bg-[#1F1F1F] lg:rounded-xl">
      <div class="w-full flex flex-col">
        <router-link to="/planning"
          class="hover:bg-[#404040] bg-[#2F2F2F] duration-300 rounded-lg w-32 lg:w-42 h-12 flex flex-row justify-evenly items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>

          <span>Retour</span>
        </router-link>

        <div class="w-full flex flex-col items-center justify-center my-7">
          <div class="uppercase font-bold text-4xl">Réserver</div>
          <div class="text-xl">{{ clickedDay }}</div>
        </div>

        <div class="flex flex-col mb-7">
          <div>
            Heure de début (min: 8h00)

            <Datepicker v-model="startTime" timePicker minutesIncrement="15"
              :maxTime="{ hours: 22, minutes: 30 }"
              :minTime="{ hours: 8, minutes: 0 }" />
          </div>
        </div>

        <div class="flex flex-col mb-7">
          <div>
            Heure de fin (max: 22h30)

            <Datepicker v-model="endTime" timePicker minutesIncrement="15"
              :maxTime="{ hours: 22, minutes: 30 }"
              :minTime="{ hours: 8, minutes: 0 }" />
          </div>
        </div>

        <div class="flex flex-col">
          <div>
            Intitulé
            <input type="text" v-model="title" required class="h-10 rounded-md text-black px-3 w-full">
          </div>
        </div>

        <div class="w-full mt-5" v-if="isUserAdmin">
          <input type="checkbox" class="mr-5" v-model="isAdminReservation">
          <span>Réservation administrateur </span>
        </div>
      </div>


      <span class="h-10 mt-5 mb-2 mx-2" v-show="!isAdminReservation">{{ this.selectedUsersText }}</span>

      <!-- User list and search query -->
      <div class="w-full flex justify-center">
        <div class="w-full h-72 bg-[#2F2F2F]  rounded-lg overflow-hidden mb-10" v-if="!isAdminReservation">
          <input type="text" class="w-full h-12 outline-none text-black px-5" v-model="searchQuery"
            @input="handleSearch" />

          <div class="flex flex-col overflow-y-auto shrink-0 h-[90%]">
            <div v-for="user in users"
              class="px-2 py-1 duration-300 hover:cursor-pointer h-12 shrink-0 flex items-center"
              :class="selectedUsers.includes(user) ? 'bg-[#ffcc03] hover:bg-[#846500]' : 'hover:bg-[#404040]'"
              @click="handleUserClick(user)">
              {{ user }}
            </div>
          </div>
        </div>
      </div>


      <div class="w-full flex justify-center">
        <div class="w-full py-4 flex justify-center rounded-lg duration-300 text-black" :class="{
          'bg-[#9e3737]': !isReservationValid,
          'hover:cursor-pointer bg-[#8DD18A] hover:bg-[#b1d1af]': this.isReservationValid,
        }" @click="onBookingButtonClick">
          <span>Réserver</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment, { Moment } from "moment";

import axiosInstance from "@/axiosInstance";

export default {
  name: "BookingView2",
  data() {
    return {
      startTime: {
        hours: new Date(0, 0, 0, this.$store.state.bookingDay.hour + 6).getHours(),
        minutes: new Date(0, 0, 0, 0, 0).getMinutes(),
      },
      endTime: {
        hours: new Date(0, 0, 0, (this.$store.state.bookingDay.hour + 7 > 22) ? 22 : this.$store.state.bookingDay.hour + 7).getHours(),
        minutes: new Date(0, 0, 0, 0, 0).getMinutes(),
      },
      title: "",
      searchQuery: "",
      users: [],
      usersBackup: [],
      selectedUsers: [],
      isAdminReservation: false,
    }
  },
  created() {
    if (!this.$store.dispatch("isCurrentDaySet")) {
      this.$router.push("/admin/reservations-overview");
    }

    this.fetchUsers();
  },
  methods: {
    onBookingButtonClick() {
      if (!this.isReservationValid) {
        return;
      }

      const day = this.selectedDay();
      console.log(day);


      // Format to "YYYY-MM-DD HH:mm:ss"
      const formattedStartTime = `${day} ${this.startTime.hours.toString().padStart(2, "0")}:${this.startTime.minutes.toString().padStart(2, "0")}:00`;
      const formattedEndTime = `${day} ${this.endTime.hours.toString().padStart(2, "0")}:${this.endTime.minutes.toString().padStart(2, "0")}:00`;

      if (this.isAdminReservation) {
        axiosInstance.post("/api/v1/reservations/admin", {
          title: this.title,
          startDate: formattedStartTime,
          endDate: formattedEndTime,
          ownerId: "ADMIN",
          users: []
        }).then(() => {
          this.$router.push("/planning");
        }).catch(console.error);
      } else {
        axiosInstance.post("/api/v1/reservations", {
          title: this.title,
          startDate: formattedStartTime,
          endDate: formattedEndTime,
          ownerId: this.$store.state.user.id,
          users: this.selectedUsers
        }).then(() => {
          this.$router.push("/planning");
        }).catch(console.error);
      }
    },
    handleSearch() {
      if (this.searchQuery.length === 0) {
        this.users = this.usersBackup;
        return;
      }

      this.users = this.usersBackup.filter((user) => {
        return user.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    handleUserClick(user) {
      if (this.selectedUsers.includes(user)) {
        this.selectedUsers = this.selectedUsers.filter((selectedUser) => {
          return selectedUser !== user;
        });
      } else {
        this.selectedUsers.push(user);
      }
    },
    fetchUsers() {
      axiosInstance.get("/api/v1/users").then(response => {
        this.users = response.data.data.map(u => u.id).filter(u => u !== this.$store.state.user.id && u !== "ADMIN");
        this.usersBackup = response.data.data.map(u => u.id).filter(u => u !== this.$store.state.user.id && u !== "ADMIN");
      });
    },
    days(index) {
      return [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
      ][index];
    },

    monthes(index) {
      return [
        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre"
      ][index - 1];
    },

    selectedDay() {
      let week = this.$store.state.bookingDay.week;
      let dayIndex = this.$store.state.bookingDay.day;
      let mom = moment(week).add(dayIndex, "days").format("YYYY-MM-DD");
      return mom;
    }
  },
  computed: {


    clickedDay() {
      let dayIndex = this.$store.state.bookingDay.day;
      let mom = this.selectedDay();
      console.log(mom.toString());
      // create string "Mercredi 25 Janvier 2023"
      let day = mom.toString().split("-")[2];
      let month = parseInt(mom.toString().split("-")[1]);
      let year = mom.toString().split("-")[0];
      let dayName = this.days(dayIndex);
      let monthName = this.monthes(month);
      let dayString = dayName + " " + day + " " + monthName + " " + year;
      return dayString;

    },
    selectedUsersText() {
      return this.selectedUsers.join(", ");
    },
    isUserAdmin() {
      return this.$store.state.user.admin;
    },
    currentDay() {
      return this.$store.state.clickedDay;
    },
    reservationIsAvailable() {
      const disponibilities = this.currentDay.disponibilities || [];
      const reservations = this.currentDay.reservations || [];

      // Handle the case where there is no disponibilities
      if (disponibilities.length === 0) {
        return false;
      }

      // Serialized date
      const serialized = this.currentDay.serialized;

      // Deserialize the serialized date
      const deserialized = moment(serialized, "YYYY-MM-DD");

      // Create the Moment objects
      const reservationStartDate = moment(deserialized.clone());

      // Set hours and minutes
      reservationStartDate.hour(this.startTime.hours);
      reservationStartDate.minute(this.startTime.minutes);
      reservationStartDate.second(0);

      // Create the Moment objects
      const reservationEndDate = moment(deserialized.clone());

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

      return (
        isDuringDisponibility
        && !isDuringReservation
        && (isSpanValid || this.isUserAdmin)
      ) || this.isAdminReservation;
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