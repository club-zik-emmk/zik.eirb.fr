<template>
  <main class="h-[92vh] overflow-hidden w-full">
    <!-- Photo showcase -->
    <div class="wrapper relative w-full h-full">
      <div class="h-full w-full absolute top-o left-0 bg-black opacity-20"></div>
      <div class="w-full h-full absolute top-0 left-0 z-10 flex items-center justify-center">

        <div class="flex flex-col justify-center items-center">
          <!-- Logo Zik -->
          <div>

          </div>

          <!-- Description -->
          <div class="uppercase text-4xl font-bold">
            Ouais le zik
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomeView"
}
</script>

<style>
.wrapper {
  background-image: url("@/assets/images/cover_00.png");
  background-size: cover;
  background-repeat: no-repeat;
}

</style>