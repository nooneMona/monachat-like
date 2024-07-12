<template>
  <div>
    <Accordion :value="['0']" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>一般／外観</AccordionHeader>
        <AccordionContent>
          <div class="field-wrapper">
            <SwitchField v-model="isKBMode" label="KBテーマ" labelId="KBMode" />
          </div>
          <div class="field-wrapper">
            <SwitchField v-model="isDarkMode" label="ダークモード" labelId="darkMode" />
          </div>
          <SwitchField
            v-model="isDrawUnderLineLog"
            label="ログに色の下線を引く"
            labelId="drawUnderLineLog"
          />
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>高度な設定</AccordionHeader>
        <AccordionContent>
          <div class="field-wrapper">
            <SwitchField
              v-model="isScrollableLog"
              label="ログの高さを固定する"
              labelId="scrollableLog"
            />
          </div>
          <div class="field-wrapper">
            <SwitchField
              v-model="isDescendingLog"
              label="ログの最新を一番下にする"
              labelId="descendingLog"
            />
          </div>
          <div class="field-wrapper">
            <SwitchField v-model="isTypingMode" label="タイピングモード" labelId="typingMode" />
          </div>
          <div class="field-wrapper">
            <SwitchField
              v-model="isLogInfinite"
              label="ログを無限に保存する（OFF: 1,000行）"
              labelId="logInfinite"
            />
          </div>
          <div class="field-wrapper">
            <PrimeButton
              label="ログを削除する"
              icon="pi pi-trash"
              class="p-button-raised p-button-sm p-button-warning p-button-text"
              @click="deleteLog"
            />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useStore } from "vuex";
import PrimeButton from "primevue/button";
import SwitchField from "../molecules/SwitchField.vue";
import { useSettingStore } from "../../stores/setting";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

const store = useStore();
const settingStore = useSettingStore();
const computedSetting = (fieldName: string, updatorName: string) => {
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

const bindPrimevueDarkMode = (isDark: boolean) => {
  if (isDark) {
    document.querySelector("html")?.classList.add("my-app-dark");
  } else {
    document.querySelector("html")?.classList.remove("my-app-dark");
  }
};
watch(
  isDarkMode,
  (value) => {
    bindPrimevueDarkMode(value);
  },
  { immediate: true },
);
</script>

<style>
.field-wrapper {
  margin-bottom: 0.5rem;
}
</style>
