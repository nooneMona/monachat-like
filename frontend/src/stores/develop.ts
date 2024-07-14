import { defineStore } from "pinia";
import { ref } from "vue";

export interface IDev {}

export const useDevStore = defineStore("dev", () => {
  const isVisibleFrame = ref(false);
  const updateIsVisibleFrame = (value: boolean) => (isVisibleFrame.value = value);

  return { isVisibleFrame, updateIsVisibleFrame };
});
