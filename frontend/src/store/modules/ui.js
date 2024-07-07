// UIの状態

const ui = {
  namespaced: true,
  state: () => ({
    size: {
      // メインパネルのサイズ
      width: 1000,
      height: 500,
    },
    bottomBarHeight: 50, // 下部のバーの高さ
    requiredRefresh: false, // ブラウザの更新を呼びかけるメッセージの表示有無
  }),
  actions: {},
  getters: {},
};

export default ui;
