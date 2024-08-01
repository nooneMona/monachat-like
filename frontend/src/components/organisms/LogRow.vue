<template>
  <div
    class="log-row"
    :style="{
      backgroundColor: msg.visibleOnReceived ? 'none' : greyBackgroundColor,
      /*rgbaが渡されているが、alphaの値が1.0でありrgbに変換されるため、rgbに0.4を新たに加える。そうすると勝手にrgbaに変換され、線が薄くなる*/
      borderBottom: isDrawnUnderlineLog ? `2px solid ${msg.color.replace(')', ', 0.4)')}` : 'none',
    }"
  >
    <SpanText
      :text="msg.head"
      :type="selectedUsersIhashes[msg.ihash]"
      @click.right.prevent="changeSelectedUsersColor(msg.ihash)"
      @click="toggleUserSelecting(msg.ihash)"
    />
    <LinkableText :text="msg.content" :type="selectedUsersIhashes[msg.ihash]" />
    <SpanText :text="msg.foot" :type="selectedUsersIhashes[msg.ihash]" />
  </div>
</template>

<script setup lang="ts">
import SpanText from "@/components/atoms/SpanText.vue";
import LinkableText from "@/components/molecules/LinkableText.vue";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";
import { useSettingStore } from "@/stores/setting";

export type LogMessage = {
  head: string;
  content: string;
  foot: string;
  ihash: string;
  color: string;
  visibleOnReceived: boolean;
};

defineProps<{ msg: LogMessage }>();

const uiStore = useUIStore();
const settingStore = useSettingStore();

const { greyBackgroundColor } = storeToRefs(uiStore);
const { isDrawnUnderlineLog, selectedUsersIhashes } = storeToRefs(settingStore);

// TODO: イベントにして上位コンポーネントに渡すようにする。
const toggleUserSelecting = (ihash: string) => {
  settingStore.toggleUserSelecting(ihash);
};
const changeSelectedUsersColor = (ihash: string) => {
  settingStore.changeSelectedUserColor(ihash);
};
</script>

<style lang="scss" scoped>
.log-row {
  overflow-wrap: break-word;
  overflow: hidden; // NOTE: 要素から想定外の方向にはみ出る文字を抑制する
}
</style>
