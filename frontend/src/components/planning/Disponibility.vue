<template>
  <div class="absolute left-0 w-12" :style="style"></div>
</template>

<script>
import {emitter} from "../../emitter";

export default {
  name: "Disponibility",
  props: {
    disponibility: {
      type: Object,
      required: true
    },
    eventAnchorProp: {
      type: Object,
      required: true
    },
    innerPaddingProp: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      eventAnchor: this.eventAnchorProp,
      innerPadding: this.innerPaddingProp
    }
  },
  created() {
    emitter.on("updatedEventAnchor", (eventAnchor) => {
      this.eventAnchor = eventAnchor;
    });

    emitter.on("updatedInnerPadding", (innerPadding) => {
      this.innerPadding = innerPadding;
    });
  },
  computed: {
    style() {
      // If not set, find the anchor
      if (!this.eventAnchor) {
        this.eventAnchor = document.querySelector(".event-anchor")?.getBoundingClientRect();
        emitter.emit("updatedEventAnchor", this.eventAnchor);
      }

      if (this.innerPadding === -1) {
        this.innerPadding = document.querySelector(`[anchor-value="08:00"]`)?.getBoundingClientRect().height / 2;
        emitter.emit("updatedInnerPadding", this.innerPadding);
      }

      // Get opening and closing hour formatted as HH:mm (ex: 08:00) with padding
      const openingHour = this.disponibility.openningTime.format("HH:mm");
      const closingHour = this.disponibility.closingTime.format("HH:mm");

      // Get the top and bottom position of the event
      const openingHourAnchor = document.querySelector(`[anchor-value="${openingHour}"]`)?.getBoundingClientRect();
      const closingHourAnchor = document.querySelector(`[anchor-value="${closingHour}"]`)?.getBoundingClientRect();

      const openingHourMiddle = openingHourAnchor?.top ? openingHourAnchor.top + (openingHourAnchor.height / 2) : 0;
      const closingHourMiddle = closingHourAnchor?.top ? closingHourAnchor.top + (closingHourAnchor.height / 2) : 0;

      // Get the height of the event
      const height = closingHourMiddle - openingHourMiddle;

      // Calculate relative position to this.eventAnchor
      const relativeTop = openingHourAnchor.top - this.eventAnchor.top + this.innerPadding;

      // Return the style
      return {
        top: relativeTop + "px",
        height: height + "px",
        backgroundColor: this.disponibility.allowNoise ? "rgb(220 252 231)" : "rgb(254 249 195)",
        borderBottom: "2px dashed rgb(0 0 0 / 10%)",
        borderTop: "2px dashed rgb(0 0 0 / 10%)"
      }
    }
  }
}
</script>

<style scoped>

</style>