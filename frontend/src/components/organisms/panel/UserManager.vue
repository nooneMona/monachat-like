<template>
  <div>
    <DataTable
      :value="manageableUsers"
      resizable-columns
      size="small"
      column-resize-mode="fit"
      responsive-layout="scroll"
      striped-rows
    >
      <Column>
        <template #header>
          <SpanText text="名前" :size="16" type="text" />
        </template>
        <template #body="nameSlotProps">
          <SpanText
            :text="nameSlotProps.data.disp"
            :size="16"
            :type="selectedUsersIhashes[nameSlotProps.data.ihash]"
          />
        </template>
      </Column>
      <Column>
        <template #header>
          <SpanText text="無視" :size="16" type="text" />
        </template>
        <template #body="slotProps">
          <Checkbox
            v-model="slotProps.data.isIgnored"
            binary
            @click="onClickIgnore(slotProps.data.ihash)"
          />
        </template>
      </Column>
      <Column>
        <template #header>
          <SpanText text="サイレント無視" :size="16" type="text" />
        </template>
        <template #body="silentIgnoreSlotProps">
          <Checkbox
            v-model="silentIgnoreSlotProps.data.isSilentUser"
            binary
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
</template>

<script setup lang="ts">
import Checkbox from "primevue/checkbox";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import SpanText from "@/components/atoms/SpanText.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { useUserStore } from "@/stores/user";
import { useUsersStore } from "@/stores/users";
import { useUIStore } from "@/stores/ui";
import { computed } from "vue";
import { Character } from "@/domain/character";

const userStore = useUserStore();
const usersStore = useUsersStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();

const { panelBackgroundColor } = storeToRefs(uiStore);
const { selectedUsersIhashes } = storeToRefs(settingStore);

const onClickIgnore = (ihash: string) => {
  userStore.toggleIgnorance(ihash);
};
const onChangeSilentIgnore = (ihash: string, isActive: boolean) => {
  userStore.toggleSilentIgnorance(ihash, isActive);
};

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
</script>

<style lang="scss" scoped>
:deep(.p-resizable-column) {
  background-color: v-bind(panelBackgroundColor);
}

:deep(.p-datatable-header-cell) {
  background-color: v-bind(panelBackgroundColor);
}

:deep(.p-datatable-tbody td) {
  background-color: v-bind(panelBackgroundColor);
}
</style>
