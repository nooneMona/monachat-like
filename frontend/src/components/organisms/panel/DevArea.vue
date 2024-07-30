<template>
  <div class="dev-area">
    <div>
      <SwitchField v-model="isVisibleFrame" label="フレーム表示" labelId="checkedFrame" />
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PrimeButton from "primevue/button";
import SwitchField from "@/components/molecules/SwitchField.vue";
import { useDevStore } from "@/stores/develop";

const devStore = useDevStore();

const isVisibleFrame = computed({
  get: () => devStore.isVisibleFrame,
  set: (value) => devStore.updateIsVisibleFrame(value),
});

const onClickDisconnect = () => {
  devStore.simulateReconnection();
};
const onClickKicked = () => {
  devStore.suicide();
};
</script>

<style lang="scss" scoped>
.dev-area {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
</style>
