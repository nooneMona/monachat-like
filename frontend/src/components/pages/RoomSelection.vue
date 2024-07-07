<template>
  <div class="room-selection">
    <div class="selection-top">
      <SpanText text="もなちゃと☆ω(β版)" :size="20" />
      <div class="top-right-text-area">
        <SpanText v-if="!disconnected" :text="`ID:${myID}...`" />
        <SpanText v-else text="切断しました" />
      </div>
    </div>
    <div class="room-selection-columns">
      <div class="character-selection-area">
        <div
          :style="{
            textAlign: 'center',
          }"
        >
          <SpanText text="キャラ選択" :size="18" />
        </div>
        <div class="charceter-selection-box">
          <div class="selection-index-container">
            <Dropdown title="インデックス" :options="characterOptions" @select="onSelectGenre" />
          </div>
          <div class="color-palette-container">
            <ColorPalette :hexColors="hexColors" @click="updateColor" />
          </div>
          <div class="character-selection-box-image">
            <CharacterImage
              :user="{ type: userType, hexValue: userHexColor, stat: '通常', scl: 100 }"
              :depthRate="1.0"
            />
            <div
              :style="{
                lineHeight: 1,
                textAlign: 'center',
              }"
            >
              <SpanText :text="setting.name" />
            </div>
            <div
              :style="{
                lineHeight: 1,
                textAlign: 'center',
              }"
            >
              <SpanText :text="dispTrip" />
            </div>
          </div>
        </div>
        <div class="selection-box-under-area">
          <div class="seek-bar-container">
            <SeekBar :sequence="characterSequence" v-model:index="currentCharIndex" />
          </div>
          <div>
            <label for="type">
              <input id="type" v-model="userType" :style="{ width: '100px' }" />
              タイプ
            </label>
            <label for="color">
              <input id="color" type="color" v-model="userHexColor" />
              色
            </label>
          </div>
          <div class="selection-box-under-buttons">
            <Button title="名前変更" @onClick="backToHome" />
          </div>
          <div class="selection-box-under-buttons">
            <Button title="キャラランダム変更" @onClick="randomCharacter" />
          </div>
        </div>
      </div>
      <div class="room-selection-area">
        <div class="text-flex-box">
          <SpanText text="ステージ選択" :size="18" />
          <SpanText text="最大人数 ∞人" :size="18" />
        </div>
        <Rooms :rooms="rooms" :roomCount="roomCount" @clickRoom="submitEnter" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import Color from "@/store/color";
import SpanText from "@/components/atoms/SpanText.vue";
import Button from "@/components/atoms/Button.vue";
import CharacterImage from "@/components/organisms/CharacterImage.vue";
import SeekBar from "@/components/molecules/SeekBar.vue";
import ColorPalette from "@/components/molecules/ColorPalette.vue";
import Dropdown from "@/components/molecules/Dropdown.vue";
import Rooms from "@/components/organisms/Rooms.vue";

export default {
  components: {
    Text,
    SpanText,
    CharacterImage,
    ColorPalette,
    SeekBar,
    Rooms,
    Dropdown,
    Button,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // ストア
    const rooms = computed(() => store.state.roomMetadata); // APIから取得した部屋一覧
    const setting = computed(() => store.state.setting); // 設定値
    const myID = computed(() => store.getters["user/displayedMyID"](10)); // 自分のID
    const roomCount = computed(() => store.state.rooms); // 同期された部屋人数情報
    const userType = computed({
      // 画面で選択されているキャラタイプ
      get: () => store.state.setting.type,
      set: (value) => store.commit("setting/updateType", value),
    });
    const userHexColor = computed({
      // 画面で選択されているキャラ色
      get: () => store.state.setting.color,
      set: (value) => store.commit("setting/updateColor", value),
    });
    const disconnected = computed(() => store.state.user.disconnected);

    // リアクティブ
    const currentCharIndex = ref(0); // 画面で選択されているキャラのIndex
    const colors = ref([]); // APIから取得した色一覧
    const characters = ref([]); // APIから取得したキャラ一覧

    const hexColors = computed(() =>
      colors.value.map((e) => ({
        id: e.id,
        hexColor: Color.monaRGBToHex({ r: e.r, g: e.g, b: e.b }),
      }))
    );
    const characterSequence = computed(() => characters.value.map((e) => e.characters).flat());
    const characterOptions = computed(() =>
      characters.value.map((e) => ({
        value: e.genre,
        text: e.genre,
      }))
    );
    const dispTrip = computed(() => {
      if (!setting.value.tripResult) {
        return store.state.user.ihash ? `◇${store.state.user.ihash?.slice(0, 6)}` : "Loading...";
      }
      return `◆${setting.value.tripResult.slice(0, 11)}`;
    });
    const isDarkMode = computed(() => store.state.setting.darkMode);
    const backgroundColor = computed(() => {
      if (isDarkMode.value) {
        return "#121212";
      }
      return "white";
    });

    // ライフサイクル
    onMounted(async () => {
      const colorsRes = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/colors`);
      colors.value = colorsRes.data.colors;
      const charactersRes = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/characters`);
      characters.value = charactersRes.data.characters;

      store.commit("user/updateCurrentRoom", { room: null });
      store.commit("resetChatMessages");
      await store.dispatch("enterName", { text: null });
    });

    const updateColor = (hexColor) => {
      userHexColor.value = hexColor;
    };
    const onSelectGenre = (genre) => {
      const targetCharacters = characters.value.find((e) => e.genre === genre).characters;
      const type = targetCharacters[0];
      userType.value = type;
    };
    const randomCharacter = async () => {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/character/random`);
      userType.value = res.data.randomChar;
    };
    const submitEnter = async (room) => {
      router.push({
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
      userType.value = characterSequence.value[currentCharIndex.value];
    });

    return {
      userType,
      userHexColor,
      updateColor,
      submitEnter,
      backToHome,
      randomCharacter,
      dispTrip,
      rooms,
      characterSequence,
      characterOptions,
      onSelectGenre,
      currentCharIndex,
      hexColors,
      setting,
      myID,
      roomCount,
      disconnected,
      backgroundColor,
    };
  },
};
</script>

<style scoped>
.room-selection {
  height: 100%;
}

.selection-top {
  display: flex;
  justify-content: center;
  position: relative;
}

.top-right-text-area {
  position: absolute;
  right: 10px;
}

.room-selection-columns {
  margin-top: 30px;
  display: flex;
}

.character-selection-area {
  float: left;
  width: 30%;
  height: 100%;
}

.charceter-selection-box {
  margin: 0px auto;
  position: relative;
  border: solid 1px;
  width: 80%;
  aspect-ratio: 1 / 1;
}

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

.room-selection-area {
  float: right;
  display: flex;
  flex-flow: column wrap;
  width: 70%;
  height: 100%;
}

.text-flex-box {
  display: flex;
  justify-content: space-between;
}

.selection-box-under-area {
  margin: 5px auto;
  width: 80%;
}

.seek-bar-container {
  margin: 10px auto 8px;
  width: 248px;
}

.selection-box-under-buttons {
  margin: 10px 0;
}

.color-palette-container {
  position: absolute;
  right: 0px;
  transform: translateX(50%);
  width: 59px;
  height: 236px;
}
</style>
