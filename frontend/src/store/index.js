import moment from "moment";
import axios from "axios";
import { createStore } from "vuex";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import { indexGetters } from "@/store/getters";
import Color from "../stores/color";
import { piniaInstance } from "../piniaInstance";
import { useNoticeStore } from "@/stores/notice";
import { useUIStore } from "../stores/ui";
import { useSettingStore } from "@/stores/setting";
import { useUserStore } from "../stores/user";

const noticeStore = useNoticeStore(piniaInstance);
const uiStore = useUIStore(piniaInstance);
const settingStore = useSettingStore(piniaInstance);
const userStore = useUserStore(piniaInstance);

export default createStore({
  // strict: import.meta.env.NODE_ENV !== "production",
  state() {
    return {
      socket: null, // socket.ioのクライアント
      users: {}, // 現在のコンテキストにいるユーザー
      roomMetadata: [], // 部屋情報
      rooms: {}, // 部屋の人数情報
      chatMessages: {}, // 吹き出し
      logMessages: [], // ログ
      ihashsIgnoredByMe: {}, // 自分が無視したユーザーリスト
      idsIgnoresMe: {}, // 自分が無視されたユーザーリスト
      ihashsSilentIgnoredByMe: {},
      currentPathName: null, // 現在の部屋（Vue routerの値を同期するためのもの）
    };
  },
  getters: indexGetters,
  mutations: {
    updateRoomMetadata(state, array) {
      state.roomMetadata = array;
    },
    appendLog(state, logObj) {
      const MAX_LOG_LENGTH = 1_000;
      if (settingStore.isInfiniteLog) {
        state.logMessages = [logObj, ...state.logMessages];
        return;
      }
      state.logMessages = [logObj, ...state.logMessages.slice(0, MAX_LOG_LENGTH - 1)];
    },
    resetLog(state) {
      state.logMessages.splice(0);
    },
    initializeSocket(state) {
      state.socket = io(import.meta.env.VITE_APP_SOCKET_HOST, {
        path: "/monachatchat/",
        withCredentials: true,
        reconnectionDelay: 200,
        closeOnBeforeunload: false,
      });
    },
    updateRooms(state, countParam) {
      const rooms = {};
      countParam.rooms.forEach((e) => {
        rooms[e.n] = e.c;
      });
      state.rooms = rooms;
    },
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
    updateUserIgnore(state, { id, stat, ihash }) {
      const ignores = stat === "on"; // offでもなかった場合は無視を解除する
      if (id === userStore.myID) {
        state.ihashsIgnoredByMe[ihash] = ignores;
        // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
      }
      if (ihash === userStore.ihash) {
        state.idsIgnoresMe[id] = ignores;
        // TODO: 無視から戻ったときに吹き出しが表示される問題の暫定対応
        state.chatMessages[id] = [];
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
    updateUserSilentIgnore(state, { ihash, isActive }) {
      state.ihashsSilentIgnoredByMe[ihash] = isActive;
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
    appendChatMessage(state, { id, message }) {
      if (state.chatMessages[id] === undefined) {
        state.chatMessages[id] = [];
      }
      // NOTE: どう追加するかは吹き出しの重なり方が依存する
      // ref: https://developer.mozilla.org/ja/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_without_z-index
      state.chatMessages[id].push({ messageID: uuidv4(), ...message });
    },
    removeChatMessage(state, { characterID, messageID }) {
      const index = state.chatMessages[characterID].findIndex((v) => v.messageID === messageID);
      state.chatMessages[characterID].splice(index, 1);
    },
    removeChatMessages(state, { id }) {
      state.chatMessages[id] = [];
    },
    resetChatMessages(state) {
      state.chatMessages = {};
    },
    resetUsers(state) {
      state.users = {};
    },
    updateCurrentPathName(state, { name }) {
      state.currentPathName = name;
    },
  },
  actions: {
    async loadPreData({ commit }) {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_HOST}api/rooms`);
      commit("updateRoomMetadata", res.data.rooms);
    },
    registerSocketEvents({ state, commit, dispatch }) {
      state.socket.on("connect", () => {
        userStore.updateDisconnected(false);
        dispatch("receivedConnect");
      });
      state.socket.on("disconnect", () => {
        userStore.updateDisconnected(true);
      });
      state.socket.on("COM", (param) => {
        dispatch("receivedCOM", param);
      });
      state.socket.on("ENTER", (param) => {
        dispatch("receivedENTER", param);
        commit("updateUserDispLocation", { id: param.id });
      });
      state.socket.on("SET", (param) => {
        commit("updateUserBySet", param);
        commit("updateUserDispLocation", { id: param.id });
      });
      state.socket.on("IG", (param) => {
        commit("updateUserIgnore", param);
        dispatch("removeChatMessagesIgnored", { id: param.id, ihash: param.ihash });
      });
      state.socket.on("EXIT", (param) => {
        dispatch("receivedEXIT", {
          id: param.id,
          isEnter: false,
        });
      });
      state.socket.on("USER", (param) => {
        commit("initializeUsers", param);
      });
      state.socket.on("COUNT", (param) => {
        commit("updateRooms", param);
      });
      state.socket.on("AUTH", ({ id, token }) => {
        dispatch("receivedAUTH", {
          id,
          token,
        });
      });
      state.socket.on("SLEEP", (param) => {
        commit("updateUserExistence", { id: param.id, exists: false });
        commit("removeChatMessages", { id: param.id });
      });
      state.socket.on("AWAKE", (param) => {
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
      context.commit("appendLog", { head, content, foot, visibleOnReceived, color, ihash });
      settingStore.saveCurrentLog(context.state.logMessages);
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
      context.commit("appendLog", { head, content, foot, visibleOnReceived, color, ihash });
      settingStore.saveCurrentLog(context.state.logMessages);
    },
    // トリップ付き名前文字列`text`を分解しsetting.name, .tripに保管
    parseNameWithTrip(_, { text }) {
      let name = "";
      let trip = "";
      if (text.includes("#")) {
        const splitNames = text.split("#");
        [name] = splitNames;
        trip = splitNames.slice(1).join("#");
      } else {
        // トリップの予約語 `#` が含まれていない場合
        name = text;
      }
      name = name.trim() === "" ? "名無しさん" : name;
      settingStore.updateSavedName(name);
      settingStore.updateSavedTrip(trip);
    },
    resetLogStorage({ state, commit }) {
      commit("resetLog");
      settingStore.saveCurrentLog(state.logMessages);
    },
    enterName({ state }) {
      // ローカルストレージの内容に頼る
      const trip = settingStore.savedTrip;
      let name = settingStore.savedName;
      name = name.trim() === "" ? "名無しさん" : name;
      const enterParams = {
        room: "/MONA8094",
        attrib: "no",
        name,
        trip,
      };
      if (userStore.myToken !== null) {
        // すでにトークンを取得している場合はトークンを付加する
        enterParams.token = userStore.myToken;
      }
      state.socket.emit("ENTER", enterParams);
      settingStore.updateSavedName(name);
      settingStore.updateSavedTrip(trip);
      const log = settingStore.loadedLogFromStorage;
      if (state.logMessages.length === 0 && log.length !== 0) {
        state.logMessages = log;
      }
    },
    enter({ state }, { room }) {
      const hexColor = settingStore.savedColor;
      const { r, g, b } = Color.hexToMonaRGB(hexColor);
      const randomX = Math.floor(Math.random() * uiStore.width);
      const defaultY = uiStore.height - 150;
      const x = userStore.x ?? randomX;
      const y = userStore.y ?? defaultY;
      state.socket.emit("ENTER", {
        token: userStore.myToken,
        room: room.id,
        x,
        y,
        scl: 100,
        stat: "通常",
        name: settingStore.savedName,
        trip: settingStore.savedTrip,
        r,
        g,
        b,
        type: settingStore.savedType,
      });
      const log = settingStore.loadedLogFromStorage;
      if (state.logMessages.length === 0 && log.length !== 0) {
        state.logMessages = log;
      }
      userStore.updateCurrentRoom(room);
      userStore.updateCoordinate({ x, y });
    },
    exit(context) {
      context.state.socket.emit("EXIT", {
        token: userStore.myToken,
      });
    },
    com(context, { text, shift, typing }) {
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
      context.state.socket.emit("COM", comParam);
    },
    setXY(context, { x, y }) {
      const { scl, stat } = context.state.users[userStore.myID];
      context.state.socket.emit("SET", {
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
      context.state.socket.emit("SET", {
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
      context.state.socket.emit("SET", {
        token: userStore.myToken,
        x,
        y,
        scl: newScl,
        stat,
      });
    },
    sendError(context, { text }) {
      context.state.socket.emit("ERROR", {
        text: JSON.stringify(text),
      });
    },
    receivedConnect({ state }) {
      if (userStore.myToken == null) {
        return;
      }
      state.socket.emit("AUTH", {
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
        context.commit("appendChatMessage", { id, message });
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
      context.commit("removeChatMessages", { id });
    },
    receivedAUTH({ commit, dispatch }, { id, token }) {
      if (id === "error") {
        dispatch("returnFromAUTHError");
      }
      userStore.updateAuthInfo(id, token);
      commit("updateUserExistence", { id, exists: true });
    },
    returnFromAUTHError({ state, dispatch }) {
      if (state.currentPathName === "room") {
        dispatch("enter", {
          room: userStore.currentRoom,
          isReturned: true,
        });
      }
      if (state.currentPathName === "select") {
        dispatch("enter", {
          room: "/MONA8094",
        });
      }
      noticeStore.requestRefresh();
    },
    removeChatMessagesIgnored(context, { id, ihash }) {
      if (id === userStore.myID) {
        context.getters.idsByIhash[ihash].forEach((targetId) => {
          context.commit("removeChatMessages", { id: targetId });
        });
      }
    },
    removeChatMessagesSilentIgnored(context, { ihash, isActive }) {
      if (isActive) {
        context.getters.idsByIhash[ihash].forEach((targetId) => {
          context.commit("removeChatMessages", { id: targetId });
        });
      }
    },
    toggleIgnorance(context, { ihash }) {
      if (ihash === userStore.ihash) {
        return;
      }
      const newIgnores = !context.state.ihashsIgnoredByMe[ihash];
      context.state.socket.emit("IG", {
        token: userStore.myToken,
        stat: newIgnores ? "on" : "off",
        ihash,
      });
    },
    toggleSilentIgnorance(context, { ihash, isActive }) {
      if (ihash === userStore.ihash) {
        return;
      }
      context.commit("updateUserSilentIgnore", { ihash, isActive });
      context.dispatch("removeChatMessagesSilentIgnored", { ihash, isActive });
    },
    simulateReconnection({ state }) {
      state.socket.disconnect();
      setTimeout(() => {
        state.socket.connect();
      }, 3000);
    },
    suicide({ state }) {
      state.socket.emit("SUICIDE", {
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
