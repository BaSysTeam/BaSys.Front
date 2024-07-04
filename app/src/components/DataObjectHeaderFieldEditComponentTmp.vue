<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, reactive, ref, watch, onMounted, onBeforeMount,
} from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import MetaObjectColumnFlags from '@/models/MetaObjectColumnFlags';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

// @component
const name = 'DataObjectHeaderFieldEditComponentTmp';

// Props
const props = defineProps({
  modelValue: {
    type: Object as PropType<any>,
    required: true,
  },
  column: {
    type: Object as PropType<MetaObjectTableColumn>,
    required: true,
  },
  dataTypes: {
    type: Object as PropType<DataType[]>,
    required: true,
  },
  isPrimaryKeyEnabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits({
  'update:modelValue': (value: any) => true,
  change: () => true,
});

const inputValue = ref(props.modelValue);
let columnFlags = reactive(new MetaObjectColumnFlags(null, []));

// Watch
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});

watch(() => props.column, (newValue) => {
  columnFlags = new MetaObjectColumnFlags(props.column, props.dataTypes);
});

// Events
function onChange(): void {
  console.log('input value changed', inputValue.value);
  emit('update:modelValue', inputValue.value);
  emit('change');
}

// Life cycle hooks
onBeforeMount(() => {
  console.log('onBeforeMount');
  columnFlags = new MetaObjectColumnFlags(props.column, props.dataTypes);
  console.log('header field values', props.modelValue, inputValue);
});

onMounted(() => {
  console.log('onMounted');
});

</script>

<template>
  <label :for="column.uid"
         :class="{ 'bs-required': column.required }"
         class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>

  <div class="col-12 md:col-8" v-if="columnFlags.isPrimaryKey">

    <PrimaryKeyInput v-model="inputValue"
                     :id="column.uid"
                     :is-disabled="!isPrimaryKeyEnabled"
                     @change="onChange"></PrimaryKeyInput>

  </div>

  <div class="col-12 md:col-8" v-if="columnFlags.isString">
    <!--String input-->
    <InputText :id="column.uid"
               v-model="inputValue"
               autocomplete="off"
               size="small"
               class="w-full"
               @change="onChange"
    />
  </div>

  <!--Integer input-->
  <div class="col-12 md:col-4" v-if="columnFlags.isInt">
    <InputNumber :id="column.uid"
                 v-model="inputValue"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange"
    />
  </div>

  <!--Number input-->
  <div class="col-12 md:col-4" v-if="columnFlags.isNumber">
    <InputNumber :id="column.uid"
                 v-model="inputValue"
                 :min-fraction-digits="column.numberDigits"
                 :max-fraction-digits="column.numberDigits"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange"
    />
  </div>

  <!--Checkbox-->
  <div class="col-12 md:col-4" v-if="columnFlags.isBoolean">
    <Checkbox :id="column.uid"
              :binary="true"
              v-model="inputValue"
              @change="onChange">
    </Checkbox>
  </div>

  <!--Calendar-->
  <div class="col-12 md:col-4" v-if="columnFlags.isDate">
    <Calendar :id="column.uid"
              :show-time="false"
              :show-icon="true"
              :show-button-bar="true"
              iconDisplay="input"
              date-format="dd.mm.yy"
              class="w-full"
              v-model="inputValue"
              @update:model-value="onChange"></Calendar>

  </div>

</template>

<style scoped>

</style>
