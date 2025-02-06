<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeMount,
  defineProps,
  defineEmits,
  computed,
  PropType,
  onBeforeUnmount,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import { Guid } from 'guid-typescript';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
import WorkflowParameter from '../../../../shared/src/models/workflowModel/workflowParameter';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const confirmVue = useConfirm();

// Props
const props = defineProps({
  parameters: {
    type: Array as PropType<WorkflowParameter[]>,
    required: true,
  },
});

// Data
const selectedRow = ref<any>(null);
const windowHeight = ref(window.innerHeight);
const parameterTypes = ref<any[]>([]);

const dataTableStyle = computed(() => ({ maxHeight: `${windowHeight.value - 150}px` }));
const dataTableScrollHeight = computed(() => `${windowHeight.value - 220}px`);
const inputStyle = ref<any>({
  width: '100%',
  fontSize: '14px',
  borderRadius: 0,
  padding: '5px',
});

// Emits
const emit = defineEmits({ change: () => true });

// Methods
function deleteRow(): void {
  if (!selectedRow.value) {
    return;
  }

  const ind = props.parameters.indexOf(selectedRow.value);
  if (ind > -1) {
    props.parameters.splice(ind, 1);
    if (props.parameters.length) {
      [selectedRow.value] = props.parameters;
    }
  }

  emit('change');
}

// Event handlers
function onAddClick(): void {
  props.parameters.push(new WorkflowParameter(null));

  emit('change');
}

function onCopyClick(): void {
  if (!selectedRow.value) {
    return;
  }

  const newParameter = new WorkflowParameter(selectedRow.value);
  newParameter.uid = Guid.create().toString();
  newParameter.name = `${selectedRow.value}_copy`;
  props.parameters.push(newParameter);

  emit('change');
}

function onDeleteClick(): void {
  if (!selectedRow.value) {
    return;
  }

  confirmVue.require({
    message: t('deleteItemQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteRow(),
  });
}

function onUpClick(): void {
  if (!selectedRow.value) {
    return;
  }

  UpDownHelper.up(props.parameters, selectedRow.value);

  emit('change');
}

function onDownClick(): void {
  if (!selectedRow.value) {
    return;
  }

  UpDownHelper.down(props.parameters, selectedRow.value);

  emit('change');
}

async function onCellEditComplete(event: any): Promise<void> {
  const row = event.data;
  const columnName: string = event.field as string;
  const newRow = event.newData;

  row[columnName] = newRow[columnName];
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

// Life cycle hooks
onBeforeMount(() => {
  parameterTypes.value.push({ text: 'string', value: 'string' });
  parameterTypes.value.push({ text: 'number', value: 'number' });
  parameterTypes.value.push({ text: 'date', value: 'date' });
  parameterTypes.value.push({ text: 'boolean', value: 'boolean' });
  parameterTypes.value.push({ text: 'integer', value: 'integer' });
  parameterTypes.value.push({ text: 'long', value: 'long' });
});

onMounted(async () => {
  window.addEventListener('resize', onResize);

  if (props.parameters.length > 0) {
    [selectedRow.value] = props.parameters;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});
</script>

<template>
  <div>
    <div class="grid">
      <div class="col-12">
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

      </div>
    </div>

    <div class="grid">
      <div class="col-12">
        <DataTable
          v-model:selection="selectedRow"
          v-model:value="props.parameters"
          :style="dataTableStyle"
          :scroll-height="dataTableScrollHeight"
          :metaKeySelection="false"
          showGridlines
          size="small"
          selectionMode="single"
          scrollable
          dataKey="uid"
          edit-mode="cell"
          @cellEditComplete="onCellEditComplete"
          :pt="{
                column: {
                    bodycell: ({ state }:any) => ({
                        class: [{ 'p-0': state['d_editing'] }]
                    })
                }
            }"
        >
          <template #empty>{{$t('noItemsFound')}} </template>
          <Column header="#" style="width: 50px">
            <template #body="currentRow">
              {{ currentRow.index + 1 }}
            </template>
          </Column>
          <Column field="name" :header="$t('name')" style="width: 150px">
            <template #body="{ data, field }">
              <span>{{data[field]}}</span>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]"
                         class="w-full border-noround"
                         :style="inputStyle"
                         size="small"
                         autocomplete="off"
                         autofocus="true"/>

            </template>
          </Column>
          <Column field="dataType" :header="$t('dataType')" style="width: 150px">
            <template #body="{ data, field }">
              <span>{{data[field]}}</span>
            </template>
            <template #editor="{ data, field }">
              <Dropdown :editable="true"
                        :options="parameterTypes"
                        :input-style="inputStyle"
                        :virtualScrollerOptions="{ itemSize: 38 }"
                        v-model="data[field]"
                        size="small"
                        option-label="text"
                        option-value="value"
                        class="w-full border-noround"></Dropdown>

            </template>
          </Column>
          <Column field="value" :header="$t('value')">
            <template #body="{ data, field }">
              <span>{{data[field]}}</span>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]"
                         class="w-full border-noround"
                         style="padding: 5px"
                         size="small"
                         autocomplete="off"
                         autofocus="true"/>

            </template>
          </Column>
          </DataTable>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
