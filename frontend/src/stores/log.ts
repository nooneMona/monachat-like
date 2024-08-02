import { computed, ref } from "vue";
import { defineStore } from "pinia";
import moment from "moment";
import { useSettingStore } from "@/stores/setting";
import { useUsersStore } from "./users";
import Color from "./color";
import { ChatMessage } from "../domain/type";

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
    const logLineNumber = settingStore.logLineNumberInteger;
    if (logLineNumber === 0) {
      logs.value = [log, ...logs.value];
      return;
    }
    logs.value = [log, ...logs.value.slice(0, logLineNumber - 1)];
  };

  const resetLog = () => {
    const settingStore = useSettingStore();
    logs.value.splice(0);
    settingStore.saveCurrentLog(logs.value);
  };

  // ログに表示するための順序が考慮されたリスト
  const logMessages = computed(() => {
    const settingStore = useSettingStore();
    if (settingStore.isDescendingLog) {
      return logs.value.slice().reverse();
    }
    return logs.value;
  });
  const visibleLogMessages = computed(() => {
    const usersStore = useUsersStore();
    return logMessages.value
      .filter((e) => !(usersStore.ihashsSilentIgnoredByMe[e.ihash] ?? false))
      .filter((e) => !(usersStore.ihashsIgnoredByMe[e.ihash] ?? false));
  });

  const appendCommentLog = ({ id, cmt, typing }: ChatMessage) => {
    const usersStore = useUsersStore();
    const settingStore = useSettingStore();

    const name = usersStore.visibleUsers[id]?.name;
    const nameString = name ?? "不明";
    const trip = usersStore.visibleUsers[id]?.trip;
    const ihash = usersStore.visibleUsers[id]?.ihash;
    let tripString = "";
    if (trip !== "") {
      tripString = `◆${trip?.slice(0, 10)}`;
    } else {
      tripString = `◇${ihash?.slice(0, 6)}`;
    }
    const dateString = moment().format("MM/DD　HH:mm:ss");
    const head = `${nameString}${tripString} (ID:${id.slice(0, 3)}): `;
    const content = cmt;
    let kpmText = "";
    if (typing !== undefined) {
      const kpm = Math.floor((60 * typing.count) / (typing.milliTime / 1000));
      kpmText = ` (${kpm}KPM)`;
    }
    const foot = ` [${dateString}]${kpmText}`;
    const visibleOnReceived = document.visibilityState === "visible";
    const color =
      usersStore.visibleUsers[id]?.rgbaValue ?? Color.monaRGBToCSS({ r: 255, g: 255, b: 255 }, 1.0);
    appendLog({ head, content, foot, visibleOnReceived, color, ihash });
    settingStore.saveCurrentLog(logs.value);
  };

  const appendUserLog = (id: string, isEnter: boolean) => {
    const usersStore = useUsersStore();
    const settingStore = useSettingStore();

    const name = usersStore.visibleUsers[id]?.name;
    const nameString = name ?? "不明";
    const trip = usersStore.visibleUsers[id]?.trip;
    const ihash = usersStore.visibleUsers[id]?.ihash;
    let tripString = "";
    if (trip !== "") {
      tripString = `◆${trip?.slice(0, 10)}`;
    } else {
      tripString = `◇${ihash?.slice(0, 6)}`;
    }
    const dateString = moment().format("MM/DD　HH:mm:ss");
    let announce;
    let symbol;
    if (isEnter) {
      announce = "が入室しました";
      symbol = "□";
    } else {
      announce = "が退室しました";
      symbol = "■";
    }
    const head = `${symbol} ${nameString}${tripString} (ID:${id.slice(0, 3)}): `;
    const content = announce;
    const foot = ` [${dateString}] ${symbol}`;
    const visibleOnReceived = document.visibilityState === "visible";
    const color =
      usersStore.visibleUsers[id]?.rgbaValue ?? Color.monaRGBToCSS({ r: 255, g: 255, b: 255 }, 1.0);
    appendLog({ head, content, foot, visibleOnReceived, color, ihash });
    settingStore.saveCurrentLog(logs.value);
  };

  return {
    logs,
    appendLog,
    resetLog,
    logMessages,
    visibleLogMessages,
    appendCommentLog,
    appendRoomLog: appendUserLog,
  };
});
