<template>
  <label for="characterBar" class="seekbar">
    <button class="aside-button-frame" @click="decrease">
      <span class="aside-button">◀</span>
    </button>
    <!-- v-modelと:maxの値が更新されてもUIにそれが反映されない。v-ifで再描画のタイミングを制御することで解決 -->
    <!-- 例: キャラコを直接入れた場合のシークバーへの反映 -->
    <input v-if="isReady" v-model="index" type="range" :max="maxIndex" />
    <button class="aside-button-frame" @click="increase">
      <span class="aside-button">▶</span>
    </button>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    sequence: string[];
    index?: number;
  }>(),
  { index: 0 },
);
const emit = defineEmits<{ (e: "update:index", index: number): void }>();

const index = computed({
  get: () => {
    return props.index;
  },
  set: (value) => {
    const numberIndex = Number(value);
    if (!Number.isFinite(numberIndex)) {
      return;
    }
    emit("update:index", numberIndex);
  },
});
const isReady = computed(() => props.sequence.length > 0);
const maxIndex = computed(() => props.sequence.length - 1);

const increase = () => {
  if (index.value < maxIndex.value) {
    index.value += 1;
  }
};
const decrease = () => {
  if (index.value > 0) {
    index.value -= 1;
  }
};
</script>

<style lang="scss" scoped>
$bar-left-color: darkgrey;
$bar-right-color: #dddddd;
$bar-thumb-color: white;

.seekbar {
  display: flex;
  flex-flow: row nowrap;
  column-gap: 4px;

  .aside-button-frame {
    width: 20px;
    height: 20px;
    border-width: 1px;
    text-align: center;

    .aside-button {
      display: inline-block;
      font-size: 8px;
    }
  }

  input[type="range"] {
    display: block;
    flex: 1;
    margin: 0;
    overflow: hidden;
    cursor: pointer;

    /* TODO: -webkit-appearance: none を消すとどうなるか試す */
    -webkit-appearance: none;
    border-radius: 0; /* for iOS */
  }
}

/* スライダーされる溝のスタイル https://www.webdesignleaves.com/pr/css/input-range-style.html */
::-webkit-slider-runnable-track {
  background: $bar-right-color;
}

/* スライダーするつまみのスタイル https://www.webdesignleaves.com/pr/css/input-range-style.html */
::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 8px;
  height: 20px;
  background: white;
  border: 1px solid $bar-left-color;
  /* つまみの左側の色を変える */
  box-shadow: -1000px 0 0 1000px $bar-left-color;
}

/* スライダーされる溝のスタイル https://developer.mozilla.org/ja/docs/Web/CSS/::-moz-range-track */
::-moz-range-track {
  height: 100%;
  background: $bar-right-color;
}

/* スライダーするつまみのスタイル */
::-moz-range-thumb {
  width: 8px;
  height: 100%;
  background: white;
  box-sizing: border-box;
  border: 1px solid $bar-left-color;
  border-radius: 0;
  /* つまみの左側の色を変える */
  box-shadow: -1000px 0 0 1000px $bar-left-color;
}
</style>
