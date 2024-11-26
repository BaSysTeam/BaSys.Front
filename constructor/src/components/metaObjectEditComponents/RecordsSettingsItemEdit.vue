<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectRecordsSettingsItem from '../../../../shared/src/models/metaObjectRecordsSettingsItem';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
  kindSettings: {
    type: Object as PropType<MetaObjectKindSettings>,
    required: true,
  },
  destinationSettings: {
    type: Object as PropType<MetaObjectStorableSettings[]>,
    required: true,
  },
  item: {
    type: Object as PropType<MetaObjectRecordsSettingsItem>,
    required: true,
  },
});

// Data
const title = computed(() => {
  const destination = props.destinationSettings.find(
    (item) => item.uid === props.item.destinationMetaObjectUid,
  );

  return destination ? destination.title : '';
});

// Emits
const emit = defineEmits({
  change: () => true,
  up: () => true,
  down: () => true,
  remove: () => true,
});

// Methods

// Event handlers
function onAddClick(): void {
  console.log('On add click');
}

function onUpClick(): void {
  console.log('On up click');
  emit('up');
}

function onDownClick(): void {
  console.log('On down click');
  emit('down');
}

function onRemoveClick(): void {
  console.log('On remove click');
  emit('remove');
}

// Life cycle hooks
</script>

<template>
  <Card>
    <template #header>
      <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
        <template #start>
          <Button icon="pi pi-plus"
                  v-tooltip.top="$t('add')"
                  class="mr-2"
                  severity="primary"
                  size="small"
                  text
                  @click="onAddClick" />

          <Button icon="pi pi-arrow-up"
                  v-tooltip.top="$t('up')"
                  class="mr-2"
                  severity="primary"
                  size="small"
                  text
                  @click="onUpClick" />

          <Button icon="pi pi-arrow-down"
                  v-tooltip.top="$t('down')"
                  class="mr-2"
                  severity="primary"
                  size="small"
                  text
                  @click="onDownClick" />

        </template>
        <template #end>
          <span class="text-primary">{{title}}</span>
          <Button icon="pi pi-times"
                  v-tooltip.top="$t('delete')"
                  class="mr-2"
                  severity="danger"
                  size="small"
                  text
                  @click="onRemoveClick" />
        </template>
      </Toolbar>
    </template>
    <template #content>
      <div>{{item.destinationMetaObjectUid}}</div>
    </template>
  </Card>

</template>

<style scoped>

</style>
