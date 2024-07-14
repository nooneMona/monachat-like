import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const ihashsSilentIgnoredByMe = ref<{ [key in string]: boolean }>({});

  const updateUserSilentIgnore = (ihash: string, isActive: boolean) => {
    ihashsSilentIgnoredByMe.value[ihash] = isActive;
  };

  return { ihashsSilentIgnoredByMe, updateUserSilentIgnore };
});
