<template>
  <div class="rooms">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <template v-for="roomsColumn in roomsColumns" :key="roomsColumn">
      <div class="rooms-column">
        <template v-for="room in roomsColumn" :key="room.id">
          <div class="room-cell">
            <div class="room-button-frame">
              <SimpleButton :title="room.name" :text-size="16" @click="onClick(room)" />
            </div>
            <SpanText :text="`${roomCount[room.id] ?? 0}人`" :size="18" />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SimpleButton from "@/components/atoms/SimpleButton.vue";
import SpanText from "@/components/atoms/SpanText.vue";
import { RoomResponse } from "@/infrastructure/api";

type Room = RoomResponse["rooms"][number];
const props = withDefaults(
  defineProps<{
    rooms: Room[];
    roomCount: { [key: string]: number };
  }>(),
  {},
);

const emits = defineEmits<{ (e: "click-room", room: Room): void }>();

const chunk = <T,>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, (i + 1) * size),
  );
};

const roomsColumns = computed(() => chunk(props.rooms, 10) as Room[][]);

const onClick = (room: Room) => {
  emits("click-room", room);
};
</script>

<style scoped lang="scss">
.rooms {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .rooms-column {
    width: calc(100% / 3);
    display: flex;
    flex-direction: column;
    row-gap: 5px;

    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;

    .room-cell {
      display: flex;
      flex-direction: row;
      column-gap: 7px;

      .room-button-frame {
        width: 70%;
        height: 30px;
      }
    }
  }
}
</style>
