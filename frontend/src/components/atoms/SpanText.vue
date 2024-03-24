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
import { useStore } from "vuex";
import { ColorType, UIColor } from "@/ui/uiColor";

const props = withDefaults(
  defineProps<{ text: string | undefined; type?: ColorType; size?: number; isDark?: boolean }>(),
  {
    type: "text",
    size: undefined,
    isDark: undefined,
  }
);

const store = useStore();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = store?.state?.setting?.darkMode;
  if (isDarkModeFromStore !== undefined) {
    return isDarkModeFromStore;
  }
  return props.isDark ?? false;
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
  overflow: "hidden";
}
</style>
@/ui/uiColor
