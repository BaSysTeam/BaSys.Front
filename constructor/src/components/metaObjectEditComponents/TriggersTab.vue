<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Badge from 'primevue/badge';
import Listbox from 'primevue/listbox';
import WorkflowTrigger from '@/models/workflowTrigger';
import WorkflowTriggersProvider from '@/dataProviders/workflowTriggersProvider';
import TriggerEditDialog from '@/components/metaObjectEditComponents/TriggerEditDialog.vue';
import ToastHelper from '../../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const toastHelper = new ToastHelper(useToast());
const confirmVue = useConfirm();
const provider = new WorkflowTriggersProvider();

// Props
const props = defineProps({
  metaObjectKindUid: { type: String, required: true },
  metaObjectUid: { type: String, required: true },
});

// Data
const isWaiting = ref(false);
const items = ref<WorkflowTrigger[]>([]);
const selectedItem:any = ref(null);
const lastSelectedItem = ref(null);
const windowHeight = ref(window.innerHeight);
const isEditDialogOpen = ref(false);
const dialogRegime = ref('edit');
const listStyle = computed(() => ({
  height: `${windowHeight.value - 200}px`,
}));

// Methods
function handleError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

function selectItem(uid: string): void {
  const item = items.value.find((item) => item.uid === uid);
  if (item) {
    selectedItem.value = item;
  }
}

async function refresh(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.getObjectTriggers(props.metaObjectUid);
  isWaiting.value = false;

  items.value = [];
  if (response.isOK) {
    response.data.forEach((item) => {
      items.value.push(new WorkflowTrigger(item));
    });
    if (items.value.length > 0) {
      [selectedItem.value] = items.value;
    }
  } else {
    handleError(response);
  }
}

async function save(editResult: any): Promise<void> {
  console.log('editResult', editResult);
  editResult.data.metaObjectUid = props.metaObjectUid;
  editResult.data.metaObjectKindUid = props.metaObjectKindUid;

  console.log('editResult', editResult);
  if (editResult.regime === 'add' || editResult.regime === 'copy') {
    // Create new item.
    isWaiting.value = true;
    const response = await provider.create(editResult.data);
    isWaiting.value = false;

    if (response.isOK) {
      await refresh();
      selectItem(editResult.data.uid);
    } else {
      handleError(response);
    }
  } else if (editResult.regime === 'edit' && editResult.isModified) {
    // Update existing item.
    isWaiting.value = true;
    const response = await provider.update(editResult.data);
    isWaiting.value = false;

    if (response.isOK) {
      await refresh();
      selectItem(editResult.data.uid);
    } else {
      handleError(response);
    }
  }
}

async function deleteItem(): Promise<void> {
  if (!selectedItem.value) {
    return;
  }
  isWaiting.value = true;
  const response = await provider.delete(selectedItem.value.uid);
  isWaiting.value = false;
  if (response.isOK) {
    toastHelper.success(response.message);
    await refresh();
  } else {
    handleError(response);
  }
}

// Event handlers
function onAddClick(): void {
  dialogRegime.value = 'add';
  isEditDialogOpen.value = true;
}

function onEditClick(): void {
  if (!selectedItem.value) {
    return;
  }

  dialogRegime.value = 'edit';
  isEditDialogOpen.value = true;
}

function onCopyClick(): void {
  if (!selectedItem.value) {
    return;
  }

  dialogRegime.value = 'copy';
  isEditDialogOpen.value = true;
}

function onDeleteClick(): void {
  if (!selectedItem.value) {
    return;
  }

  confirmVue.require({
    message: `${t('deleteItem')} "${selectedItem.value.cronExpression}" ?`,
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteItem(),
  });
}

function onListChange(event: any): void {
  if (!event.value) {
    selectedItem.value = lastSelectedItem.value; // Restore the previous selection
  } else {
    lastSelectedItem.value = event.value; // Save the new selection
  }
}

function onListDoubleClick(): void {
  if (isWaiting.value) {
    return;
  }
  if (!selectedItem.value) {
    return;
  }

  dialogRegime.value = 'edit';
  isEditDialogOpen.value = true;
}

function onEditDialogClose(args: any): void {
  isEditDialogOpen.value = false;
  if (args != null) {
    save(args);
  }
}

// Life cycle hooks
onMounted(async () => {
  await refresh();
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
                  :disabled="isWaiting"
                  severity="primary"
                  size="small"
                  text
                  @click="onAddClick" />
          <Button icon="pi pi-pencil"
                  v-tooltip.top="$t('edit')"
                  :disabled="isWaiting"
                  severity="primary"
                  size="small"
                  text
                  @click="onEditClick" />
          <Button icon="pi pi-copy"
                  v-tooltip.top="$t('copy')"
                  :disabled="isWaiting"
                  severity="primary"
                  size="small"
                  text
                  @click="onCopyClick" />
          <Button icon="pi pi-times"
                  v-tooltip.top="$t('delete')"
                  :disabled="isWaiting"
                  severity="danger"
                  size="small"
                  text
                  @click="onDeleteClick" />
        </template>
        <template #end>
          <i v-if="isWaiting" class="pi pi-spin pi-spinner"></i>
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
            <span class="ml-2 font-bold">{{option.eventName}}</span>
            <span>&nbsp;&rarr;&nbsp;</span>
            <span class="ml-2">{{option.workflowTitle}}</span>
            <span class="ml-4 text-sm">{{option.memo}}</span>
            <span class="pi pi-check ml-2" style="float:right" v-if="option.isActive"></span>
          </div>
        </template>
      </Listbox>
    </div>
  </div>

  <TriggerEditDialog v-if="isEditDialogOpen"
                     :regime="dialogRegime"
                     :item="selectedItem"
                     @close="onEditDialogClose"></TriggerEditDialog>
</template>

<style scoped>

</style>
