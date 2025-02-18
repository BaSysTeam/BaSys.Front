<script setup lang="ts">
import {
  ref, onMounted, defineProps, defineEmits,
} from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataObjectEditComponent from '@/components/DataObjectEditComponent.vue';
import LogPanel from '@/components/LogPanel.vue';
import RecordsButton from '@/components/standardButtons/RecordsButton.vue';
import DataObjectRecordsDialog from '@/components/DataObjectRecordsDialog.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const logger = new InMemoryLogger(LogLevels.Error);

// Props
const props = defineProps({
  regime: { type: String, required: true, default: 'edit' },
  kind: { type: String, required: true },
  name: { type: String, required: true },
  uid: { type: String, default: '' },
  copyUid: { type: String, default: '' },
  title: { type: String, default: '' },
});

// Data
const isModified = ref(false);
const isWaiting = ref(false);
const closeAfterSave = ref(false);
const isCalculationLogOpen = ref(false);
const actionsButtonItems = ref<any[]>([]);
const canCreateRecords = ref(false);
const isRecordsDialogOpen = ref(false);
const editComponentRef = ref<any>(null);

// Emit
const emit = defineEmits({
  close: () => true,
  saved: (args: string) => true,
});

// Event handlers
function onCloseClick(): void {
  emit('close');
}

function onRecordsClick(): void {
  isRecordsDialogOpen.value = true;
}

function onRecordsDialogClose(): void {
  isRecordsDialogOpen.value = false;
}

function onSaveClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerSaveClick();
  }
}

function onSaveAndCloseClick(): void {
  if (editComponentRef.value) {
    closeAfterSave.value = true;
    editComponentRef.value.triggerSaveClick();
  }
}

function onIsModifiedChanged(args: boolean): void {
  isModified.value = args;
}

function onIsWaitingChanged(args: boolean): void {
  isWaiting.value = args;
}

function onSaved(args: string): void {
  emit('saved', args);
  if (args && closeAfterSave.value) {
    emit('close');
  }
  closeAfterSave.value = false;
}

function onCloseTriggered(): void {
  emit('close');
}

function onCalculationLogClick(): void {
  isCalculationLogOpen.value = true;
}

function onRecalculateClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerRecalculateClick();
  }
}

function onLogPanelHide(): void {
  isCalculationLogOpen.value = false;
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

function onCreateRecordsClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerCreateRecords();
  }
}

function onDeleteRecordsClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerDeleteRecords();
  }
}

function initActionsButtonItems(): void {
  actionsButtonItems.value = [];

  actionsButtonItems.value = [
    {
      label: t('calculationLog'),
      icon: 'pi pi-list',
      command: () => onCalculationLogClick(),
    },
    {
      label: t('recalculate'),
      icon: 'pi pi-replay',
      command: () => onRecalculateClick(),
    },
  ];

  if (canCreateRecords.value) {
    actionsButtonItems.value.push({
      label: t('createRecords'),
      command: () => onCreateRecordsClick(),
    });
    actionsButtonItems.value.push({
      label: t('deleteRecords'),
      command: () => onDeleteRecordsClick(),
    });
  }
}

function onCanCreateRecordsChanged(flagValue: boolean):void {
  canCreateRecords.value = flagValue;
  initActionsButtonItems();
}

// Life cycle hooks
onMounted(() => {
  initActionsButtonItems();
});

</script>

<template>
  <div>
    <Dialog
      modal
      class="pb-0"
      position="top"
      maximizable
      :visible="true"
      :draggable="false"
      :style="{width: '50rem'}"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      @update:visible="updateVisible"
    >
      <template #header>
        <div>
          <ViewTitleComponent :title="title" :is-modified="isModified" :is-waiting="isWaiting"/>
        </div>
      </template>

      <div>
        <DataObjectEditComponent ref="editComponentRef"
                                 :kind="kind"
                                 :name="name"
                                 :uid="uid"
                                 :copyUid="copyUid"
                                 :regime="regime"
                                 :logger="logger"
                                 render-place="dialog"
                                 @isModifiedChanged="onIsModifiedChanged"
                                 @isWaitingChanged="onIsWaitingChanged"
                                 @canCreateRecordsChanged="onCanCreateRecordsChanged"
                                 @saved="onSaved"
                                 @close-trigger="onCloseTriggered"></DataObjectEditComponent>
      </div>
      <template #footer>
        <div>
          <RecordsButton v-if="canCreateRecords"
                         buttonClass="mr-1"
                         @click="onRecordsClick">
          </RecordsButton>
          <SplitButton
            class="mr-1"
            :label="$t('actions')"
            severity="primary"
            size="small"
            outlined
            :model="actionsButtonItems">
          </SplitButton>
          <Button
            class="mr-1"
            :label="$t('close')"
            severity="secondary"
            size="small"
            outlined
            icon="pi pi-times"
            @click="onCloseClick"
          />
          <Button
            class="mr-1"
            :label="$t('saveAndClose')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveAndCloseClick"
          />
          <Button
            :label="$t('save')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveClick"
          />
        </div>
      </template>
    </Dialog>
  </div>

  <DataObjectRecordsDialog v-if="isRecordsDialogOpen"
                           :kind="kind"
                           :name="name"
                           :uid="uid"
                           @close="onRecordsDialogClose"></DataObjectRecordsDialog>

  <LogPanel :visible="isCalculationLogOpen"
            :logger="logger"
            :title="$t('calculationLog')"
            @hide="onLogPanelHide"></LogPanel>
</template>

<style scoped>

</style>
