
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface IUI {
  width: number
  height: number
}

export const useUIStore = defineStore('ui', () => {
  const width = ref(1_000);
  const height = ref(500);

  return { width, height }
})
