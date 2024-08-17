<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import { Guid } from 'guid-typescript';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import Listbox from 'primevue/listbox';
import { useConfirm } from 'primevue/useconfirm';
import ColumnPropertiesPanel from '@/components/metaObjectEditComponents/columnPropertiesPanel.vue';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
import DataType from '../../../../shared/src/models/dataType';
import MetaObjectTable from '../../../../shared/src/models/metaObjectTable';

// @component
const name = 'TableSettingsTab';

// Data
const selectedItem:any = ref(null);
const confirm = useConfirm();

// Props
const props = defineProps({
  table: {
    type: Object as PropType<MetaObjectTable>,
    required: true,
  },
  dataTypes: {
    type: Object as PropType<DataType[]>,
    required: true,
  },
});

// Emits
const emit = defineEmits({
  change: () => true,
  copy: (uid: string) => true,
  delete: (uid: string) => true,
});

function deleteColumn(): void {
  const indexToDelete = props.table.columns.findIndex(
    (column) => column.uid === selectedItem.value.uid,
  );
  if (indexToDelete > -1) {
    props.table.columns.splice(indexToDelete, 1);

    if (props.table.columns.length) {
      // eslint-disable-next-line prefer-destructuring
      selectedItem.value = props.table.columns[0];
    }
  }

  emit('change');
}

function onCopyTableClick(): void {
  console.log('Copy click');
  emit('copy', props.table.uid);
}

function onDeleteTableClick(): void {
  console.log('Delete click');
  emit('delete', props.table.uid);
}

function onAddColumnClick(): void {
  const newColumn = props.table.newColumn(null);
  newColumn.title = `New column ${props.table.columns.length}`;
  selectedItem.value = newColumn;

  emit('change');
}

function onCopyColumnClick(): void {
  if (!selectedItem.value) {
    return;
  }
  if (selectedItem.value.isStandard) {
    return;
  }

  const newColumn = props.table.newColumn(selectedItem.value);
  newColumn.uid = Guid.create().toString();
  newColumn.title = `${newColumn.title} - copy`;
  newColumn.name = '';
  selectedItem.value = newColumn;

  emit('change');
}

function onDeleteColumnClick(): void {
  if (!selectedItem.value) {
    return;
  }
  if (selectedItem.value.isStandard) {
    return;
  }

  confirm.require({
    message: 'Delete column?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => deleteColumn(),
  });
}

function onUpColumnClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.up(props.table.columns, selectedItem.value);

  emit('change');
}

function onDownColumnClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.down(props.table.columns, selectedItem.value);

  emit('change');
}

function onPropertiesChange(): void {
  emit('change');
}

</script>

<template>
<div class="grid">
  <div class="col-6 h-screen" style="border-right: 1px solid #ececec;">
    <!--Table command panel-->
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <Button icon="pi pi-copy"
                severity="primary"
                size="small"
                text
                @click="onCopyTableClick" />
        <Button icon="pi pi-times"
                severity="danger"
                size="small"
                text
                @click="onDeleteTableClick" />
      </template>
      <template #end>
        <span class="text-primary">Table.{{table.title}}</span>
      </template>
    </Toolbar>
    <!--Table properties-->
    <!--Title-->
    <div class="field grid">
      <label for="table-title" class="col-4 bs-label bs-required">{{$t('title')}}</label>
      <div class="col-8">
        <InputText id="table-title"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="table.title"
                   @change="onPropertiesChange"></InputText>
      </div>
    </div>
    <!--Name-->
    <div class="field grid">
      <label for="table-name" class="col-4 bs-label bs-required">{{$t('name')}}</label>
      <div class="col-8">
        <InputText id="table-name"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="table.name"
                   @change="onPropertiesChange"></InputText>
      </div>
    </div>

    <!--List command panel-->
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <Button icon="pi pi-plus"
                severity="primary"
                size="small"
                text
                @click="onAddColumnClick" />
        <Button icon="pi pi-copy"
                severity="primary"
                size="small"
                text
                @click="onCopyColumnClick" />
        <Button icon="pi pi-times"
                severity="danger"
                size="small"
                text
                @click="onDeleteColumnClick" />
        <Button class="ml-2"
                icon="pi pi-arrow-up"
                severity="primary"
                size="small"
                text
                @click="onUpColumnClick" />
        <Button icon="pi pi-arrow-down"
                severity="primary"
                size="small"
                text
                @click="onDownColumnClick" />
      </template>
      <template #end>
        <span class="text-primary">Columns</span>
      </template>
    </Toolbar>

    <!--Columns list-->
    <Listbox v-if="table"
             v-model="selectedItem"
             :options="table.columns"
             option-label="title">
      <template #option="{option, index}">
        <div>
          <Badge :value="index+1" severity="info"></Badge>
          <span class="ml-2">{{option.title}}</span>
          <span class="pi pi-lock ml-2" style="float:right" v-if="option.isStandard"></span>
          <span class="pi pi-key ml-2" style="float:right" v-if="option.primaryKey"></span>
        </div>
      </template>
    </Listbox>
  </div>
  <div class="col-6">
    <!--Properties panel-->
    <ColumnPropertiesPanel :column="selectedItem"
                           :data-types="dataTypes"
                           v-if="selectedItem"
                           @change="onPropertiesChange"></ColumnPropertiesPanel>
  </div>
</div>
</template>

<style scoped>

</style>
