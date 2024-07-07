<template>
  <div class="body">
    <Notice v-if="noticeStore.isRequiredRefresh" @click="onClickErrorTextButton" />
    <div class="panel-container" :style="{ width: `${uiStore.width}px`, height: `${uiStore.height}px` }">
      <router-view></router-view>
    </div>
    <div class="panel-container" :style="{ width: `${uiStore.width}px` }">
      <InfoPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import InfoPanel from "@/components/pages/InfoPanel.vue";
import Notice from "@/components/organisms/Notice.vue";
import { useNoticeStore } from "./stores/notice";
import { useUIStore } from "./stores/ui";
import { useSettingStore } from "./stores/setting";

const store = useStore();
const noticeStore = useNoticeStore();
const settingStore = useSettingStore();
const uiStore = useUIStore();
const router = useRouter();

// ストア
const isDark = computed(() => settingStore.isDarkMode);

const backgroundColor = computed(() => (isDark.value ? "black" : "#d9d5da"));
const panelBackgroundColor = computed(() => (isDark.value ? "#121212" : "white"));

// ライフサイクル
onMounted(() => {
  store.commit("initializeSocket");
  store.dispatch("registerSocketEvents");
  store.dispatch("loadPreData");
  window.onerror = (message, source, lineno, colno) => {
    const text = `${message} ${source}?${lineno}:${colno}`;
    store.dispatch("sendError", { text });
  };
  window.onunhandledrejection = (e) => {
    store.dispatch("sendError", { text: e.reason });
  };
});
router.beforeEach((to, _, next) => {
  store.commit("updateCurrentPathName", { name: to.name });
  next();
});

const onClickErrorTextButton = () => store.dispatch("reloadPage");
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
</style>
