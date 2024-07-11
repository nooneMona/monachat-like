<template>
  <div>
    <div class="field-wrapper">
      <SwitchField v-model="isKBMode" label="KBモード（キロバイトモード）" labelId="KBMode" />
    </div>
    <div class="field-wrapper">
      <SwitchField v-model="isTypingMode" label="タイピングモード" labelId="typingMode" />
    </div>
    <div class="field-wrapper">
      <SwitchField v-model="isScrollableLog" label="ログの高さを固定する" labelId="scrollableLog" />
    </div>
    <div class="field-wrapper">
      <SwitchField
        v-model="isDescendingLog"
        label="ログの最新を一番下にする"
        labelId="descendingLog"
      />
    </div>
    <div class="field-wrapper">
      <SwitchField
        v-model="isDrawUnderLineLog"
        label="ログにキャラの色の下線を引く"
        labelId="drawUnderLineLog"
      />
    </div>
    <div class="field-wrapper">
      <SwitchField
        v-model="isLogInfinite"
        label="ログを無限に保存する（OFFにすると1,000行で切り捨て）（実験中）"
        labelId="logInfinite"
      />
    </div>
    <div class="field-wrapper">
      <SwitchField v-model="isDarkMode" label="ダークモード" labelId="darkMode" />
    </div>
    <div class="field-wrapper">
      <PrimeButton
        label="ログを削除する"
        icon="pi pi-trash"
        class="p-button-raised p-button-sm p-button-warning p-button-text"
        @click="deleteLog"
      />
    </div>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import PrimeButton from "primevue/button";
import SwitchField from "../molecules/SwitchField.vue";
import { useSettingStore } from "../../stores/setting";

export default {
  name: "SettingsFields",
  components: {
    SwitchField,
    PrimeButton,
  },
  setup() {
    const store = useStore();
    const settingStore = useSettingStore();
    const computedSetting = (fieldName, updatorName) => {
      return computed({
        get: () => {
          return store.state.setting[fieldName];
        },
        set: (value) => {
          // TODO: mutationの上にactionをかぶせる。
          store.commit(updatorName, value);
        },
      });
    };

    const isKBMode = computed({
      get: () => settingStore.isKBMode,
      set: (value) => settingStore.updateIsKBMode(value),
    });
    const isTypingMode = computedSetting("typingMode", "setting/updateTypingMode");
    const isScrollableLog = computedSetting("scrollableLog", "setting/updateScrollableLog");
    const isDescendingLog = computedSetting("descendingLog", "setting/updateDescendingLog");
    const isDrawUnderLineLog = computedSetting(
      "drawBorderBottomLog",
      "setting/updateDrawBorderBottomLog",
    );
    const isLogInfinite = computedSetting("logInfinite", "setting/updateLogInfinite");
    const isDarkMode = computed({
      get: () => settingStore.isDarkMode,
      set: (value) => settingStore.updateIsDarkMode(value),
    });
    const deleteLog = () => store.dispatch("resetLogStorage");

    const bindPrimevueDarkMode = (isDark) => {
      if (isDark) {
        document.querySelector("html").classList.add("my-app-dark");
      } else {
        document.querySelector("html").classList.remove("my-app-dark");
      }
    };
    watch(
      isDarkMode,
      (value) => {
        bindPrimevueDarkMode(value);
      },
      { immediate: true },
    );

    return {
      isKBMode,
      isTypingMode,
      isScrollableLog,
      isDescendingLog,
      isDrawUnderLineLog,
      isLogInfinite,
      isDarkMode,
      deleteLog,
    };
  },
};
</script>

<style>
.field-wrapper {
  margin-bottom: 0.5rem;
}
</style>
