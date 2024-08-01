<template>
  <div
    class="dropdown"
    @mouseover="hoverOn"
    @focus="hoverOn"
    @mouseleave="hoverOff"
    @blur="hoverOff"
  >
    <button
      :class="{ dark: shouldBeDark, light: !shouldBeDark }"
      @click="toggleKeepingSelectionBox"
    >
      <SpanText :text="`▼${title}`" :size="10" type="text" :is-dark="shouldBeDark" />
    </button>
    <button
      v-for="option in options"
      v-show="isVisibleSelectionBox"
      :key="option.value"
      :class="{ dark: shouldBeDark, light: !shouldBeDark }"
      @click="onSelect(option.value)"
    >
      <SpanText :text="option.text" :size="10" type="text" :is-dark="shouldBeDark" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SpanText from "@/components/atoms/SpanText.vue";
import { useSettingStore } from "@/stores/setting";

export type Option = {
  value: string;
  text: string;
};

const props = withDefaults(
  defineProps<{
    title: string;
    options: Option[];
    isDark?: boolean;
  }>(),
  { isDark: undefined },
);
const emit = defineEmits<{ (e: "select", value: string): void }>();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const isVisibleSelectionBox = ref(false);
const isKeepingVisibleSelectionBox = ref(false); // ドロップダウンの選択肢を表示し続けるかどうか

const hoverOn = () => {
  isVisibleSelectionBox.value = true;
};
const hoverOff = () => {
  if (!isKeepingVisibleSelectionBox.value) {
    isVisibleSelectionBox.value = false;
  }
};
const toggleKeepingSelectionBox = () => {
  isKeepingVisibleSelectionBox.value = !isKeepingVisibleSelectionBox.value;
};

const onSelect = (value: string) => {
  emit("select", value);
};
</script>

<style lang="scss" scoped>
.dropdown {
  display: flex;
  flex-flow: column nowrap;
  /* TODO: コンテンツの大きさにあわせて伸縮した方がよさそう */
  width: 85px;

  button {
    padding: 0;
    border: solid 1px;
    height: 15px;

    &.light {
      border-color: black;
      background-color: white;
    }

    &.dark {
      border-color: white;
      background-color: #121212;
    }
  }
}
</style>
