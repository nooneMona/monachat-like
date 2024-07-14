import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "../domain/type";
import Color from "./color";
import { useUIStore } from "./ui";

export const useUsersStore = defineStore("users", () => {
  const users = ref<{ [id in string]: any }>({}); // 現在のコンテキストにいるユーザー
  const chatMessages = ref<{ [key in string]: ChatMessage[] }>({});
  const ihashsIgnoredByMe = ref<{ [key in string]: boolean }>({});
  const idsIgnoresMe = ref<{ [key in string]: boolean }>({});
  const ihashsSilentIgnoredByMe = ref<{ [key in string]: boolean }>({});

  // 画面に表示されているユーザー
  const visibleUsers = computed(() => {
    return Object.keys(users.value)
      .filter((id) => users.value[id].alive)
      .filter((id) => !idsIgnoresMe.value[id])
      .filter((id) => !ihashsIgnoredByMe.value[users.value[id].ihash])
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = users.value[id];
        return result;
      }, {});
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
      .filter((id) => ihashsSilentIgnoredByMe.value[users.value[id].ihash])
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = users.value[id];
        return result;
      }, {});
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
  const updateUserByEnter = (newUser: any) => {
    const { id } = newUser;
    let userRef = users.value[id];
    if (!userRef) {
      // 初めてみかけたIDがあったらキャラのプロパティを作成する
      users.value[id] = {};
      userRef = users.value[id];
    }
    userRef.x = newUser.x;
    userRef.y = newUser.y;
    userRef.scl = newUser.scl;
    userRef.stat = newUser.stat;
    userRef.trip = newUser.trip;
    userRef.ihash = newUser.ihash;
    userRef.name = newUser.name;
    userRef.rgbaValue = Color.monaRGBToCSS({ r: newUser.r, g: newUser.g, b: newUser.b }, 1.0);
    userRef.hexValue = Color.monaRGBToHex({ r: newUser.r, g: newUser.g, b: newUser.b });
    userRef.type = newUser.type;
    userRef.isMobile = newUser.isMobile;
    userRef.alive = true;
  };
  const updateUserBySet = (newUser: any) => {
    const { id } = newUser;
    const userRef = users.value[id];
    userRef.x = newUser.x;
    userRef.y = newUser.y;
    userRef.scl = newUser.scl;
    userRef.stat = newUser.stat;
    userRef.alive = true;
  };
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
