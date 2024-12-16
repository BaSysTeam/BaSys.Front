<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import RecordsButton from '@/components/standardButtons/RecordsButton.vue';
import SplitButton from 'primevue/splitbutton';
import DataObjectEditComponent from '@/components/DataObjectEditComponent.vue';
import LogPanel from '@/components/LogPanel.vue';
import DataObjectRecordsDialog from '@/components/DataObjectRecordsDialog.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const logger = new InMemoryLogger(LogLevels.Error);

// Props
const props = defineProps({
  kind: { type: String, required: true },
  name: { type: String, required: true },
  uid: { type: String, default: '' },
  copyUid: { type: String, default: '' },
});

// Data
const isWaiting = ref(false);
const isModified = ref(false);
const isCalculationLogOpen = ref(false);
const closeAfterSave = ref(false);
const title = ref('BaSYS');
const currentUid = ref<string>('');
const editRegime = ref('edit');
const actionsButtonItems = ref<any[]>([]);
const canCreateRecords = ref(false);
const isRecordsDialogOpen = ref(false);
const editComponentRef = ref<any>(null);
// eslint-disable-next-line @typescript-eslint/no-empty-function
let initActionsButtonItems = ():any => {};

// Methods
function returnToList(): void {
  router.push({
    name: 'data-objects',
    params: {
      kind: props.kind,
      name: props.name,
    },
  });
}

function defineEditRegime(): void {
  const route = useRoute();
  if (route.name === 'data-objects-copy') {
    editRegime.value = 'copy';
  } else if (route.name === 'data-objects-add') {
    editRegime.value = 'add';
  } else {
    editRegime.value = 'edit';
  }
}

// Event handlers
function onBackClick(): void {
  returnToList();
}

function onSaveCloseClick(): void {
  if (editComponentRef.value) {
    closeAfterSave.value = true;
    editComponentRef.value.triggerSaveClick();
  }
}

function onSaveClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerSaveClick();
  }
}

function onRecordsClick(): void {
  isRecordsDialogOpen.value = true;
}

function onRecordsDialogClose(): void {
  isRecordsDialogOpen.value = false;
}

function onIsModifiedChanged(args: boolean): void {
  isModified.value = args;
}

function onIsWaitingChanged(args: boolean):void {
  isWaiting.value = args;
}

function onCanCreateRecordsChanged(flagValue: boolean):void {
  canCreateRecords.value = flagValue;
  initActionsButtonItems();
}

function onTitleChanged(args: string):void {
  title.value = args;
  document.title = `${args} - BaSYS`;
}

function onSaved(args: string): void {
  currentUid.value = args;
  if (args && closeAfterSave.value) {
    returnToList();
  }
  closeAfterSave.value = false;
}

function onCloseTriggered(): void {
  returnToList();
}

function onCalculationLogClick(): void {
  isCalculationLogOpen.value = true;
}

function onRecalculateClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerRecalculateClick();
  }
}

function onCreateRecordsClick():void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerCreateRecords();
  }
}

function onDeleteRecordsClick(): void {
  if (editComponentRef.value) {
    editComponentRef.value.triggerDeleteRecords();
  }
}

function onLogPanelHide(): void {
  isCalculationLogOpen.value = false;
}

initActionsButtonItems = () => {
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
};

// Life cycle hooks
onBeforeMount(() => {
  defineEditRegime();
});

onMounted(() => {
  initActionsButtonItems();
  currentUid.value = props.uid;
});

</script>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="isModified" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <ButtonGroup>
          <Button
            :label="$t('back')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-arrow-left"
            @click="onBackClick"
          />
          <Button
            :label="$t('saveAndClose')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveCloseClick"
          />
          <Button
            :label="$t('save')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveClick"
          />

        </ButtonGroup>
        <RecordsButton v-if="canCreateRecords"
                       @click="onRecordsClick">
        </RecordsButton>

        <SplitButton
          class="ml-1"
          :label="$t('actions')"
          severity="primary"
          size="small"
          outlined
          :model="actionsButtonItems">
        </SplitButton>

      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>
    <div class="grid">
      <div class="col-12">
        <DataObjectEditComponent ref="editComponentRef"
                                 :regime="editRegime"
                                 :kind="kind"
                                 :name="name"
                                 :uid="uid"
                                 :copyUid="copyUid"
                                 :logger="logger"
                                 render-place="page"
                                 @is-modified-changed="onIsModifiedChanged"
                                 @is-waiting-changed="onIsWaitingChanged"
                                 @canCreateRecordsChanged="onCanCreateRecordsChanged"
                                 @title-changed="onTitleChanged"
                                 @saved="onSaved"
                                 @close-trigger="onCloseTriggered"></DataObjectEditComponent>
      </div>
    </div>
  </div>

  <DataObjectRecordsDialog v-if="isRecordsDialogOpen"
                           :kind="kind"
                           :name="name"
                           :uid="currentUid"
                           @close="onRecordsDialogClose"></DataObjectRecordsDialog>

  <LogPanel :visible="isCalculationLogOpen"
            :logger="logger"
            :title="$t('calculationLog')"
            @hide="onLogPanelHide"></LogPanel>
</template>

<style scoped>
.bs-required:after {
  content: "*";
  color: red;
  font-size: 12pt;
}
</style>
