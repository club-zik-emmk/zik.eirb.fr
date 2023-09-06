<template>
  <div class="w-full flex flex-col week-list h-full bg-[#101010]">
    <!-- Week list header if mobile -->
    <div class="w-full p-5 week-list-header bg-[#1F1F1F]" v-show="this.isMobile">
      <div @click="closeWeekList">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-10 h-10 p-2 hover:bg-[#404040] bg-[#2F2F2F] rounded-lg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
    </div>


    <!-- Week list body -->
    <div class="w-full overflow-y-auto">
      <div v-for="week in weeks" :key="week.weekNumber"
           class="w-92 pl-5 lg:pl-5 flex flex-row justify-evenly items-center h-24 week-item hover:bg-[#2F2F2F] hover:cursor-pointer duration-150"
           @click="handleWeekClick(week)">
        <span class="font-bold mr-3">{{ week.weekNumber }}.</span>

        <div class="flex-1 flex items-baseline justify-center">
          <span class="font-extrabold text-3xl mr-2">{{ week.firstDay.date() }}</span>
          {{ this.monthIndexToMonthName[week.firstDay.month()] }}
        </div>

        <!-- SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="w-6 h-6 ml-3 mr-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
        </svg>

        <div class="flex-1 flex items-baseline justify-center">
          <span class="font-extrabold text-3xl mr-2">{{ week.lastDay.date() }}</span>
          {{ this.monthIndexToMonthName[week.lastDay.month()] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {monthIndexToMonthName} from "../../utils";
import {emitter} from "../../emitter";
import moment from "moment";

export default {
  name: "WeekList",
  data() {
    return {
      weeks: {},
      monthIndexToMonthName: monthIndexToMonthName
    }
  },
  created() {
    // Moment.js
    const week = function (d) {
      return {
        weekNumber: d.isoWeek(),
        firstDay: moment(d).startOf('isoWeek').hour(12),
        lastDay: moment(d).endOf('isoWeek').hour(12)
      };
    }

    // get all week between two dates
    const weeks = function (start, end) {
      const weeks = [];
      const current = moment(start);
      while (current.isBefore(end) || current.isoWeeks() === end.isoWeeks()) {
        weeks.push(week(current));
        current.add(1, 'weeks');
      }

      return weeks;
    }

    // Get all weeks from 1st of september 2022 to 1st of august 2023
    this.weeks = weeks(moment(new Date(2023, 8, 1)), moment(new Date(2024, 7, 1)));
  },
  methods: {
    handleWeekClick(week) {
      emitter.emit("weekClick", week);
      document.getElementById("day").scrollTo(0, 0); // Scroll to top of day to avoid disponibility position bug

      if (this.isMobile) {
        this.closeWeekList();
      }
    },
    closeWeekList() {
      this.$store.dispatch("closeWeekList");
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    }
  }
}
</script>

<style scoped>

</style>
