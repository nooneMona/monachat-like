// クライアントを使用するユーザーがもつ情報を管理する
import { useUserStore } from "../../stores/user";
import { piniaInstance } from "../../piniaInstance";

const userStore = useUserStore(piniaInstance);
const user = {
  namespaced: true,
  state: () => ({
    ihash: null, // サーバーから付与されたihash
  }),
  mutations: {
    updateIhash(state, { ihash }) {
      state.ihash = ihash;
    },
  },
  getters: {
    // ユーザー自身のユーザー情報
    me(_, __, rootState) {
      return rootState.users[userStore.myID];
    },
  },
};

export default user;
