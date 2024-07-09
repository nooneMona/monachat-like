<template>
  <input
    :class="{ dark: shouldBeDark, light: !shouldBeDark }"
    ref="inputEl"
    type="text"
    v-model="text"
    @keydown="onKeydown"
  />
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { useSettingStore } from "../../stores/setting";

const props = withDefaults(defineProps<{ modelValue: string; isDark?: boolean }>(), {
  isDark: undefined,
});
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "typed", value: string): void;
}>();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const inputEl = ref(null);
const typedInputEl: Ref<HTMLInputElement | undefined> = computed(
  () => inputEl.value as unknown as HTMLInputElement | undefined,
);

const text = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emits("update:modelValue", value);
  },
});

const onKeydown = (e: KeyboardEvent) => {
  emits("typed", e.key);
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
