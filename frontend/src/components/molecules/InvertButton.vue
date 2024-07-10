<template>
  <img src="/img/invert.svg" alt="反転" @click.prevent="click" @keydown="click" draggable="false" />
</template>

<script setup lang="ts">
const emits = defineEmits<{ (e: "click"): void }>();
const click = () => emits("click");
</script>

<style lang="scss" scoped>
img {
  height: 100%;
  user-select: none;
}
</style>
