import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useRoomStore = defineStore("room", () => {
  // 部屋のメタデータ
  const roomMetadata = ref<{ id: string; name: string; img_url: string }[]>([]);
  // 部屋の人数情報
  const rooms = ref<{ [key in string]: number }>({});

  const updateRoomMetadata = (value: { id: string; name: string; img_url: string }[]) => {
    roomMetadata.value = [...value];
  };
  const updateRooms = (countParam: { rooms: { n: string; c: string }[] }) => {
    const newRooms: { [key in string]: number } = {};
    countParam.rooms.forEach((r) => {
      newRooms[r.n] = parseInt(r.c);
    });
    rooms.value = { ...newRooms };
  };

  // idでRoomオブジェクトを取得
  const roomObj = computed(() => (id: string | null | undefined) => {
    return roomMetadata.value.filter((r) => r.id === id)[0];
  });

  return {
    roomMetadata,
    updateRoomMetadata,
    rooms,
    updateRooms,
    roomObj,
  };
});
