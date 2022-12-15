<template>
  <div class="h-[92vh] w-full flex justify-center">
    <div class="w-full lg:w-1/3 flex flex-col items-center py-10">
      <div class="uppercase font-bold text-4xl mb-10">Mes informations</div>

      <div class="flex flex-col">

        <div class="flex flex-col mb-7">
          <div class="flex flex-row items-center mb-2">
            <span class="text-xl">Identifiant</span>
            <div class="h-[1px] text-white flex-1 bg-white ml-2"></div>
          </div>

          <input type="text" v-model="member.id" required class="h-10 w-80 rounded-md text-black px-3 w-full mt-1 font-semibold"
                 disabled>
        </div>

        <div class="flex flex-col mb-7">
          <div class="flex flex-row items-center mb-2">
            <span class="text-xl">Membre ?</span>
            <div class="h-[1px] text-white flex-1 bg-white ml-2"></div>
          </div>

          <div class="h-10 w-80 rounded-md text-black px-3 w-full mt-1 flex items-center justify-center font-semibold"
               :class="member.member ? 'bg-[#8CCD8A]' : 'bg-[#EF9270]'">
            {{ member.member ? 'Oui' : 'Non' }}
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-row items-center mb-2">
            <span class="text-xl">Admin ?</span>
            <div class="h-[1px] text-white flex-1 bg-white ml-2"></div>
          </div>

          <div class="h-10 w-80 rounded-md text-black px-3 w-full mt-1 flex items-center justify-center font-semibold"
               :class="member.admin ? 'bg-[#8CCD8A]' : 'bg-[#EF9270]'">
            {{ member.admin ? 'Oui' : 'Non' }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "MemberView",
  computed: {
    member() {
      return this.$store.state.user;
    }
  }
}
</script>

<style scoped>

</style>