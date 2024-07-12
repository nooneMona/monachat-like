import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";

export interface ISetting {
  isDarkMode: boolean;
}

const storageKeyPrefix = `/monachatchat`;
type StorageKey =
  | "name"
  | "trip"
  | "type"
  | "color"
  | "tripResult"
  | "darkMode"
  | "sound"
  | "kbMode"
  | "typingMode"
  | "scrollableLog"
  | "descendingLog"
  | "drawBorderBottomLog"
  | "logInfinite";
const TRUE = "true";
const FALSE = "false";

const getBooleanValueWithDefault = (key: StorageKey, defaultValue: boolean) => {
  const serializedValue = localStorage.getItem(`${storageKeyPrefix}/${key}`);
  if (serializedValue !== null && ![TRUE, FALSE].includes(serializedValue)) {
    return defaultValue;
  }
  return serializedValue === TRUE;
};
const updateBooleanValueWithPerpetuation = (ref: Ref<boolean>, key: StorageKey, value: boolean) => {
  ref.value = value;
  const serializedValue = value ? TRUE : FALSE;
  localStorage.setItem(`${storageKeyPrefix}/${key}`, serializedValue);
};
const getValueWithDefault = (key: StorageKey, defaultValue: string) =>
  localStorage.getItem(`${storageKeyPrefix}/${key}`) ?? defaultValue;
const updateValueWithPerpetuation = (ref: Ref<string>, key: StorageKey, value: string) => {
  ref.value = value;
  localStorage.setItem(`${storageKeyPrefix}/${key}`, value);
};

export const useSettingStore = defineStore("setting", () => {
  // キャラクター情報
  const savedName = ref(getValueWithDefault("name", ""));
  const updateSavedName = (value: string) => updateValueWithPerpetuation(savedName, "name", value);
  const savedTrip = ref(getValueWithDefault("trip", ""));
  const updateSavedTrip = (value: string) => updateValueWithPerpetuation(savedTrip, "trip", value);
  const tripResult = ref(getValueWithDefault("tripResult", ""));
  const updateTripResult = (value: string) =>
    updateValueWithPerpetuation(tripResult, "tripResult", value);
  const savedType = ref(getValueWithDefault("type", "charhan"));
  const updateSavedType = (value: string) => updateValueWithPerpetuation(savedType, "type", value);
  const savedColor = ref(getValueWithDefault("color", "#ffffff"));
  const updateSavedColor = (value: string) =>
    updateValueWithPerpetuation(savedColor, "color", value);
  const characterSetupResult = {
    savedName,
    updateSavedName,
    savedTrip,
    updateSavedTrip,
    tripResult,
    updateTripResult,
    savedType,
    updateSavedType,
    savedColor,
    updateSavedColor,
  };

  // 設定情報
  const selectedVolume = ref(getValueWithDefault("sound", ""));
  const updateSelectedVolume = (value: string) =>
    updateValueWithPerpetuation(selectedVolume, "sound", value);
  // 設定情報（下部パネル）
  const isKBMode = ref(getBooleanValueWithDefault("kbMode", false)); // KBモード ON/OFF
  const updateIsKBMode = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isKBMode, "kbMode", value);
  const isDarkMode = ref(getBooleanValueWithDefault("darkMode", false));
  const updateIsDarkMode = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isDarkMode, "darkMode", value);
  const isTypingMode = ref(getBooleanValueWithDefault("typingMode", true)); // タイピングモード ON/OFF
  const updateIsTypingMode = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isTypingMode, "typingMode", value);
  const isScrollableLog = ref(getBooleanValueWithDefault("scrollableLog", false));
  const updateIsScrollableLog = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isScrollableLog, "scrollableLog", value);
  const isDescendingLog = ref(getBooleanValueWithDefault("descendingLog", false));
  const updateIsDescendingLog = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isDescendingLog, "descendingLog", value);
  const isDrawnUnderlineLog = ref(getBooleanValueWithDefault("drawBorderBottomLog", false));
  const updateIsDrawnUnderlineLog = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isDrawnUnderlineLog, "drawBorderBottomLog", value);
  const isInfiniteLog = ref(getBooleanValueWithDefault("logInfinite", false)); // ログを無限に保存するか
  const updateIsInfiniteLog = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isInfiniteLog, "logInfinite", value);
  const settingSetupResult = {
    selectedVolume,
    updateSelectedVolume,
    isKBMode,
    updateIsKBMode,
    isDarkMode,
    updateIsDarkMode,
    isTypingMode,
    updateIsTypingMode,
    isScrollableLog,
    updateIsScrollableLog,
    isDescendingLog,
    updateIsDescendingLog,
    isDrawnUnderlineLog,
    updateIsDrawnUnderlineLog,
    isInfiniteLog,
    updateIsInfiniteLog,
  };

  const savedNameWithTrip = computed(() => {
    if (savedTrip.value === "") {
      return savedName.value;
    }
    return `${savedName.value}#${savedTrip.value}`;
  });

  return {
    ...characterSetupResult,
    ...settingSetupResult,
    savedNameWithTrip,
  };
});
