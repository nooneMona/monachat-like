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
import { socketIOInstance } from "@/socketIOInstance";
import { useUsersStore } from "@/stores/users";
import { useLogStore } from "@/stores/log";
import { useSettingStore } from "@/stores/setting";
import InfoPanel from "@/components/pages/InfoPanel.vue";
import NoticeBar from "@/components/organisms/NoticeBar.vue";

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
  socketIOInstance.on("connect", () => {
    userStore.updateDisconnected(false);
    if (userStore.myToken == null) {
      return;
    }
  });
  socketIOInstance.on("disconnect", () => {
    userStore.updateDisconnected(true);
  });
  socketIOInstance.on("COM", ({ id, cmt, style, typing }) => {
    usersStore.updateUserExistence(id, true);
    if (usersStore.visibleUsers[id] === undefined) return;
    if (usersStore.silentUsers[id] != null) return;
    noticeStore.playCOMAudio();
    const message = {
      id,
      cmt,
      style,
      typing,
    };
    // フォーカスから外れているときに吹き出しをためない
    if (document.visibilityState === "visible") {
      usersStore.appendChatMessage(id, message);
    }
    logStore.appendCommentLog(message.id, message.cmt, message.typing);
    usersStore.updateUserExistence(id, true);
  });
  socketIOInstance.on("ENTER", (param) => {
    usersStore.updateUserByEnter(param);
    if (param.id === userStore.myID) {
      settingStore.updateTripResult(param.trip);
      userStore.updateIhash(param.ihash);
    }
    if (usersStore.visibleUsers[param.id] === undefined) return;
    if (userStore.currentRoom !== null) {
      noticeStore.playENTERAudio();
    }
    logStore.appendUserLog(param.id, true);
    usersStore.updateUserDispLocation(param.id);
  });
  socketIOInstance.on("SET", (param) => {
    usersStore.updateUserBySet(param);
    usersStore.updateUserDispLocation(param.id);
  });
  socketIOInstance.on("IG", (param) => {
    // キャラの座標とサイズから実際の表示座標を更新する
    // サイズが未定の場合はwidthとheightに0を入れる
    const ignores = param.stat === "on"; // offでもなかった場合は無視を解除する
    if (param.id === userStore.myID) {
      // 自分が無視した場合
      usersStore.updateUserIgnore(param.ihash, ignores);
      // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
    }
    if (param.ihash === userStore.ihash) {
      // 自分が無視された場合
      usersStore.updateIDsIgnoresMe(param.id, ignores);
      // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
      usersStore.removeChatMessages(param.id);
    }
    if (param.id === userStore.myID) {
      usersStore.idsByIhash[param.ihash].forEach((targetId) => {
        usersStore.removeChatMessages(targetId);
      });
    }
  });
  socketIOInstance.on("EXIT", ({ id, isEnter }) => {
    if (usersStore.visibleUsers[id] !== undefined) {
      if (userStore.currentRoom !== null) {
        noticeStore.playENTERAudio();
      }
      // visibleUsersに退室を反映する前にログに書き出さないと、名前の情報がとれない。
      logStore.appendUserLog(id, isEnter);
    }
    usersStore.updateUserExistence(id, false);
    usersStore.removeChatMessages(id);
  });
  socketIOInstance.on("USER", (param) => {
    usersStore.initializeUsers(param);
  });
  socketIOInstance.on("COUNT", (param) => {
    roomStore.updateRooms(param);
  });
  socketIOInstance.on("AUTH", ({ id, token }) => {
    if (id === "error") {
      if (userStore.currentPathName === "room") {
        userStore.enter(userStore.currentRoom);
      }
      if (userStore.currentPathName === "select") {
        userStore.enterName();
      }
      noticeStore.requestRefresh();
    }
    userStore.updateAuthInfo(id, token);
    usersStore.updateUserExistence(id, true);
  });
  socketIOInstance.on("SLEEP", (param) => {
    usersStore.updateUserExistence(param.id, false);
    usersStore.removeChatMessages(param.id);
  });
  socketIOInstance.on("AWAKE", (param) => {
    usersStore.updateUserExistence(param.id, true);
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
