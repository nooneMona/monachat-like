<template>
  <div ref="root" class="room" @drop.prevent="drop" @dragover.prevent @dragenter.prevent>
    <div class="top-right-text"><SpanText :size="15" :text="topRightText" /></div>
    <img
      v-if="currentRoom != undefined && !isDarkMode"
      class="room-img"
      :src="`img/roomimg/${currentRoom?.img_url ?? ''}`"
      alt="背景画像"
    />
    <!-- TODO: v-forのインデックスが勝手にnumber型になる問題を解消する -->
    <div
      v-for="(user, id) in visibleUsers"
      class="character-frame"
      :style="{
        left: user.dispX + 'px',
        top: user.dispY - bubbleAreaHeight + 'px',
        // TODO: 可動域の高さが400pxを超えたときに破綻するので修正する
        zIndex: `${user.dispY + isMine(id as unknown as string) ? 500 : 100}`,
      }"
      :key="id"
      :ref="
        // https://vuejs.org/guide/essentials/template-refs.html#function-refs
        (el) => {
          if (el) {
            characterChildren[id] = el as any;
          }
        }
      "
    >
      <ChatCharacter
        :key="id"
        :user="{ ...user, id }"
        :messages="chatMessages[id] ?? []"
        :bubble-area-height="bubbleAreaHeight"
        :draggable="isMine(id as unknown as string)"
        @dragstart="dragStart"
        @sizeUpdated="sizeUpdated"
        @bubbleDeleted="bubbleDeleted"
      />
    </div>

    <div class="setting-bar">
      <div class="setting-bar-left">
        <div class="setting-item">
          <select v-model="selectedVolume">
            <option disabled value="" selected>音量</option>
            <option value="on">ON</option>
            <option value="off">OFF</option>
          </select>
        </div>
        <div class="setting-item">
          <select v-model="selectedTime">
            <option disabled value="" selected>時間</option>
            <option value="long">LONG</option>
            <option value="medium">MEDIUM</option>
            <option value="short">SHORT</option>
            <option value="quick">QUICK</option>
          </select>
        </div>
        <div class="setting-item">
          <select v-model="selectedStat" @change="onChangeStat">
            <option disabled value="">状態</option>
            <option disabled value="free">フリー</option>
            <option v-for="option in statOptions" :key="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
      <div class="setting-bar-center">
        <SubmittableField
          ref="chatField"
          v-model="text"
          :allowedEmpty="false"
          :disabled="disabledSubmitButton"
          @submit="submitCOM"
          @delete-all="fieldAllTextDeleted"
          @typed="onTyped"
        />
      </div>
      <div class="setting-bar-right">
        <InvertButton @click="clickInvert" />
        <SimpleButton title="戻る" class="return-button" @click="clickExit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { Stat } from "@/domain/stat";
import SpanText from "@/components/atoms/SpanText.vue";
import SimpleButton from "@/components/atoms/SimpleButton.vue";
import InvertButton from "@/components/molecules/InvertButton.vue";
import SubmittableField from "@/components/molecules/SubmittableField.vue";
import ChatCharacter from "@/components/organisms/ChatCharacter.vue";
import { useUIStore } from "../../stores/ui";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useRoomStore } from "../../stores/room";

const store = useStore();
const userStore = useUserStore();
const roomStore = useRoomStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();
const router = useRouter();
const route = useRoute();

const bubbleAreaHeight = 300;
const commentIntervalMilliSec = 1000;
const statOptions = Stat.defaultOptions();

// 要素
const root = ref(null);
const chatField = ref<InstanceType<typeof SubmittableField> | null>(null);
const characterChildren = ref<{ [key: string]: InstanceType<typeof ChatCharacter> }>({});

// リアクティブ
const selectedStat = ref("");
const text = ref("");
const gripX = ref(0);
const gripY = ref(0);
const permittedSubmitting = ref(true); // チャットの送信が許可されているかどうか
const keyCount = ref(0); // キータイプ数
const typingStartTime = ref(0); // タイピング開始時刻

// ストア
const { disconnected, myID } = storeToRefs(userStore);
const { isDarkMode } = storeToRefs(settingStore);
const selectedVolume = computed({
  get: () => settingStore.selectedVolume,
  set: (value) => settingStore.updateSelectedVolume(value),
});
const selectedTime = computed({
  get: () => settingStore.selectedTime,
  set: (value) => settingStore.updateSelectedTime(value),
});
const visibleUsers = computed(() => store.getters.visibleUsers);
const chatMessages = computed(() => store.state.chatMessages);
const displayingMyID = computed(() => userStore.displayingMyID(3));
const currentRoom = computed({
  get: () => userStore.currentRoom,
  set: (value) => userStore.updateCurrentRoom(value),
});
// TODO: キャラクターの配置範囲をdivで限定できれば、この処理を書く必要がない
const bottomBarHeight = computed(() => `${uiStore.bottomBarHeight}px`);
const totalUser = computed(() => {
  return Object.keys(store.getters.visibleUsers).length;
});

const disabledSubmitButton = computed(() => disconnected.value || !permittedSubmitting.value);
const topRightText = computed(() =>
  !disconnected.value ? `${totalUser.value}人 (ID:${displayingMyID.value})` : "切断しました",
);

const isMine = (id: string) => {
  return id === myID.value;
};

// ライフサイクル
onMounted(async () => {
  // 以前いた部屋のユーザー情報を削除する。
  store.commit("resetUsers");
  const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/rooms`);
  roomStore.updateRoomMetadata(res.data.rooms);

  const roomObj = roomStore.roomObj(`/${route.params.id}`);
  if (roomObj === undefined) {
    router.push({
      path: "/select",
    });
    return;
  }
  currentRoom.value = { ...roomObj };
  store.dispatch("enter", { room: currentRoom.value });

  const unloadAppendExitLog = () => {
    store.dispatch("exit");
    window.location.reload();
    window.onbeforeunload = null;
  };
  window.addEventListener("unload", unloadAppendExitLog);
  window.addEventListener("keydown", onKeyDown);
});

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    chatField.value?.focus();
  }
};
onUnmounted(() => window.removeEventListener("keydown", onKeyDown));

const drop = (e: DragEvent) => {
  if (e.target === root.value) {
    // なにもないところにドロップしたとき
    store.dispatch("setXY", {
      x: e.offsetX - gripX.value,
      y: e.offsetY - gripY.value,
    });
    return;
  }
  //何か別の要素にドロップしてしまったとき
  const targetId = Object.keys(characterChildren.value).find((element) => {
    const candidate = characterChildren.value[element] as unknown as HTMLElement;
    // NOTE: eventが発生するのがcharacter配下のみなので、要素を含むかどうかで判定する
    return candidate.contains(e.target as HTMLElement);
  });
  if (targetId !== undefined) {
    // キャラクターの要素にドロップしたとき
    store.dispatch("setXY", {
      x: store.state.users[targetId].x + e.offsetX - gripX.value,
      y: store.state.users[targetId].y + e.offsetY - gripY.value,
    });
  }
  // TODO: 画像、名前とトリップにドロップしたときに変なふうになる
};
const clickInvert = () => {
  store.dispatch("setScl");
};
const clickExit = async () => {
  await store.dispatch("exit");
  router.push({
    path: "/select",
  });
};
const submitCOM = (param: { text: string }) => {
  if (param.text.match(/^(状態|stat)(:|：)/)) {
    store.dispatch("setStat", {
      stat: param.text.replace(/(状態|stat)(:|：)/, ""),
    });
    selectedStat.value = "free";
    return;
  }
  permittedSubmitting.value = false;
  setTimeout(function () {
    permittedSubmitting.value = true;
  }, commentIntervalMilliSec);
  store.dispatch("com", {
    ...param,
    typing: {
      count: keyCount.value,
      milliTime: Math.floor(performance.now() - typingStartTime.value),
    },
  });
};
const fieldAllTextDeleted = () => {
  keyCount.value = 0;
};
const onTyped = (value: string) => {
  if (keyCount.value === 0) {
    typingStartTime.value = performance.now();
  }
  if (["Enter", "Tab"].includes(value)) {
    return;
  }
  keyCount.value += 1;
};
const onChangeStat = (e: Event) => {
  if (!(e.target instanceof HTMLSelectElement)) {
    return;
  }
  store.dispatch("setStat", {
    stat: e.target.value,
  });
};
const dragStart = (e: DragEvent) => {
  gripX.value = e.offsetX;
  gripY.value = e.offsetY - bubbleAreaHeight;
};
// キャラクターの画像が変化した時
const sizeUpdated = (e: { id: string; width: number; height: number }) => {
  store.commit("updateUserSize", {
    id: e.id,
    width: e.width,
    height: e.height,
  });
  store.commit("updateUserDispLocation", {
    id: e.id,
  });
};

const bubbleDeleted = ({ characterID, messageID }: { characterID: string; messageID: string }) => {
  store.commit("removeChatMessage", { characterID, messageID });
};
</script>

<style lang="scss" scoped>
/* キャラクター以外の補助的なオブジェクトには全てこのmixinを付ける */
@mixin supplementary-object {
  pointer-events: none;
  user-select: none;
}

.room {
  position: relative;
  height: 100%;
  pointer-events: auto;
  user-select: none;

  .room-img {
    @include supplementary-object;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .top-right-text {
    @include supplementary-object;
    position: absolute;
    top: 0px;
    right: 7%;
  }

  .character-frame {
    @include supplementary-object;
    position: absolute;
  }

  .setting-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: v-bind(bottomBarHeight);
    display: flex;
    justify-content: space-between;

    .setting-bar-left {
      display: flex;
      flex-direction: row;

      .setting-item {
        display: flex;
        flex-direction: row;

        select {
          width: 60px;
        }
      }
    }
    .setting-bar-center {
      width: 40%;
    }
    .setting-bar-right {
      display: flex;
      flex-direction: row;
      column-gap: 30px;

      .return-button {
        width: 84px;
      }
    }
  }
}
</style>
