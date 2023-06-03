<template>
  <main class="w-full flex-1 flex justify-center items-center px-2 lg:px-0">

    <div class="w-[50rem] flex flex-col">

      <div class="bg-[#1F1F1F] py-7 px-5 lg:px-10 rounded-xl mb-2">
        <div class="uppercase text-3xl font-bold mb-5">Confidentialité</div>

        <p class="mb-5">
          En vous connectant, vous acceptez que vos données personnelles soient traitées par Eirbware
          et le Zik de l'<span class="uppercase">Enseirb-Matmeca</span> .
        </p>

        <p class="mb-2">
          Nous recueillons:
        </p>

        <ul class="pl-10 mb-5">
          <li class="list-disc">Votre identifiant de connexion au <span class="uppercase">Cas</span> de l'<span class="uppercase">Enseirb-Matmeca</span></li>
          <li class="list-disc">Les données que vous entrez volontairement dans l'application</li>
        </ul>

        <p class="mb-5">Ces données sont utilisées dans le seul but de pouvoir fournir le service que vous utilisez, et seuls les membres d'Eirbware et du Zik de l'<span class="uppercase">Enseirb-Matmeca</span> peuvent accéder à ces données.</p>
        <p class="mb-5">À tout moment, vous pouvez demander la suppression ou bien la modification de vos informations en nous envoyant un mail à <a href="mailto:eirbware@enseirb-matmeca.fr" class="underline text-blue-400">eirbware@enseirb-matmeca.fr</a>.</p>
      </div>

      <a :href="authUrl"
         class="btn mb-4 lg:mb-0 w-fit px-5 py-3 rounded-lg bg-[#8DD18A] hover:bg-[#b1d1af] duration-300 hover:cursor-pointer text-black font-semibold">
        Se connecter avec le CAS
      </a>
    </div>
  </main>
</template>

<script>
import {authenticateUser} from "../services/authenticationService";

export default {
  name: "AuthView",
  computed: {
    authUrl() {
      return `https://cas.bordeaux-inp.fr/login?service=${encodeURIComponent("https://zik.eirb.fr/#/auth")}`;
    },
  },
  mounted() {
    // Check if the user is already authenticated by looking for ticket and token in the url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ticket = urlParams.get("ticket");
    
    // Remove the ticket from the url
    const newUrl = window.location.href.replace(`?ticket=${ticket}`, "");
    window.history.pushState({}, null, newUrl);

    // Authenticate the user by using the backend API
    if (ticket) {
      authenticateUser(`${ticket}`)
          .then(student => {
            // Send the student to the header
            this.$store.commit("setUser", student);
            // Redirect to the root page
            this.$router.push("/");
          })
          .catch(console.error);
    }
  }
}
</script>

<style scoped>

</style>