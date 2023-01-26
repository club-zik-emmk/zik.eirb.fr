<template>
  <div
      class="absolute left-[10vw] lg:left-24 w-[65vw] lg:w-96 reservation rounded-lg overflow-hidden"
      :style="this.style"
      :class="reservationClass"
  >
    <div class="flex flex-row items-center flex-wrap h-[3.25rem] py-1 px-2">

      <div
          :class="{ 'bg-[#AD86FF]': !isReservationAdmin, 'bg-[#ED916F]': isReservationAdmin }"
          class="p-2 rounded-lg mr-4">
        <svg
            v-if="isReservationAdmin"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-5">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path
              d="M12 14v8H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm9 4h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z"/>
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-5">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"/>
        </svg>
      </div>

      <div class="flex flex-col flex-wrap">
        <div class="font-bold text-[90%]">{{ reservation.title }} <span class="text-xs font-normal">(<span
            class="text-[#cccccc]">{{ reservation.ownerId }}</span>)</span></div>
        <div>
          <div class="text-xs flex items-center">
            {{ this.padDate(reservation.startDate) }}

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                 stroke="currentColor"
                 class="w-3 h-[0.6rem]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>


            {{ this.padDate(reservation.endDate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axiosInstance";
import {emitter} from "@/emitter";
import moment from "moment";

export default {
  name: "Reservation",
  props: {
    reservation: {
      type: Object,
      required: true
    }
  },
  computed: {
    style() {
      // If this.reservation.startDate isn't the same day as this.reservation.endDate
      if (!this.reservation.startDate.isSame(this.reservation.endDate, 'day')) {
        // Then the reservation
        // TODO
      }

      // Number of quarter hours between 08:00 and the start of the disponibility
      const start = this.reservation.startDate.diff(this.reservation.startDate.clone().startOf("day").hour(8), "minutes") / 15;
      // Number of quarter hours between the start and the end of the disponibility
      const height = this.reservation.endDate.diff(this.reservation.startDate, "minutes") / 15;
      // How many times the reservation goes over a round hour
      const roundHour = Math.floor(height / 4);
      // How many times the difference between the parent height and the reservation start goes over a round hour
      const roundHourStart = Math.floor(start / 4);

      return {
        '--start': start,
        '--round-hour-start': roundHourStart,
        '--height': height,
        '--round-hour': roundHour,
      };
    },
    reservationClass() {
      return {
        'duration-300 hover:cursor-pointer': this.deletable,
        'bg-[#332A44]': !this.isReservationAdmin,
        'bg-[#3F1B0C]': this.isReservationAdmin,
        'hover:bg-[#655587]': !this.isReservationAdmin && this.deletable,
        'hover:bg-[#873a1c]': this.isReservationAdmin && this.deletable,
      }
    },
    deletable() {
      return this.reservation.ownerId === this.$store.state.user.id
          || this.$store.state.user.admin;
    },
    isUserAdmin() {
      return this.$store.state.user.admin;
    },
    isReservationAdmin() {
      return this.reservation.ownerId === 'ADMIN';
    }
  },
  methods: {
    padDate(date) {
      // Set locale to french
      return date.format("HH:mm");
    },
    deleteReservation() {
      if (this.deletable) {
        axiosInstance.delete("/api/v1/reservations/" + this.reservation.id)
            .then(() => {
              emitter.emit("refreshDay");
            })
            .catch((error) => {
              console.error(error);
            });
      }
    }
  }
}
</script>

<style scoped>
.reservation {
  top: calc((var(--start) * 3rem) + ((var(--start) - var(--round-hour-start)) * 0.25rem) + ((var(--round-hour-start) + 1) * 1rem));
  height: calc((var(--height) * 3rem) + ((var(--height) - var(--round-hour)) * 0.25rem) + ((var(--round-hour)) * 1rem));
}
</style>