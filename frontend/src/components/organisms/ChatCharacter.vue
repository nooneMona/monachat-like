<template>
  <div
    :class="[
      'character-container',
      {
        'debug-frame': isVisibleDebugFrame,
      },
    ]"
  >
    <div class="debug-text character-text" v-if="isVisibleDebugFrame">
      <SpanText :text="`(${user.x}, ${user.y})`" :size="10" />
    </div>
    <BubbleArea
      class="bubble-area"
      :user="user"
      :messages="messages"
      @bubbleDeleted="bubbleDeleted"
    />
    <div ref="characterEl" class="character">
      <CharacterImage
        :class="{
          'debug-frame': isVisibleDebugFrame,
          'image-frame': selectedUsersIhashes[user.ihash],
        }"
        :style="{
          borderStyle: selectedUsersIhashes[user.ihash] ? 'solid' : 'unset',
          borderColor: selectedBorderColor,
        }"
        :user="user"
        :depthRate="depthRate"
        :is-k-b-mode="isKBMode"
        :is-silent="isSilent"
        @click="toggleUserSelecting(user.ihash)"
        @click.right.prevent="
          selectedUsersIhashes[user.ihash] ? changeSelectedUsersColor(user.ihash) : ''
        "
        @imageUpdated="imageUpdated"
      />
      <div
        :class="[
          'character-text',
          {
            'debug-frame': isVisibleDebugFrame,
          },
        ]"
      >
        <SpanText :text="user.name" />
      </div>
      <div
        :class="[
          'character-text',
          {
            'debug-frame': isVisibleDebugFrame,
          },
        ]"
      >
        <SpanText :text="dispSubText" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUpdated, Ref } from "vue";
import { useStore } from "vuex";
import BubbleArea from "@/components/organisms/BubbleArea.vue";
import CharacterImage from "@/components/organisms/CharacterImage.vue";
import SpanText from "@/components/atoms/SpanText.vue";
import { UIColor } from "../../ui/uiColor";
import { useUIStore } from "../../stores/ui";
import { useSettingStore } from "@/stores/setting";
import { storeToRefs } from "pinia";

const props = withDefaults(
  defineProps<{ user: any; messages: any[]; bubbleAreaHeight: number; isDark?: boolean }>(),
  { bubbleAreaHeight: 300, isDark: undefined },
);
const emits = defineEmits<{
  (e: "sizeUpdated", obj: { id: string; width: number; height: number }): void;
  (e: "bubbleDeleted", obj: { characterID: string; messageID: string }): void;
}>();

// 要素
const characterEl = ref(null);
const typedCharacterEl: Ref<HTMLDivElement | undefined> = computed(
  () => characterEl.value as unknown as HTMLDivElement | undefined,
);

// ストア
const store = useStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();

const { isKBMode } = storeToRefs(settingStore);

const isVisibleDebugFrame = computed(() => store.state.developer.isVisibleFrame);
const selectedUsersIhashes = computed(() => store.state.setting.selectedUsersIhashes);
const silentUsers = computed(() => store.getters.silentUsers);

const dispTrip = computed(() => {
  if (props.user.trip) {
    return `◆${props.user.trip.slice(0, 10)}`;
  }
  return `◇${props.user.ihash?.slice(0, 6)}`;
});
const dispSubText = computed(() => {
  const { isMobile } = props.user;
  return `${dispTrip.value}${isMobile ? "ﾓ" : ""}`;
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
  const color: string | undefined = selectedUsersIhashes.value[props.user.ihash];
  const candidates = ["red", "blue", "green", "purple", "orange"] as const;
  if (color === undefined || !(candidates as readonly string[]).includes(color)) {
    return undefined;
  }
  return new UIColor(color as (typeof candidates)[number]).getCSSColorName(shouldBeDark.value);
});

const imageUpdated = () => {
  const rect = typedCharacterEl.value?.getBoundingClientRect();
  if (rect === undefined) {
    return;
  }
  emits("sizeUpdated", {
    id: props.user.id,
    width: rect.width,
    height: rect.height,
  });
};
const toggleUserSelecting = (ihash: string) => {
  store.dispatch("setting/toggleUserSelecting", { ihash });
};
const changeSelectedUsersColor = (ihash: string) => {
  store.dispatch("setting/changeSelectedUsersColor", { ihash });
};
const bubbleDeleted = ({ characterID, messageID }: { characterID: string; messageID: string }) => {
  emits("bubbleDeleted", { characterID, messageID });
};

onUpdated(() => {
  if (!props.user.height || !props.user.width) {
    imageUpdated();
  }
});
</script>

<style lang="scss" scoped>
.character-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;

  text-align: center;
  pointer-events: none;

  .debug-text {
    position: absolute;
    top: 0;
  }

  .bubble-area {
    pointer-events: none;
    width: 100%;
  }

  .character {
    pointer-events: auto;

    .image-frame {
      box-sizing: border-box;
      border-radius: 5px;
      border-width: 2px;
    }
  }

  .character-text {
    pointer-events: none;
    line-height: 1;
  }
}
</style>
