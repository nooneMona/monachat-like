<template>
  <div class="character-image">
    <div v-if="fetchedSVGText !== ''" class="character-svg" v-html="characterSVG" />
    <!-- TODO: ChatCharacterに移譲する -->
    <div v-show="isVisibleStat" class="stat-panel-frame">
      <StatPanel :text="user.stat" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import axios from "axios";
import { Stat } from "@/domain/stat";
import defaultCharhanSVG from "@/store/defaultCharhan";
import StatPanel from "@/components/molecules/character/StatPanel.vue";

const props = defineProps<{ user: any; depthRate: number; isKBMode: boolean; isSilent: boolean }>();
const emits = defineEmits<{ (e: "imageUpdated"): void }>();

// リアクティブ
const fetchedSVGText = ref("");

const characterOpacity = computed(() => (props.isSilent ? 0.3 : 1));
// 画像のパス
const imagePath = computed(() => {
  // NOTE: 存在しないキャラコかどうかは問い合わせがないとわからないため、
  // バリデーションはここでは行わない。空白も存在しないキャラコかわからない扱い。
  if (props.isKBMode) {
    return `/img/kb/${props.user.type}`;
  }
  return `/img/svg/${props.user.type}`;
});
const characterSVG = computed(() => {
  let text = fetchedSVGText.value;
  text = text.replaceAll(`style="fill:white;"`, `fill="${props.user.hexValue}"`);
  return text.replaceAll(`fill="#ffffff"`, `fill="${props.user.hexValue}"`);
});
const scale = computed(() => {
  const oneValue = props.depthRate;
  if (props.user.scl === 100) {
    return `scale(${oneValue}, ${oneValue})`;
  }
  return `scale(${-oneValue}, ${oneValue})`;
});
const isVisibleStat = computed(() => {
  const stat = Stat.create(props.user.stat);
  return stat.isVisible();
});

const fetchSVGData = async () => {
  if (props.user.type == null) {
    // typeがundefined or nullのときにリクエストを送信しない。
    // 仮に順番にリクエストを送信しても、何らかの拍子にtypeがundefinedのときのリクエストのレスポンスが最後に来ると、
    // いくら正しいキャラコでリクエストしてもチャーハンになってしまう。
    return;
  }
  try {
    const svgRes = await axios({
      url: `${imagePath.value}.svg`,
      method: "GET",
      responseType: "text",
    });
    fetchedSVGText.value = svgRes.data;
  } catch {
    fetchedSVGText.value = defaultCharhanSVG;
  }
};

onMounted(() => fetchSVGData());
// パスが変わるということはデータも変わるということを想定
// 例: KBモードの切替
watch(imagePath, () => fetchSVGData());
watch([fetchedSVGText], () => {
  setTimeout(() => {
    // svgにセットされた瞬間はまだ描画されていないので、遅延させる。遅延時間に意味はない。
    // TODO: 描画完了イベントをとれるようにする。
    emits("imageUpdated");
  }, 100);
});
</script>

<style lang="scss" scoped>
.character-image {
  position: relative;
  opacity: v-bind(characterOpacity);

  .character-svg {
    transform-origin: center bottom;
    transform: v-bind(scale);
  }

  .stat-panel-frame {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
