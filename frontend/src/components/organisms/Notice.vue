<template>
  <div class="frame">
    <SpanText
      :text="'サーバーが更新されました。最新のクライアントを取得するため、ブラウザの更新をお願いします。'"
      :size="16"
      type="notice"
    />
    <div :style="{ width: '80px' }">
      <Button title="更新" @onClick="onClick" />
    </div>
  </div>
</template>

<script>
import SpanText from "@/components/atoms/SpanText.vue";
import Button from "@/components/atoms/Button.vue";

export default {
  components: { Text, Button, SpanText },
  emits: ["click"],
  setup(_, { emit }) {
    const onClick = () => emit("click");
    return { onClick };
  },
};
</script>

<style scoped>
.frame {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 20px;
}
</style>
