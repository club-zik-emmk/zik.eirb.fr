<template>
  <div class="h-[92vh] w-full flex justify-center">
    <div class="w-full lg:w-2/3 bg-blue-900 flex flex-row">

      <!-- Left side -->
      <div class="flex flex-col justify-center h-full">
        <div class="w-96 h-96 bg-red-900 rounded-lg overflow-hidden">
          <input type="text" class="w-full h-[10%]"/>

          <div class="flex flex-col overflow-y-auto shrink-0 h-[90%]">
            <div v-for="(user, index) in users"
                 class="px-2 py-1 border-b-[1px] border-solid border-black last:border-b-0 hover:cursor-pointer"
                 @click="handleUserClick(user, index)">
              {{ user.id }}
            </div>
          </div>
        </div>

        <div class="bg-red-900 w-96 h-12 flex items-center justify-center rounded-lg hover:cursor-pointer mt-2" @click="resetSelection">
          <span>Ajouter un utilisateur</span>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center justify-center flex-1 bg-green-900">
        <div class="flex flex-col">
          <input type="text" class="w-96 h-12 rounded-lg text-black px-5" placeholder="CAS UID" v-model="selectedUser.data.id"/>

          <div class="flex flex-row mt-2">
            <input type="checkbox" v-model="selectedUser.data.member">
            <span class="ml-5">Member</span>
          </div>

          <div class="flex flex-row">
            <input type="checkbox" v-model="selectedUser.data.admin">
            <span class="ml-5">Admin</span>
          </div>

          <div class="bg-red-900 w-96 h-12 flex items-center justify-center rounded-lg hover:cursor-pointer mt-2" @click="handleValidationClick">
            <span v-if="!isUserSelected">Ajouter</span>
            <span v-else>Modifier</span>
          </div>

          <div class="bg-red-900 w-96 h-12 flex items-center justify-center rounded-lg hover:cursor-pointer mt-2" @click="handleDeletionClick" v-show="isUserSelected">
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
      }
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
        this.users = response.data.data;
      });
    }
  }
}
</script>

<style scoped>

</style>