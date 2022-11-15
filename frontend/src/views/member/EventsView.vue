<template>
  <div class="h-[92vh] w-full flex justify-center">
    <div class="w-full lg:w-1/3 bg-blue-900 flex flex-col items-center py-10">
      <div class="uppercase font-bold text-4xl mb-5">Événements</div>

      <div class="flex flex-col" v-show="events.length > 0">
        <a v-for="event in events" :key="event.name" :href="event.link" class="w-96 bg-red-900 px-5 py-5 uppercase rounded-lg mt-5" target="_blank">
          {{event.name}}
        </a>
      </div>

      <!-- No events message -->
      <div class="flex flex-col" v-show="events.length === 0">
        <div class="flex items-center">
          <span class="text-xl">Aucun événement ...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import links from "@/links.json";

export default {
  name: "EventsView",
  data() {
    return {
      events: links.events
    }
  }
}
</script>

<style scoped>

</style>