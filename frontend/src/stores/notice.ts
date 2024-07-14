import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingStore } from "./setting";

export interface INotice {
  requiredRefresh: boolean;
}

export const useNoticeStore = defineStore("notice", () => {
  const requiredRefresh = ref(false);

  const isRequiredRefresh = computed(() => requiredRefresh.value);

  const requestRefresh = () => (requiredRefresh.value = true);
  const stopRefreshRequest = () => (requiredRefresh.value = false);

  const playCOMAudio = () => {
    const settingStore = useSettingStore();
    if (settingStore.selectedVolume === "off") return;
    const music = new Audio("sound/mojachat5l1.mp3");
    music.play();
  };

  const playENTERAudio = () => {
    const settingStore = useSettingStore();
    if (settingStore.selectedVolume === "off") return;
    const music = new Audio("sound/mojachat5l0.mp3");
    music.play();
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return {
    requiredRefresh,
    isRequiredRefresh,
    requestRefresh,
    stopRefreshRequest,
    playCOMAudio,
    playENTERAudio,
    reloadPage,
  };
});
