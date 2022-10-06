<template>
  <div class="flex flex-col justify-center items-center absolute left-16 lg:left-24 w-56 lg:w-96" :style="this.style">
    <div class="font-bold text-2xl">{{ reservation.title }}</div>
    <div class="text-sm">Réservé par {{ reservation.ownerId }}</div>
    <div class="text-sm">De {{ this.padDate(reservation.startDate) }} à {{ this.padDate(reservation.endDate) }}</div>
  </div>
</template>

<script>
import {emitter} from "../../emitter";

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
      // If not set, find the anchor
      if (!this.eventAnchor) {
        this.$store.commit("setEventAnchor", document.querySelector(".event-anchor")?.getBoundingClientRect());
      }

      if (this.innerPadding === -1) {
        this.$store.dispatch("setInnerPadding", document.querySelector(`[anchor-value="08:00"]`)?.getBoundingClientRect().height / 2);
      }

      // Get start and end hour formatted as HH:mm (ex: 08:00) with padding
      const startHour = this.reservation.startDate.format("HH:mm");
      const endHour = this.reservation.endDate.format("HH:mm");

      // Get the top and bottom position of the event
      const startHourAnchor = document.querySelector(`[anchor-value="${startHour}"]`)?.getBoundingClientRect();
      const endHourAnchor = document.querySelector(`[anchor-value="${endHour}"]`)?.getBoundingClientRect();

      const startHourMiddle = startHourAnchor?.top ? startHourAnchor.top + (startHourAnchor.height / 2) : 0;
      const endHourMiddle = endHourAnchor?.top ? endHourAnchor.top + (endHourAnchor.height / 2) : 0;

      // Get the height of the event
      const height = endHourMiddle - startHourMiddle;

      // Calculate relative position to this.eventAnchor
      const relativeTop = startHourAnchor.top - this.eventAnchor.top + this.innerPadding;

      // Return the style
      return {
        top: relativeTop + "px",
        height: height + "px",
        backgroundColor: "rgb(113 113 122)",
        borderBottom: "2px dashed rgb(255 255 255 / 40%)",
        borderTop: "2px dashed rgb(255 255 255 / 40%)"
      }
    }
  },
  methods: {
    padDate(date) {
      return date.format("HH:mm");
    }
  }
}
</script>

<style scoped>

</style>