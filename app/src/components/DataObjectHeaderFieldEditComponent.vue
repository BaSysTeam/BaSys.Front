<script setup lang="ts">
import {
  defineProps, defineEmits, reactive, ref, watch, onMounted,
} from 'vue';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import DataObject from '@/models/dataObject';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

// @component
const name = 'DataObjectHeaderFieldEditComponent';

// Props
const props = defineProps({
  column: { type: MetaObjectTableColumn, required: true },
  item: { type: DataObject, required: true },
  isPrimaryKeyEnabled: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits({
  change: () => true,
});

const itemReactive = reactive(props.item);

// Events
function onChange(): void {
  emit('change');
}

</script>

<template>
  <label :for="column.uid"
         :class="{ 'bs-required': column.required }"
         class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>

  <div class="col-12 md:col-8" v-if="column.primaryKey">

    <PrimaryKeyInput v-model="itemReactive.header[column.name]"
                     :id="column.uid"
                     :is-disabled="!isPrimaryKeyEnabled"
                     @change="onChange" ></PrimaryKeyInput>

  </div>
</template>

<style scoped>

</style>
