<script setup lang="ts">
import {
  computed, defineEmits, defineProps, onBeforeMount, onMounted, PropType, ref, watch,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import { Guid } from 'guid-typescript';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
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
const autoCompleteItems = ref<string[]>([]);

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
function getSettingsRow(row: any): any {
  return props.item.rows.find((item) => item.uid === row.uid);
}

function getCurrentTable(sourceUid: string): any {
  return props.settings.allTables.find((table) => table.uid === sourceUid);
}

function prepareAutoCompleteItems(row: any): string[] {
  const items: string[] = [];

  props.settings.header.columns.forEach((col: any) => {
    items.push(`$h.${col.name}`);
  });

  const currentTable = getCurrentTable(row.sourceUid);
  if (currentTable.name !== props.settings.header.name) {
    currentTable.columns.forEach((col: any) => {
      items.push(`$r.${col.name}`);
    });
  }

  return items;
}

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
}

function autoFillMappingByTable(
  table: any,
  prefix: string,
  row: any,
  settingsRow: any,
): void {
  columns.value.forEach((column) => {
    if (!row[column.uid]) {
      const destinationColumn = destinationItem.value?.header.getColumn(column.uid);

      if (destinationColumn) {
        // Try to find column by name.
        const sourceColumn = table.getColumnByName(destinationColumn.name);

        if (sourceColumn) {
          const expression = `${prefix}.${sourceColumn.name}`;
          settingsRow.setValue(column.uid, expression);
          row[column.uid] = expression;
        } else {
          // If we cannot find column by name try to find it by type.
          const sourceColumnByType = table.getColumnByDataType(
            destinationColumn.dataTypeUid,
          );

          if (sourceColumnByType) {
            const expression = `${prefix}.${sourceColumnByType.name}`;
            settingsRow.setValue(column.uid, expression);
            row[column.uid] = expression;
          }
        }
      }
    }
  });
}

function autoFillMapping(row: any): void {
  const settingsRow = getSettingsRow(row);
  const currentTable = getCurrentTable(row.sourceUid);
  const headerTable = props.settings.header;

  if (!currentTable) {
    return;
  }

  if (!settingsRow) {
    return;
  }

  const isHeader = currentTable.name === 'header';
  const prefix = isHeader ? '$h' : '$r';

  autoFillMappingByTable(currentTable, prefix, row, settingsRow);
  if (!isHeader) {
    autoFillMappingByTable(headerTable, '$h', row, settingsRow);
  }
}

function createRow(settingsRow: MetaObjectRecordsSettingsRow): any {
  const row: any = {
    uid: settingsRow.uid,
    sourceUid: settingsRow.sourceUid,
    direction: settingsRow.direction,
    condition: settingsRow.condition,
  };

  settingsRow.columns.forEach((column) => {
    row[column.destinationColumnUid] = column.expression;
  });

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
  const settingsRow = getSettingsRow(row);
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

  emit('change');
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

  emit('change');
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

  const settingsRow = getSettingsRow(row);
  if (settingsRow) {
    settingsRow.setValue(columnName, row[columnName]);
  }

  if (columnName === 'sourceUid') {
    autoFillMapping(row);
  }

  emit('change');
}

function onRowDeleteClick(row: any): void {
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

function onRowCopyClick(row: any): void {
  const settingsRow = getSettingsRow(row);
  if (settingsRow) {
    const newSettingsRow = new MetaObjectRecordsSettingsRow(settingsRow);
    newSettingsRow.uid = Guid.create().toString();

    props.item.rows.push(newSettingsRow);

    const newRow = createRow(newSettingsRow);
    rows.value.push(newRow);
    emit('change');
  }
}

function onRowUpClick(row: any): void {
  UpDownHelper.up(rows.value, row);
  const settingsRow = getSettingsRow(row);
  if (settingsRow) {
    UpDownHelper.up(props.item.rows, settingsRow);
  }

  emit('change');
}

function onRowDownClick(row: any): void {
  UpDownHelper.down(rows.value, row);
  const settingsRow = getSettingsRow(row);
  if (settingsRow) {
    UpDownHelper.down(props.item.rows, settingsRow);
  }

  emit('change');
}

function onAutoCompleteSearch(event: any, row: any): void {
  if (!event.query.trim().length) {
    autoCompleteItems.value = prepareAutoCompleteItems(row);
  } else {
    autoCompleteItems.value = prepareAutoCompleteItems(row)
      .filter((str) => str.toLowerCase().startsWith(event.query.toLowerCase()));
  }
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
                    style="max-width:100px; min-width:100px; width: 100px;">
              <template #body="{data}">
                <a href="#"
                   class="mr-2 bs-row-action"
                   v-tooltip.top="$t('delete')"
                   tabindex="-1"
                   @click.prevent="onRowDeleteClick(data)">
                  <span class="pi pi-times text-red-500"></span>
                </a>
                <a href="#"
                   class="mr-2 bs-row-action"
                   v-tooltip.top="$t('copy')"
                   tabindex="-1"
                   @click.prevent="onRowCopyClick(data)">
                  <span class="pi pi-clone text-primary"></span>
                </a>
                <a href="#"
                   class="mr-2 bs-row-action"
                   v-tooltip.top="$t('up')"
                   tabindex="-1"
                   @click.prevent="onRowUpClick(data)">
                  <span class="pi pi-arrow-up text-primary"></span>
                </a>
                <a href="#"
                   class="mr-2 bs-row-action"
                   v-tooltip.top="$t('down')"
                   tabindex="-1"
                   @click.prevent="onRowDownClick(data)">
                  <span class="pi pi-arrow-down text-primary"></span>
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
<!--                <InputText v-model="data[field]"-->
<!--                           class="w-full border-noround"-->
<!--                           style="padding: 5px"-->
<!--                           size="small"-->
<!--                           autocomplete="off"></InputText>-->
                <AutoComplete v-model="data[field]"
                              class="w-full border-noround"
                              :input-style="inputStyle"
                              size="small"
                              :suggestions="autoCompleteItems"
                              @complete="(evt:any):any => onAutoCompleteSearch(evt, data)">

                </AutoComplete>

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
