<template>
  <TabView>
    <TabPanel>
      <template #header>
        <span v-if="!isKBMode">ログ</span>
        <i v-else class="pi pi-list"></i>
      </template>
      <ChatLog />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span v-if="!isKBMode">ユーザー({{ manageableUsers.length }})</span>
        <i v-else class="pi pi-users">({{ manageableUsers.length }})</i>
      </template>
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
    <TabPanel>
      <template #header>
        <span v-if="!isKBMode">設定</span>
        <i v-else class="pi pi-cog"></i>
      </template>
      <SettingsFields />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span v-if="!isKBMode">開発</span>
        <i v-else class="pi pi-github"></i>
      </template>
      <SwitchField v-model="isVisibleFrame" label="フレーム表示" labelId="checkedFrame" />
      <div>
        <PrimeButton
          label="切断／再接続テスト（３秒復帰）"
          class="p-button-raised p-button-text p-button-sm p-button-danger"
          @click="onClickDisconnect"
        />
      </div>
      <div>
        <PrimeButton
          label="サーバーキックテスト"
          class="p-button-raised p-button-text p-button-sm p-button-danger"
          @click="onClickKicked"
        />
      </div>
    </TabPanel>
  </TabView>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import Checkbox from "primevue/checkbox";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import PrimeButton from "primevue/button";
import SwitchField from "@/components/molecules/SwitchField.vue";
import ChatLog from "@/components/organisms/ChatLog.vue";
import SettingsFields from "@/components/organisms/SettingsFields.vue";
import SpanText from "@/components/atoms/SpanText.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useDevStore } from "@/stores/develop";
import { useUIStore } from "@/stores/ui";
import { Character } from "@/domain/character";

const store = useStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();
const devStore = useDevStore();

const { isKBMode, selectedUsersIhashes } = storeToRefs(settingStore);
const { panelBackgroundColor } = storeToRefs(uiStore);

const isVisibleFrame = computed({
  get: () => devStore.isVisibleFrame,
  set: (value) => devStore.updateIsVisibleFrame(value),
});

const userDisp = (user: { name: string; trip: string; ihash: string }, id: string) => {
  const character = Character.create({ name: user.name, trip: user.trip, ihash: user.ihash });
  const idDisp = `(ID:${id.slice(0, 3)})`;
  return `${character.nameTag()} ${idDisp}`;
};

const manageableUsers = computed(() => {
  const usersObj = store.getters.manageableUsers;
  return Object.keys(usersObj).map((key) => {
    return {
      id: key,
      ...usersObj[key],
      disp: userDisp(usersObj[key], key),
      ihash: usersObj[key].ihash,
      isSilentUser: store.getters.silentUsers[key] != null,
    };
  });
});

const onClickIgnore = (ihash: string) => {
  store.dispatch("toggleIgnorance", { ihash });
};
const onChangeSilentIgnore = (ihash: string, isActive: boolean) => {
  store.dispatch("toggleSilentIgnorance", { ihash, isActive });
};
const onClickDisconnect = () => {
  store.dispatch("simulateReconnection");
};
const onClickKicked = () => {
  store.dispatch("suicide");
};
</script>

<style lang="scss" scoped>
.link-containers {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  h1 {
    font-size: 24px;
    margin: 0;
  }

  p {
    margin: 0;
  }

  .discord-container {
    .dicsord-widget {
      margin-top: 20px;
    }
  }
}

:deep(.p-tabview-nav) {
  background-color: v-bind(panelBackgroundColor);
  height: 40px;
}

:deep(.p-tabview-nav .p-tabview-header .p-tabview-nav-link) {
  background-color: v-bind(panelBackgroundColor);
  height: 30px;
  min-width: 160px;
  padding: 1.18em;
  align-items: center;
  justify-content: center;
}

:deep(.p-tabview-panels) {
  background-color: v-bind(panelBackgroundColor);
}

:deep(.pi) {
  font-size: 1.4rem;
}

:deep(.p-datatable .p-resizable-column) {
  background-color: v-bind(panelBackgroundColor);
}

:deep(.p-datatable .p-datatable-tbody td) {
  background-color: v-bind(panelBackgroundColor);
}
</style>
