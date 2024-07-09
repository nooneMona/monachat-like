<template>
  <div :class="{ dark: shouldBeDark, light: !shouldBeDark }">
    <SpanText :text="text" :isDark="shouldBeDark" />
  </div>
</template>

<script setup lang="ts">
import SpanText from "@/components/atoms/SpanText.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const props = withDefaults(defineProps<{ text: string; isDark?: boolean }>(), {
  isDark: undefined,
});

const store = useStore();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = store?.state?.setting?.darkMode;
  if (isDarkModeFromStore !== undefined) {
    return isDarkModeFromStore;
  }
  return props.isDark ?? false;
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
