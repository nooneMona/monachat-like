<template>
  <div :class="{ dark: shouldBeDark, light: !shouldBeDark }">
    <SpanText :text="text" :isDark="shouldBeDark" />
  </div>
</template>

<script setup lang="ts">
import SpanText from "@/components/atoms/SpanText.vue";
import { useSettingStore } from "@/stores/setting";
import { computed } from "vue";

const props = withDefaults(defineProps<{ text: string; isDark?: boolean }>(), {
  isDark: undefined,
});

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});
</script>

<style lang="scss" scoped>
div {
  background-color: white;
  border: solid 1px black;
  padding: 0 5px;
  white-space: nowrap;
  line-height: 1;
  max-width: fit-content;

  &.light {
    border-color: black;
    background-color: white;
  }
  &.dark {
    border-color: white;
    background-color: #121212;
  }
}
</style>
