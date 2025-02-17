<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed, PropType, defineEmits,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputText from 'primevue/inputtext';
import WorkflowTrigger from '@/models/workflowTrigger';
import { Guid } from 'guid-typescript';
import MetaWorkflowsProvider from '@/dataProviders/metaWorkflowsProvider';
import ViewTitleComponent from '../../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const workflowsProvider = new MetaWorkflowsProvider();

// Props
const props = defineProps({
  item: { type: Object as PropType<WorkflowTrigger>, required: true },
  regime: { type: String, required: true },
});

// Data
const isModified = ref(false);
const isWaiting = ref(false);
const item = ref<WorkflowTrigger>(new WorkflowTrigger(null));
const events = ref<any[]>([
  { text: 'create', value: '8c382b01-543b-42a9-849a-29578f3f2ddb' },
  { text: 'update', value: '43d1b132-ec50-41de-ab27-8395a5ec5f00' },
]);
const workflows = ref<any[]>([]);

// Emit
const emit = defineEmits(
  {
    close: (data:any) => true,
  },
);

// Methods
function handleError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

async function loadWorkflows(): Promise<void> {
  isWaiting.value = true;
  const response = await workflowsProvider.getCollection();
  isWaiting.value = false;

  if (response.isOK) {
    workflows.value = response.data.items;
  } else {
    handleError(response);
  }
}

// Event handlers
function onCloseClick(): void {
  emit('close', null);
}

function onSaveClick(): void {
  const payload = {
    regime: props.regime,
    isModified: isModified.value,
    data: item.value,
  };
  emit('close', payload);
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close', null);
  }
}

function onChange(): void {
  isModified.value = true;
}

// Life cycle hooks
onMounted(async () => {
  switch (props.regime) {
    case 'edit':
      item.value = new WorkflowTrigger(props.item);
      break;
    case 'copy':
      item.value = new WorkflowTrigger(props.item);
      isModified.value = true;
      item.value.uid = Guid.create().toString();
      break;
    case 'add':
      item.value = new WorkflowTrigger(null);
      isModified.value = true;
      break;
    default:
      break;
  }

  await loadWorkflows();
});

</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    :header="$t('trigger')"
    :visible="true"
    :draggable="false"
    :style="{width: '40rem'}"
    @update:visible="updateVisible">
    <template #header>
      <ViewTitleComponent :title="$t('trigger')"
                          :is-waiting="isWaiting"
                          :is-modified="isModified"></ViewTitleComponent>

    </template>
    <div>
      <!--Is active-->
      <FieldGridComponent :title="$t('isActive')"
                          label-for="fld-is-active">
        <InputSwitch id="fld-is-active"
                     v-model="item.isActive"
                     @change="onChange"></InputSwitch>
      </FieldGridComponent>

      <!--Event-->
      <FieldGridComponent :title="$t('event')"
                          label-for="fld-event"
                          :required="true">
        <Dropdown id="fld-event"
                  v-model="item.eventUid"
                  :options="events"
                  size="small"
                  option-label="text"
                  option-value="value"
                  class="w-full"
                  @update:model-value="onChange"></Dropdown>

      </FieldGridComponent>

      <!--Workflow-->
      <FieldGridComponent :title="$t('workflow')"
                          label-for="fld-workflow"
                          :required="true">
        <Dropdown v-model="item.workflowUid"
                  :options="workflows"
                  size="small"
                  option-label="title"
                  option-value="uid"
                  class="w-full"
                  @update:model-value="onChange"></Dropdown>

      </FieldGridComponent>

      <!--Memo-->
      <FieldGridComponent :title="$t('memo')" label-for="fld-memo">
        <InputText id="fld-memo"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="item.memo"
                   @change="onChange"></InputText>
      </FieldGridComponent>

    </div>
    <template #footer>
      <Button
        class="mr-1"
        :label="$t('cancel')"
        severity="secondary"
        size="small"
        outlined
        @click="onCloseClick"
      />
      <Button
        class="mr-1"
        :label="$t('save')"
        severity="primary"
        size="small"
        outlined
        @click="onSaveClick"
      />
    </template>
  </Dialog>
</template>

<style scoped>

</style>
