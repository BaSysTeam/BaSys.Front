<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import ColumnPropertiesPanel from '@/components/metaObjectKindEditComponents/ColumnPropertiesPanel.vue';
import Listbox from 'primevue/listbox';
import Badge from 'primevue/badge';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
import DataType from '../../../../shared/src/models/dataType';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectKindSettings>,
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
const selectedItem = ref<any>(null);
const listStyle = computed(() => ({ maxHeight: `${props.windowHeight - 220}px` }));

// Emits
const emit = defineEmits({ change: () => true });

// Methods

// Event handlers
function onAddClick(): void {
  console.log('onAddClick');
}

function onCopyClick(): void {
  console.log('onCopyClick');
}

function onDeleteClick(): void {
  console.log('onDeleteClick');
}

function onUpClick(): void {
  console.log('onUpClick');
}

function onDownClick(): void {
  console.log('onDownClick');
}

function onPropertiesChange(): void {
  console.log('onPropertiesChange');
}

// Life cycle hooks
onBeforeMount(() => {
  if (props.settings.standardColumns.length) {
    // eslint-disable-next-line prefer-destructuring
    selectedItem.value = props.settings.standardColumns[0];
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
               :list-style="listStyle"
               :options="settings.standardColumns"
               option-label="title">
        <template #option="{option, index}">
          <div>
            <Badge :value="index+1" severity="info"></Badge>
            <span class="ml-2">{{option.title}}</span>
            <span class="pi pi-key ml-2" style="float:right" v-if="option.isPrimaryKey"></span>

          </div>
        </template>
      </Listbox>
    </div>
    <div class="col-6">
      <!--Properties panel-->
      <ColumnPropertiesPanel :column="selectedItem"
                             :window-height="windowHeight"
                             :data-types="dataTypes"
                             v-if="selectedItem"
                             @change="onPropertiesChange"></ColumnPropertiesPanel>
    </div>
  </div>
</template>

<style scoped>

</style>
