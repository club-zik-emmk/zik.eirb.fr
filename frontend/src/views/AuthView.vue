<template>
  <main class="w-full flex-1 flex justify-center items-center px-2 lg:px-0">

    <div class="w-[50rem] flex flex-col">

      <div class="bg-gray-200 py-7 px-5 lg:px-10 rounded-xl mb-5">
        <div class="uppercase text-3xl font-bold mb-5">Confidentialité</div>

        <p class="mb-5">
          En vous connectant, vous acceptez que vos données personnelles soient traitées par Eirbware et le Bureau des Arts de l'<span class="uppercase">Enseirb-Matmeca</span> .
        </p>

        <p>
          Nous recueillons:
        </p>

        <ul class="pl-10 mb-5">
          <li class="list-disc">Votre nom</li>
          <li class="list-disc">Votre prénom</li>
          <li class="list-disc">Votre adresse mail de l'école</li>
          <li class="list-disc">Votre identifiant de connexion au <span class="uppercase">Cas</span> de l'<span class="uppercase">Enseirb-Matmeca</span></li>
        </ul>

        <p class="mb-5">Ces données sont utilisées dans le seul but de pouvoir fournir le service que vous utilisez, et seuls les membres d'Eirbware et du Bureau des Arts de l'<span class="uppercase">Enseirb-Matmeca</span> peuvent accéder à ces données.</p>
        <p class="mb-5">À tout moment, vous pouvez demander la suppression ou bien la modification de vos informations en nous envoyant un mail à <a href="mailto:eirbware@enseirb-matmeca.fr" class="underline text-blue-400">eirbware@enseirb-matmeca.fr</a>.</p>
        <p>Les données récoltées sont automatiquement supprimées à la fin de votre scolarité, à l'exception des membres du Bureau des Arts dont les données sont utilisées dans un but de conservation de l'histoire du BDA.</p>

      </div>

      <a :href="authUrl"
         class="btn mb-4 lg:mb-0">
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
      return `https://cas.bordeaux-inp.fr/login?service=https://aboin.vvv.enseirb-matmeca.fr/casAuth/?token=${window.btoa(`${import.meta.env.VITE_FRONTEND_ADDRESS}/#/auth`)}@bordeaux-inp.fr`;
    },
  },
  mounted() {
    // Check if the user is already authenticated by looking for ticket and token in the url
    const token = this.$route.query.token;
    const ticket = this.$route.query.ticket;
    // Authenticate the user by using the backend API
    if (token && ticket) {
      authenticateUser(`${ticket}`, `${token}`)
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