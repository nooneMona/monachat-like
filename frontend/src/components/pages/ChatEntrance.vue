<template>
  <div class="entrance">
    <div><SpanText text="もなちゃと☆ω(β版)" :size="24" /></div>
    <div><SpanText text="Login" :size="20" /></div>
    <div class="field-space"></div>
    <div><SpanText text="なまえを入れてください" :size="26" /></div>
    <div class="field-area">
      <SubmittableField ref="nameField" v-model="nameWithTrip" @submit="submitName" />
    </div>
    <div class="rule-area">
      <div class="rule-title">
        <SpanText text="もなちゃと☆ω(β版)のきまり" :size="20" />
      </div>
      <div class="scrollable-area">
        <!-- TODO: コンポーネントに切り出す -->
        <ul class="notice-list">
          <li
            v-for="notice in notices"
            :key="notice.day"
            :style="{
              color: notice.isNew ? 'red' : 'black',
            }"
          >
            <SpanText
              :text="`${notice.day !== undefined ? notice.day + ': ' : ''}${notice.info}`"
              :size="20"
              :type="notice.isNew ? 'notice' : 'text'"
            />
          </li>
        </ul>
        <div class="manner">
          <div>
            <SpanText text="いろいろな世代・地域の人が集まる場所です" :size="20" />
          </div>
          <div>
            <SpanText text="マナーを守り、みんなで楽しく過ごせるようにしましょう" :size="20" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, Ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import SpanText from "@/components/atoms/SpanText.vue";
import SubmittableField from "@/components/molecules/SubmittableField.vue";
import { useSettingStore } from "@/stores/setting";
import { NewsResponse } from "@/infrastructure/api";
import { useLogStore } from "@/stores/log";
import { Character } from "../../domain/character";

const logStore = useLogStore();
const settingStore = useSettingStore();
const router = useRouter();

// 要素
const nameField = ref<HTMLInputElement | null>(null);
const typedNameFieldEl: Ref<HTMLInputElement | undefined> = computed(
  () => nameField.value as unknown as HTMLInputElement | undefined,
);

// リアクティブ
const nameWithTrip = ref("");
const notices = ref<NewsResponse>([]);

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    typedNameFieldEl.value?.focus();
  }
};

const fetchNotices = async () => {
  const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/news`);
  notices.value = res.data.news;
};

// ライフサイクル
onMounted(async () => {
  nameWithTrip.value = settingStore.savedNameWithTrip;
  fetchNotices();
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => window.removeEventListener("keydown", onKeyDown));

// メソッド
const submitName = async ({ text }: { text: string }) => {
  // 解析が無事に終わってから移動しないと引き継がれないのでawaitする。
  const character = Character.createFromText(text);
  settingStore.updateSavedName(character.name);
  settingStore.updateSavedInputTrip(character.tripInput);
  logStore.resetLog();
  router.push({
    path: "/select",
  });
};
</script>

<style lang="scss" scoped>
.entrance {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .field-space {
    height: 20px;
  }

  .field-area {
    margin-top: 8px;
    height: 50px;
    width: 50%;
  }

  .rule-area {
    margin: 20px auto;
    width: 70%;
    height: 60%;
    overflow: auto;
    scrollbar-width: none; /* Firefox 対応 */

    .rule-title {
      padding-left: 20px;
    }

    .notice-list {
      margin-top: 0px;
      margin-bottom: 0px;
    }

    .manner {
      margin-left: 20px;
      margin-top: 20px;
    }
  }
  .rule-area::-webkit-scrollbar {
    /* Chrome, Safari 対応 */
    display: none;
  }
}
</style>
