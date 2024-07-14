<template>
  <div
    :class="['bubble-area-frame', { 'debug-frame': isVisibleFrame }]"
    :style="{ bottom: `${bubbleAreaHeight - user.y}`, height: `${bubbleAreaHeight}px` }"
  >
    <div :class="['bubble-area', { 'debug-frame': isVisibleFrame }]">
      <div v-for="msg in messages" :key="msg.messageID" class="bubble-container">
        <transition name="bubble" appear @after-enter="afterEnter($event, msg.messageID)">
          <ChatBubble :msg="msg" :color="user.rgbaValue" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatBubble from "@/components/molecules/character/ChatBubble.vue";
import { ChatCharacterUser, ChatMessage } from "@/domain/type";
import { useSettingStore } from "@/stores/setting";
import { useDevStore } from "@/stores/develop";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps<{
  user: ChatCharacterUser;
  messages: ChatMessage[];
  bubbleAreaHeight: number;
}>();
const emits = defineEmits<{
  (e: "bubbleDeleted", obj: { characterID: string; messageID: string }): void;
}>();

const settingStore = useSettingStore();
const devStore = useDevStore();

const { selectedTime } = storeToRefs(settingStore);
const { isVisibleFrame } = storeToRefs(devStore);

const transitionPeriod = computed(() => {
  const convertToPeriod = () => {
    switch (selectedTime.value) {
      case "quick":
        return 3;
      case "short":
        return 10;
      case "medium":
        return 20;
      case "long":
        return 30;
      default:
        return 20;
    }
  };
  return `${convertToPeriod()}s`;
});

const afterEnter = (_: Element, messageID: string) => {
  emits("bubbleDeleted", { characterID: props.user.id, messageID });
};
</script>

<style lang="scss" scoped>
.bubble-area-frame {
  pointer-events: none;
  user-select: none;

  .bubble-area {
    width: 100%;
    height: 100%;

    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .bubble-container {
      /* 吹き出しを重ねるため */
      position: absolute;
    }
  }
}

.bubble-enter {
  transform: translateX(-50%) translateY(-30px);
}
.bubble-enter-active {
  transition: transform v-bind(transitionPeriod) linear;
}
.bubble-enter-to {
  transform: translateX(0%) translateY(-300px);
}
</style>
