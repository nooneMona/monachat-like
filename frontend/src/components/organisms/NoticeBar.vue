<template>
  <div class="frame">
    <SpanText
      text="サーバーが更新されました。最新のクライアントを取得するため、ブラウザの更新をお願いします。"
      :size="16"
      type="notice"
    />
    <div class="button">
      <SimpleButton title="更新" @click="onClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SpanText from "@/components/atoms/SpanText.vue";
import SimpleButton from "@/components/atoms/SimpleButton.vue";

const emit = defineEmits<{ (e: "click"): void }>();

const onClick = () => emit("click");
</script>

<style scoped>
.frame {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  column-gap: 20px;

  .button {
    width: 80px;
  }
}
</style>
