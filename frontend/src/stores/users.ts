import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import {
  ChatCharacterUser,
  ChatCharacterUserDict,
  ChatMessage,
  ChatMessages,
} from "../domain/type";
import Color from "./color";
import { useUIStore } from "./ui";
import { ENTERResParam, SETResParam } from "../socketIOInstance";

export const useUsersStore = defineStore("users", () => {
  const users = ref<{ [id in string]: ChatCharacterUser }>({}); // 現在のコンテキストにいるユーザー
  const chatMessages = ref<{ [key in string]: ChatMessages }>({});
  const ihashsIgnoredByMe = ref<{ [key in string]: boolean }>({});
  const idsIgnoresMe = ref<{ [key in string]: boolean }>({});
  const ihashsSilentIgnoredByMe = ref<{ [key in string]: boolean }>({});

  // 画面に表示されているユーザー
  const visibleUsers = computed(() => {
    return Object.keys(users.value)
      .filter((id) => users.value[id]?.alive ?? false)
      .filter((id) => !idsIgnoresMe.value[id])
      .filter((id) => !ihashsIgnoredByMe.value[users.value[id]?.ihash ?? ""])
      .reduce((result, id) => {
        const currentResult: ChatCharacterUserDict = { ...result };
        currentResult[id] = users.value[id] as ChatCharacterUser;
        return currentResult;
      }, {} as ChatCharacterUserDict);
  });
  // 設定上表示されているユーザー
  const manageableUsers = computed(() => {
    return Object.keys(users.value ?? {})
      .filter((id) => users.value[id].alive)
      .filter((id) => !idsIgnoresMe.value[id]) // 自分が無視したユーザーは解除できるべきである
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = users.value[id];
        resultRef[id].isIgnored = ihashsIgnoredByMe.value[users.value[id].ihash] ?? false;
        return result;
      }, {});
  });
  // サイレント無視したユーザー
  const silentUsers = computed(() => {
    return Object.keys(users.value)
      .filter((id) => ihashsSilentIgnoredByMe.value[users.value[id]?.ihash ?? ""])
      .reduce((result, id) => {
        const currentResult: ChatCharacterUserDict = { ...result };
        currentResult[id] = users.value[id] as ChatCharacterUser;
        return currentResult;
      }, {} as ChatCharacterUserDict);
  });
  const idsByIhash = computed(() => {
    const ids = Object.keys(users.value);
    const obj: any = {};
    ids.forEach((id) => {
      if (obj[users.value[id].ihash] == null) {
        obj[users.value[id].ihash] = [];
      }
      obj[users.value[id].ihash].push(id);
    });
    return obj;
  });

  const initializeUsers = (newUsers: any) => {
    users.value = {};
    newUsers.forEach((userObj: any) => {
      const { id } = userObj;
      let userRef = users.value[id];
      if (!userRef) {
        // 初めてみかけたIDがあったらキャラのプロパティを作成する
        users.value[id] = {};
        userRef = users.value[id];
      }
      userRef.x = userObj.x;
      userRef.y = userObj.y;
      userRef.dispX = userObj.x;
      userRef.dispY = userObj.y;
      userRef.scl = userObj.scl;
      userRef.stat = userObj.stat;
      userRef.trip = userObj.trip;
      userRef.ihash = userObj.ihash;
      userRef.name = userObj.name;
      userRef.rgbaValue = Color.monaRGBToCSS({ r: userObj.r, g: userObj.g, b: userObj.b }, 1.0);
      userRef.hexValue = Color.monaRGBToHex({ r: userObj.r, g: userObj.g, b: userObj.b });
      userRef.type = userObj.type;
      userRef.isMobile = userObj.isMobile;
      userRef.alive = true;
    });
  };
  const updateUserByEnter = (enterRes: ENTERResParam) => {
    const id = enterRes.id;
    if (users.value[id] === undefined) {
      // 初めてみかけたIDがあったらキャラのプロパティを作成する
      // TODO: あまり型安全でないので修正
      users.value[id] = {} as ChatCharacterUser;
    }
    users.value[id].x = enterRes.x;
    users.value[id].y = enterRes.y;
    users.value[id].scl = enterRes.scl;
    users.value[id].stat = enterRes.stat;
    users.value[id].trip = enterRes.trip;
    users.value[id].ihash = enterRes.ihash;
    users.value[id].name = enterRes.name;
    users.value[id].rgbaValue = Color.monaRGBToCSS(
      { r: enterRes.r, g: enterRes.g, b: enterRes.b },
      1.0,
    );
    users.value[id].hexValue = Color.monaRGBToHex({
      r: enterRes.r,
      g: enterRes.g,
      b: enterRes.b,
    });
    users.value[id].type = enterRes.type;
    users.value[id].isMobile = enterRes.isMobile;
    users.value[id].alive = true;
  };
  const updateUserBySet = (setRes: SETResParam) => {
    const { id } = setRes;
    const userRef = users.value[id];
    userRef.x = setRes.x;
    userRef.y = setRes.y;
    userRef.scl = setRes.scl;
    userRef.stat = setRes.stat;
    userRef.alive = true;
  };
  // キャラの座標とサイズから実際の表示座標を更新する
  // サイズが未定の場合はwidthとheightに0を入れる
  const updateUserDispLocation = (id: string) => {
    const uiStore = useUIStore();
    const userRef = users.value[id];
    if (userRef.x < 0) {
      userRef.dispX = 0;
    } else if (userRef.x > uiStore.width - userRef.width) {
      userRef.dispX = uiStore.width - userRef.width;
    } else {
      userRef.dispX = userRef.x;
    }
    if (userRef.y < uiStore.height / 3) {
      userRef.dispY = uiStore.height / 3;
    } else if (userRef.y > uiStore.height - userRef.height - uiStore.bottomBarHeight) {
      userRef.dispY = uiStore.height - userRef.height - uiStore.bottomBarHeight;
    } else {
      userRef.dispY = userRef.y;
    }
  };
  const updateUserExistence = (id: string, exists: boolean) => {
    const userRef = users.value[id];
    if (!userRef) return;
    userRef.alive = exists;
  };
  const updateUserSize = (id: string, width: number, height: number) => {
    const userRef = users.value[id];
    if (!userRef) return;
    userRef.width = width;
    userRef.height = height;
  };
  const resetUsers = () => {
    users.value = {};
  };
  const appendChatMessage = (id: string, message: ChatMessage) => {
    if (chatMessages.value[id] === undefined) {
      chatMessages.value[id] = [];
    }
    // NOTE: どう追加するかは吹き出しの重なり方が依存する
    // ref: https://developer.mozilla.org/ja/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_without_z-index
    chatMessages.value[id].push({ ...message, messageID: uuidv4() });
  };
  const removeChatMessage = (characterID: string, messageID: string) => {
    const index = chatMessages.value[characterID]?.findIndex((v) => v.messageID === messageID);
    if (index === undefined) {
      return;
    }
    chatMessages.value[characterID]?.splice(index, 1);
  };
  const removeChatMessages = (characterID: string) => {
    chatMessages.value[characterID] = [];
  };
  const resetChatMessages = () => {
    chatMessages.value = {};
  };
  const updateUserIgnore = (ihash: string, isActive: boolean) => {
    ihashsIgnoredByMe.value[ihash] = isActive;
  };
  const updateIDsIgnoresMe = (id: string, isActive: boolean) => {
    idsIgnoresMe.value[id] = isActive;
  };
  const updateUserSilentIgnore = (ihash: string, isActive: boolean) => {
    ihashsSilentIgnoredByMe.value[ihash] = isActive;
  };

  return {
    users,
    chatMessages,
    ihashsIgnoredByMe,
    idsIgnoresMe,
    ihashsSilentIgnoredByMe,
    visibleUsers,
    manageableUsers,
    silentUsers,
    idsByIhash,
    initializeUsers,
    updateUserByEnter,
    updateUserBySet,
    updateUserDispLocation,
    updateUserExistence,
    updateUserSize,
    resetUsers,
    appendChatMessage,
    removeChatMessage,
    removeChatMessages,
    resetChatMessages,
    updateUserIgnore,
    updateIDsIgnoresMe,
    updateUserSilentIgnore,
  };
});
