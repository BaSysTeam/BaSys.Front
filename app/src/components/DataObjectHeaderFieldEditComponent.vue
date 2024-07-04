<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, reactive, ref, watch, onMounted,
} from 'vue';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

// @component
const name = 'DataObjectHeaderFieldEditComponent';

// Props
const props = defineProps({
  modelValue: { type: Object as PropType<any>, required: true },
  column: { type: Object as PropType<MetaObjectTableColumn>, required: true },
  isPrimaryKeyEnabled: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits({
  'update:modelValue': (value: any) => true,
  change: () => true,
});

const inputValue = ref(props.modelValue);

// Watch
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});

// Events
function onChange(): void {
  emit('update:modelValue', inputValue.value);
  emit('change');
}

// Life cycle hooks
onMounted(() => {
  inputValue.value = props.modelValue;
});

</script>

<template>
  <label :for="column.uid"
         :class="{ 'bs-required': column.required }"
         class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>

  <div class="col-12 md:col-8" v-if="column.primaryKey">

    <PrimaryKeyInput v-model="inputValue"
                     :id="column.uid"
                     :is-disabled="!isPrimaryKeyEnabled"
                     @change="onChange" ></PrimaryKeyInput>

  </div>
</template>

<style scoped>

</style>
