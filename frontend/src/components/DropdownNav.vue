<template>
  <div
      class="flex flex-col z-20 ml-5"
      :class="dynamicClassName">

    <div
        class="px-5 py-2 rounded-md hover:cursor-pointer w-52 text-center duration-300"
        :class="buttonClass"
        @click="onButtonClick">
      {{title}}
    </div>

    <div class="relative">
      <div v-show="isOpen" class="absolute top-0 flex flex-col">
        <router-link
            v-for="link in links"
            :key="link.title"
            :to="link.path"
            class="bg-[#606060] hover:bg-[#707070] rounded-md px-5 py-2 hover:cursor-pointer mt-2 text-center w-52 duration-300">
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
  computed: {
    dynamicClassName() {
      return `dropdown-nav-${this.title}`;
    },
    buttonClass() {
      return {
        "bg-[#606060]": this.isOpen,
        "hover:bg-[#404040]": !this.isOpen
      };
    }
  },
  methods: {
    onButtonClick() {
      this.isOpen = !this.isOpen;
    },
    handleClickEvent() {
      if (!event.target.closest(`.${this.dynamicClassName}`)) {
        this.isOpen = false;
      }
    }
  }
}
</script>

<style scoped>

</style>