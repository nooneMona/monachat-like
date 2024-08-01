<template>
  <form>
    <div class="text-field">
      <TextField ref="inputEl" v-model="model" @typed="onTyped" />
    </div>
    <div class="button">
      <SimpleButton title="OK" :disabled @click="submit" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watchEffect } from "vue";
import TextField from "@/components/atoms/TextField.vue";
import SimpleButton from "@/components/atoms/SimpleButton.vue";

const props = withDefaults(defineProps<{ allowedEmpty?: boolean; disabled?: boolean }>(), {
  allowedEmpty: true,
  disabled: false,
});
const emit = defineEmits<{
  (e: "submit", data: { text: string; shift: boolean }): void;
  (e: "typed", value: string): void;
  (e: "delete-all"): void;
}>();
const model = defineModel({ type: String });
const inputEl = ref<HTMLInputElement | null>(null);
const typedInputEl: Ref<HTMLInputElement | undefined> = computed(
  () => inputEl.value as unknown as HTMLInputElement | undefined,
);

const isValidSubmitting = computed(() => props.allowedEmpty || model.value?.length !== 0);
const submit = (event: Event & { shiftKey: boolean }) => {
  if (!isValidSubmitting.value) {
    return;
  }
  emit("submit", {
    text: model.value ?? "",
    shift: event.shiftKey,
  });
  model.value = "";
};
const onTyped = (value: string) => {
  emit("typed", value);
};

watchEffect(() => {
  if (model.value?.length === 0) {
    emit("delete-all");
  }
});

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
