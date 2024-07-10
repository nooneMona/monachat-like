// クライアントを使用するユーザーがもつ情報を管理する

const user = {
  namespaced: true,
  state: () => ({
    myToken: null,
    myID: null,
    ihash: null, // サーバーから付与されたihash
    /*
     * ユーザーの状態を復元するために必要な情報
     */
    currentRoom: null, // 現在の部屋(部屋にいない場合はnull)
    x: null, // キャラのX座標
    y: null, // キャラのY座標
  }),
  mutations: {
    updateAuthInfo(state, { id, token }) {
      state.myID = id;
      state.myToken = token;
    },
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
    me(state, _, rootState) {
      return rootState.users[state.myID];
    },
  },
};

export default user;
