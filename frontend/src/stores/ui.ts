
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface IUI {
  width: number;
  height: number;
  bottomBarHeight: number;
}

export const useUIStore = defineStore('ui', () => {
  const width = ref(1_000);
  const height = ref(500);
  const bottomBarHeight = ref(50);

  return { width, height, bottomBarHeight }
})
