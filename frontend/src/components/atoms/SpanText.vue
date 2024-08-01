<template>
  <span
    v-if="text !== undefined"
    :style="{
      color,
      fontSize,
    }"
    >{{ text }}</span
  >
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ColorType, UIColor } from "@/ui/uiColor";
import { useSettingStore } from "@/stores/setting";

const props = withDefaults(
  defineProps<{ text: string | undefined; type?: ColorType; size?: number; isDark?: boolean }>(),
  {
    type: "text",
    size: undefined,
    isDark: undefined,
  },
);

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const color = computed(() => {
  return new UIColor(props.type).getCSSColorName(shouldBeDark.value);
});
const fontSize = computed(() => (props.size !== undefined ? `${props.size}px` : undefined));
</script>

<style lang="scss" scoped>
span {
  font-size: 14px;
  font-family: "Noto Sans JP", monospace;
}
</style>
