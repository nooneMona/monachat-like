<template>
  <div class="entrance">
    <div :style="{ textAlign: 'center' }">
      <SpanText text="もなちゃと☆ω(β版)" :size="40" />
    </div>
    <div :style="{ textAlign: 'center' }">
      <SpanText text="Login" :size="20" />
    </div>
    <div :style="{ textAlign: 'center' }">
      <SpanText text="なまえを入れてください" :size="20" />
    </div>
    <div class="field-area">
      <SubmittableField ref="nameField" @submit="submitName" v-model="nameWithTrip" />
    </div>

    <div class="rule-area">
      <div :style="{ textAlign: 'center' }">
        <SpanText text="もなちゃと☆ω(β版)のきまり" :size="20" />
      </div>
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
            :size="16"
            :type="notice.isNew ? 'notice' : 'text'"
          />
        </li>
      </ul>
      <div class="manner">
        <div>
          <SpanText text="いろいろな世代・地域の人が集まる場所です" :size="16" />
        </div>
        <div>
          <SpanText text="マナーを守り、みんなで楽しく過ごせるようにしましょう" :size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import SpanText from "@/components/atoms/SpanText.vue";
import SubmittableField from "@/components/molecules/SubmittableField.vue";

export default {
  components: {
    SpanText,
    SubmittableField,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // 要素
    const nameField = ref(null);

    // ストア
    const width = computed(() => store.state.ui.size.width);
    const height = computed(() => store.state.ui.size.height);

    // リアクティブ
    const nameWithTrip = ref("");
    const notices = ref([]);

    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        nameField.value.focus();
      }
    };
    const isDarkMode = computed(() => store.state.setting.darkMode);
    const backgroundColor = computed(() => {
      if (isDarkMode.value) {
        return "#121212";
      }
      return "white";
    });

    // ライフサイクル
    onMounted(async () => {
      nameWithTrip.value = store.getters["setting/nameWithTrip"];
      const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/news`);
      notices.value = res.data.news;
      window.addEventListener("keydown", onKeyDown);
    });

    onUnmounted(() => window.removeEventListener("keydown", onKeyDown));

    // メソッド
    const submitName = async ({ text }) => {
      // 解析が無事に終わってから移動しないと引き継がれないのでawaitする。
      await store.dispatch("parseNameWithTrip", { text });
      await store.dispatch("resetLogStorage");
      router.push({
        path: "/select",
      });
    };

    return {
      width,
      height,
      nameWithTrip,
      notices,
      submitName,
      nameField,
      backgroundColor,
    };
  },
};
</script>
<style scoped>
.entrance {
  height: 100%;
}

.field-area {
  margin: 0 auto;
  height: 50px;
  width: 50%;
}
.rule-area {
  margin: 20px auto;
  width: 70%;
  height: 60%;
  overflow: auto;
  scrollbar-width: none; /* Firefox 対応 */
}
.rule-area::-webkit-scrollbar {
  /* Chrome, Safari 対応 */
  display: none;
}

.notice-list {
  margin-top: 0px;
  margin-bottom: 0px;
}

.manner {
  margin-top: 20px;
}
</style>
