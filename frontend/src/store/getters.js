import { piniaInstance } from "../piniaInstance";
import { useUsersStore } from "../stores/users";

const usersStore = useUsersStore(piniaInstance);

export const indexGetters = {
  // 画面に表示されているユーザー
  visibleUsers(state) {
    return Object.keys(state.users)
      .filter((id) => state.users[id].alive)
      .filter((id) => !usersStore.idsIgnoresMe[id])
      .filter((id) => !usersStore.ihashsIgnoredByMe[state.users[id].ihash])
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
      .filter((id) => !usersStore.idsIgnoresMe[id]) // 自分が無視したユーザーは解除できるべきである
      .reduce((result, id) => {
        const resultRef = result;
        resultRef[id] = state.users[id];
        resultRef[id].isIgnored = usersStore.ihashsIgnoredByMe[state.users[id].ihash] ?? false;
        return result;
      }, {});
  },
  // サイレント無視したユーザー
  silentUsers(state) {
    return Object.keys(state.users)
      .filter((id) => usersStore.ihashsSilentIgnoredByMe[state.users[id].ihash])
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
