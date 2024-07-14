import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { socketIOInstance } from "../socketIOInstance";
import { useLogStore } from "./log";
import { useSettingStore } from "./setting";

export interface IUser {
  myID: string | null;
  myToken: string | null;
  disconnected: boolean;
}

/*
 * ユーザーの認可
 * [Client(s)]                [Server]
 *    | ------- request -------> |
 *    |                   [ create account ]
 *    | <----- token+ID -------- |
 *    | ---- request+token ----> |
 *    |                    [ valid account ]
 *    |                 [ process something  ]
 *   (s) <---- response+ID ------|
 */

export const useUserStore = defineStore("user", () => {
  const myToken = ref<string | null>(null); // サーバーから付与されたトークン
  const myID = ref<string | null>(null); // サーバから付与されたID
  const ihash = ref<string | null>(null); // サーバーから付与されたihash
  const currentPathName = ref<string | undefined>(undefined); // 現在のパス（Vue routerの値を同期するためのもの）
  const currentRoom = ref<{ id: string; name: string; img_url: string } | null>(null); // 現在いる部屋(部屋にいない場合はnull)
  const coordinate = ref<{ x: number; y: number } | null>(null);
  const disconnected = ref(false); // サーバーから切断されているかどうか

  const updateAuthInfo = (id: string, token: string) => {
    myID.value = id;
    myToken.value = token;
  };
  const updateIhash = (value: string) => {
    ihash.value = value;
  };
  const updateCurrentPathName = (value: string | undefined) => {
    currentPathName.value = value;
  };
  const updateCurrentRoom = (room: { id: string; name: string; img_url: string } | null) => {
    if (room === null) {
      currentRoom.value = null;
      return;
    }
    currentRoom.value = { ...room };
  };
  const updateCoordinate = (value: { x: number; y: number } | null) => {
    if (value === null) {
      coordinate.value = null;
      return;
    }
    coordinate.value = { ...value };
  };
  const updateDisconnected = (value: boolean) => {
    disconnected.value = value;
  };

  const displayingMyID = computed(() => (end: number) => {
    if (myID.value == null) {
      return "";
    }
    return myID.value.slice(0, end);
  });

  const enterName = () => {
    const logStore = useLogStore();
    const settingStore = useSettingStore();
    // ローカルストレージの内容に頼る
    const trip = settingStore.savedInputTrip;
    let name = settingStore.savedName;
    name = name.trim() === "" ? "名無しさん" : name;
    const enterParams = {
      room: "/MONA8094",
      attrib: "no",
      name,
      trip,
      token: undefined,
    };
    socketIOInstance.emit("ENTER", { ...enterParams, token: myToken.value ?? undefined });
    settingStore.updateSavedName(name);
    settingStore.updateSavedInputTrip(trip);
    const log = settingStore.loadedLogFromStorage;
    if (logStore.logs.length === 0 && log.length !== 0) {
      logStore.$patch({ logs: log });
    }
  };

  return {
    myID,
    myToken,
    ihash,
    currentPathName,
    currentRoom,
    coordinate,
    disconnected,
    updateAuthInfo,
    updateIhash,
    updateCurrentPathName,
    updateCurrentRoom,
    updateCoordinate,
    updateDisconnected,
    displayingMyID,
    enterName,
  };
});
