import { useSettingStore } from "../stores/setting";
import { piniaInstance } from "../piniaInstance";

const settingStore = useSettingStore(piniaInstance);

export const indexGetters = {
  // idでRoomオブジェクトを取得
  roomObj: (state) => (id) => {
    if (id == null) {
      return undefined;
    }
    return state.roomMetadata.filter((r) => r.id === id)[0];
  },
  // ログに表示するための順序が考慮されたリスト
  logMessages(state) {
    if (settingStore.isDescendingLog) {
      return state.logMessages.slice().reverse();
    }
    return state.logMessages;
  },
  visibleLogMessages(state, getters) {
    return getters.logMessages
      .filter((e) => !state.ihashsSilentIgnoredByMe[e.ihash])
      .filter((e) => !state.ihashsIgnoredByMe[e.ihash]);
  },
  // 画面に表示されているユーザー
  visibleUsers(state) {
    return Object.keys(state.users)
      .filter((id) => state.users[id].alive)
      .filter((id) => !state.idsIgnoresMe[id])
      .filter((id) => !state.ihashsIgnoredByMe[state.users[id].ihash])
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = state.users[id];
        return result;
      }, {});
  },
  // 設定上表示されているユーザー
  manageableUsers(state) {
    return Object.keys(state.users)
      .filter((id) => state.users[id].alive)
      .filter((id) => !state.idsIgnoresMe[id]) // 自分が無視したユーザーは解除できるべきである
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = state.users[id];
        resultRef[id].isIgnored = state.ihashsIgnoredByMe[state.users[id].ihash] ?? false;
        return result;
      }, {});
  },
  // サイレント無視したユーザー
  silentUsers(state) {
    return Object.keys(state.users)
      .filter((id) => state.ihashsSilentIgnoredByMe[state.users[id].ihash])
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = state.users[id];
        return result;
      }, {});
  },

  idsByIhash(state) {
    const ids = Object.keys(state.users);
    const obj = {};
    ids.forEach((id) => {
      if (obj[state.users[id].ihash] == null) {
        obj[state.users[id].ihash] = [];
      }
      obj[state.users[id].ihash].push(id);
    });
    return obj;
  },
};
