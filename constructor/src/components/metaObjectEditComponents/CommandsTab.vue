<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import { Guid } from 'guid-typescript';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
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

// Methods
function buildCommandTitle(command: MetaObjectCommand): string {
  const table = props.settings.getTable(command.tableUid);
  console.log('Build command title', command);

  if (!table) {
    return command.title;
  }

  return `${table.title}.${command.title}`;
}

// Event handlers
function onAddClick(): void {
  const newCommand = props.settings.newCommand(null);
  newCommand.title = `${t('command')} ${props.settings.commands.length}`;
  selectedItem.value = newCommand;

  emit('change');
}

function onCopyClick(): void {
  if (!selectedItem.value) {
    return;
  }
  const copyCommand = props.settings.newCommand(selectedItem.value);
  copyCommand.uid = Guid.create().toString();
  copyCommand.name = '';
  copyCommand.title = `${t('copy')} - ${selectedItem.value.title}`;

  emit('change');
}

function onDeleteClick(): void {
  console.log('onDeleteClick');

  if (!selectedItem.value) {
    return;
  }
  props.settings.deleteCommand(selectedItem.value);

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

// Life cycle events

</script>

<template>
<div class="grid">
  <div class="col-6 h-screen" style="border-right: 1px solid #ececec;">
    <!--List command panel-->
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <Button icon="pi pi-plus"
                v-tooltip.top="$t('add')"
                severity="primary"
                size="small"
                text
                @click="onAddClick" />
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
