import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";

export interface ISetting {
  isDarkMode: boolean;
}

const storageKeyPrefix = `/monachatchat`;
type StorageKey = "name" | "trip" | "tripResult" | "darkMode";
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
  const savedName = ref(getValueWithDefault("name", ""));
  const updateSavedName = (value: string) => updateValueWithPerpetuation(savedName, "name", value);
  const savedTrip = ref(getValueWithDefault("trip", ""));
  const updateSavedTrip = (value: string) => updateValueWithPerpetuation(savedTrip, "trip", value);
  const tripResult = ref(getValueWithDefault("tripResult", ""));
  const updateTripResult = (value: string) =>
    updateValueWithPerpetuation(tripResult, "tripResult", value);
  const savedNameWithTrip = computed(() => {
    if (savedTrip.value === "") {
      return savedName.value;
    }
    return `${savedName.value}#${savedTrip.value}`;
  });
  const isDarkMode = ref(getBooleanValueWithDefault("darkMode", false));
  const updateIsDarkMode = (value: boolean) =>
    updateBooleanValueWithPerpetuation(isDarkMode, "darkMode", value);
  return {
    savedName,
    updateSavedName,
    savedTrip,
    updateSavedTrip,
    tripResult,
    updateTripResult,
    savedNameWithTrip,
    isDarkMode,
    updateIsDarkMode,
  };
});
