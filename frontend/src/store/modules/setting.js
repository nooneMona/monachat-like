const storageKeyPrefix = `/monachatchat`;
const TRUE = "true";
const FALSE = "false";

const updateValueSessionStorageWithPerpetuation = (state, key, value) => {
  state[key] = value;
  sessionStorage.setItem(`${storageKeyPrefix}/${key}`, value);
};

// Stateに保存しつつ、LocalStorageにも保存する(Bool型のみ)
const updateBooleanValueWithPerpetuation = (state, key, value) => {
  state[key] = value;
  const serializedValue = value ? TRUE : FALSE;
  localStorage.setItem(`${storageKeyPrefix}/${key}`, serializedValue);
};

const getValueSessionStorageWithDefault = (key, defaultValue) =>
  sessionStorage.getItem(`${storageKeyPrefix}/${key}`) ?? defaultValue;
const getBooleanValueWithDefault = (key, defaultValue) => {
  const serializedValue = localStorage.getItem(`${storageKeyPrefix}/${key}`);
  if (![TRUE, FALSE].includes(serializedValue)) {
    return defaultValue;
  }
  return serializedValue === TRUE;
};

const setting = {
  namespaced: true,
  state: () => ({
    // 一時的に保持する値
    selectedUsersIhashes: [],
    // 永久に保持する値
    kbMode: getBooleanValueWithDefault("kbMode", false), // KBモード ON/OFF
    typingMode: getBooleanValueWithDefault("typingMode", true), // タイピングモード ON/OFF
    scrollableLog: getBooleanValueWithDefault("scrollableLog", false),
    descendingLog: getBooleanValueWithDefault("descendingLog", false),
    drawBorderBottomLog: getBooleanValueWithDefault("drawBorderBottomLog", false),
    logInfinite: getBooleanValueWithDefault("logInfinite", true), // ログを無限に保存するか
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
    updateKBMode: (state, value) => updateBooleanValueWithPerpetuation(state, "kbMode", value),
    updateTypingMode: (state, value) =>
      updateBooleanValueWithPerpetuation(state, "typingMode", value),
    updateScrollableLog: (state, value) =>
      updateBooleanValueWithPerpetuation(state, "scrollableLog", value),
    updateDescendingLog: (state, value) =>
      updateBooleanValueWithPerpetuation(state, "descendingLog", value),
    updateDrawBorderBottomLog: (state, value) =>
      updateBooleanValueWithPerpetuation(state, "drawBorderBottomLog", value),
    updateLogInfinite: (state, value) =>
      updateBooleanValueWithPerpetuation(state, "logInfinite", value),
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
