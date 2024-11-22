<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import DataType from '../../../../shared/src/models/dataType';
import MetaObjectKindStandardColumn from '../../../../shared/src/models/metaObjectKindStandardColumn';
import DataTypeDefaults from '../../../../shared/src/dataProviders/dataTypeDefaults';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  column: {
    type: Object as PropType<MetaObjectKindStandardColumn>,
    required: true,
  },
  dataTypes: {
    type: Object as PropType<DataType[]>,
    required: true,
  },
  windowHeight: {
    type: Number,
    required: true,
  },
});

// Data
const containerStyle = computed(() => ({
  height: `${props.windowHeight - 180}px`,
  overflowY: 'auto',
}));

// Emits
const emit = defineEmits({ change: () => true });

// Methods
function isColumnDisabled(): boolean {
  return false;
}

function isString(dataTypeUid: string): boolean {
  return DataTypeDefaults.String.uid === dataTypeUid;
}

function isNumber(dataTypeUid: string): boolean {
  return DataTypeDefaults.Decimal.uid === dataTypeUid;
}

// Event handlers
function onChange(): void {
  emit('change');
}

// Life cycle hooks
</script>

<template>
  <div :style="containerStyle">
  <Accordion :multiple="true" :active-index="[0, 1, 2]">
    <AccordionTab :header="$t('mainTab')">
      <div class="grid">
        <div class="col-12">

          <!--Title-->
          <FieldGridComponent :title="$t('title')"
                              :required="true"
                              label-for="fld-title">
            <InputText id="fld-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="column.title"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Name-->
          <FieldGridComponent :title="$t('name')"
                              :required="true"
                              label-for="fld-name">
            <InputText id="fld-name"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="column.name"
                       @change="onChange"></InputText>
          </FieldGridComponent>

        </div>
      </div>
    </AccordionTab>
    <AccordionTab :header="$t('data')">
      <div class="grid">
        <div class="col-12">

          <!--Data type-->
          <FieldGridComponent :title="$t('dataType')"
                              :required="true"
                              label-for="fld-data-types">
            <Dropdown id="fld-data-types"
                      size="small"
                      class="w-full"
                      :options="dataTypes"
                      :disabled="isColumnDisabled()"
                      option-label="title"
                      option-value="uid"
                      v-model="column.dataTypeUid"
                      @change="onChange"></Dropdown>
          </FieldGridComponent>

          <!--Number digits-->
          <FieldGridComponent :title="$t('numberDigits')"
                              label-for="fld-number-digits"
                              v-if="isNumber(column.dataTypeUid)">

            <InputNumber id="fld-number-digits"
                         v-model="column.numberDigits"
                         class="w-full"
                         size="small"
                         show-buttons
                         :min="0"
                         :min-fraction-digits="0"
                         :max-fraction-digits="0"
                         :disabled="isColumnDisabled()"
                         @update:model-value="onChange"></InputNumber>

          </FieldGridComponent>

          <!--String length-->
          <FieldGridComponent :title="$t('stringLength')"
                              label-for="fld-string-length"
                              v-if="isString(column.dataTypeUid)">
            <InputNumber id="fld-string-length"
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
          </FieldGridComponent>

          <!--Primary key-->
          <FieldGridComponent :title="$t('primaryKey')"
                              label-for="fld-primary-key">
            <InputSwitch id="fld-primary-key"
                         v-model="column.isPrimaryKey"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>

          <!--Required-->
          <FieldGridComponent :title="$t('required')"
                              label-for="fld-required">
            <InputSwitch id="fld-required"
                         v-model="column.required"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>

          <!--Unique-->
          <FieldGridComponent :title="$t('unique')"
                              label-for="fld-unique">
            <InputSwitch id="fld-unique"
                         v-model="column.isUnique"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>

        </div>
      </div>

    </AccordionTab>
    <AccordionTab :header="$t('other')">
      <div class="grid">
        <div class="col-12">

          <!--Memo-->
          <FieldGridComponent :title="$t('memo')" label-for="fld-memo">
            <Textarea id="fld-memo"
                size="small"
                autocomplete="off"
                class="w-full"
                rows="3"
                v-model="column.memo"
                @change="onChange"></Textarea>
          </FieldGridComponent>

        </div>
      </div>
    </AccordionTab>
  </Accordion>
  </div>
</template>

<style scoped>

</style>
