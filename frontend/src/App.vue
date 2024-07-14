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
import { useStore } from "vuex";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import InfoPanel from "@/components/pages/InfoPanel.vue";
import NoticeBar from "@/components/organisms/NoticeBar.vue";
import { useUserStore } from "@/stores/user";
import { useNoticeStore } from "@/stores/notice";
import { useUIStore } from "@/stores/ui";
import { useRoomStore } from "@/stores/room";

const store = useStore();
const userStore = useUserStore();
const roomStore = useRoomStore();
const noticeStore = useNoticeStore();
const uiStore = useUIStore();
const router = useRouter();

// ストア
const { backgroundColor, panelBackgroundColor, width, height } = storeToRefs(uiStore);
const { isRequiredRefresh } = storeToRefs(noticeStore);

// ライフサイクル
onMounted(() => {
  store.dispatch("registerSocketEvents");
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
