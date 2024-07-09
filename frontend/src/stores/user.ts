import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface IUser {
  myID: string | null;
  myToken: string | null;
}

export const useUserStore = defineStore("user", () => {
  const myID = ref<string | null>(null);
  const myToken = ref<string | null>(null);

  const updateAuthInfo = (id: string, token: string) => {
    myID.value = id;
    myToken.value = token;
  };

  const displayingMyID = computed(() => (end: number) => {
    if (myID.value == null) {
      return "";
    }
    return myID.value.slice(0, end);
  });

  return { myID, myToken, updateAuthInfo, displayingMyID };
});
