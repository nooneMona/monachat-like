<template>
  <div class="switch-field">
    <ToggleSwitch v-model="valueComputed" :input-id="labelId" />
    <label :for="labelId"><SpanText :text="label" /></label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ToggleSwitch from "primevue/toggleswitch";
import SpanText from "../atoms/SpanText.vue";

const emits = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();
const props = defineProps<{ label: string; labelId: string; modelValue: boolean }>();

const valueComputed = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});
</script>

<style lang="scss" scoped>
.switch-field {
  display: flex;
  column-gap: 0.75em;
  align-items: center;
}
</style>
