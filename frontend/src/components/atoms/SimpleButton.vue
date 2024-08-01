<template>
  <button
    :class="{ dark: shouldBeDark, light: !shouldBeDark }"
    :disabled="disabled"
    @click.prevent="onClick"
  >
    <SpanText :text="title" :size="textSize" :is-dark="shouldBeDark" />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingStore } from "@/stores/setting";
import SpanText from "./SpanText.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    disabled?: boolean;
    isDark?: boolean;
    textSize?: number;
  }>(),
  { disabled: undefined, isDark: undefined, textSize: 20 },
);
// TODO: 適切なEvent型を探してくる
const emits = defineEmits<{ (e: "click", event: Event & { shiftKey: boolean }): void }>();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const onClick = (e: Event & { shiftKey: boolean }) => {
  emits("click", e);
};
</script>

<style lang="scss" scoped>
button {
  height: 100%;
  width: 100%;
  border: 1px solid;
  white-space: nowrap;
  overflow: hidden;

  &.light {
    color: black;
    border-color: black;
    background-color: white;
  }
  &.dark {
    color: white;
    border-color: white;
    background-color: #121212;
  }
}
</style>
