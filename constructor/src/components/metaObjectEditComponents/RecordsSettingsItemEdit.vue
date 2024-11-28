<script setup lang="ts">
import {
  computed, defineEmits, defineProps, onBeforeMount, onMounted, PropType, ref, watch,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectRecordsSettingsItem
  from '../../../../shared/src/models/metaObjectRecordsSettingsItem';
import MetaObjectRecordsSettingsRow
  from '../../../../shared/src/models/metaObjectRecordsSettingsRow';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
  kindSettings: {
    type: Object as PropType<MetaObjectKindSettings>,
    required: true,
  },
  destinationSettings: {
    type: Object as PropType<MetaObjectStorableSettings[]>,
    required: true,
  },
  item: {
    type: Object as PropType<MetaObjectRecordsSettingsItem>,
    required: true,
  },
});

// Data
const destinationItem = ref<MetaObjectStorableSettings>();
const columns = ref<any[]>([]);
const rows = ref<any[]>([]);
const directionItems = ref<any[]>([]);
const sourceItems = ref<any[]>([]);

const title = computed(() => (destinationItem.value ? destinationItem.value.title : ''));
const dataTableStyle = computed(() => ({
  fontSize: '14px',
}));

const inputStyle = ref<any>({
  width: '100%',
  fontSize: '14px',
  borderRadius: 0,
  padding: '5px',
});

// Emits
const emit = defineEmits({
  change: () => true,
  up: () => true,
  down: () => true,
  remove: () => true,
});

// Methods
function shouldAddColumn(column: any, primaryKeyColumn: any): boolean {
  if (primaryKeyColumn) {
    if (column.uid === primaryKeyColumn.uid) {
      return false;
    }
  }

  if (column.uid === props.kindSettings.recordsSettings.storageMetaObjectColumnUid) {
    return false;
  }

  if (column.uid === props.kindSettings.recordsSettings.storageKindColumnUid) {
    return false;
  }

  if (column.uid === props.kindSettings.recordsSettings.storageObjectColumnUid) {
    return false;
  }

  if (column.uid === props.kindSettings.recordsSettings.storageRowColumnUid) {
    return false;
  }

  return true;
}

function initColumns(): void {
  columns.value = [];

  const destinationPrimaryKey = destinationItem.value?.header.getPrimaryKey();

  destinationItem.value?.header.columns.forEach((column) => {
    if (shouldAddColumn(column, destinationPrimaryKey)) {
      columns.value.push({
        title: column.title,
        uid: column.uid,
        name: column.name,
      });
    }
  });

  console.log('initColumns', columns.value);
}

function createRow(settingsRow: MetaObjectRecordsSettingsRow): any {
  console.log('create row', settingsRow);
  const row: any = {
    uid: settingsRow.uid,
    sourceUid: settingsRow.sourceUid,
    direction: settingsRow.direction,
    condition: settingsRow.condition,
  };

  settingsRow.columns.forEach((column) => {
    row[column.destinationColumnUid] = column.expression;
  });

  console.log('row', row);
  return row;
}

function initRows(): void {
  rows.value = [];

  props.item.rows.forEach((settingsRow: MetaObjectRecordsSettingsRow) => {
    rows.value.push(createRow(settingsRow));
  });
}

function init(): void {
  destinationItem.value = props.destinationSettings.find(
    (item) => item.uid === props.item.destinationMetaObjectUid,
  );

  sourceItems.value = [];
  props.settings.allTables.forEach((table: any) => {
    let { title } = table;
    if (table.name === 'header') {
      title = t('header');
    }
    sourceItems.value.push({ title, value: table.uid });
  });

  initColumns();
  initRows();
}

function directionDisplay(row: any): string {
  if (row.direction === 0) {
    return '+';
  }
  if (row.direction === 1) {
    return '-';
  }

  return '';
}

function sourceDisplay(row: any): string {
  const currentTable = props.settings.allTables.find((table) => table.uid === row.sourceUid);

  if (currentTable) {
    let { title } = currentTable;
    if (currentTable.name === 'header') {
      title = t('header');
    }
    return title;
  }

  return '';
}

function deleteRow(row: any): void {
  const settingsRow = props.item.rows.find((item) => item.uid === row.uid);
  if (settingsRow) {
    const settingsInd = props.item.rows.indexOf(settingsRow);
    if (settingsInd > -1) {
      props.item.rows.splice(settingsInd, 1);
    }
  }

  const ind = rows.value.indexOf(row);
  if (ind > -1) {
    rows.value.splice(ind, 1);
  }
}

// Event handlers
function onAddClick(): void {
  // Add row to data item.
  const newSettingsRow = new MetaObjectRecordsSettingsRow(null);
  columns.value.forEach((column) => {
    const newColumn: any = { destinationColumnUid: column.uid, expression: '', name: column.name };
    newSettingsRow.columns.push(newColumn);
  });
  props.item.rows.push(newSettingsRow);

  // Add view model row.
  const row = createRow(newSettingsRow);
  rows.value.push(row);
}

function onUpClick(): void {
  emit('up');
}

function onDownClick(): void {
  emit('down');
}

function onRemoveClick(): void {
  emit('remove');
}

function onCellEditComplete(event: any): void {
  const row = event.data;
  const columnName: string = event.field as string;
  const newRow = event.newData;

  row[columnName] = newRow[columnName];

  const settingsRow = props.item.rows.find((item) => item.uid === row.uid);
  if (settingsRow) {
    settingsRow.setValue(columnName, row[columnName]);
  }
  console.log('cellEditComplete', row, columnName);
  console.log(settingsRow);
}

function onRowDeleteClick(row: any): void {
  console.log('RowDeleteClick', row);

  confirmVue.require({
    message: `${t('deleteRow')}?`,
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteRow(row),
  });
}

// Life cycle hooks
onBeforeMount(() => {
  directionItems.value.push({
    title: '+',
    value: 0,
  });
  directionItems.value.push({
    title: '-',
    value: 1,
  });
});

onMounted(() => {
  init();
});

</script>

<template>
  <div>
    <Card class="bs-records-settings-item">
      <template #header>
        <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
          <template #start>
            <Button icon="pi pi-plus"
                    v-tooltip.top="$t('add')"
                    class="mr-2"
                    severity="primary"
                    size="small"
                    text
                    @click="onAddClick"/>

            <Button icon="pi pi-arrow-up"
                    v-tooltip.top="$t('up')"
                    class="mr-2"
                    severity="primary"
                    size="small"
                    text
                    @click="onUpClick"/>

            <Button icon="pi pi-arrow-down"
                    v-tooltip.top="$t('down')"
                    class="mr-2"
                    severity="primary"
                    size="small"
                    text
                    @click="onDownClick"/>

          </template>
          <template #end>
            <span class="text-primary">{{ title }}</span>
            <Button icon="pi pi-times"
                    v-tooltip.top="$t('delete')"
                    class="mr-2"
                    severity="danger"
                    size="small"
                    text
                    @click="onRemoveClick"/>
          </template>
        </Toolbar>
      </template>
      <template #content>
        <div style="max-width:1100px;">
          <DataTable
            v-model:selection="selectedRecord"
            :style="dataTableStyle"
            :value="rows"
            :metaKeySelection="true"
            data-key="uid"
            showGridlines
            scrollable
            selectionMode="single"
            size="small"
            edit-mode="cell"
            @cell-edit-complete="onCellEditComplete"
            :pt="{
                table: { style: 'width: 1000px; max-width: 1000px' },
                column: {
                    bodycell: ({ state }:any) => ({
                        class: [{ 'p-0': state['d_editing'] }]
                    })
                }
            }"
          >
            <Column header=""
                    frozen
                    style="max-width:50px; min-width:50px; width: 50px;">
              <template #body="{data}">
                <a href="#"
                   class="mr-2 bs-row-action"
                   tabindex="-1"
                   @click.prevent="onRowDeleteClick(data)">
                  <span class="pi pi-times text-red-500"></span>
                </a>
              </template>
            </Column>
            <Column header="+/-"
                    field="direction"
                    frozen
                    style="max-width:60px; min-width:60px; width: 60px;">
              <template #body="{data}">
                {{ directionDisplay(data) }}
              </template>
              <template #editor="{data}">
                <Dropdown :options="directionItems"
                          option-value="value"
                          option-label="title"
                          :input-style="inputStyle"
                          v-model="data.direction"
                          size="small"
                          class="w-full border-noround">

                </Dropdown>

              </template>
            </Column>
            <Column :header="$t('source')"
                    field="sourceUid"
                    frozen
                    style="max-width:150px; min-width:150px; width: 150px;">
              <template #body="{data}">
                {{ sourceDisplay(data) }}
              </template>
              <template #editor="{data}">
                <Dropdown :options="sourceItems"
                          option-value="value"
                          option-label="title"
                          :input-style="inputStyle"
                          v-model="data.sourceUid"
                          size="small"
                          class="w-full border-noround">

                </Dropdown>

              </template>
            </Column>
            <Column
              v-for="col of columns"
              :key="col.uid"
              :field="col.uid"
              :header="col.title"
              style="min-width: 150px; width:150px;"
            >
              <template #body="{data, field}">
                {{ data[field] }}
              </template>
              <template #editor="{data, field}">
                <InputText v-model="data[field]"
                           class="w-full border-noround"
                           style="padding: 5px"
                           size="small"
                           autocomplete="off"></InputText>
              </template>
            </Column>
            <Column :header="$t('condition')"
                    field="condition"
                    style="max-width:200px; min-width:200px; width: 200px;">
              <template #editor="{data, field}">
                <InputText v-model="data[field]"
                           class="w-full border-noround"
                           style="padding: 5px"
                           size="small"
                           autocomplete="off"></InputText>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

  </div>

</template>

<style>
.bs-records-settings-item .p-card-body {
  padding: 0;
}

td.p-editable-column.p-cell-editing {
  padding: 0 !important;
}

.bs-row-action span {
  font-size: 12px !important;
}

.p-tabview-nav-link {
  padding: 0.5rem !important;
}
</style>
