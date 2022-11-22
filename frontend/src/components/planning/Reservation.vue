<template>
  <div
      class="flex flex-col justify-center items-center absolute left-16 lg:left-24 w-[70vw] lg:w-96 flex-wrap reservation bg-slate-500"
      :style="this.style"
      :class="reservationClass"
      @click="deleteReservation"
  >
    <div class="font-bold text-2xl">{{ reservation.title }}</div>
    <div class="flex flex-col justify-center items-center">
      <div class="text-xs">Réservé par {{ reservation.ownerId }}</div>
      <div class="text-xs">De {{ this.padDate(reservation.startDate) }} à {{ this.padDate(reservation.endDate) }}</div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axiosInstance";
import {emitter} from "@/emitter";

export default {
  name: "Reservation",
  props: {
    reservation: {
      type: Object,
      required: true
    }
  },
  computed: {
    eventAnchor() {
      return this.$store.state.eventAnchor;
    },
    innerPadding() {
      return this.$store.state.innerPadding;
    },
    style() {
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
        'hover:bg-red-200 duration-200 hover:cursor-pointer': this.deletable,
      }
    },
    deletable() {
      return this.reservation.ownerId === this.$store.state.user.id
          || this.$store.state.user.admin;
    }
  },
  methods: {
    padDate(date) {
      return date.format("HH:mm");
    },
    deleteReservation() {
      if (this.deletable) {
        axiosInstance.delete("/api/v1/reservations/" + this.reservation.id)
          .then(() => {
            emitter.emit("refreshDay");
          })
          .catch((error) => {
            console.log(error);
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
  border-top: 2px dashed rgb(255 255 255 / 40%);
  border-bottom: 2px dashed rgb(255 255 255 / 40%);
}
</style>