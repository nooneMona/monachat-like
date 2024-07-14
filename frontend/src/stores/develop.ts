import { defineStore } from "pinia";
import { ref } from "vue";
import { socketIOInstance } from "../socketIOInstance";
import { useUserStore } from "./user";

export interface IDev {}

export const useDevStore = defineStore("dev", () => {
  const isVisibleFrame = ref(false);
  const updateIsVisibleFrame = (value: boolean) => (isVisibleFrame.value = value);

  const suicide = () => {
    const userStore = useUserStore();
    socketIOInstance.emit("SUICIDE", {
      token: userStore.myToken,
    });
  };

  const simulateReconnection = () => {
    socketIOInstance.disconnect();
    setTimeout(() => {
      socketIOInstance.connect();
    }, 3000);
  };

  return { isVisibleFrame, updateIsVisibleFrame, suicide, simulateReconnection };
});
