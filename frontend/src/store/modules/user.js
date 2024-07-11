// クライアントを使用するユーザーがもつ情報を管理する
import { useUserStore } from "../../stores/user";
import { piniaInstance } from "../../piniaInstance";

const userStore = useUserStore(piniaInstance);
const user = {
  namespaced: true,
  state: () => ({
    ihash: null, // サーバーから付与されたihash
    /*
     * ユーザーの状態を復元するために必要な情報
     */
    currentRoom: null, // 現在の部屋(部屋にいない場合はnull)
    x: null, // キャラのX座標
    y: null, // キャラのY座標
  }),
  mutations: {
    updateIhash(state, { ihash }) {
      state.ihash = ihash;
    },
    updateCurrentRoom(state, { room }) {
      state.currentRoom = room;
    },
    updateCoordinate: (state, { x, y }) => {
      state.x = x;
      state.y = y;
    },
  },
  actions: {},
  getters: {
    // ユーザー自身のユーザー情報
    me(_, __, rootState) {
      return rootState.users[userStore.myID];
    },
  },
};

export default user;
