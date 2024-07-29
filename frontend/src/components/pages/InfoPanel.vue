<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">
        <span v-if="!isKBMode">ログ</span>
        <i v-else class="pi pi-list"></i>
      </Tab>
      <Tab value="1">
        <span v-if="!isKBMode">{{ `ユーザー${populationText}` }}</span>
        <i v-else class="pi pi-users">{{ populationText }}</i>
      </Tab>
      <Tab value="2">
        <span v-if="!isKBMode">設定</span>
        <i v-else class="pi pi-cog"></i>
      </Tab>
      <Tab value="3">
        <span v-if="!isKBMode">開発</span>
        <i v-else class="pi pi-github"></i>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <ChatLog />
      </TabPanel>
      <TabPanel value="1">
        <UserManager />
      </TabPanel>
      <TabPanel value="2">
        <SettingsFields />
      </TabPanel>
      <TabPanel value="3">
        <DevArea />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import ChatLog from "@/components/organisms/panel/ChatLog.vue";
import UserManager from "@/components/organisms/panel/UserManager.vue";
import SettingsFields from "@/components/organisms/panel/SettingsFields.vue";
import DevArea from "@/components/organisms/panel/DevArea.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useUIStore } from "@/stores/ui";
import { useUsersStore } from "@/stores/users";
import { computed } from "vue";

const usersStore = useUsersStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();

const { isKBMode } = storeToRefs(settingStore);
const { manageableUsers } = storeToRefs(usersStore);
const { panelBackgroundColor } = storeToRefs(uiStore);

const populationText = computed(() => {
  return `(${Object.keys(manageableUsers.value).length})`;
});
</script>

<style lang="scss" scoped>
:deep(.p-tab) {
  background-color: v-bind(panelBackgroundColor);
  flex: 1;
}

:deep(.p-tabpanels) {
  background-color: v-bind(panelBackgroundColor);
}
</style>
