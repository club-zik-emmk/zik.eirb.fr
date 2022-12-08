<template>
  <div
      id="selected-reservation"
      class="fixed w-full h-[92vh] lg:sticky lg:h-fit lg:p-5 lg:w-96 top-[8vh] lg:ml-[33rem] bg-red-900 z-[100] flex flex-col items-center"
  >

    <!-- Mobile header -->
    <div
        class="w-full p-2"
        @click="closeSelectedReservation"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           class="w-10 h-10 p-2 border-2 rounded-lg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </div>

    <span class="text-xl">Réservation #{{ reservation.id }}</span>
    <span class="text-3xl">{{ reservation.title }}</span>
    <span>De {{ reservation.startDate.format("HH:mm") }} à {{
        reservation.endDate.format("HH:mm")
      }}</span>
    <span>Réservé par {{ reservation.ownerId }}</span>

    {{reservation}}

    <span
        v-for="user in reservation.users"
        :key="user"
    >
          {{ user }}
        </span>
  </div>
</template>

<script>
import {emitter} from "@/emitter";

export default {
  name: "SelectedReservation",
  props: {
    reservation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeSelectedReservation() {
      emitter.emit("closeSelectedReservation");
    },
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  }
}
</script>

<style scoped>

</style>