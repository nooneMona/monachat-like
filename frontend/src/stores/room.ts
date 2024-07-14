import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useRoomStore = defineStore("room", () => {
  const roomMetadata = ref<{ id: string; name: string; img_url: string }[]>([]);

  const updateRoomMetadata = (value: { id: string; name: string; img_url: string }[]) => {
    roomMetadata.value = [...value];
  };

  // idでRoomオブジェクトを取得
  const roomObj = computed(() => (id: string | null | undefined) => {
    return roomMetadata.value.filter((r) => r.id === id)[0];
  });

  return {
    roomMetadata,
    updateRoomMetadata,
    roomObj,
  };
});
