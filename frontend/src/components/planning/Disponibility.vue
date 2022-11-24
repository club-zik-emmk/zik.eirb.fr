<template>
  <div class="absolute left-0 w-[6vw] lg:w-12 disponibility" :style="style"></div>
</template>

<script>
export default {
  name: "Disponibility",
  props: {
    disponibility: {
      type: Object,
      required: true
    }
  },
  computed: {
    style() {
      // Number of quarter hours between 08:00 and the start of the disponibility
      const start = this.disponibility.openningTime.diff(this.disponibility.openningTime.clone().startOf("day").hour(8), "minutes") / 15;
      // Number of quarter hours between the start and the end of the disponibility
      const height = this.disponibility.closingTime.diff(this.disponibility.openningTime, "minutes") / 15;
      // How many times the disponibility goes over a round hour
      const roundHour = Math.floor(height / 4);
      // How many times the difference between the parent height and the disponibility start goes over a round hour
      const roundHourStart = Math.floor(start / 4);

      return {
        '--start': start,
        '--round-hour-start': roundHourStart,
        '--height': height,
        '--round-hour': roundHour,
        '--allow-noise': this.disponibility.allowNoise ? 1 : 0,
        '--background-color': this.disponibility.allowNoise ? "#97c4a7" : "#e8d8ab",
        '--priority': this.disponibility.priority,
      };
    }
  }
}
</script>

<style scoped>
.disponibility {
  top: calc((var(--start) * 3rem) + ((var(--start) - var(--round-hour-start)) * 0.25rem) + ((var(--round-hour-start) + 1) * 1rem));
  height: calc((var(--height) * 3rem) + ((var(--height) - var(--round-hour)) * 0.25rem) + ((var(--round-hour)) * 1rem));
  background-color: var(--background-color);
  border-bottom: 2px dashed rgb(0 0 0 / 10%);
  border-top: 2px dashed rgb(0 0 0 / 10%);
  z-index: var(--priority);
}
</style>