<template>
  <div class="w-full flex flex-col week-list h-full">
    <!-- Week list header -->
    <div class="w-full bg-red-900">
      Truc
    </div>

    <!-- Week list body -->
    <div class="w-full overflow-y-auto">
      <div v-for="week in weeks" :key="week.weekNumber" class="w-full flex flex-row justify-center items-center h-24 week-item hover:bg-gray-50 hover:cursor-pointer duration-150">
        <div class="w-52 flex flex-row justify-content items-content">
          <span class="font-bold">{{week.weekNumber}}.</span>

          <div><span class="font-extrabold text-3xl">{{week.firstDay.getDate()}}</span> {{this.monthIndexToMonthName[week.firstDay.getUTCMonth()]}}</div>
          <!-- SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>

          <div>{{week.lastDay.getDate()}} {{this.monthIndexToMonthName[week.lastDay.getUTCMonth()]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getWeekNumber} from "../../utils";
import {monthIndexToMonthName} from "../../utils";

export default {
  name: "WeekList",
  data() {
    return {
      weeks: {},
      monthIndexToMonthName: monthIndexToMonthName
    }
  },
  created() {
    // Create a map of weeks with the starting day, the ending day, the week number and the Date object of the first day of the week
    // The map will be used to display the weeks in the planning

    // For each week in the year
    const weeks = {};
    for (let i = 0; i < 52; i++) {
      // Get the first day of the week
      const firstDay = new Date(new Date().getFullYear(), 0, 1 + (i * 7));
      // Get the last day of the week
      const lastDay = new Date(new Date().getFullYear(), 0, 1 + ((i + 1) * 7) - 1);
      // Get the week number

      const weekNumber = getWeekNumber(firstDay);

      // Add the week to the map
      weeks[weekNumber] = {
        firstDay: firstDay,
        lastDay: lastDay,
        weekNumber: weekNumber,
        date: firstDay
      }
    }

    this.weeks = weeks;
  }
}
</script>

<style scoped>
.week-item {
  border-top: solid 1px rgb(241 245 249);
}

.week-item:last-of-type {
  border-bottom: solid 1px rgb(241 245 249);
}

.week-list {
  border-right: solid 1px rgb(241 245 249);
}
</style>