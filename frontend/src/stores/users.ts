import { ref } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "../domain/type";

export const useUsersStore = defineStore("users", () => {
  const chatMessages = ref<{ [key in string]: ChatMessage[] }>({});
  const ihashsIgnoredByMe = ref<{ [key in string]: boolean }>({});
  const idsIgnoresMe = ref<{ [key in string]: boolean }>({});
  const ihashsSilentIgnoredByMe = ref<{ [key in string]: boolean }>({});

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
    appendChatMessage,
    removeChatMessage,
    removeChatMessages,
    resetChatMessages,
    updateUserIgnore,
    updateIDsIgnoresMe,
    updateUserSilentIgnore,
  };
});
