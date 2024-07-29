<template>
  <div
    ref="wrapperEl"
    class="log-container"
    :style="{
      maxHeight: isScrollableLog ? '220px' : 'none',
      overflowY: isScrollableLog ? 'scroll' : 'auto',
    }"
  >
    <!-- ログの1行分 -->
    <!-- TODO: コンポーネント化する -->
    <div
      class="log-row"
      v-for="msg in visibleLogMessages"
      :key="msg.head + msg.foot"
      :style="{
        backgroundColor: msg.visibleOnReceived ? 'none' : greyBackgroundColor,
        /*rgbaが渡されているが、alphaの値が1.0でありrgbに変換されるため、rgbに0.4を新たに加える。そうすると勝手にrgbaに変換され、線が薄くなる*/
        borderBottom: isDrawnUnderlineLog
          ? `2px solid ${msg.color.replace(')', ', 0.4)')}`
          : 'none',
      }"
    >
      <SpanText
        @click.right.prevent="changeSelectedUsersColor(msg.ihash)"
        @click="toggleUserSelecting(msg.ihash)"
        :text="msg.head"
        :type="selectedUsersIhashes[msg.ihash]"
      />
      <LinkableText :text="msg.content" :type="selectedUsersIhashes[msg.ihash]" />
      <SpanText :text="msg.foot" :type="selectedUsersIhashes[msg.ihash]" />
    </div>
    <div class="log-info-container" v-if="!isDescendingLog && visibleLogMessages.length !== 0">
      <SpanText :text="`現在のログ: ${visibleLogMessages.length}件`" type="text" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick, onUnmounted } from "vue";
import SpanText from "@/components/atoms/SpanText.vue";
import LinkableText from "@/components/molecules/LinkableText.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useUIStore } from "@/stores/ui";
import { useLogStore } from "@/stores/log";

const pageTitle = document.title;
const wrapperEl = ref<HTMLDivElement>();

// ストア
const logStore = useLogStore();
const settingStore = useSettingStore();
const uiStore = useUIStore();

const { visibleLogMessages } = storeToRefs(logStore);
const { isScrollableLog, isDescendingLog, isDrawnUnderlineLog, selectedUsersIhashes } =
  storeToRefs(settingStore);
const { greyBackgroundColor } = storeToRefs(uiStore);

// スクロール位置が下端にあるか
const isLatestScrollPosition = ref(true);
const unseenLogCounter = ref(0);

const scrollToLatest = () => {
  const elm = wrapperEl.value;
  if (elm === undefined) {
    return;
  }
  const destTop = isDescendingLog.value ? elm.scrollHeight - elm.offsetHeight : 0;
  elm.scrollTop = destTop;
};
const handleScroll = () => {
  const elm = wrapperEl.value;
  if (elm === undefined) {
    return;
  }
  const scrollBottomPosition = elm.scrollTop + elm.offsetHeight;
  // 1px分の誤差を許容する
  const isLatestOnDesc =
    scrollBottomPosition - 1 < elm.scrollHeight && elm.scrollHeight < scrollBottomPosition + 1;
  const isOnLatestScrollPosition = isDescendingLog.value ? isLatestOnDesc : elm.scrollTop === 0;
  isLatestScrollPosition.value = isOnLatestScrollPosition;
};

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    resetUnseenLogCounter();
    document.title = pageTitle;
  }
};

const toggleUserSelecting = (ihash: string) => {
  settingStore.toggleUserSelecting(ihash);
};
const changeSelectedUsersColor = (ihash: string) => {
  settingStore.changeSelectedUserColor(ihash);
};

const increaseUnseenLogCounter = () => {
  unseenLogCounter.value += 1;
};
const resetUnseenLogCounter = () => {
  unseenLogCounter.value = 0;
};

onMounted(() => {
  wrapperEl.value?.addEventListener("scroll", handleScroll);
  document.addEventListener("visibilitychange", handleVisibilityChange);
});
onUnmounted(() => {
  wrapperEl.value?.removeEventListener("scroll", handleScroll);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

// When messages are updated,
// fixes the scroll position to show latest message.
// However, if the scroll position isn't on edge, doesn't that.
watch(
  () => [...visibleLogMessages.value],
  () => {
    if (isLatestScrollPosition.value) {
      if (isDescendingLog) {
        nextTick(scrollToLatest);
      }
      scrollToLatest();
    }
    if (document.visibilityState === "hidden") {
      increaseUnseenLogCounter();
      document.title = `${pageTitle} (${
        unseenLogCounter.value > 1000 ? "999+" : unseenLogCounter.value
      })`;
    }
  },
);
// FIXME:
// We cannot change the scroll position of the element
// whose CSS prop 'display' is 'none'.
watch(
  () => isDescendingLog,
  () => {
    scrollToLatest();
  },
);
</script>

<style lang="scss" scoped>
.log-container {
  display: flex;
  flex-direction: column;
  row-gap: 2px;

  .log-row {
    overflow-wrap: break-word;

    .log-info-container {
      padding-top: 16px;
    }
  }
}
</style>
