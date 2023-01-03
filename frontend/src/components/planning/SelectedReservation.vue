<template>
  <div id="selected-reservation"
    class="fixed w-full h-[92vh] lg:sticky lg:h-fit p-5 lg:p-3 lg:w-96 top-[8vh] lg:ml-[33rem] bg-[#1F1F1F] z-[100] flex flex-col rounded-lg">

    <!-- Mobile header -->
    <div class="w-full flex mb-2" @click="closeSelectedReservation">
      <div class="p-2 bg-[#2F2F2F] w-fit rounded-lg mr-3 hover:cursor-pointer hover:bg-[#404040] duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div v-if="isDeletable" @click="deleteReservation"
        class="p-2 bg-[#2F2F2F] w-fit rounded-lg hover:cursor-pointer hover:bg-[#ee5253] hover:text-black duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
    </div>

    <div class="flex flex-col mt-2">

      <span class="text-3xl font-semibold mb-2">
        {{ reservation.title }}
        <span class="text-sm font-normal">#{{ reservation.id }}</span>
      </span>


      <span class="mb-2">
        De {{ reservation.startDate.format("HH:mm") }} à {{ reservation.endDate.format("HH:mm") }}
      </span>
      <span>Réservé par <span class="font-semibold">{{ reservation.ownerId }}</span></span>

      <ul v-show="reservation.users.length > 0" class="list-disc pl-5 mt-2">
        <li v-for="user in reservation.users" :key="user" class="font-semibold">
          {{ user }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { emitter } from "@/emitter";
import axiosInstance from "@/axiosInstance";


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
    deleteReservation() {
      // Cache reservation
      this.$store.dispatch("pushReservationStack", this.reservation);
      emitter.emit("onReservationDeletionClick", this.reservation.id);

      axiosInstance.delete('api/v1/reservations/' + this.reservation.id)
        .then(() => {
          emitter.emit("closeSelectedReservation");
          
          // Remove reservation from store
          this.$store.dispatch("removeReservationById", this.reservation.id);
        })
        .catch((error) => {
          emitter.emit("onReservationDeletionError", this.reservation);
        });
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
    isDeletable() {
      return this.reservation.ownerId === this.$store.state.user.id || this.$store.state.user.admin;
    },
  }
}
</script>

<style scoped>

</style>