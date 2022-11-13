<template>
  <div class="flex flex-col z-20 dropdown-nav">
    <div class="bg-red-900 px-5 py-2 rounded-md uppercase hover:cursor-pointer w-44 text-center" @click="onButtonClick">
      Admin
    </div>

    <div class="relative">
      <div v-show="isOpen" class="absolute top-0 flex flex-col">
        <router-link v-for="link in links" :key="link.title" :to="link.path"
                     class="bg-red-900 rounded-md uppercase px-5 py-2 hover:cursor-pointer mt-1 text-center">
          {{ link.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownNav",
  props: {
    title: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      required: true
    }
  },
  created() {
    // When clicking outside, close the dropdown
    document.addEventListener("click", this.handleClickEvent);
  },
  unmounted() {
    // Be careful to remove the listener when the component is destroyed
    document.removeEventListener("click", this.handleClickEvent);
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    onButtonClick() {
      this.isOpen = !this.isOpen;
    },
    handleClickEvent() {
      if (!event.target.closest(".dropdown-nav")) {
        this.isOpen = false;
      }
    }
  }
}
</script>

<style scoped>

</style>