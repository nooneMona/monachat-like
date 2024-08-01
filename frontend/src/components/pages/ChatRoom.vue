<template>
  <div ref="root" class="room" @drop.prevent="drop" @dragover.prevent @dragenter.prevent>
    <div class="top-right-text"><SpanText :size="15" :text="topRightText" /></div>
    <div class="top-log-buttons">
      <SimpleButton title="ログモード" class="log-button" :text-size="16" @click="clickLogMode" />
      <SimpleButton
        v-if="isLogVisible"
        title="ログ行数"
        class="log-button"
        :text-size="16"
        @click="clickLogLines"
      />
      <div class="log-line-text">
        <SpanText v-if="isLogVisible" :text="logLinesText" />
      </div>
    </div>
    <div v-if="isLogVisible" class="log-window">
      <div v-for="log in visibleLogMessages" :key="log.head + log.foot">
        <div><SpanText :text="`${log.head}${log.content}${log.foot}`" /></div>
      </div>
    </div>
    <img
      v-if="currentRoom != undefined"
      class="room-img"
      :src="`img/roomimg/${currentRoom?.img_url ?? ''}`"
      alt="背景画像"
    />
    <!-- TODO: v-forのインデックスが勝手にnumber型になる問題を解消する -->
    <div
      v-for="(user, id) in visibleUsers"
      :key="id"
      :ref="
        // https://vuejs.org/guide/essentials/template-refs.html#function-refs
        (el) => {
          if (el) {
            characterChildren[id] = el as any;
          }
        }
      "
      class="character-frame"
      :style="{
        left: user.dispX + 'px',
        top: user.dispY - bubbleAreaHeight + 'px',
        // TODO: 可動域の高さが400pxを超えたときに破綻するので修正する
        zIndex: `${user.dispY + (isMine(id as unknown as string) ? 500 : 100)}`,
      }"
    >
      <ChatCharacter
        :key="id"
        :user="{ ...user, id }"
        :messages="chatMessages[id] ?? []"
        :bubble-area-height="bubbleAreaHeight"
        :draggable="isMine(id as unknown as string)"
        @dragstart="dragStart"
        @size-updated="sizeUpdated"
        @bubble-deleted="bubbleDeleted"
        @click="click"
        @click-right="clickRight"
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
          :allowed-empty="false"
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
import { useRouter, useRoute } from "vue-router";
import { Stat } from "@/domain/stat";
import SpanText from "@/components/atoms/SpanText.vue";
import SimpleButton from "@/components/atoms/SimpleButton.vue";
import InvertButton from "@/components/molecules/InvertButton.vue";
import SubmittableField from "@/components/molecules/SubmittableField.vue";
import ChatCharacter from "@/components/organisms/ChatCharacter.vue";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useRoomStore } from "@/stores/room";
import { useUsersStore } from "@/stores/users";
import { useLogStore } from "@/stores/log";

const userStore = useUserStore();
const usersStore = useUsersStore();
const roomStore = useRoomStore();
const logStore = useLogStore();
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
const { chatMessages, visibleUsers } = storeToRefs(usersStore);
const { visibleLogMessages } = storeToRefs(logStore);
const { isLogVisible, panelBackgroundColor } = storeToRefs(uiStore);
const selectedVolume = computed({
  get: () => settingStore.selectedVolume,
  set: (value) => settingStore.updateSelectedVolume(value),
});
const selectedTime = computed({
  get: () => settingStore.selectedTime,
  set: (value) => settingStore.updateSelectedTime(value),
});
const displayingMyID = computed(() => userStore.displayingMyID(3));
const currentRoom = computed({
  get: () => userStore.currentRoom,
  set: (value) => userStore.updateCurrentRoom(value),
});
// TODO: キャラクターの配置範囲をdivで限定できれば、この処理を書く必要がない
const bottomBarHeight = computed(() => `${uiStore.bottomBarHeight}px`);
const totalUser = computed(() => {
  return Object.keys(visibleUsers.value).length;
});

const disabledSubmitButton = computed(() => disconnected.value || !permittedSubmitting.value);
const topRightText = computed(() =>
  !disconnected.value ? `${totalUser.value}人 (ID:${displayingMyID.value})` : "切断しました",
);
const logLinesText = computed(() => {
  if (settingStore.logLineNumberInteger === 0) {
    return "制限なし";
  }
  return `${settingStore.logLineNumberInteger}行`;
});

const isMine = (id: string) => {
  return id === myID.value;
};

// ライフサイクル
onMounted(async () => {
  usersStore.resetUsers(); // 以前いた部屋のユーザー情報を削除する。
  await roomStore.syncRoomMetadata(); // NOTE: これがないと、直接入った部屋が有効な部屋なのか判断ができない

  const roomObj = roomStore.roomObj(`/${route.params.id}`);
  if (roomObj === undefined) {
    router.push({
      path: "/select",
    });
    return;
  }
  currentRoom.value = { ...roomObj };
  userStore.enter(currentRoom.value);

  const unloadAppendExitLog = () => {
    userStore.exit();
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
    userStore.setXY(e.offsetX - gripX.value, e.offsetY - gripY.value);
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
    userStore.setXY(
      (usersStore.users[targetId]?.x ?? 0) + e.offsetX - gripX.value,
      (usersStore.users[targetId]?.y ?? 0) + e.offsetY - gripY.value,
    );
  }
  // TODO: 画像、名前とトリップにドロップしたときに変なふうになる
};
const clickInvert = () => {
  userStore.setScl();
};
const clickExit = async () => {
  userStore.exit();
  router.push({
    path: "/select",
  });
};
const clickLogMode = () => {
  isLogVisible.value = !isLogVisible.value;
};
const clickLogLines = () => {
  switch (settingStore.logLineNumberInteger) {
    case 0:
      settingStore.updateLogLineNumber("1000");
      break;
    case 1000:
      settingStore.updateLogLineNumber("200");
      break;
    case 200:
      settingStore.updateLogLineNumber("100");
      break;
    case 100:
      settingStore.updateLogLineNumber("50");
      break;
    case 50:
      settingStore.updateLogLineNumber("0");
      break;
  }
};
const click = ({ ihash }: { ihash: string }) => {
  settingStore.toggleUserSelecting(ihash);
};
const clickRight = ({ ihash }: { ihash: string }) => {
  if (settingStore.selectedUsersIhashes[ihash]) {
    settingStore.changeSelectedUserColor(ihash);
    return;
  }
};

const submitCOM = (param: { text: string; shift: boolean }) => {
  if (param.text.match(/^(状態|stat)(:|：)/)) {
    userStore.setStat(param.text.replace(/(状態|stat)(:|：)/, ""));
    selectedStat.value = "free";
    return;
  }
  permittedSubmitting.value = false;
  setTimeout(function () {
    permittedSubmitting.value = true;
  }, commentIntervalMilliSec);
  userStore.com({
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
  userStore.setStat(e.target.value);
};
const dragStart = (e: DragEvent) => {
  gripX.value = e.offsetX;
  gripY.value = e.offsetY - bubbleAreaHeight;
};
// キャラクターの画像が変化した時
const sizeUpdated = (e: { id: string; width: number; height: number }) => {
  usersStore.updateUserSize(e.id, e.width, e.height);
  usersStore.updateUserDispLocation(e.id);
};

const bubbleDeleted = ({ characterID, messageID }: { characterID: string; messageID: string }) => {
  usersStore.removeChatMessage(characterID, messageID);
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
    z-index: 1;
  }

  .top-right-text {
    @include supplementary-object;
    position: absolute;
    top: 0px;
    right: 7%;
  }

  .top-log-buttons {
    @include supplementary-object;
    position: absolute;
    top: 4px;

    display: flex;
    flex-direction: row;
    column-gap: 16px;

    padding-left: 16px;

    .log-line-text {
      @include supplementary-object;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .log-button {
      pointer-events: auto;
      width: 100px;
      height: 30px;
    }
  }

  .log-window {
    position: absolute;
    top: 40px;
    left: 10%;
    right: 10%;
    height: 40%;

    border: 1px solid black;
    overflow-y: scroll;
    overflow-wrap: break-word;
    z-index: 10;
    background-color: v-bind(panelBackgroundColor);
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
