<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeMount,
  defineProps,
  defineEmits,
  watch,
  computed,
  PropType,
  onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
import SplitButton from 'primevue/splitbutton';
import Badge from 'primevue/badge';
import StepEditDialog from '@/components/metaObjectWorkflowEditComponents/StepEditDialog.vue';
import { Guid } from 'guid-typescript';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<WorkflowSettings>,
    required: true,
  },
});

// Data
const selectedItem:any = ref(null);
const lastSelectedItem = ref(null);
const windowHeight = ref(window.innerHeight);
const addCommandItems = ref<any[]>([]);
const isStepEditDialogOpen = ref(false);
const listStyle = computed(() => ({
  height: `${windowHeight.value - 200}px`,
}));

// Emits
const emit = defineEmits({ change: () => true });

// Methods
function stepTitle(step: any):string {
  if (!step.previousStepUid) {
    return step.title;
  }

  const previousStep = props.settings.steps.find((s) => s.uid === step.previousStepUid);
  if (!previousStep) {
    return step.title;
  }

  return `${previousStep.title} ⟶ ${step.title}`;
}

// Event handlers
function onAddClick(kind: string): void {
  const previousUid = selectedItem.value ? selectedItem.value.uid : null;

  const params = {
    previousStepUid: previousUid,
    kindName: kind,
    name: `step_${props.settings.steps.length + 1}`,
    title: `Step ${props.settings.steps.length + 1}`,
  };

  selectedItem.value = props.settings.newStep(kind, params);
  isStepEditDialogOpen.value = true;
  emit('change');
}

function onEditClick(): void {
  if (!selectedItem.value) {
    return;
  }

  isStepEditDialogOpen.value = true;
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
  isStepEditDialogOpen.value = true;
}

function onCopyClick(): void {
  if (!selectedItem.value) {
    return;
  }

  const newStep = props.settings.newStep(selectedItem.value.kindName, selectedItem.value);
  newStep.title = `${newStep.title} - copy`;
  newStep.name = '';
  newStep.previousStepUid = '';
  newStep.uid = Guid.create().toString();

  selectedItem.value = newStep;
  isStepEditDialogOpen.value = true;

  emit('change');
}

function onDeleteClick(): void {
  if (!selectedItem.value) {
    return;
  }

  confirmVue.require({
    message: t('deleteStepQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => {
      props.settings.deleteStep(selectedItem.value);
      if (props.settings.steps.length) {
        [selectedItem.value] = props.settings.steps;
      }
      emit('change');
    },
  });
}

function onUpClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.up(props.settings.steps, selectedItem.value);

  emit('change');
}

function onDownClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.down(props.settings.steps, selectedItem.value);

  emit('change');
}

function onChange(): void {
  emit('change');
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

function onStepEditDialogClose(): void {
  isStepEditDialogOpen.value = false;
}

// Life cycle hooks
onBeforeMount(() => {
  addCommandItems.value = [
    {
      label: t('delay'),
      command: () => onAddClick('sleep'),
    },
    {
      label: t('message'),
      command: () => onAddClick('message'),
    },

  ];
});

onMounted(() => {
  window.addEventListener('resize', onResize);
  if (props.settings.steps.length) {
    [selectedItem.value] = props.settings.steps;
    lastSelectedItem.value = selectedItem.value;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
<div class="grid">
  <div class="col-6">
    <!--Steps command panel-->
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <SplitButton
          v-tooltip.top="$t('add')"
          icon = "pi pi-plus"
          severity="primary"
          size="small"
          class="ml-1"
          outlined
          :model="addCommandItems"
        />
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
        <Button class="ml-2"
                v-tooltip.top="$t('up')"
                icon="pi pi-arrow-up"
                severity="primary"
                size="small"
                text
                @click="onUpClick" />
        <Button icon="pi pi-arrow-down"
                v-tooltip.top="$t('down')"
                severity="primary"
                size="small"
                text
                @click="onDownClick" />
      </template>
    </Toolbar>

    <!--steps list-->
    <Listbox v-if="settings"
             v-model="selectedItem"
             :options="settings.steps"
             :list-style="listStyle"
             :meta-key-selection="false"
             @change="onListChange"
             @dblclick="onListDoubleClick">
      <template #option="{option, index}">
        <div>
          <Badge :value="index+1" severity="info"></Badge>
          <span class="ml-2">{{stepTitle(option)}}</span>
          <span class="pi pi-check ml-2" style="float:right" v-if="option.isActive"></span>
        </div>
      </template>
    </Listbox>
  </div>
</div>

  <StepEditDialog v-if="isStepEditDialogOpen"
                  :step-settings="selectedItem"
                  :workflow-settings="settings"
                  @close="onStepEditDialogClose"></StepEditDialog>
</template>

<style scoped>

</style>
