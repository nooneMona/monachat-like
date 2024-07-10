import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface INotice {
  requiredRefresh: boolean;
}

export const useNoticeStore = defineStore("notice", () => {
  const requiredRefresh = ref(false);

  const isRequiredRefresh = computed(() => requiredRefresh.value);

  const requestRefresh = () => (requiredRefresh.value = true);
  const stopRefreshRequest = () => (requiredRefresh.value = false);

  return { requiredRefresh, isRequiredRefresh, requestRefresh, stopRefreshRequest };
});
