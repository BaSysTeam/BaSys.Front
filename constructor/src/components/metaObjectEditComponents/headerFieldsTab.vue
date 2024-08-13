<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
import ColumnPropertiesPanel from '@/components/metaObjectEditComponents/columnPropertiesPanel.vue';
import DataType from '../../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// @component
const name = 'HeaderFieldsTab';

// Data
const selectedItem:any = ref(null);

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
  dataTypes: {
    type: Object as PropType<DataType[]>,
    required: true,
  },
});

// Emits
const emit = defineEmits({ change: () => true });

function onAddClick(): void {
  console.log('AddClick', props.settings);
}

function onCopyClick(): void {
  console.log('CopyClick');
}

function onDeleteClick(): void {
  console.log('DeleteClick');
}

function onPropertiesChange(): void {
  emit('change');
}

onBeforeMount(() => {
  if (props.settings.header.columns.length) {
    // eslint-disable-next-line prefer-destructuring
    selectedItem.value = props.settings.header.columns[0];
  }
});

</script>

<template>
  <div class="grid">
    <div class="col-6 h-screen" style="border-right: 1px solid #ececec;">
      <!--List command panel-->
      <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
        <template #start>
          <Button icon="pi pi-plus"
                  severity="primary"
                  size="small"
                  text
                  @click="onAddClick" />
          <Button icon="pi pi-copy"
                  severity="primary"
                  size="small"
                  text
                  @click="onCopyClick" />
          <Button icon="pi pi-times"
                  severity="danger"
                  size="small"
                  text
                  @click="onDeleteClick" />
        </template>
      </Toolbar>
      <!--Columns list-->
      <Listbox v-if="settings"
               v-model="selectedItem"
               :options="settings.header.columns"
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
