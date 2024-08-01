<template>
  <!-- 本文をリンクと通常のテキストで分離 -->
  <template v-for="(content, index) in splitTextByContent" :key="content">
    <SpanText v-if="index % 2 === 0" :text="content" :type="type" :size="size" :is-dark="isDark" />
    <a
      v-if="index % 2 === 1"
      class="link"
      :href="content"
      target="_blank"
      rel="noopener noreferrer"
    >
      <SpanText :text="content" type="link" :size="size" :is-dark="isDark" />
    </a>
  </template>
</template>

<script setup lang="ts">
import SpanText from "@/components/atoms/SpanText.vue";
import { computed } from "vue";
import { ColorType } from "@/ui/uiColor";

const props = withDefaults(
  defineProps<{ text: string; type?: ColorType; size?: number; isDark?: boolean }>(),
  {
    type: "text",
    size: undefined,
    isDark: undefined,
  },
);

const splitTextByContent = computed(() => {
  const urlPattern = /https?:\/\/[^\s$.?#].[^\s]*/gm;
  const plainContents = props.text.split(urlPattern) ?? [];
  const urlContents = props.text.match(urlPattern) ?? [];
  const resultArray = [];
  for (let i = 0; i < urlContents.length; i += 1) {
    resultArray.push(plainContents[i] as string);
    resultArray.push(urlContents[i] as string);
  }
  resultArray.push(plainContents[plainContents.length - 1] as string);
  return resultArray;
});
</script>

<style lang="scss" scoped>
.link {
  text-decoration: none;
}
</style>
