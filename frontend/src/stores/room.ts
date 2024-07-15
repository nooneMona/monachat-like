import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { COUNTResParam } from "../socketIOInstance";

export const useRoomStore = defineStore("room", () => {
  // 部屋のメタデータ
  const roomMetadata = ref<{ id: string; name: string; img_url: string }[]>([]);
  // 部屋の人数情報
  const rooms = ref<{ [key in string]: number }>({});

  const updateRooms = (countParam: COUNTResParam) => {
    const newRooms: { [key in string]: number } = {};
    countParam.rooms.forEach((r) => {
      newRooms[r.n] = r.c;
    });
    rooms.value = { ...newRooms };
  };
  const syncRoomMetadata = async () => {
    const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/rooms`);
    roomMetadata.value = [...res.data.rooms];
  };

  // idでRoomオブジェクトを取得
  const roomObj = computed(() => (id: string | null | undefined) => {
    return roomMetadata.value.filter((r) => r.id === id)[0];
  });

  return {
    roomMetadata,
    syncRoomMetadata,
    rooms,
    updateRooms,
    roomObj,
  };
});
