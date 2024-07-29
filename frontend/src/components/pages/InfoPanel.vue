<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">
        <span v-if="!isKBMode">ログ</span>
        <i v-else class="pi pi-list"></i>
      </Tab>
      <Tab value="1">
        <span v-if="!isKBMode">ユーザー({{ manageableUsers.length }})</span>
        <i v-else class="pi pi-users">({{ manageableUsers.length }})</i>
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
      <TabPanel value="0"><ChatLog /></TabPanel>
      <TabPanel value="1">
        <div>
          <DataTable
            :value="manageableUsers"
            :resizableColumns="true"
            columnResizeMode="fit"
            responsiveLayout="scroll"
            stripedRows
            class="p-datatable-sm"
          >
            <Column header="名前">
              <template #body="nameSlotProps">
                <SpanText
                  :text="nameSlotProps.data.disp"
                  :size="16"
                  :type="selectedUsersIhashes[nameSlotProps.data.ihash]"
                />
              </template>
            </Column>
            <Column header="無視">
              <template #body="slotProps">
                <Checkbox
                  v-model="slotProps.data.isIgnored"
                  :binary="true"
                  @click="onClickIgnore(slotProps.data.ihash)"
                />
              </template>
            </Column>
            <Column header="サイレント無視">
              <template #body="silentIgnoreSlotProps">
                <Checkbox
                  v-model="silentIgnoreSlotProps.data.isSilentUser"
                  :binary="true"
                  @change="
                    onChangeSilentIgnore(
                      silentIgnoreSlotProps.data.ihash,
                      silentIgnoreSlotProps.data.isSilentUser,
                    )
                  "
                />
              </template>
            </Column>
          </DataTable>
        </div>
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
import { computed } from "vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ChatLog from "@/components/organisms/ChatLog.vue";
import SettingsFields from "@/components/organisms/SettingsFields.vue";
import SpanText from "@/components/atoms/SpanText.vue";
import DevArea from "@/components/organisms/DevArea.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useUIStore } from "@/stores/ui";
import { Character } from "@/domain/character";
import { useUsersStore } from "@/stores/users";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const usersStore = useUsersStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();

const { isKBMode, selectedUsersIhashes } = storeToRefs(settingStore);
const { panelBackgroundColor } = storeToRefs(uiStore);

const userDisp = (user: { name: string; trip: string; ihash: string }, id: string) => {
  const character = Character.create({ name: user.name, trip: user.trip, ihash: user.ihash });
  const idDisp = `(ID:${id.slice(0, 3)})`;
  return `${character.nameTag()} ${idDisp}`;
};

const manageableUsers = computed(() => {
  const usersObj = usersStore.manageableUsers;
  return Object.keys(usersObj).map((id) => {
    return {
      id,
      ...usersObj[id],
      disp: userDisp(usersObj[id]!, id),
      ihash: usersObj[id]!.ihash,
      isSilentUser: usersStore.silentUsers[id] != undefined,
    };
  });
});

const onClickIgnore = (ihash: string) => {
  userStore.toggleIgnorance(ihash);
};
const onChangeSilentIgnore = (ihash: string, isActive: boolean) => {
  userStore.toggleSilentIgnorance(ihash, isActive);
};
</script>

<style lang="scss" scoped>
:deep(.p-tab) {
  background-color: v-bind(panelBackgroundColor);
  width: 100%;
}

:deep(.p-tabpanels) {
  background-color: v-bind(panelBackgroundColor);
}

:deep(.p-datatable .p-resizable-column) {
  background-color: v-bind(panelBackgroundColor);
}

:deep(.p-datatable .p-datatable-tbody td) {
  background-color: v-bind(panelBackgroundColor);
}
</style>
