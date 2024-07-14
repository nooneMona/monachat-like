import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useSettingStore } from "@/stores/setting";

export const useLogStore = defineStore("log", () => {
  const logs = ref<
    {
      head: string;
      content: string;
      foot: string;
      visibleOnReceived: boolean;
      color: string;
      ihash: string;
    }[]
  >([]);

  const appendLog = (log: {
    head: string;
    content: string;
    foot: string;
    visibleOnReceived: boolean;
    color: string;
    ihash: string;
  }) => {
    const settingStore = useSettingStore();
    const MAX_LOG_LENGTH = 1_000;
    if (settingStore.isInfiniteLog) {
      logs.value = [log, ...logs.value];
      return;
    }
    logs.value = [log, ...logs.value.slice(0, MAX_LOG_LENGTH - 1)];
  };
  const resetLog = () => {
    logs.value.splice(0);
  };

  // ログに表示するための順序が考慮されたリスト
  const logMessages = computed(() => {
    const settingStore = useSettingStore();
    if (settingStore.isDescendingLog) {
      return logs.value.slice().reverse();
    }
    return logs.value;
  });

  return { logs, appendLog, resetLog, logMessages };
});
