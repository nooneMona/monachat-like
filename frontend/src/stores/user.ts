import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
  const currentRoom = ref<{ id: string; name: string; img_url: string } | null>(null); // 現在いる部屋(部屋にいない場合はnull)
  const coordinate = ref<{ x: number; y: number } | null>(null);
  const disconnected = ref(false); // サーバーから切断されているかどうか

  const updateAuthInfo = (id: string, token: string) => {
    myID.value = id;
    myToken.value = token;
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

  return {
    myID,
    myToken,
    currentRoom,
    coordinate,
    disconnected,
    updateAuthInfo,
    updateCurrentRoom,
    updateCoordinate,
    updateDisconnected,
    displayingMyID,
  };
});
