<template>
  <div class="body">
    <NoticeBar v-if="isRequiredRefresh" @click="onClickErrorTextButton" />
    <div class="panel-container" :style="{ width: `${width}px`, height: `${height}px` }">
      <router-view></router-view>
    </div>
    <div class="panel-container" :style="{ width: `${width}px` }">
      <InfoPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useNoticeStore } from "@/stores/notice";
import { useUIStore } from "@/stores/ui";
import { useRoomStore } from "@/stores/room";
import {
  AUTHResParam,
  AWAKEResParam,
  COMResParam,
  COUNTResParam,
  ENTERResParam,
  EXITResParam,
  IGResParam,
  SETResParam,
  SLEEPResParam,
  socketIOInstance,
  USERResParam,
} from "@/socketIOInstance";
import { useUsersStore } from "@/stores/users";
import { useLogStore } from "@/stores/log";
import { useSettingStore } from "@/stores/setting";
import InfoPanel from "@/components/pages/InfoPanel.vue";
import NoticeBar from "@/components/organisms/NoticeBar.vue";
import { ChatMessage } from "./domain/type";

const userStore = useUserStore();
const usersStore = useUsersStore();
const roomStore = useRoomStore();
const logStore = useLogStore();
const noticeStore = useNoticeStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();
const router = useRouter();

// ストア
const { backgroundColor, panelBackgroundColor, width, height } = storeToRefs(uiStore);
const { isRequiredRefresh } = storeToRefs(noticeStore);

const registerSocketEvents = () => {
  socketIOInstance.off("connect");
  socketIOInstance.on("connect", () => {
    userStore.updateDisconnected(false);
    if (userStore.myToken !== null) {
      userStore.sendAuth();
    }
  });
  socketIOInstance.off("disconnect");
  socketIOInstance.on("disconnect", () => {
    userStore.updateDisconnected(true);
  });
  socketIOInstance.off("COM");
  socketIOInstance.on("COM", ({ id, cmt, style, typing }: COMResParam) => {
    usersStore.updateUserExistence(id, true); // TODO: この操作の必要性を検証する必要あり
    if (usersStore.visibleUsers[id] === undefined) return;
    if (usersStore.silentUsers[id] !== undefined) return;
    const message: ChatMessage = { id, cmt, style, typing };
    // フォーカスから外れているときに吹き出しをためない
    if (document.visibilityState === "visible" && !uiStore.isLogVisible) {
      usersStore.appendChatMessage(id, message);
    }
    logStore.appendCommentLog(message);
    usersStore.updateUserExistence(id, true); // TODO: この操作の必要性を検証する必要あり

    noticeStore.playCOMAudio();
  });
  socketIOInstance.off("ENTER");
  socketIOInstance.on("ENTER", (param: ENTERResParam) => {
    usersStore.updateUserByEnter(param); // NOTE: 無視関係にある場合も裏では更新しておく
    if (param.id === userStore.myID) {
      // ENTERコマンドから自機のメタ情報を取得しておく
      settingStore.updateTripResult(param.trip);
      userStore.updateIhash(param.ihash);
    }
    if (usersStore.visibleUsers[param.id] === undefined) return;
    logStore.appendRoomLog(param.id, true);
    usersStore.updateUserDispLocation(param.id);

    if (userStore.currentRoom !== null) {
      noticeStore.playENTERAudio();
    }
  });
  socketIOInstance.off("SET");
  socketIOInstance.on("SET", (param: SETResParam) => {
    usersStore.updateUserBySet(param);
    usersStore.updateUserDispLocation(param.id);
  });
  socketIOInstance.off("IG");
  socketIOInstance.on("IG", (param: IGResParam) => {
    const ignores = param.stat === "on"; // offでもなかった場合は無視を解除する
    if (param.id === userStore.myID) {
      // 自分が無視した場合
      usersStore.updateUserIgnore(param.ihash, ignores);
      // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
      //       -> COM受信時、visibleUsersに入ってない限りは吹き出しを保存しないようにしているので、もう外して大丈夫そう？
      usersStore.idsByIhash[param.ihash]?.forEach((targetId: string) => {
        usersStore.removeChatMessages(targetId);
      });
    }
    if (param.ihash === userStore.ihash) {
      // 自分が無視された場合
      usersStore.updateIDsIgnoresMe(param.id, ignores);
      // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
      //       -> COM受信時、visibleUsersに入ってない限りは吹き出しを保存しないようにしているので、もう外して大丈夫そう？
      usersStore.removeChatMessages(param.id);
    }
  });
  socketIOInstance.off("EXIT");
  socketIOInstance.on("EXIT", ({ id }: EXITResParam) => {
    if (usersStore.visibleUsers[id] !== undefined) {
      // visibleUsersに退室を反映する前にログに書き出さないと、名前の情報がとれない。
      logStore.appendRoomLog(id, false);
      if (userStore.currentRoom !== null) {
        noticeStore.playENTERAudio();
      }
    }
    usersStore.updateUserExistence(id, false);
    usersStore.removeChatMessages(id);
  });
  socketIOInstance.off("USER");
  socketIOInstance.on("USER", (param: USERResParam) => {
    usersStore.initializeUsers(param);
  });
  socketIOInstance.off("COUNT");
  socketIOInstance.on("COUNT", (param: COUNTResParam) => {
    roomStore.updateRooms(param);
  });
  socketIOInstance.off("AUTH");
  socketIOInstance.on("AUTH", ({ id, token }: AUTHResParam) => {
    // TODO: 設計として微妙なので要検討
    if (id === "error") {
      // NOTE: AUTHを送ったときにエラーが返ってきた場合は、
      //       サーバーがリセットされている可能性が高いため、復帰処理を行う。
      const currentRoom = userStore.currentRoom;
      if (userStore.currentPathName === "room" && currentRoom !== null) {
        userStore.enter(currentRoom);
      }
      if (userStore.currentPathName === "select") {
        userStore.enterName();
      }
      noticeStore.requestRefresh();
    }
    userStore.updateAuthInfo(id, token);
    usersStore.updateUserExistence(id, true);
  });
  socketIOInstance.off("SLEEP");
  socketIOInstance.on("SLEEP", ({ id }: SLEEPResParam) => {
    usersStore.updateUserExistence(id, false);
    // NOTE: 通信断してから戻ってきたときに吹き出しが大量に出てくるのを防ぐ。
    usersStore.removeChatMessages(id);
  });
  socketIOInstance.off("AWAKE");
  socketIOInstance.on("AWAKE", ({ id }: AWAKEResParam) => {
    usersStore.updateUserExistence(id, true);
  });
};

// ライフサイクル
onMounted(() => {
  registerSocketEvents();
  roomStore.syncRoomMetadata();
  window.onerror = (message, source, lineno, colno) => {
    const text = `${message} ${source}?${lineno}:${colno}`;
    userStore.sendError(text);
  };
  window.onunhandledrejection = (e) => {
    userStore.sendError(e.reason);
  };
});
router.beforeEach((to, _, next) => {
  userStore.updateCurrentPathName(to.name?.toString());
  next();
});

const onClickErrorTextButton = () => noticeStore.reloadPage();
</script>

<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;

  min-width: fit-content;
  min-height: 100vh;

  background-color: v-bind(backgroundColor);

  .panel-container {
    border-radius: 10px;
    background-color: v-bind(panelBackgroundColor);
  }
}
</style>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.debug-frame {
  box-sizing: border-box;
  border: solid 1px red;
}
</style>
