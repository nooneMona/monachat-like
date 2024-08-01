<template>
  <div class="room-selection">
    <!-- トップエリア -->
    <div class="selection-top">
      <div><SpanText text="もなちゃと☆ω(β版)" :size="24" /></div>
      <div class="selection-top-right"><SpanText :text="topRightText" /></div>
    </div>
    <!-- 左エリア -->
    <div class="room-selection-columns">
      <div class="character-selection-area">
        <div><SpanText text="キャラ選択" :size="18" /></div>
        <div class="charceter-selection-box">
          <div class="selection-index-container">
            <MonaDropdown
              title="インデックス"
              :options="characterOptions"
              @select="onSelectGenre"
            />
          </div>
          <div class="color-palette-container">
            <ColorPalette :hex-colors="hexColors" @click="updateColor" />
          </div>
          <div class="character-selection-box-image">
            <CharacterImage
              :user="{ type: userType, hexValue: userHexColor, scl: 100 }"
              :depth-rate="1.0"
              :is-k-b-mode
              :is-silent="false"
            />
            <div class="character-preview-text"><SpanText :text="savedName" /></div>
            <div class="character-preview-text"><SpanText :text="dispTrip" /></div>
          </div>
        </div>
        <div class="selection-box-under-area">
          <div class="seek-bar-container">
            <SeekBar v-model:index="currentCharIndex" :sequence="characterSequence" />
          </div>
          <div>
            <label for="type">
              <input id="type" v-model="userType" :style="{ width: '100px' }" />タイプ
            </label>
            <label for="color"> <input id="color" v-model="userHexColor" type="color" />色 </label>
          </div>
          <div class="selection-box-under-buttons">
            <SimpleButton title="名前変更" @on-click="backToHome" />
          </div>
          <div class="selection-box-under-buttons">
            <SimpleButton title="キャラランダム変更" @on-click="pickRandomCharacter" />
          </div>
        </div>
      </div>
      <!-- 右エリア -->
      <div class="room-selection-area">
        <div class="text-flex-box">
          <SpanText text="ステージ選択" :size="18" />
          <SpanText text="最大人数 ∞人" :size="18" />
        </div>
        <RoomButtons :rooms="roomMetadata" :room-count="rooms" @click-room="submitEnter" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
import Color from "@/stores/color";
import SpanText from "@/components/atoms/SpanText.vue";
import SimpleButton from "@/components/atoms/SimpleButton.vue";
import CharacterImage from "@/components/organisms/CharacterImage.vue";
import SeekBar from "@/components/molecules/SeekBar.vue";
import ColorPalette from "@/components/molecules/ColorPalette.vue";
import MonaDropdown from "@/components/molecules/MonaDropdown.vue";
import RoomButtons from "@/components/organisms/RoomButtons.vue";
import { useSettingStore } from "@/stores/setting";
import { useUserStore } from "@/stores/user";
import { CharactersResponse, ColorResponse, RoomResponse } from "@/infrastructure/api";
import { CharType } from "@/domain/charType";
import { Trip, TripFactory } from "@/domain/trip";
import { useRoomStore } from "../../stores/room";
import { useUsersStore } from "../../stores/users";

const userStore = useUserStore();
const usersStore = useUsersStore();
const roomStore = useRoomStore();
const settingStore = useSettingStore();
const router = useRouter();

// ストア
const { savedName, tripResult, savedType, savedColor, isKBMode } = storeToRefs(settingStore);
const { ihash, disconnected } = storeToRefs(userStore);
const { roomMetadata, rooms } = storeToRefs(roomStore); // APIから取得した部屋一覧
const displayingMyID = computed(() => userStore.displayingMyID(10)); // 自分のID
const userType = computed({
  // 画面で選択されているキャラタイプ
  get: () => savedType.value,
  set: (value) => settingStore.updateSavedType(value),
});
const userHexColor = computed({
  // 画面で選択されているキャラ色
  get: () => savedColor.value,
  set: (value) => settingStore.updateSavedColor(value),
});

// リアクティブ
const colorsResponse = ref<ColorResponse[]>([]);
const charactersResponse = ref<CharactersResponse>([]);

const currentCharIndex = ref(0); // 画面で選択されているキャラのIndex
const hexColors = computed(() =>
  colorsResponse.value.map((e) => ({
    id: e.id,
    hexColor: Color.monaRGBToHex({ r: e.r, g: e.g, b: e.b }),
  })),
);
const characterSequence = computed(() => charactersResponse.value.map((e) => e.characters).flat());
const characterOptions = computed(() =>
  charactersResponse.value.map((e) => ({
    value: e.genre,
    text: e.genre,
  })),
);
const dispTrip = computed(() => {
  let trip: Trip | undefined;
  if (tripResult.value) {
    trip = TripFactory.create("black", tripResult.value);
  }
  if (!tripResult.value && ihash.value !== null) {
    trip = TripFactory.create("white", ihash.value);
  }
  return trip?.toString() ?? "Loading...";
});
const topRightText = computed(() => {
  if (!disconnected.value) {
    return `ID:${displayingMyID.value}...`;
  }
  return "切断しました";
});

// ライフサイクル
onMounted(async () => {
  const colorsRes = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/colors`);
  colorsResponse.value = colorsRes.data.colors;
  const charactersRes = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/characters`);
  charactersResponse.value = charactersRes.data.characters;

  userStore.updateCurrentRoom(null);
  usersStore.resetChatMessages();
  userStore.enterName();
});

const updateColor = (hexColor: string) => {
  userHexColor.value = hexColor;
};
const onSelectGenre = (genre: string) => {
  const targetCharacters = charactersResponse.value.find((e) => e.genre === genre)?.characters;
  if (targetCharacters === undefined) {
    return CharType.create(undefined).value;
  }
  userType.value = CharType.create(targetCharacters[0]).value;
};
const pickRandomCharacter = async () => {
  const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/character/random`);
  userType.value = CharType.create(res.data.randomChar).value;
};
const submitEnter = async (room: RoomResponse["rooms"][number]) => {
  router.push({
    // NOTE: idに"/"が含まれる
    path: `/room${room.id}`,
  });
};
const backToHome = () => {
  router.push({
    path: "/",
  });
};

// 初回でuserTypeが変更されるときにはまだcharacterSequenceの結果が返ってきてない。
// -> characterSequenceの変更を受け取って再計算を試みることで、シーケンスバーを初期化できる。
watch([userType, characterSequence], () => {
  if (userType.value === undefined) {
    return;
  }
  if (
    characterSequence.value.indexOf(userType.value) !== -1 &&
    // TODO: 存在しないタイプが入力されたときの対策でたまたまこれが動いてる可能性があるので、代替案を考える
    userType.value !== characterSequence.value[currentCharIndex.value - 1]
  ) {
    currentCharIndex.value = characterSequence.value.indexOf(userType.value);
  }
});

watch(currentCharIndex, () => {
  const selectedCharType = characterSequence.value[currentCharIndex.value];
  userType.value = CharType.create(selectedCharType).value;
});
</script>

<style lang="scss" scoped>
.room-selection {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  height: 100%;

  .selection-top {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;

    .selection-top-right {
      position: absolute;
      right: 10px;
    }
  }

  .room-selection-columns {
    display: flex;
    flex-direction: row;
    column-gap: 20px;

    .character-selection-area {
      display: flex;
      flex-direction: column;
      width: 30%;
      align-items: center;

      .charceter-selection-box {
        margin: 0px auto;
        position: relative;
        border: solid 1px;
        width: 80%;
        aspect-ratio: 1 / 1;

        .selection-index-container {
          position: absolute;
          left: 0;
          top: 0;
          transform: translateX(-30%);
        }

        .character-selection-box-image {
          position: absolute;
          left: 0px;
          right: 0px;
          bottom: 0px;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .character-preview-text {
          line-height: 1;
          text-align: "center";
        }

        .color-palette-container {
          position: absolute;
          right: 0px;
          transform: translateX(50%);
          width: 59px;
          height: 236px;
        }
      }

      .selection-box-under-area {
        margin: 5px auto;
        width: 80%;

        .seek-bar-container {
          margin: 10px auto 8px;
          width: 248px;
        }

        .selection-box-under-buttons {
          margin: 10px 0;
        }
      }
    }

    .room-selection-area {
      display: flex;
      flex-direction: column;
      width: 70%;

      .text-flex-box {
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
      }
    }
  }
}
</style>
