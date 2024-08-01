<template>
  <div
    :class="[
      'bubble',
      {
        'bubble--thinking': isThinkingBubble,
        'bubble--normal': !isThinkingBubble,
        dark: shouldBeDark,
        light: !shouldBeDark,
      },
    ]"
  >
    <div class="text-container">
      <SpanText :text="msg.cmt" :type="isDarkColor(color) ? 'white' : 'black'" class="text" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SpanText from "@/components/atoms/SpanText.vue";
import Color from "@/stores/color";
import { useSettingStore } from "@/stores/setting";

export type Message = {
  cmt: string;
  style: number;
};

const props = withDefaults(defineProps<{ msg: Message; color: string; isDark?: boolean }>(), {
  isDark: undefined,
});

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const isThinkingBubble = computed(() => props.msg.style === 2);
const isDarkColor = (color: string) => {
  return Color.isDarkColor(color);
};
const borderColor = computed(() => (shouldBeDark.value ? "white" : "black"));
</script>

<style lang="scss" scoped>
.bubble {
  position: relative;

  display: flex;
  justify-content: center;
  box-sizing: border-box;
  border: solid 1.5px;
  border-radius: 50%;
  min-width: 100px;
  max-width: fit-content;
  min-height: 40px;

  padding: 8px 15px;
  background-color: v-bind(color);

  text-align: center;
  white-space: nowrap;

  &.light {
    border-color: black;
  }
  &.dark {
    border-color: white;
  }

  .text-container {
    overflow: hidden; // NOTE: 要素から想定外の方向にはみ出る文字を抑制する

    .text {
      /* これがないとline-heightが小さいときに上に偏ってしまう。謎すぎる。。 */
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &--normal {
    &::after {
      content: "";
      position: absolute;
      right: 0;
      left: 0;
      bottom: -5px;
      width: 0px;
      height: 0px;
      margin: auto;
      border-width: 5px 5px 0 5px;
      border-style: solid;
      border-color: v-bind(borderColor) transparent transparent transparent;
    }
  }

  &--thinking {
    &::before {
      content: "";
      position: absolute;
      display: block;
      border: 1.5px solid v-bind(borderColor);
      border-radius: 50%;
      background-color: v-bind(color);
      right: auto;
      left: auto;
      bottom: -7px;
      width: 10px;
      height: 10px;
    }

    &::after {
      content: "";
      position: absolute;
      display: block;
      border: 1.5px solid v-bind(borderColor);
      border-radius: 50%;
      border-width: 1.5px;
      background-color: v-bind(color);
      right: auto;
      left: auto;
      bottom: -12px;
      width: 4px;
      height: 4px;
    }
  }
}
</style>
