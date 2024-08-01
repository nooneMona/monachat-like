<template>
  <img src="/img/invert.svg" alt="反転" draggable="false" @click.prevent="click" @keydown="click" />
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: "click"): void }>();
const click = () => emit("click");
</script>

<style lang="scss" scoped>
img {
  height: 100%;
  user-select: none;
}
</style>
