<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, computed, onBeforeMount, onBeforeUnmount, onMounted,
} from 'vue';
import { Guid } from 'guid-typescript';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import ColumnPropertiesPanel from '@/components/metaObjectEditComponents/ColumnPropertiesPanel.vue';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
import DataType from '../../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// Infrastructure
const confirmVue = useConfirm();
const { t } = useI18n({ useScope: 'global' });

// Data
const selectedItem:any = ref(null);
const windowHeight = ref(window.innerHeight);
const listStyle = computed(() => ({ height: `${windowHeight.value - 200}px` }));

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

function deleteColumn(): void {
  const indexToDelete = props.settings.header.columns.findIndex(
    (column) => column.uid === selectedItem.value.uid,
  );
  if (indexToDelete > -1) {
    props.settings.header.columns.splice(indexToDelete, 1);

    if (props.settings.header.columns.length) {
      // eslint-disable-next-line prefer-destructuring
      selectedItem.value = props.settings.header.columns[0];
    }
  }

  emit('change');
}

function onAddClick(): void {
  const newColumn = props.settings.header.newColumn(null);
  newColumn.title = `New column ${props.settings.header.columns.length}`;
  selectedItem.value = newColumn;

  emit('change');
}

function onCopyClick(): void {
  if (!selectedItem.value) {
    return;
  }
  if (selectedItem.value.isStandard) {
    return;
  }

  const newColumn = props.settings.header.newColumn(selectedItem.value);
  newColumn.uid = Guid.create().toString();
  newColumn.title = `${newColumn.title} - copy`;
  newColumn.name = '';
  selectedItem.value = newColumn;

  emit('change');
}

function onDeleteClick(): void {
  if (!selectedItem.value) {
    return;
  }
  if (selectedItem.value.isStandard) {
    return;
  }

  confirmVue.require({
    message: t('deleteColumnQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteColumn(),
  });
}

function onPropertiesChange(): void {
  emit('change');
}

function onUpClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.up(props.settings.header.columns, selectedItem.value);

  emit('change');
}

function onDownClick(): void {
  if (!selectedItem.value) {
    return;
  }
  UpDownHelper.down(props.settings.header.columns, selectedItem.value);

  emit('change');
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

onBeforeMount(() => {
  if (props.settings.header.columns.length) {
    // eslint-disable-next-line prefer-destructuring
    selectedItem.value = props.settings.header.columns[0];
  }
});

onMounted(() => {
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
  <div class="grid">
    <div class="col-6 h-screen" style="border-right: 1px solid #ececec;">
      <!--List command panel-->
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
      <!--Columns list-->
      <Listbox v-if="settings"
               v-model="selectedItem"
               :options="settings.header.columns"
               :list-style="listStyle"
               option-label="title"
               :meta-key-selection="false">
        <template #option="{option, index}">
            <div>
              <Badge :value="index+1" severity="info"></Badge>
              <span class="ml-2">{{option.title}}</span>
              <span class="pi pi-lock ml-2" style="float:right" v-if="option.isStandard"></span>
              <span class="pi pi-key ml-2" style="float:right"
                    v-if="option.dataSettings.primaryKey"></span>
              <span class="ml-2 text-primary"
                    style="font-style: italic; float: right;"
                    v-if="option.formula">f(x)</span>
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
