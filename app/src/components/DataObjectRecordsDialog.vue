<script setup lang="ts">
import {
  ref, onMounted, defineProps, defineEmits,
} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataObjectRecordsProvider from '@/dataProviders/dataObjectRecordsProvider';
import DataObjectRecordsDialogViewModel from '@/models/dataObjectRecordsDialogViewModel';
import DataObjectRecordsTable from '@/components/DataObjectRecordsTable.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const provider = new DataObjectRecordsProvider();
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({
  kind: { type: String, required: true },
  name: { type: String, required: true },
  uid: { type: String, required: true },
});

// Data
const title = ref<string>(t('records'));
const model = ref<DataObjectRecordsDialogViewModel>(new DataObjectRecordsDialogViewModel(null));
const activeTabIndex = ref<number>(0);
const isWaiting = ref<boolean>(true);

// Emit
const emit = defineEmits(
  {
    close: () => true,
  },
);

// Methods
async function initAsync(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.getModelAsync(props.kind, props.name, props.uid);
  isWaiting.value = false;

  if (response.isOK) {
    model.value = new DataObjectRecordsDialogViewModel(response.data);
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

function setTabActive(): void {
  model.value.tabs.forEach((tab) => {
    tab.isActive = false;
  });

  const activeTab = model.value.tabs[activeTabIndex.value];
  activeTab.isActive = true;
}

// Event handlers
function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

function onTabChange(): void {
  setTabActive();
}

function onIsWaitingChange(flagValue: boolean): void {
  isWaiting.value = flagValue;
}

// Life cycle hooks
onMounted(async () => {
  await initAsync();
});
</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    maximizable
    :visible="true"
    :draggable="false"
    :style="{width: '75%'}"
    @update:visible="updateVisible">
    <template #header>
      <ViewTitleComponent :title="title"
                          :is-waiting="isWaiting"></ViewTitleComponent>
    </template>
    <div>
      <TabView v-model:activeIndex="activeTabIndex"
               @tabChange="onTabChange">
        <TabPanel v-for="tab in model.tabs"
                  :key="tab.key"
                  :header="tab.title">
          <DataObjectRecordsTable :is-active="tab.isActive"
                                  :kind="kind"
                                  :name="name"
                                  :object-uid="uid"
                                  :register-uid="tab.uid"
                                  :columns="tab.columns"
                                  @is-waiting-change="onIsWaitingChange"
                                  ></DataObjectRecordsTable>
        </TabPanel>
      </TabView>
    </div>
  </Dialog>
</template>

<style scoped>

</style>
