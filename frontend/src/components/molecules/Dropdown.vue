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
      :class="{ dark: shouldBeDark, light: !shouldBeDark }"
      v-show="isVisibleSelectionBox"
      v-for="option in options"
      :key="option.value"
      @click="onSelect(option.value)"
    >
      <SpanText :text="option.text" :size="10" type="text" :is-dark="shouldBeDark" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SpanText from "../atoms/SpanText.vue";
import { useStore } from "vuex";

type Option = {
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
const emits = defineEmits<{ (e: "select", value: string): void }>();

const store = useStore();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = store?.state?.setting?.darkMode;
  if (isDarkModeFromStore !== undefined) {
    return isDarkModeFromStore;
  }
  return props.isDark ?? false;
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
  emits("select", value);
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
