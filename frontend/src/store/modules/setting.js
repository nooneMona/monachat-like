const storageKeyPrefix = `/monachatchat`;

const updateValueSessionStorageWithPerpetuation = (state, key, value) => {
  state[key] = value;
  sessionStorage.setItem(`${storageKeyPrefix}/${key}`, value);
};

const getValueSessionStorageWithDefault = (key, defaultValue) =>
  sessionStorage.getItem(`${storageKeyPrefix}/${key}`) ?? defaultValue;

const setting = {
  namespaced: true,
  state: () => ({
    // 一時的に保持する値
    selectedUsersIhashes: [],
    // 永久に保持する値
    log: getValueSessionStorageWithDefault("log", "[]"), // ログ
  }),
  mutations: {
    addSelectedUsersIhash(state, { ihash }) {
      state.selectedUsersIhashes[ihash] = "red";
    },
    deleteSelectedUsersIhash(state, { ihash }) {
      delete state.selectedUsersIhashes[ihash];
    },
    changeSelectedUsersIhashesColor(state, { ihash }) {
      const presetColor = ["red", "blue", "green", "purple", "orange"];
      if (presetColor.indexOf(state.selectedUsersIhashes[ihash]) === presetColor.length - 1) {
        state.selectedUsersIhashes[ihash] = presetColor[0];
      } else {
        state.selectedUsersIhashes[ihash] =
          presetColor[presetColor.indexOf(state.selectedUsersIhashes[ihash]) + 1];
      }
    },
    saveCurrentLog: (state, value) => {
      let cutValue = value;
      const limit = 10000;
      if (value.length > limit) {
        cutValue = value.slice(0, -(value.length - limit));
      }
      const logRawData = JSON.stringify(cutValue);
      updateValueSessionStorageWithPerpetuation(state, "log", logRawData);
    },
  },
  actions: {
    toggleUserSelecting(context, { ihash }) {
      if (context.state.selectedUsersIhashes[ihash]) {
        context.commit("deleteSelectedUsersIhash", { ihash });
      } else {
        context.commit("addSelectedUsersIhash", { ihash });
      }
    },
    changeSelectedUsersColor(context, { ihash }) {
      context.commit("changeSelectedUsersIhashesColor", { ihash });
    },
  },
  getters: {
    loadLog: (state) => {
      return JSON.parse(state.log);
    },
  },
};

export default setting;
