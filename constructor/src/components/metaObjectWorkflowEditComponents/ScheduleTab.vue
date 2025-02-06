<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import WorkflowScheduleRecord from '@/models/workflowScheduleRecord';
import WorkflowScheduleProvider from '@/dataProviders/workflowsScheduleProvider';
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import Listbox from 'primevue/listbox';
import Badge from 'primevue/badge';
import Toolbar from 'primevue/toolbar';
import ToastHelper from '../../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const provider = new WorkflowScheduleProvider();

// Props
const props = defineProps({
  workflowUid: { type: String, required: true },
});

// Data
const isWaiting = ref(false);
const items = ref<WorkflowScheduleRecord[]>([]);
const selectedItem:any = ref(null);
const lastSelectedItem = ref(null);
const windowHeight = ref(window.innerHeight);
const isEditDialogOpen = ref(false);
const listStyle = computed(() => ({
  height: `${windowHeight.value - 200}px`,
}));

// Methods
async function update(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.getWorkflowRecords(props.workflowUid);
  isWaiting.value = false;

  items.value = [];
  if (response.isOK) {
    response.data.forEach((item) => {
      items.value.push(new WorkflowScheduleRecord(item));
    });
    if (items.value.length > 0) {
      [selectedItem.value] = items.value;
    }
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

// Event handlers
function onAddClick(): void {
  console.log('addClick');
}

function onEditClick(): void {
  console.log('editClick');
}

function onCopyClick(): void {
  console.log('copyClick');
}

function onDeleteClick(): void {
  console.log('deleteClick');
}

function onListChange(event: any): void {
  if (!event.value) {
    selectedItem.value = lastSelectedItem.value; // Restore the previous selection
  } else {
    lastSelectedItem.value = event.value; // Save the new selection
  }
}

function onListDoubleClick(): void {
  if (!selectedItem.value) {
    return;
  }
  isEditDialogOpen.value = true;
}

// Life cycle hooks
onMounted(async () => {
  await update();
});
</script>

<template>
  <div class="grid">
    <div class="col-8">
      <!--Steps command panel-->
      <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
        <template #start>
          <Button icon="pi pi-plus"
                  v-tooltip.top="$t('add')"
                  severity="primary"
                  size="small"
                  text
                  @click="onAddClick" />
          <Button icon="pi pi-pencil"
                  v-tooltip.top="$t('edit')"
                  severity="primary"
                  size="small"
                  text
                  @click="onEditClick" />
          <Button icon="pi pi-copy"
                  v-tooltip.top="$t('copy')"
                  severity="primary"
                  size="small"
                  text
                  @click="onCopyClick" />
          <Button icon="pi pi-times"
                  v-tooltip.top="$t('delete')"
                  severity="danger"
                  size="small"
                  text
                  @click="onDeleteClick" />
        </template>
      </Toolbar>

      <!--steps list-->
      <Listbox v-model="selectedItem"
               :options="items"
               :list-style="listStyle"
               :meta-key-selection="false"
               @change="onListChange"
               @dblclick="onListDoubleClick">
        <template #option="{option, index}">
          <div>
            <Badge :value="index+1" severity="info"></Badge>
            <span class="ml-2 font-bold">{{option.cronExpression}}</span>
            <span class="ml-4 text-sm">{{option.memo}}</span>
            <span class="pi pi-check ml-2" style="float:right" v-if="option.isActive"></span>
          </div>
        </template>
      </Listbox>
    </div>
  </div>
</template>

<style scoped>

</style>
