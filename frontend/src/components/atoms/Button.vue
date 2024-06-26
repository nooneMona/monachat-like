<template>
  <button
    :class="{ dark: shouldBeDark, light: !shouldBeDark }"
    @click.prevent="onClick"
    :disabled="disabled"
  >
    <SpanText :text="title" :size="textSize" :is-dark="shouldBeDark" />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import SpanText from "./SpanText.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    disabled?: boolean;
    isDark?: boolean;
    textSize?: number;
  }>(),
  { disabled: undefined, isDark: undefined, textSize: 20 }
);
const emits = defineEmits<{ (e: "onClick", event: Event): void }>();

const store = useStore();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = store?.state?.setting?.darkMode;
  if (isDarkModeFromStore !== undefined) {
    return isDarkModeFromStore;
  }
  return props.isDark ?? false;
});

const onClick = (e: Event) => {
  emits("onClick", e);
};
</script>

<style lang="scss" scoped>
button {
  height: 100%;
  width: 100%;
  border: 1px solid;
  margin-left: auto;

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
