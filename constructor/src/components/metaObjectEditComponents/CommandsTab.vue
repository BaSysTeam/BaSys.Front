<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref,
  onBeforeUnmount, onMounted, onBeforeMount,
} from 'vue';
import { Guid } from 'guid-typescript';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
import SplitButton from 'primevue/splitbutton';
import Badge from 'primevue/badge';
import CommandPropertiesPanel
  from '@/components/metaObjectEditComponents/CommandPropertiesPanel.vue';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
import MetaObjectCommand from '../../../../shared/src/models/metaObjectCommand';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// Infrastructure
const confirmVue = useConfirm();
const { t } = useI18n({ useScope: 'global' });

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
});

// Emits
const emit = defineEmits({ change: () => true });

// Data
const selectedItem:any = ref(null);
const windowHeight = ref(window.innerHeight);
const addCommandItems = ref<any[]>([]);

// Methods
function listStyle(): any {
  return {
    height: `${windowHeight.value - 200}px`,
  };
}

function buildCommandTitle(command: MetaObjectCommand): string {
  const table = props.settings.getTable(command.tableUid);

  if (!table) {
    return command.title;
  }

  return `${table.title}.${command.title}`;
}

// Event handlers
function onAddClick(kind: number): void {
  const newCommand = props.settings.newCommand(kind);
  newCommand.title = `${t('command')} ${props.settings.commands.length}`;
  selectedItem.value = newCommand;

  emit('change');
}

function onCopyClick(): void {
  if (!selectedItem.value) {
    return;
  }
  const copyCommand = new MetaObjectCommand(selectedItem.value);
  copyCommand.uid = Guid.create().toString();
  copyCommand.name = '';
  copyCommand.title = `${t('copyNoun')} - ${selectedItem.value.title}`;
  props.settings.commands.push(copyCommand);

  selectedItem.value = copyCommand;

  emit('change');
}

function onDeleteClick(): void {
  if (!selectedItem.value) {
    return;
  }

  confirmVue.require({
    message: t('deleteCommandQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => { props.settings.deleteCommand(selectedItem.value); },
  });

  emit('change');
}

function onUpClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.up(props.settings.commands, selectedItem.value);

  emit('change');
}

function onDownClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.down(props.settings.commands, selectedItem.value);

  emit('change');
}

function onChange(): void {
  emit('change');
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

// Life cycle events
onBeforeMount(() => {
  addCommandItems.value = [
    {
      label: t('customCommand'),
      command: () => onAddClick(0),
    },
    {
      label: t('fill'),
      command: () => onAddClick(1),
    },
    {
      label: t('pickUp'),
      command: () => onAddClick(2),
    },
  ];
});

onMounted(() => {
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
<div class="grid">
  <div class="col-6 h-screen" style="border-right: 1px solid #ececec;">
    <!--List command panel-->
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
<!--        <Button icon="pi pi-plus"-->
<!--                v-tooltip.top="$t('add')"-->
<!--                severity="primary"-->
<!--                size="small"-->
<!--                text-->
<!--                @click="onAddClick" />-->
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

    <!--Commands list-->
    <Listbox v-if="settings"
             v-model="selectedItem"
             :options="settings.commands"
             :list-style="listStyle()"
             option-label="title">
      <template #option="{option, index}">
        <div>
          <Badge :value="index+1" severity="info"></Badge>
          <span class="ml-2">{{buildCommandTitle(option)}}</span>
          <span class="pi pi-check ml-2" style="float:right" v-if="option.isActive"></span>
        </div>
      </template>
    </Listbox>
  </div>

  <!-- Properties panel -->
  <div class="col-6">
   <CommandPropertiesPanel :command="selectedItem"
                           :settings="settings"
                           @change="onChange"></CommandPropertiesPanel>
  </div>
</div>
</template>

<style scoped>

</style>
