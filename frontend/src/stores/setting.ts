
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export interface ISetting {
  isDarkMode: boolean;
}

const storageKeyPrefix = `/monachatchat`;
type StorageKey = "darkMode";
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

export const useSettingStore = defineStore('setting', () => {
  const isDarkMode = ref(getBooleanValueWithDefault('darkMode', false));
  const updateIsDarkMode = (value: boolean) => {
    isDarkMode.value = value;
    updateBooleanValueWithPerpetuation(isDarkMode, 'darkMode', value);
  }
  return { isDarkMode, updateIsDarkMode }
})
