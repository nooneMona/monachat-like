// クライアントを使用するユーザーがもつ情報を管理する

const user = {
  namespaced: true,
  state: () => ({
    /*
     * ユーザーの認可
     * [Client(s)]                [Server]
     *    | ------- request -------> |
     *    |                   [ create account ]
     *    | <----- token+ID -------- |
     *    | ---- request+token ----> |
     *    |                    [ valid account ]
     *    |                 [ process something  ]
     *   (s) <---- response+ID ------|
     */
    myToken: null, // サーバーから付与されたトークン
    myID: null, // サーバから付与されたID
    ihash: null, // サーバーから付与されたihash
    disconnected: false, // サーバーから切断されているかどうか
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
    updateDisconnected(state, { disconnected }) {
      state.disconnected = disconnected;
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
    // 表示するためのID文字列
    displayedMyID: (state) => (end) => {
      if (state.myID == null) {
        return "";
      }
      return state.myID.slice(0, end);
    },
    // ユーザー自身のユーザー情報
    me(state, _, rootState) {
      return rootState.users[state.myID];
    },
  },
};

export default user;
