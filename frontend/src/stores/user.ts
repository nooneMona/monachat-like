import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { socketIOInstance } from "../socketIOInstance";
import { useLogStore } from "./log";
import { useSettingStore } from "./setting";
import { RoomResponse } from "../infrastructure/api";
import { useUIStore } from "./ui";
import Color from "./color";
import { useUsersStore } from "./users";

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
  const updateIhash = (value: string | undefined) => {
    ihash.value = value ?? null;
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

  const enter = (room: RoomResponse["rooms"][number]) => {
    const logStore = useLogStore();
    const uiStore = useUIStore();
    const settingStore = useSettingStore();

    const hexColor = settingStore.savedColor;
    const { r, g, b } = Color.hexToMonaRGB(hexColor);
    const randomX = Math.floor(Math.random() * uiStore.width);
    const defaultY = uiStore.height - 150;
    const x = coordinate.value?.x ?? randomX;
    const y = coordinate.value?.y ?? defaultY;
    socketIOInstance.emit("ENTER", {
      token: myToken.value,
      room: room.id,
      x,
      y,
      scl: 100,
      stat: "通常",
      name: settingStore.savedName,
      trip: settingStore.savedInputTrip,
      r,
      g,
      b,
      type: settingStore.savedType,
    });
    const log = settingStore.loadedLogFromStorage;
    if (logStore.logs.length === 0 && log.length !== 0) {
      logStore.$patch({ logs: log });
    }
    updateCurrentRoom(room);
    updateCoordinate({ x, y });
  };

  const exit = () => {
    socketIOInstance.emit("EXIT", {
      token: myToken.value,
    });
  };

  const com = ({
    text,
    shift,
    typing,
  }: {
    text: string;
    shift: boolean;
    typing: { count: number; milliTime: number };
  }) => {
    const settingStore = useSettingStore();

    if (myToken.value === null) {
      return;
    }
    const comParam: {
      token: string;
      cmt: string;
      style?: number;
      typing?: { count: number; milliTime: number };
    } = {
      token: myToken.value,
      cmt: text,
    };
    if (shift) {
      comParam.style = 2;
    }
    if (settingStore.isTypingMode && typing !== undefined) {
      comParam.typing = { ...typing };
    }
    socketIOInstance.emit("COM", comParam);
  };

  const setXY = (x: number, y: number) => {
    const usersStore = useUsersStore();

    if (myID.value === null) {
      return;
    }
    const user = usersStore.users[myID.value];
    if (user === undefined) {
      return;
    }
    socketIOInstance.emit("SET", {
      token: myToken.value,
      x,
      y,
      scl: user.scl,
      stat: user.stat,
    });
    updateCoordinate({ x, y });
  };

  const setStat = (stat: string) => {
    const usersStore = useUsersStore();

    if (myID.value === null) {
      return;
    }
    const user = usersStore.users[myID.value];
    if (user === undefined) {
      return;
    }
    socketIOInstance.emit("SET", {
      token: myToken.value,
      x: user.x,
      y: user.y,
      scl: user.scl,
      stat,
    });
  };

  const setScl = () => {
    const usersStore = useUsersStore();

    if (myID.value === null) {
      return;
    }
    const user = usersStore.users[myID.value];
    if (user === undefined) {
      return;
    }
    const newScl = user.scl === 100 ? -100 : 100;
    socketIOInstance.emit("SET", {
      token: myToken.value,
      x: user.x,
      y: user.y,
      scl: newScl,
      stat: user.stat,
    });
  };

  const toggleIgnorance = (targetIhash: string) => {
    const usersStore = useUsersStore();

    if (targetIhash === ihash.value) {
      return;
    }
    const newIgnores = !(usersStore.ihashsIgnoredByMe[targetIhash] ?? false);
    socketIOInstance.emit("IG", {
      token: myToken.value,
      stat: newIgnores ? "on" : "off",
      ihash: targetIhash,
    });
  };

  const sendIgnorance = (targetIhash: string, isActive: boolean) => {
    socketIOInstance.emit("IG", {
      token: myToken.value,
      stat: isActive ? "on" : "off",
      ihash: targetIhash,
    });
  };

  const toggleSilentIgnorance = (targetIhash: string, isActive: boolean) => {
    const usersStore = useUsersStore();

    if (targetIhash === ihash.value) {
      return;
    }
    usersStore.updateUserSilentIgnore(targetIhash, isActive);
    if (isActive) {
      usersStore.idsByIhash[targetIhash]?.forEach((targetId: string) => {
        usersStore.removeChatMessages(targetId);
      });
    }
  };

  const sendAuth = () => {
    socketIOInstance.emit("AUTH", {
      token: myToken.value,
    });
  };

  const sendError = (text: string) => {
    socketIOInstance.emit("ERROR", {
      text: JSON.stringify(text),
    });
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
    enter,
    exit,
    com,
    setXY,
    setStat,
    setScl,
    toggleIgnorance,
    sendIgnorance,
    toggleSilentIgnorance,
    sendAuth,
    sendError,
  };
});
