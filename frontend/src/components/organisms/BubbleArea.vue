<template>
  <div
    class="bubble-area-frame"
    :class="{
      'debug-frame': isVisibleDebugFrame,
    }"
    :style="{
      bottom: `${300 - user.y}`,
      height: '300px',
    }"
  >
    <div
      class="bubble-area"
      :class="{
        'debug-frame': isVisibleDebugFrame,
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
import { computed } from "vue";
import { useStore } from "vuex";
import Bubble from "@/components/molecules/character/Bubble.vue";

const store = useStore();

const props = defineProps<{ user: any; messages: any[] }>();
const emits = defineEmits<{
  (e: "bubbleDeleted", obj: { characterID: string; messageID: string }): void;
}>();

const afterEnter = (_: Element, messageID: string) => {
  emits("bubbleDeleted", { characterID: props.user.id, messageID });
};
const isVisibleDebugFrame = computed(() => store.state.developer.isVisibleFrame);
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
