<template>
  <div
    class="bubble-area-frame"
    :class="{
      'debug-frame': isVisibleFrame,
    }"
    :style="{
      bottom: `${300 - user.y}`,
      height: '300px',
    }"
  >
    <div
      class="bubble-area"
      :class="{
        'debug-frame': isVisibleFrame,
      }"
    >
      <div v-for="msg in messages" :key="msg.messageID" class="bubble-container">
        <transition name="bubble" appear @after-enter="afterEnter($event, msg.messageID)">
          <Bubble :msg="msg" :color="user.rgbaValue" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Bubble from "@/components/molecules/character/ChatBubble.vue";
import { useDevStore } from "@/stores/develop";
import { storeToRefs } from "pinia";

type ChatCharacterUser = {
  id: string;
  x: number;
  y: number;
  dispX: number;
  dispY: number;
  scl: number;
  stat: string;
  trip: string;
  ihash: string;
  name: string;
  rgbaValue: string;
  hexValue: string;
  type: string;
  isMobile: boolean;
  alive: boolean;
  width: number;
  height: number;
};

type ChatMessage = {
  messageID: string;
  id: string;
  cmt: string;
  style: number;
  typing: string;
};

const devStore = useDevStore();
const { isVisibleFrame } = storeToRefs(devStore);

const props = defineProps<{ user: ChatCharacterUser; messages: ChatMessage[] }>();
const emits = defineEmits<{
  (e: "bubbleDeleted", obj: { characterID: string; messageID: string }): void;
}>();

const afterEnter = (_: Element, messageID: string) => {
  emits("bubbleDeleted", { characterID: props.user.id, messageID });
};
</script>

<style lang="scss" scoped>
.bubble-area-frame {
  pointer-events: none;
  user-select: none;
}

.bubble-area {
  width: 100%;
  height: 100%;

  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bubble-container {
  /* 吹き出しを重ねるため */
  position: absolute;
}
</style>
