import ChatEntrance from "@/components/pages/ChatEntrance.vue";
import RoomSelection from "@/components/pages/RoomSelection.vue";
import ChatRoom from "@/components/pages/ChatRoom.vue";

export const routes = [
  { name: "entrance", path: "/", component: ChatEntrance },
  { name: "select", path: "/select", component: RoomSelection },
  { path: "/room", redirect: "/select" },
  { name: "room", path: "/room/:id", component: ChatRoom },
];
