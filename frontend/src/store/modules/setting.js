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
    // 永久に保持する値
    log: getValueSessionStorageWithDefault("log", "[]"), // ログ
  }),
  mutations: {
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
  getters: {
    loadLog: (state) => {
      return JSON.parse(state.log);
    },
  },
};

export default setting;
