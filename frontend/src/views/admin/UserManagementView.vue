<template>
  <div class="h-[92vh] w-full flex justify-center items-center">
    <div class="w-full h-full overflow-auto py-10 lg:py-0 lg:w-2/3 flex flex-col lg:mb-0 lg:flex-row bg-[#1F1F1F] lg:px-5 lg:h-[80%] lg:rounded-xl">

      <!-- Left side -->
      <div class="flex flex-col justify-center h-fit  lg:h-full lg:w-1/2 items-center px-5 lg:px-0 mb-10 lg:mb-0">
        <div class="lg:w-96 w-full h-96 bg-[#2F2F2F] rounded-lg overflow-hidden">
          <input type="text" class="w-full h-12 text-black px-5 outline-none" v-model="searchQuery" @input="handleSearch"/>

          <div class="flex flex-col overflow-y-auto shrink-0 h-[90%]">
            <div v-for="(user, index) in users"
                 class="px-2 py-1 hover:bg-[#404040] duration-300 hover:cursor-pointer h-12 shrink-0 flex items-center"
                 :class="{ 'bg-[#404040]': user.id === selectedUser.data.id }"
                 @click="handleUserClick(user, index)">
              {{ user.id }}
            </div>
          </div>
        </div>

        <div class="bg-[#8DD18A] hover:bg-[#b1d1af] text-black duration-300 lg:w-96 w-full h-12 flex items-center justify-center rounded-lg hover:cursor-pointer mt-2" @click="resetSelection">
          <span>Ajouter un utilisateur</span>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center justify-center flex-1 lg:w-1/2 px-5 lg:px-0">
        <div class="flex flex-col w-full">
          <input type="text" class="lg:w-96 w-full h-12 rounded-lg text-black px-5" placeholder="CAS UID" v-model="selectedUser.data.id" :disabled="isUserSelected"/>

          <div class="flex flex-row mt-2">
            <input type="checkbox" v-model="selectedUser.data.member">
            <span class="ml-5">Member</span>
          </div>

          <div class="flex flex-row">
            <input type="checkbox" v-model="selectedUser.data.admin">
            <span class="ml-5">Admin</span>
          </div>

          <div 
            class="lg:w-96 w-full h-12 flex items-center text-black duration-300 justify-center rounded-lg hover:cursor-pointer mt-2" 
            :class="{ 
              'bg-[#8DD18A] hover:bg-[#b1d1af]': !isUserSelected,
              'bg-[#6399ff] hover:bg-[#b5ceff]': isUserSelected
              }"
            @click="handleValidationClick">
            <span v-if="!isUserSelected">Ajouter</span>
            <span v-else>Modifier</span>
          </div>

          <div class="bg-[#ee5253] hover:bg-[#ff6b6b] text-black w-full lg:w-96 h-12 flex items-center justify-center rounded-lg hover:cursor-pointer mt-2" @click="handleDeletionClick" v-show="isUserSelected">
            <span>Supprimer</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/axiosInstance";

export default {
  name: "UserManagementView",
  data() {
    return {
      users: [],
      selectedUser: {
        index: -1,
        data: {
          id: "",
          member: false,
          admin: false,
        }
      },
      usersBackup: [],
      searchQuery: "",
    }
  },
  created() {
    this.refreshUsers();
  },
  computed: {
    isInputValid() {
      return this.selectedUser.data.id !== "";
    },
    isUserSelected() {
      return this.selectedUser.index !== -1;
    }
  },
  methods: {
    handleValidationClick() {
      if (!this.isInputValid) {
        return;
      }

      if (this.isUserSelected) {
        axiosInstance.post("/api/v1/users", this.selectedUser.data).then(response => {
          this.refreshUsers();
          this.resetSelection();
        });
      } else {
        const payload = {
          member: this.selectedUser.data.member,
          admin: this.selectedUser.data.admin,
        };

        axiosInstance.put(`/api/v1/users/${this.selectedUser.data.id}`, payload).then(response => {
          this.refreshUsers();
          this.resetSelection();
        });
      }
    },
    handleUserClick(user, index) {
      this.selectedUser = {
        index,
        data: user
      };
    },
    handleDeletionClick() {
      if (!this.isUserSelected) {
        return;
      }

      axiosInstance.delete(`/api/v1/users/${this.selectedUser.data.id}`).then(response => {
        this.refreshUsers();
        this.resetSelection();
      });
    },
    resetSelection() {
      this.selectedUser = {
        index: -1,
        data: {
          id: "",
          member: false,
          admin: false,
        }
      };
    },
    refreshUsers() {
      axiosInstance.get("/api/v1/users").then(response => {
        this.users = response.data.data.filter(user => user.id !== "ADMIN");
        this.usersBackup = response.data.data.filter(user => user.id !== "ADMIN");
      });
    },
    handleSearch() {
      if (this.searchQuery === "") {
        this.users = this.usersBackup;
        return;
      }

      this.users = this.usersBackup.filter(user => user.id.includes(this.searchQuery));
    }
  }
}
</script>

<style scoped>

</style>