<template>
  <div class="rooms">
    <template v-for="rooms in roomsColumns" :key="rooms">
      <div class="rooms-column">
        <template v-for="room in rooms" :key="room.id">
          <div class="room-cell">
            <div class="room-button-frame">
              <Button :title="room.name" @onClick="onClick(room)" :textSize="16" />
            </div>
            <SpanText :text="`${roomCount[room.id] ?? 0}人`" :size="18" />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, toRefs } from "vue";
import Button from "@/components/atoms/Button.vue";
import SpanText from "@/components/atoms/SpanText.vue";

const split = (array, n) =>
  array.reduce(
    (a, c, i) => (i % n === 0 ? [...a, [c]] : [...a.slice(0, -1), [...a[a.length - 1], c]]),
    []
  );

export default {
  components: { Button, SpanText },
  props: {
    rooms: {
      type: Array,
    },
    roomCount: {
      type: Object,
    },
  },
  emits: ["clickRoom"],
  setup(props, { emit }) {
    const { rooms } = toRefs(props);

    const roomsColumns = computed(() => split(rooms.value, 10));
    const onClick = (room) => {
      emit("clickRoom", room);
    };
    return { onClick, roomsColumns };
  },
};
</script>

<style scoped>
.rooms {
  width: 100%;
  height: 100%;
  display: flex;
}
.rooms-column {
  width: 33%;
}

.room-cell {
  display: flex;
  margin: 5px 10px;
  justify-content: center;
}

.room-button-frame {
  width: 70%;
  height: 30px;
  margin-right: 5px;
}
</style>
