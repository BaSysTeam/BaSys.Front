<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataObjectRecordsProvider from '@/dataProviders/dataObjectRecordsProvider';
import DataObjectRecordsDialogViewModel from '@/models/dataObjectRecordsDialogViewModel';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
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

// Emit
const emit = defineEmits(
  {
    close: () => true,
  },
);

// Methods
async function initAsync(): Promise<void> {
  console.log('Records dialog init', props.kind, props.name, props.uid);

  const response = await provider.getModel(props.kind, props.name, props.uid);

  if (response.isOK) {
    model.value = new DataObjectRecordsDialogViewModel(response.data);
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

// Event handlers
function onCloseClick(): void {
  emit('close');
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
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
    :header="title"
    :visible="true"
    :draggable="false"
    :style="{width: '50rem'}"
    @update:visible="updateVisible">
    <div>
      <TabView>
        <TabPanel v-for="tab in model.tabs" :key="tab.key" :header="tab.title">
          <div>Tab content</div>
        </TabPanel>
      </TabView>
    </div>
    <template #footer>
      <Button
        class="mr-1"
        :label="$t('close')"
        severity="secondary"
        size="small"
        outlined
        icon="pi pi-times"
        @click="onCloseClick"
      />

    </template>
  </Dialog>
</template>

<style scoped>

</style>
