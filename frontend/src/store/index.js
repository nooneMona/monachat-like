import moment from "moment";
import { createStore } from "vuex";
import { indexGetters } from "@/store/getters";
import Color from "../stores/color";
import { piniaInstance } from "../piniaInstance";
import { useNoticeStore } from "@/stores/notice";
import { useUIStore } from "../stores/ui";
import { useSettingStore } from "@/stores/setting";
import { useUserStore } from "../stores/user";
import { useUsersStore } from "../stores/users";
import { useRoomStore } from "../stores/room";
import { useLogStore } from "../stores/log";
import { socketIOInstance } from "../socketIOInstance";

const noticeStore = useNoticeStore(piniaInstance);
const uiStore = useUIStore(piniaInstance);
const settingStore = useSettingStore(piniaInstance);
const userStore = useUserStore(piniaInstance);
const usersStore = useUsersStore(piniaInstance);
const roomStore = useRoomStore(piniaInstance);
const logStore = useLogStore(piniaInstance);

export default createStore({
  // strict: import.meta.env.NODE_ENV !== "production",
  state() {
    return {
      users: {}, // 現在のコンテキストにいるユーザー
    };
  },
  getters: indexGetters,
  mutations: {
    initializeUsers(state, users) {
      state.users = {};
      users.forEach((userObj) => {
        const { id } = userObj;
        let userRef = state.users[id];
        if (!userRef) {
          // 初めてみかけたIDがあったらキャラのプロパティを作成する
          state.users[id] = {};
          userRef = state.users[id];
        }
        userRef.x = userObj.x;
        userRef.y = userObj.y;
        userRef.dispX = userObj.x;
        userRef.dispY = userObj.y;
        userRef.scl = userObj.scl;
        userRef.stat = userObj.stat;
        userRef.trip = userObj.trip;
        userRef.ihash = userObj.ihash;
        userRef.name = userObj.name;
        userRef.rgbaValue = Color.monaRGBToCSS({ r: userObj.r, g: userObj.g, b: userObj.b }, 1.0);
        userRef.hexValue = Color.monaRGBToHex({ r: userObj.r, g: userObj.g, b: userObj.b });
        userRef.type = userObj.type;
        userRef.isMobile = userObj.isMobile;
        userRef.alive = true;
      });
    },
    updateUserByEnter(state, userObj) {
      const { id } = userObj;
      let userRef = state.users[id];
      if (!userRef) {
        // 初めてみかけたIDがあったらキャラのプロパティを作成する
        state.users[id] = {};
        userRef = state.users[id];
      }
      userRef.x = userObj.x;
      userRef.y = userObj.y;
      userRef.scl = userObj.scl;
      userRef.stat = userObj.stat;
      userRef.trip = userObj.trip;
      userRef.ihash = userObj.ihash;
      userRef.name = userObj.name;
      userRef.rgbaValue = Color.monaRGBToCSS({ r: userObj.r, g: userObj.g, b: userObj.b }, 1.0);
      userRef.hexValue = Color.monaRGBToHex({ r: userObj.r, g: userObj.g, b: userObj.b });
      userRef.type = userObj.type;
      userRef.isMobile = userObj.isMobile;
      userRef.alive = true;
    },
    updateUserBySet(state, userObj) {
      const { id } = userObj;
      const userRef = state.users[id];
      userRef.x = userObj.x;
      userRef.y = userObj.y;
      userRef.scl = userObj.scl;
      userRef.stat = userObj.stat;
      userRef.alive = true;
    },
    updateUserIgnore(_, { id, stat, ihash }) {
      const ignores = stat === "on"; // offでもなかった場合は無視を解除する
      if (id === userStore.myID) {
        // 自分が無視した場合
        usersStore.updateUserIgnore(ihash, ignores);
        // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
      }
      if (ihash === userStore.ihash) {
        // 自分が無視された場合
        usersStore.updateIDsIgnoresMe(id, ignores);
        // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
        usersStore.removeChatMessages(id);
      }
    },
    // キャラの座標とサイズから実際の表示座標を更新する
    // サイズが未定の場合はwidthとheightに0を入れる
    updateUserDispLocation(state, { id }) {
      const userRef = state.users[id];
      if (userRef.x < 0) {
        userRef.dispX = 0;
      } else if (userRef.x > uiStore.width - userRef.width) {
        userRef.dispX = uiStore.width - userRef.width;
      } else {
        userRef.dispX = userRef.x;
      }
      if (userRef.y < uiStore.height / 3) {
        userRef.dispY = uiStore.height / 3;
      } else if (userRef.y > uiStore.height - userRef.height - uiStore.bottomBarHeight) {
        userRef.dispY = uiStore.height - userRef.height - uiStore.bottomBarHeight;
      } else {
        userRef.dispY = userRef.y;
      }
    },
    updateUserExistence(state, { id, exists }) {
      const userRef = state.users[id];
      if (!userRef) return;
      userRef.alive = exists;
    },
    updateUserSize(state, { id, width, height }) {
      const userRef = state.users[id];
      if (!userRef) return;
      userRef.width = width;
      userRef.height = height;
    },
    resetUsers(state) {
      state.users = {};
    },
  },
  actions: {
    registerSocketEvents({ commit, dispatch }) {
      socketIOInstance.on("connect", () => {
        userStore.updateDisconnected(false);
        dispatch("receivedConnect");
      });
      socketIOInstance.on("disconnect", () => {
        userStore.updateDisconnected(true);
      });
      socketIOInstance.on("COM", (param) => {
        dispatch("receivedCOM", param);
      });
      socketIOInstance.on("ENTER", (param) => {
        dispatch("receivedENTER", param);
        commit("updateUserDispLocation", { id: param.id });
      });
      socketIOInstance.on("SET", (param) => {
        commit("updateUserBySet", param);
        commit("updateUserDispLocation", { id: param.id });
      });
      socketIOInstance.on("IG", (param) => {
        commit("updateUserIgnore", param);
        dispatch("removeChatMessagesIgnored", { id: param.id, ihash: param.ihash });
      });
      socketIOInstance.on("EXIT", (param) => {
        dispatch("receivedEXIT", {
          id: param.id,
          isEnter: false,
        });
      });
      socketIOInstance.on("USER", (param) => {
        commit("initializeUsers", param);
      });
      socketIOInstance.on("COUNT", (param) => {
        roomStore.updateRooms(param);
      });
      socketIOInstance.on("AUTH", ({ id, token }) => {
        dispatch("receivedAUTH", {
          id,
          token,
        });
      });
      socketIOInstance.on("SLEEP", (param) => {
        commit("updateUserExistence", { id: param.id, exists: false });
        usersStore.removeChatMessages(param.id);
      });
      socketIOInstance.on("AWAKE", (param) => {
        commit("updateUserExistence", { id: param.id, exists: true });
      });
    },
    appendLog(context, { id, cmt, typing }) {
      const name = context.getters.visibleUsers[id]?.name;
      const nameString = name ?? "不明";
      const trip = context.getters.visibleUsers[id]?.trip;
      const ihash = context.getters.visibleUsers[id]?.ihash;
      let tripString = "";
      if (trip) {
        tripString = `◆${trip.slice(0, 10)}`;
      } else {
        tripString = `◇${ihash?.slice(0, 6)}`;
      }
      const dateString = moment().format("MM/DD　HH:mm:ss");
      const head = `${nameString}${tripString} (ID:${id.slice(0, 3)}): `;
      const content = cmt;
      let kpmText = "";
      if (typing !== undefined) {
        const kpm = Math.floor((60 * typing.count) / (typing.milliTime / 1000));
        kpmText = ` (${kpm}KPM)`;
      }
      const foot = ` [${dateString}]${kpmText}`;
      const visibleOnReceived = document.visibilityState === "visible";
      const color =
        context.getters.visibleUsers[id]?.rgbaValue ??
        Color.monaRGBToCSS({ r: 255, g: 255, b: 255 }, 1.0);
      logStore.appendLog({ head, content, foot, visibleOnReceived, color, ihash });
      settingStore.saveCurrentLog(logStore.logs);
    },
    appendUserLog(context, { id, isEnter }) {
      const name = context.getters.visibleUsers[id]?.name;
      const nameString = name ?? "不明";
      const trip = context.getters.visibleUsers[id]?.trip;
      const ihash = context.getters.visibleUsers[id]?.ihash;
      let tripString = "";
      if (trip) {
        tripString = `◆${trip.slice(0, 10)}`;
      } else {
        tripString = `◇${ihash?.slice(0, 6)}`;
      }
      const dateString = moment().format("MM/DD　HH:mm:ss");
      let announce;
      let symbol;
      if (isEnter) {
        announce = "が入室しました";
        symbol = "□";
      } else {
        announce = "が退室しました";
        symbol = "■";
      }
      const head = `${symbol} ${nameString}${tripString} (ID:${id.slice(0, 3)}): `;
      const content = announce;
      const foot = ` [${dateString}] ${symbol}`;
      const visibleOnReceived = document.visibilityState === "visible";
      const color =
        context.getters.visibleUsers[id]?.rgbaValue ??
        Color.monaRGBToCSS({ r: 255, g: 255, b: 255 }, 1.0);
      logStore.appendLog({ head, content, foot, visibleOnReceived, color, ihash });
      settingStore.saveCurrentLog(logStore.logs);
    },
    com(_, { text, shift, typing }) {
      const comParam = {
        token: userStore.myToken,
        cmt: text,
      };
      if (shift) {
        comParam.style = 2;
      }
      if (settingStore.isTypingMode && typing !== undefined) {
        comParam.typing = { ...typing };
      }
      socketIOInstance.emit("COM", comParam);
    },
    setXY(context, { x, y }) {
      const { scl, stat } = context.state.users[userStore.myID];
      socketIOInstance.emit("SET", {
        token: userStore.myToken,
        x,
        y,
        scl,
        stat,
      });
      userStore.updateCoordinate({ x, y });
    },
    setStat(context, { stat }) {
      const { x, y, scl } = context.state.users[userStore.myID];
      socketIOInstance.emit("SET", {
        token: userStore.myToken,
        x,
        y,
        scl,
        stat,
      });
    },
    setScl(context) {
      const { x, y, scl, stat } = context.state.users[userStore.myID];
      const newScl = scl === 100 ? -100 : 100;
      socketIOInstance.emit("SET", {
        token: userStore.myToken,
        x,
        y,
        scl: newScl,
        stat,
      });
    },
    sendError(_, { text }) {
      socketIOInstance.emit("ERROR", {
        text: JSON.stringify(text),
      });
    },
    receivedConnect() {
      if (userStore.myToken == null) {
        return;
      }
      socketIOInstance.emit("AUTH", {
        token: userStore.myToken,
      });
    },
    receivedCOM(context, { id, cmt, style, typing }) {
      context.commit("updateUserExistence", { id, exists: true });
      if (context.getters.visibleUsers[id] === undefined) return;
      if (context.getters.silentUsers[id] != null) return;
      context.dispatch("playCOMAudio");
      const message = {
        id,
        cmt,
        style,
        typing,
      };
      // フォーカスから外れているときに吹き出しをためない
      if (document.visibilityState === "visible") {
        usersStore.appendChatMessage(id, message);
      }
      context.dispatch("appendLog", message);
      context.commit("updateUserExistence", { id, exists: true });
    },
    receivedENTER(context, param) {
      context.commit("updateUserByEnter", param);
      if (param.id === userStore.myID) {
        settingStore.updateTripResult(param.trip);
        userStore.updateIhash(param.ihash);
      }
      if (context.getters.visibleUsers[param.id] === undefined) return;
      if (userStore.currentRoom !== null) {
        context.dispatch("playENTERAudio");
      }
      context.dispatch("appendUserLog", {
        id: param.id,
        isEnter: true,
      });
    },
    async receivedEXIT(context, { id, isEnter }) {
      if (context.getters.visibleUsers[id] !== undefined) {
        if (userStore.currentRoom !== null) {
          context.dispatch("playENTERAudio");
        }
        // visibleUsersに退室を反映する前にログに書き出さないと、名前の情報がとれない。
        await context.dispatch("appendUserLog", {
          id,
          isEnter,
        });
      }
      context.commit("updateUserExistence", { id, exists: false });
      usersStore.removeChatMessages(id);
    },
    receivedAUTH({ commit, dispatch }, { id, token }) {
      if (id === "error") {
        dispatch("returnFromAUTHError");
      }
      userStore.updateAuthInfo(id, token);
      commit("updateUserExistence", { id, exists: true });
    },
    returnFromAUTHError() {
      if (userStore.currentPathName === "room") {
        userStore.enter(userStore.currentRoom);
      }
      if (userStore.currentPathName === "select") {
        userStore.enterName();
      }
      noticeStore.requestRefresh();
    },
    removeChatMessagesIgnored(context, { id, ihash }) {
      if (id === userStore.myID) {
        context.getters.idsByIhash[ihash].forEach((targetId) => {
          usersStore.removeChatMessages(targetId);
        });
      }
    },
    removeChatMessagesSilentIgnored(context, { ihash, isActive }) {
      if (isActive) {
        context.getters.idsByIhash[ihash].forEach((targetId) => {
          usersStore.removeChatMessages(targetId);
        });
      }
    },
    toggleIgnorance(_, { ihash }) {
      if (ihash === userStore.ihash) {
        return;
      }
      const newIgnores = !usersStore.ihashsIgnoredByMe[ihash];
      socketIOInstance.emit("IG", {
        token: userStore.myToken,
        stat: newIgnores ? "on" : "off",
        ihash,
      });
    },
    toggleSilentIgnorance(context, { ihash, isActive }) {
      if (ihash === userStore.ihash) {
        return;
      }
      usersStore.updateUserSilentIgnore(ihash, isActive);
      context.dispatch("removeChatMessagesSilentIgnored", { ihash, isActive });
    },
    simulateReconnection() {
      socketIOInstance.disconnect();
      setTimeout(() => {
        socketIOInstance.connect();
      }, 3000);
    },
    suicide() {
      socketIOInstance.emit("SUICIDE", {
        token: userStore.myToken,
      });
    },
    playCOMAudio() {
      if (settingStore.selectedVolume === "off") return;
      const music = new Audio("sound/mojachat5l1.mp3");
      music.play();
    },
    playENTERAudio() {
      if (settingStore.selectedVolume === "off") return;
      const music = new Audio("sound/mojachat5l0.mp3");
      music.play();
    },
    reloadPage() {
      window.location.reload();
    },
  },
});
