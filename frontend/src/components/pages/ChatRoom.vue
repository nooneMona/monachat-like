<template>
  <div ref="root" class="room" @drop.prevent="drop" @dragover.prevent @dragenter.prevent>
    <img
      v-if="currentRoom != undefined && !isDarkMode"
      class="room-img"
      :src="'img/roomimg/' + currentRoom?.img_url ?? ''"
      alt="背景画像"
    />
    <div
      v-for="(user, id) in visibleUsers"
      class="character-frame"
      :style="{
        left: user.dispX + 'px',
        top: user.dispY - bubbleAreaHeight + 'px',
        zIndex: isMine(id) ? `${500 + user.dispY}` : `${100 + user.dispY}`,
      }"
      :key="id"
      :ref="
        // https://vuejs.org/guide/essentials/template-refs.html#function-refs
        (el) => {
          if (el) {
            children[id] = el as any;
          }
        }
      "
    >
      <ChatCharacter
        :key="id"
        :user="{ ...user, id }"
        :messages="chatMessages[id] ?? []"
        :bubble-area-height="bubbleAreaHeight"
        :draggable="isMine(id)"
        @dragstart="dragStart"
        @sizeUpdated="sizeUpdated"
        @bubbleDeleted="bubbleDeleted"
      />
    </div>

    <div class="top-bar">
      <SpanText
        v-if="!disconnected"
        class="total-user"
        :size="15"
        :text="`${totalUser}人 (ID:${displayingMyID})`"
      />
      <SpanText v-else class="total-user" :size="15" text="切断しました" />
    </div>
    <div class="setting-bar">
      <div class="setting-bar-left">
        <select v-model="selectedStat" @change="onChangeStat">
          <option disabled value="">状態</option>
          <option disabled value="free">フリー</option>
          <option v-for="option in statOptions" :key="option">
            {{ option }}
          </option>
        </select>
        <select v-model="selectedVolume">
          <option disabled value="" selected>音量</option>
          <option value="on">ON</option>
          <option value="off">OFF</option>
        </select>
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
        <Button title="戻る" class="return-button" @click="clickExit" />
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
import Button from "@/components/atoms/Button.vue";
import InvertButton from "@/components/molecules/InvertButton.vue";
import SubmittableField from "@/components/molecules/SubmittableField.vue";
import ChatCharacter from "@/components/organisms/ChatCharacter.vue";
import { useUIStore } from "../../stores/ui";
import { useUserStore } from "../../stores/user";

const store = useStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const router = useRouter();
const route = useRoute();

const bubbleAreaHeight = 300;
const commentIntervalMilliSec = 1000;
const statOptions = Stat.defaultOptions();

// 要素
const root = ref(null);
const chatField = ref<InstanceType<typeof SubmittableField> | null>(null);
const children = ref<{ [key: string]: InstanceType<typeof ChatCharacter> }>({});

// リアクティブ
const selectedStat = ref("");
const text = ref("");
const gripX = ref(0);
const gripY = ref(0);
// チャットの送信が許可されているかどうか
const permittedSubmitting = ref(true);
const keyCount = ref(0);
const typingStartTime = ref(0);

// ストア
const selectedVolume = computed({
  get: () => store.state.setting.sound,
  set: (value) => {
    store.commit("setting/updateSound", value);
    store.dispatch("updateCustomDimensions");
  },
});
const visibleUsers = computed(() => store.getters.visibleUsers);
const chatMessages = computed(() => store.state.chatMessages);
const myID = computed(() => store.state.user.myID);
const displayingMyID = computed(() => userStore.displayingMyID(3));
const currentRoom = computed({
  get: () => store.state.user.currentRoom,
  set: (value) => store.commit("user/updateCurrentRoom", { room: value }),
});
// TODO: キャラクターの配置範囲をdivで限定できれば、この処理を書く必要がない
const bottomBarHeight = computed(() => `${uiStore.bottomBarHeight}px`);
const disconnected = computed(() => store.state.user.disconnected);
const totalUser = computed(() => {
  return Object.keys(store.getters.visibleUsers).length;
});
const isDarkMode = computed(() => store.state.setting.darkMode);

const disabledSubmitButton = computed(() => disconnected.value || !permittedSubmitting.value);

const isMine = (id: number) => {
  return id === myID.value;
};

// ライフサイクル
onMounted(async () => {
  // 以前いた部屋のユーザー情報を削除する。
  store.commit("resetUsers");
  const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/rooms`);
  store.commit("updateRoomMetadata", res.data.rooms);
  const roomObj = store.getters.roomObj(`/${route.params.id}`);
  if (roomObj === undefined) {
    router.push({
      path: "/select",
    });
  }
  currentRoom.value = roomObj;
  store.dispatch("enter", { room: currentRoom.value });

  const unloadAppendExitLog = () => {
    store.dispatch("exit");
    window.location.reload();
    window.onbeforeunload = null;
  };
  window.addEventListener("unload", unloadAppendExitLog);
  window.addEventListener("keydown", onKeyDown);
});

const onKeyDown = (e: any) => {
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
  const targetId = Object.keys(children.value).find((element) => {
    return (children.value[element] as any).contains(e.target);
  });
  if (targetId) {
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
  if (param.text.match(/^状態:|^状態：|^stat:|^stat：/)) {
    store.dispatch("setStat", {
      stat: param.text.replace(/(状態:|状態：|stat:|stat：)/, ""),
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
const onChangeStat = (e: any) => {
  store.dispatch("setStat", {
    stat: e.target.value,
  });
};
const dragStart = (e: DragEvent) => {
  gripX.value = e.offsetX;
  gripY.value = e.offsetY - bubbleAreaHeight;
};
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
.room {
  position: relative;
  height: 100%;
  pointer-events: auto;
  user-select: none;

  .room-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    user-select: none;
  }

  .character-frame {
    position: absolute;
    user-select: none;
    pointer-events: none;
  }

  .top-bar {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    left: 0px;
    top: 0px;
    width: 100%;
    pointer-events: none;
    user-select: none;

    .total-user {
      margin-right: 7%;
    }
  }

  .setting-bar {
    position: absolute;
    display: flex;
    justify-content: space-between;
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: v-bind(bottomBarHeight);

    .setting-bar-left {
      display: flex;
    }
    .setting-bar-center {
      width: 40%;
    }
    .setting-bar-right {
      display: flex;
      column-gap: 30px;

      .return-button {
        width: 84px;
      }
    }
  }
}
</style>
