<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import FormulaEditDialog from '@/components/metaObjectEditComponents/FormulaEditDialog.vue';
import ControlKind from '../../../../shared/src/models/controlKind';
import ControlKindDefaults from '../../../../shared/src/dataProviders/controlKindDefaults';
import DataType from '../../../../shared/src/models/dataType';
import DataTypeDefaults from '../../../../shared/src/dataProviders/dataTypeDefaults';
import MetaObjectTableColumn from '../../../../shared/src/models/metaObjectTableColumn';

// @component
const name = 'ColumnPropertiesPanel';

// Props
const props = defineProps({
  column: {
    type: Object as PropType<MetaObjectTableColumn>,
    required: true,
  },
  dataTypes: {
    type: Object as PropType<DataType[]>,
    required: true,
  },
});

// Data
const controlKinds = ref<ControlKind[]>([]);
const isFormulaDialogOpen = ref(false);

// Emits
const emit = defineEmits({ change: () => true });

function prepareControlKinds(): void {
  const allControls = ControlKindDefaults.AllItems();
  controlKinds.value = [];

  allControls.forEach((control:any) => {
    const findResult = control.appliesFor.find((x:any) => x.uid === props.column.dataTypeUid);
    if (findResult) {
      controlKinds.value.push(control);
    }
  });
}

// Watch
watch(() => props.column, (newValue, oldValue) => {
  if (newValue.dataTypeUid !== oldValue.dataTypeUid) {
    prepareControlKinds();
  }
});

function onChange(): void {
  emit('change');
}

function onDataTypeChange(): void {
  prepareControlKinds();
  emit('change');
}

function onFormulaOpenClick(): void {
  isFormulaDialogOpen.value = true;
}

function onFormulaDialogClose(): void {
  isFormulaDialogOpen.value = false;
}

function onFormulaDialogSave(expression: string): void {
  isFormulaDialogOpen.value = false;
  props.column.formula = expression;
  emit('change');
}

function isString(dataTypeUid: string): boolean {
  return DataTypeDefaults.String.uid === dataTypeUid;
}

function isNumber(dataTypeUid: string): boolean {
  return DataTypeDefaults.Decimal.uid === dataTypeUid;
}

function isColumnDisabled(): boolean {
  return props.column.isStandard;
}

onBeforeMount(() => {
  prepareControlKinds();
});

</script>

<template>
<Accordion :multiple="true" :active-index="[0, 1, 2]">
  <AccordionTab :header="$t('mainTab')">
    <div class="grid">
      <div class="col-12">
        <!--Title-->
        <div class="field grid">
          <label for="prop-title" class="col-4 bs-label bs-required">{{$t('title')}}</label>
          <div class="col-8">
            <InputText id="prop-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="column.title"
                       @change="onChange"></InputText>
          </div>
        </div>

        <!--Name-->
        <div class="field grid">
          <label for="prop-name" class="col-4 bs-label bs-required">{{$t('name')}}</label>
          <div class="col-8">
            <InputText id="prop-name"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       :disabled="isColumnDisabled()"
                       v-model="column.name"
                       @change="onChange"></InputText>
          </div>
        </div>

      </div>
    </div>
  </AccordionTab>
  <AccordionTab :header="$t('data')">

    <!--Data type-->
    <div class="field grid">
      <label for="column-data-type"
             class="col-4 bs-label bs-required">{{$t('dataType')}}</label>
      <div class="col-8">
        <Dropdown id="column-data-type"
                  size="small"
                  class="w-full"
                  :options="dataTypes"
                  :disabled="isColumnDisabled()"
                  option-label="title"
                  option-value="uid"
                  v-model="column.dataTypeUid"
                  @change="onDataTypeChange"></Dropdown>
      </div>
    </div>

    <!--Number digits-->
    <div class="field grid" v-if="isNumber(column.dataTypeUid)">
      <label for="column-number-digits"
             class="col-4 bs-label">{{$t('numberDigits')}}</label>
      <div class="col-8">
        <InputNumber id="column-number-digits"
                     v-model="column.numberDigits"
                     class="w-full"
                     size="small"
                     show-buttons
                     :min="0"
                     :min-fraction-digits="0"
                     :max-fraction-digits="0"
                     :disabled="isColumnDisabled()"
                     @update:model-value="onChange"></InputNumber>
      </div>
    </div>

    <!--String length-->
    <div class="field grid" v-if="isString(column.dataTypeUid)">
      <label for="column-string-length"
             class="col-4 bs-label">{{$t('stringLength')}}</label>
      <div class="col-8">
        <InputNumber id="column-string-length"
                     v-model="column.stringLength"
                     class="w-full"
                     size="small"
                     show-buttons
                     :step="10"
                     :min ="0"
                     :min-fraction-digits="0"
                     :max-fraction-digits="0"
                     :disabled="isColumnDisabled()"
                     @update:model-value="onChange"></InputNumber>
      </div>
    </div>

    <!--Primary key-->
    <div class="field grid">
      <label for="column-primary-key"
             class="col-4 bs-label">{{$t('primaryKey')}}</label>
      <div class="col-8">
        <InputSwitch id="column-primary-key"
                     v-model="column.primaryKey"
                     :disabled="isColumnDisabled()"
                     @change="onChange"></InputSwitch>
      </div>
    </div>

    <!--Unique-->
    <div class="field grid" v-if="!column.primaryKey">
      <label for="column-unique"
             class="col-4 bs-label">{{$t('unique')}}</label>
      <div class="col-8">
        <InputSwitch id="column-unique"
                     v-model="column.unique"
                     :disabled="isColumnDisabled()"
                     @change="onChange"></InputSwitch>
      </div>
    </div>

    <!--Required-->
    <div class="field grid" v-if="!column.primaryKey">
      <label for="column-required"
             class="col-4 bs-label">{{$t('required')}}</label>
      <div class="col-8">
        <InputSwitch id="column-required"
                     v-model="column.required"
                     :disabled="isColumnDisabled()"
                     @change="onChange"></InputSwitch>
      </div>
    </div>

    <!--Formula-->
    <div class="field grid">
      <label for="prop-formula" class="col-4 bs-label bs-required">{{$t('formula')}}</label>
      <div class="col-8">
        <InputGroup>
          <InputText id="prop-formula"
                     size="small"
                     autocomplete="off"
                     class="w-full"
                     :disabled="isColumnDisabled()"
                     v-model="column.formula"
                     @change="onChange"></InputText>
          <Button icon="pi pi-search"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="onFormulaOpenClick"></Button>
        </InputGroup>

      </div>
    </div>
  </AccordionTab>
  <AccordionTab :header="$t('render')">
    <!--Control kind-->
    <div class="field grid">
      <label for="column-control-kind"
             class="col-4 bs-label">{{$t('uiControl')}}</label>
      <div class="col-8">
        <Dropdown id="column-control-kind"
                  size="small"
                  class="w-full"
                  :options="controlKinds"
                  :disabled="isColumnDisabled()"
                  option-label="title"
                  option-value="uid"
                  v-model="column.renderSettings.controlKindUid"
                  @change="onChange"></Dropdown>
      </div>
    </div>
  </AccordionTab>
</Accordion>

  <FormulaEditDialog :title="$t('formula')"
                     :expression="column.formula"
                     v-if="isFormulaDialogOpen"
                     @close="onFormulaDialogClose"
                     @save="onFormulaDialogSave"></FormulaEditDialog>
</template>

<style scoped>
.field.grid {
  margin-bottom: 0.5rem;
}

.bs-label{
  margin-bottom: 0;
}
</style>
