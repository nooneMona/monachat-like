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
import { useStore } from "vuex";
import { MonaHexColor } from "../../store/color";
import { computed } from "vue";

type Color = { hexColor: MonaHexColor };
const gridWidth = 4;
const gridHeight = 16;

const props = withDefaults(defineProps<{ hexColors: Color[]; isDark?: boolean }>(), {
  isDark: undefined,
});
const emits = defineEmits<{ (e: "click", hexColor: MonaHexColor): void }>();

const store = useStore();

const shouldBeDark = computed(() => {
  const isDarkModeFromStore = store?.state?.setting?.darkMode;
  if (isDarkModeFromStore !== undefined) {
    return isDarkModeFromStore;
  }
  return props.isDark ?? false;
});

const onClick = (color: Color) => emits("click", color.hexColor);
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
