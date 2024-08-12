<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onMounted,
} from 'vue';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// @component
const name = 'HeaderFieldsTab';

// Data
const selectedItem = ref(null);

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
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

</script>

<template>
  <div class="grid">
    <div class="col-6">
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
      <Listbox v-if="settings"
               v-model="selectedItem"
               :options="settings.header.columns"
               option-label="title"></Listbox>
    </div>
  </div>

</template>

<style scoped>

</style>
