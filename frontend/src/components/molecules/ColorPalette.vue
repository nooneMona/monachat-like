<template>
  <div :class="['color-palette', { dark: shouldBeDark, light: !shouldBeDark }]">
    <template v-for="color in hexColors" :key="color.id">
      <button
        :class="['cell', { dark: shouldBeDark, light: !shouldBeDark }]"
        :style="{
          backgroundColor: color.hexColor,
        }"
        @click="onClick(color)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
// TODO: セルの大きさを指定して上から割り振っていく方法で実現できるようにする (カラーパレットの数が増減したときに耐えられるように)
import { computed } from "vue";
import { MonaHexColor } from "@/stores/color";
import { useSettingStore } from "@/stores/setting";

export type Color = { id: number; hexColor: MonaHexColor };
const props = withDefaults(defineProps<{ hexColors: Color[]; isDark?: boolean }>(), {
  isDark: undefined,
});
const emit = defineEmits<{ (e: "click", hexColor: MonaHexColor): void }>();
const gridWidth = 4;
const gridHeight = 16;

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = useSettingStore().isDarkMode;
  if (props.isDark !== undefined) {
    return props.isDark;
  }
  return isDarkModeFromStore;
});

const onClick = (color: Color) => emit("click", color.hexColor);
</script>

<style lang="scss" scoped>
.color-palette {
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  height: 100%;
  border: 1px solid;

  &.light {
    border-color: transparent transparent black black;
  }

  &.dark {
    border-color: transparent transparent white white;
  }
}

.cell {
  width: calc(100% / v-bind(gridWidth));
  height: calc(100% / v-bind(gridHeight));
  border: 1px solid;

  &.light {
    border-color: black black transparent transparent;
  }

  &.dark {
    border-color: white white transparent transparent;
  }
}
</style>
