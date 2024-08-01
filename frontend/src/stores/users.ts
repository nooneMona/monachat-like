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
import { ENTERResParam, SETResParam, USERResParam } from "../socketIOInstance";

export const useUsersStore = defineStore("users", () => {
  const users = ref<{ [id in string]: ChatCharacterUser }>({}); // 現在のコンテキストにいるユーザー
  const chatMessages = ref<{ [key in string]: ChatMessages }>({});
  const ihashsIgnoredByMe = ref<{ [key in string]: boolean }>({});
  const idsIgnoresMe = ref<{ [key in string]: boolean }>({});
  const ihashsSilentIgnoredByMe = ref<{ [key in string]: boolean }>({});
  const ihashsSecureIgnoredByMe = ref<{ [key in string]: boolean }>({});

  // 画面に表示されているユーザー
  const visibleUsers = computed(() => {
    return Object.keys(users.value)
      .filter((id) => users.value[id]!.alive)
      .filter((id) => !(idsIgnoresMe.value[id] ?? false))
      .filter((id) => !(ihashsIgnoredByMe.value[users.value[id]!.ihash] ?? false))
      .reduce((result, id) => {
        const currentResult: ChatCharacterUserDict = { ...result };
        currentResult[id] = users.value[id]!;
        return currentResult;
      }, {} as ChatCharacterUserDict);
  });
  // 設定上表示されているユーザー
  const manageableUsers = computed(() => {
    return (
      Object.keys(users.value)
        .filter((id) => users.value[id]!.alive)
        .filter((id) => !(idsIgnoresMe.value[id] ?? false))
        // 自分が無視したユーザーは解除できるべきである (ihashIgnoraedByMeを含めていない理由)
        .reduce((result, id) => {
          const currentResult: ChatCharacterUserDict = { ...result };
          currentResult[id] = users.value[id]!;
          currentResult[id].isIgnored = ihashsIgnoredByMe.value[users.value[id]!.ihash] ?? false;
          return currentResult;
        }, {} as ChatCharacterUserDict)
    );
  });
  // サイレント無視したユーザー
  const silentUsers = computed(() => {
    return Object.keys(users.value)
      .filter((id) => ihashsSilentIgnoredByMe.value[users.value[id]!.ihash])
      .reduce((result, id) => {
        const currentResult: ChatCharacterUserDict = { ...result };
        currentResult[id] = users.value[id]!;
        return currentResult;
      }, {} as ChatCharacterUserDict);
  });
  // セキュア無視したユーザー
  const secureIgUsers = computed(() => {
    return Object.keys(users.value)
      .filter((id) => ihashsSecureIgnoredByMe.value[users.value[id]!.ihash])
      .reduce((result, id) => {
        const currentResult: ChatCharacterUserDict = { ...result };
        currentResult[id] = users.value[id]!;
        return currentResult;
      }, {} as ChatCharacterUserDict);
  });
  const idsByIhash = computed(() => {
    const obj: { [ihash in string]: string[] } = {};
    Object.keys(users.value).forEach((id) => {
      if (obj[users.value[id]!.ihash] == null) {
        obj[users.value[id]!.ihash] = [];
      } else {
        obj[users.value[id]!.ihash]?.push(id);
      }
    });
    return obj;
  });

  const initializeUsers = (newUsers: USERResParam) => {
    users.value = {};
    newUsers.forEach((userObj: USERResParam[number]) => {
      const { id } = userObj;
      let userRef = users.value[id];
      if (!userRef) {
        // 初めてみかけたIDがあったらキャラのプロパティを作成する
        users.value[id] = {} as ChatCharacterUser;
        userRef = users.value[id];
      }
      userRef.x = userObj.x ?? 0;
      userRef.y = userObj.y ?? 0;
      userRef.dispX = userObj.x ?? 0;
      userRef.dispY = userObj.y ?? 0;
      userRef.scl = userObj.scl ?? 100;
      userRef.stat = userObj.stat ?? "通常";
      userRef.trip = userObj.trip ?? "";
      userRef.ihash = userObj.ihash ?? "";
      userRef.name = userObj.name ?? "名無しさん";
      userRef.rgbaValue = Color.monaRGBToCSS(
        { r: userObj.r ?? 0, g: userObj.g ?? 0, b: userObj.b ?? 0 },
        1.0,
      );
      userRef.hexValue = Color.monaRGBToHex({
        r: userObj.r ?? 0,
        g: userObj.g ?? 0,
        b: userObj.b ?? 0,
      });
      userRef.type = userObj.type ?? "charhan";
      userRef.isMobile = userObj.isMobile ?? false;
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
    users.value[id].x = enterRes.x ?? 0;
    users.value[id].y = enterRes.y ?? 0;
    users.value[id].scl = enterRes.scl ?? 100;
    users.value[id].stat = enterRes.stat ?? "通常";
    users.value[id].trip = enterRes.trip ?? "";
    users.value[id].ihash = enterRes.ihash ?? "";
    users.value[id].name = enterRes.name ?? "名無しさん";
    users.value[id].rgbaValue = Color.monaRGBToCSS(
      { r: enterRes.r ?? 0, g: enterRes.g ?? 0, b: enterRes.b ?? 0 },
      1.0,
    );
    users.value[id].hexValue = Color.monaRGBToHex({
      r: enterRes.r ?? 0,
      g: enterRes.g ?? 0,
      b: enterRes.b ?? 0,
    });
    users.value[id].type = enterRes.type ?? "charhan";
    users.value[id].isMobile = enterRes.isMobile;
    users.value[id].alive = true;
  };
  const updateUserBySet = (setRes: SETResParam) => {
    const { id } = setRes;
    const userRef = users.value[id];
    if (userRef === undefined) {
      return;
    }
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
    if (userRef === undefined) {
      return;
    }
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
  const updateUserSecureIgnore = (ihash: string, isActive: boolean) => {
    ihashsSecureIgnoredByMe.value[ihash] = isActive;
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
    secureIgUsers,
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
    updateUserSecureIgnore,
  };
});
