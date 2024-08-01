<template>
  <input
    ref="inputEl"
    v-model="model"
    :class="{ dark: shouldBeDark, light: !shouldBeDark }"
    type="text"
    @keydown="onKeydown"
  />
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { useSettingStore } from "@/stores/setting";

const props = withDefaults(defineProps<{ isDark?: boolean }>(), {
  isDark: undefined,
});
const emit = defineEmits<{
  (e: "typed", value: string): void;
}>();
const model = defineModel<string>();

const inputEl = ref<HTMLInputElement | null>(null);
const typedInputEl: Ref<HTMLInputElement | undefined> = computed(
  () => inputEl.value as unknown as HTMLInputElement | undefined,
);

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const onKeydown = (e: KeyboardEvent) => {
  emit("typed", e.key);
};

const focus = () => {
  typedInputEl.value?.focus();
};
defineExpose({ focus });
</script>

<style lang="scss" scoped>
input {
  height: 100%;
  width: 100%;
  border: 1px solid;
  box-sizing: border-box;
  font-size: 20px;
  font-family: "Noto Sans JP", monospace;

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
