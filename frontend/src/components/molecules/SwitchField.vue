<template>
  <div class="switch-field">
    <ToggleSwitch v-model="model" :input-id="labelId" />
    <label :for="labelId"><SpanText :text="label" /></label>
  </div>
</template>

<script setup lang="ts">
import ToggleSwitch from "primevue/toggleswitch";
import SpanText from "../atoms/SpanText.vue";

defineProps<{ label: string; labelId: string; modelValue: boolean }>();

const model = defineModel();
</script>

<style lang="scss" scoped>
.switch-field {
  display: flex;
  column-gap: 0.75em;
  align-items: center;
}
</style>
