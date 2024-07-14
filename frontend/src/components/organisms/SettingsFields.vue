<template>
  <div>
    <Accordion :value="['0', '1']" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>一般／外観</AccordionHeader>
        <AccordionContent>
          <div class="field-wrapper">
            <SwitchField
              v-model="isDrawnUnderlineLog"
              label="ログに色の下線を引く"
              labelId="drawUnderLineLog"
            />
          </div>
          <div class="field-wrapper">
            <SwitchField v-model="isKBMode" label="KBテーマ" labelId="KBMode" />
          </div>
          <div class="field-wrapper">
            <SwitchField v-model="isDarkMode" label="ダークモード" labelId="darkMode" />
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>高度な設定</AccordionHeader>
        <AccordionContent>
          <div class="field-wrapper">
            <SwitchField
              v-model="isScrollableLog"
              label="ログの高さを固定する（スクロール）"
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
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import SwitchField from "@/components/molecules/SwitchField.vue";
import { useSettingStore } from "@/stores/setting";

const store = useStore();
const settingStore = useSettingStore();

const isKBMode = computed({
  get: () => settingStore.isKBMode,
  set: (value) => settingStore.updateIsKBMode(value),
});
const isTypingMode = computed({
  get: () => settingStore.isTypingMode,
  set: (value) => settingStore.updateIsTypingMode(value),
});
const isScrollableLog = computed({
  get: () => settingStore.isScrollableLog,
  set: (value) => settingStore.updateIsScrollableLog(value),
});
const isDescendingLog = computed({
  get: () => settingStore.isDescendingLog,
  set: (value) => settingStore.updateIsDescendingLog(value),
});
const isDrawnUnderlineLog = computed({
  get: () => settingStore.isDrawnUnderlineLog,
  set: (value) => settingStore.updateIsDrawnUnderlineLog(value),
});
const isLogInfinite = computed({
  get: () => settingStore.isInfiniteLog,
  set: (value) => settingStore.updateIsInfiniteLog(value),
});
const isDarkMode = computed({
  get: () => settingStore.isDarkMode,
  set: (value) => settingStore.updateIsDarkMode(value),
});
const deleteLog = () => store.dispatch("resetLogStorage");

watch(
  isDarkMode,
  (value) => {
    if (value) {
      document.querySelector("html")?.classList.add("my-app-dark");
    } else {
      document.querySelector("html")?.classList.remove("my-app-dark");
    }
  },
  { immediate: true },
);
</script>

<style>
.field-wrapper {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}
</style>
