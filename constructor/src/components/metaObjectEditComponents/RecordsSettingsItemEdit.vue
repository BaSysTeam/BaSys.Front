<script setup lang="ts">
import {
  computed, defineEmits, defineProps, onBeforeMount, onMounted, PropType, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import Toolbar from 'primevue/toolbar';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectRecordsSettingsItem
  from '../../../../shared/src/models/metaObjectRecordsSettingsItem';
import MetaObjectRecordsSettingsRow
  from '../../../../shared/src/models/metaObjectRecordsSettingsRow';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
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
function initColumns(): void {
  columns.value = [];

  const columnDirection = {
    name: 'direction',
    title: '+/-',
    width: '30px',
  };
  columns.value.push(columnDirection);

  const columnSource = {
    name: 'sourceUid',
    title: 'Source',
    width: 'auto',
  };
  columns.value.push(columnSource);
}

function createRow(settingsRow: MetaObjectRecordsSettingsRow): any {
  return {
    uid: settingsRow.uid,
    sourceUid: settingsRow.sourceUid,
    direction: settingsRow.direction,
  };
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

// Event handlers
function onAddClick(): void {
  // Add row to data item.
  const newSettingsRow = new MetaObjectRecordsSettingsRow(null);
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
  console.log('CellEdited');
  const row = event.data;
  const columnName: string = event.field as string;
  const newRow = event.newData;

  row[columnName] = newRow[columnName];
}

function onRowDeleteClick(row: any): void {
  console.log('RowDeleteClick', row);
}

// Life cycle hooks
onBeforeMount(() => {
  directionItems.value.push({ title: '+', value: 0 });
  directionItems.value.push({ title: '-', value: 1 });
});

onMounted(() => {
  init();
});

</script>

<template>
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
                  @click="onAddClick" />

          <Button icon="pi pi-arrow-up"
                  v-tooltip.top="$t('up')"
                  class="mr-2"
                  severity="primary"
                  size="small"
                  text
                  @click="onUpClick" />

          <Button icon="pi pi-arrow-down"
                  v-tooltip.top="$t('down')"
                  class="mr-2"
                  severity="primary"
                  size="small"
                  text
                  @click="onDownClick" />

        </template>
        <template #end>
          <span class="text-primary">{{title}}</span>
          <Button icon="pi pi-times"
                  v-tooltip.top="$t('delete')"
                  class="mr-2"
                  severity="danger"
                  size="small"
                  text
                  @click="onRemoveClick" />
        </template>
      </Toolbar>
    </template>
    <template #content>
      <DataTable
        v-model:selection="selectedRecord"
        :style="dataTableStyle"
        :value="rows"
        :metaKeySelection="true"
        data-key="uid"
        showGridlines
        selectionMode="single"
        size="small"
        edit-mode="cell"
        @cell-edit-complete="onCellEditComplete"
        :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }:any) => ({
                        class: [{ 'p-0': state['d_editing'] }]
                    })
                }
            }"
      >
        <Column header="" style="max-width:50px; min-width:50px; width: 50px;">
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
                style="max-width:60px; min-width:60px; width: 60px;">
          <template #body="{data}">
            {{directionDisplay(data)}}
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
        <Column header="Source" field="source"></Column>
      </DataTable>
    </template>
  </Card>

</template>

<style>
.bs-records-settings-item .p-card-body{
  padding: 0;
}

td.p-editable-column.p-cell-editing{
  padding: 0!important;
}

.bs-row-action span{
  font-size: 12px!important;
}

.p-tabview-nav-link  {
  padding: 0.5rem!important;
}
</style>
