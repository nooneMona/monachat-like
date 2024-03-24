const developer = {
  namespaced: true,
  state: () => ({
    isVisibleFrame: false,
  }),
  mutations: {
    updateIsVisibleFrame(state, value) {
      state.isVisibleFrame = value;
    },
  },
  actions: {},
  getters: {},
};

export default developer;
