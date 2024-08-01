<template>
  <div class="character-image">
    <!-- NOTE: 自サーバーに向けて取得したものをSVGとして展開するため -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="fetchedSVGText !== ''" class="character-svg" v-html="characterSVG" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import axios from "axios";
import defaultCharhanSVG from "@/stores/defaultCharhan";
import { ChatCharacterUser } from "@/domain/type";

const props = defineProps<{
  user: Pick<ChatCharacterUser, "type" | "scl" | "hexValue">;
  depthRate: number;
  isKBMode: boolean;
  isSilent: boolean;
}>();
const emits = defineEmits<{ (e: "imageUpdated"): void }>();

// リアクティブ
const fetchedSVGText = ref("");

const characterOpacity = computed(() => (props.isSilent ? 0.3 : 1));
// 画像のパス
const imageFilePath = computed(() => {
  // NOTE: 存在しないキャラコかどうかは問い合わせがないとわからないため、
  //       バリデーションはここでは行わない。空白も存在しないキャラコかわからない扱い。
  // TODO: サニタイズでは完全なディレクトリトラバーサルの対策になっていない
  const sanitizedType = props.user.type.replace(/[^0-9a-z_-]/gi, "");
  if (props.isKBMode) {
    return `/img/kb/${sanitizedType}.svg`;
  }
  return `/img/svg/${sanitizedType}.svg`;
});
const characterSVG = computed(() => {
  let text = fetchedSVGText.value;
  // キャラクターに色を塗る
  text = text.replaceAll(`style="fill:white;"`, `fill="${props.user.hexValue}"`);
  text = text.replaceAll(`fill="#ffffff"`, `fill="${props.user.hexValue}"`);
  // クールな美術館のキャラの線を太くする
  text = text.replaceAll(`stroke-width="0.05"`, `stroke-width="0.5"`);
  return text;
});
const scale = computed(() => {
  const oneValue = props.depthRate;
  if (props.user.scl === 100) {
    return `scale(${oneValue}, ${oneValue})`;
  }
  return `scale(${-oneValue}, ${oneValue})`;
});

const fetchSVGData = async () => {
  if (props.user.type == null) {
    // NOTE: 仮に正しい順番(e.g. undefined->mona)にリクエストを送信しても、
    // type=undefinedの状態のリクエストのレスポンスが最後に来る(e.g. mona->undefined)とチャーハンになってしまう。
    return;
  }
  try {
    const svgRes = await axios({
      url: imageFilePath.value,
      method: "GET",
      responseType: "text",
    });
    fetchedSVGText.value = svgRes.data;
  } catch {
    fetchedSVGText.value = defaultCharhanSVG;
  }
};

watch(
  imageFilePath,
  () => {
    // NOTE: パスが変わるということはデータも変わる 例: KBモードの切替
    fetchSVGData();
  },
  { immediate: true },
);
watch([fetchedSVGText], () => {
  // NOTE: svgにセットされた瞬間はまだ描画されていない
  //       => タスクキューに積んで遅延させる
  setTimeout(() => {
    emits("imageUpdated");
  }, 0);
});
</script>

<style lang="scss" scoped>
.character-image {
  pointer-events: auto;
  opacity: v-bind(characterOpacity);

  .character-svg {
    pointer-events: none; // SVGの要素にドラッグすると変な動きをするのを抑止
    transform-origin: center bottom;
    transform: v-bind(scale);
  }
}
</style>
