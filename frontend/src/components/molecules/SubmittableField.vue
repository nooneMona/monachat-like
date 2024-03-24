<template>
  <form>
    <div class="text-field">
      <TextField ref="inputEl" v-model="text" @typed="onTyped" />
    </div>
    <div class="button">
      <Button title="OK" @onClick="submit" :disabled="disabled" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watchEffect } from "vue";
import TextField from "@/components/atoms/TextField.vue";
import Button from "@/components/atoms/Button.vue";

const inputEl = ref(null);
const typedInputEl: Ref<HTMLInputElement | undefined> = computed(
  () => inputEl.value as unknown as HTMLInputElement | undefined
);

const props = withDefaults(
  defineProps<{ modelValue: string; allowedEmpty: boolean; disabled: boolean }>(),
  { allowedEmpty: true, disabled: false }
);
const emits = defineEmits<{
  (e: "delete-all"): void;
  (e: "submit", data: { text: string; shift: string }): void;
  (e: "update:modelValue", data: string): void;
  (e: "typed", value: string): void;
}>();

const text = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

watchEffect(() => {
  if (text.value.length === 0) {
    emits("delete-all");
  }
});

const submit = (event: any) => {
  if (!props.allowedEmpty && text.value.length === 0) {
    return;
  }
  emits("submit", {
    text: text.value,
    shift: event.shiftKey,
  });
  text.value = "";
};

const onTyped = (value: string) => {
  emits("typed", value);
};

const focus = () => {
  typedInputEl.value?.focus();
};
defineExpose({ focus });
</script>

<style lang="scss" scoped>
form {
  height: 100%;
  width: 100%;
  display: flex;
  column-gap: 2%;
}

.text-field {
  flex: 1;
}

.button {
  width: 20%;
}
</style>
