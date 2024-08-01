<template>
  <div :class="['character-container', { 'debug-frame': isVisibleFrame }]">
    <div v-if="isVisibleFrame" class="character-text debug-text">
      <SpanText :text="`(${user.x}, ${user.y})`" :size="10" />
    </div>
    <BubbleArea :user :messages :bubble-area-height @bubble-deleted="bubbleDeleted" />
    <div ref="characterEl" class="character">
      <div class="character-image-container">
        <CharacterImage
          :class="{
            'debug-frame': isVisibleFrame,
            'selected-frame': selectedUsersIhashes[user.ihash],
          }"
          :style="{
            borderStyle: selectedUsersIhashes[user.ihash] ? 'solid' : 'unset',
            borderColor: selectedBorderColor,
          }"
          :user
          :depth-rate
          :is-k-b-mode
          :is-silent
          @click="emit('click', { id: user.id, ihash: user.ihash })"
          @click.right.prevent="emit('click-right', { id: user.id, ihash: user.ihash })"
          @image-updated="imageUpdated"
        />
        <div v-show="isVisibleStat" class="stat-panel-frame">
          <StatPanel :text="user.stat" />
        </div>
      </div>
      <div :class="['character-text', { 'debug-frame': isVisibleFrame }]">
        <SpanText :text="user.name" />
      </div>
      <div :class="['character-text', { 'debug-frame': isVisibleFrame }]">
        <SpanText :text="dispSubText" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUpdated, Ref } from "vue";
import { storeToRefs } from "pinia";
import BubbleArea from "@/components/organisms/BubbleArea.vue";
import CharacterImage from "@/components/molecules/character/CharacterImage.vue";
import SpanText from "@/components/atoms/SpanText.vue";
import StatPanel from "@/components/molecules/character/StatPanel.vue";
import { UIColor } from "@/ui/uiColor";
import { useUIStore } from "@/stores/ui";
import { SelectedUserColorType, useSettingStore } from "@/stores/setting";
import { useDevStore } from "@/stores/develop";
import { useUsersStore } from "@/stores/users";
import { Character } from "@/domain/character";
import { Stat } from "@/domain/stat";
import { ChatCharacterUser, ChatMessages } from "@/domain/type";

const props = withDefaults(
  defineProps<{
    user: ChatCharacterUser;
    messages: ChatMessages;
    bubbleAreaHeight?: number;
    isDark?: boolean;
  }>(),
  { bubbleAreaHeight: 300, isDark: undefined },
);
const emit = defineEmits<{
  (e: "size-updated", obj: { id: string; width: number; height: number }): void;
  (e: "bubble-deleted", obj: { characterID: string; messageID: string }): void;
  (e: "click", obj: { id: string; ihash: string }): void;
  (e: "click-right", obj: { id: string; ihash: string }): void;
}>();

// 要素
const characterEl = ref<HTMLDivElement | null>(null);
const typedCharacterEl: Ref<HTMLDivElement | undefined> = computed(
  () => characterEl.value as unknown as HTMLDivElement | undefined,
);

// ストア
const usersStore = useUsersStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();
const devStore = useDevStore();

const { silentUsers } = storeToRefs(usersStore);
const { isKBMode, selectedUsersIhashes } = storeToRefs(settingStore);
const { isVisibleFrame } = storeToRefs(devStore);

const dispSubText = computed(() => {
  const character = Character.create({
    name: props.user.name,
    trip: props.user.trip,
    ihash: props.user.ihash,
  });
  return `${character.tripTag()}${props.user.isMobile ? "ﾓ" : ""}`;
});
const depthRate = computed(() => {
  let result = 1 - (uiStore.height - props.user.dispY) / uiStore.height;
  result = 0.6 + 0.4 * result + 0.1;
  return result;
});
const isSilent = computed(() => silentUsers.value[props.user.id] != null);
const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});
const selectedBorderColor = computed(() => {
  const color: SelectedUserColorType | undefined = selectedUsersIhashes.value[props.user.ihash];
  if (color === undefined) {
    return undefined;
  }
  return new UIColor(color).getCSSColorName(shouldBeDark.value);
});
const isVisibleStat = computed(() => {
  const stat = Stat.create(props.user.stat);
  return stat.isVisible();
});

const imageUpdated = () => {
  const rect = typedCharacterEl.value?.getBoundingClientRect();
  if (rect === undefined) {
    return;
  }
  emit("size-updated", {
    id: props.user.id,
    width: rect.width,
    height: rect.height,
  });
};
const bubbleDeleted = ({ characterID, messageID }: { characterID: string; messageID: string }) => {
  emit("bubble-deleted", { characterID, messageID });
};

onUpdated(() => {
  if (!props.user.height || !props.user.width) {
    imageUpdated();
  }
});
</script>

<style lang="scss" scoped>
.character-container {
  pointer-events: none;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  .debug-text {
    position: absolute;
    top: 0;
  }

  .character {
    pointer-events: auto;

    .character-image-container {
      position: relative;

      .selected-frame {
        box-sizing: border-box;
        border-radius: 5px;
        border-width: 2px;
      }

      .stat-panel-frame {
        pointer-events: none;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    .character-text {
      pointer-events: none;
      line-height: 1;
      overflow: hidden; // NOTE: 要素から想定外の方向にはみ出る文字を抑制する
    }
  }
}
</style>
