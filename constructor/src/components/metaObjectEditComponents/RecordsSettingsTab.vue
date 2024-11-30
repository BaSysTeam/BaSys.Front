<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, computed, PropType, onDeactivated,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import RecordsSettingsItemEdit
  from '@/components/metaObjectEditComponents/RecordsSettingsItemEdit.vue';
import RecordsSettingsSelectDestinationDialog
  from '@/components/metaObjectEditComponents/RecordsSettingsSelectDestinationDialog.vue';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import EventEmitter from '@/utils/eventEmitter';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectRecordsSettingsItem from '../../../../shared/src/models/metaObjectRecordsSettingsItem';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const confirmVue = useConfirm();
const metaObjectProvider = new MetaObjectProvider();

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
});

// Data
const destinationSettings = ref<MetaObjectStorableSettings[]>([]);
const isSelectDestinationDialogOpen = ref<boolean>(false);
const destinationItems = computed(() => {
  const items: any[] = [];
  destinationSettings.value.forEach((item) => {
    items.push({ uid: item.uid, title: item.title });
  });

  return items;
});
const initialized = ref<boolean>(false);
const windowHeight = ref(window.innerHeight);
const windowWidth = ref(window.innerWidth);
const isMenuMinimized = ref<any>(false);

const containerStyle = computed(() => ({
  maxHeight: `${windowHeight.value - 180}px`,
  overflowY: 'auto',
}));

const containerWidth = computed(() => {
  if (isMenuMinimized.value === true) {
    return windowWidth.value - 300;
  }

  return windowWidth.value - 450;
});

// Emits
const emit = defineEmits({ change: () => true });

// Methods
async function initAsync(): Promise<void> {
  const responseDestinations = await metaObjectProvider.getSettingsListByKindUid(
    props.kindSettings.recordsSettings.storageMetaObjectKindUid,
  );

  if (responseDestinations.isOK) {
    responseDestinations.data.forEach((item) => {
      destinationSettings.value.push(new MetaObjectStorableSettings(item));
    });
  }
  initialized.value = true;
}

function deleteItem(item: any): void {
  const ind = props.settings.recordsSettings.indexOf(item);
  if (ind > -1) {
    props.settings.recordsSettings.splice(ind, 1);
  }
  emit('change');
}

// Event handlers
function onAddClick(): void {
  isSelectDestinationDialogOpen.value = true;
}

function onSelectDestinationClose(args: string): void {
  isSelectDestinationDialogOpen.value = false;

  if (args) {
    // Check existing current destination.
    const existingItem = props.settings.recordsSettings.find(
      (item: any) => item.destinationMetaObjectUid === args,
    );
    if (existingItem) {
      return;
    }

    // Add new records settings item for selected destination.
    const selectedItem = destinationSettings.value.find((item) => item.uid === args);
    if (selectedItem) {
      const newRecordsSettingsItem = new MetaObjectRecordsSettingsItem(
        { destinationMetaObjectUid: selectedItem.uid },
      );
      props.settings.recordsSettings.push(newRecordsSettingsItem);
    }
    emit('change');
  }
}

function onItemUp(item: any): void {
  UpDownHelper.up(props.settings.recordsSettings, item);
  emit('change');
}

function onItemDown(item: any): void {
  UpDownHelper.down(props.settings.recordsSettings, item);
  emit('change');
}

function onItemRemove(item: any): void {
  confirmVue.require({
    message: t('deleteItemQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteItem(item),
  });
}

function onItemChange(): void {
  emit('change');
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
  windowWidth.value = window.innerWidth;
}

// Life cycle hooks
onBeforeMount(() => {
  EventEmitter.on('burger-clicked', (args) => {
    // eslint-disable-next-line prefer-destructuring
    isMenuMinimized.value = args[0];
  });
});

onMounted(async () => {
  window.addEventListener('resize', onResize);
  windowHeight.value = window.innerHeight;
  await initAsync();
});

onDeactivated(() => {
  window.removeEventListener('resize', onResize);
});

</script>

<template>
<div class="grid">
  <div class="col-12">
    <Button
      :label="$t('add')"
      v-tooltip.top="$t('addRecordsSettingsItem')"
      severity="primary"
      size="small"
      outlined
      icon="pi pi-plus"
      @click="onAddClick"
    />
  </div>
</div>
  <div class="grid" v-if="initialized" :style="containerStyle">
    <div class="col-12">
      <div :key="item.destinationMetaObjectUid"
           v-for="item in settings.recordsSettings" style="margin-bottom: 3px;">
       <RecordsSettingsItemEdit :item="item"
                                :kind-settings="kindSettings"
                                :destination-settings="destinationSettings"
                                :settings="settings"
                                :container-width="containerWidth"
                                @up="onItemUp(item)"
                                @down="onItemDown(item)"
                                @remove="onItemRemove(item)"
                                @change="onItemChange"></RecordsSettingsItemEdit>
      </div>
    </div>
  </div>

<RecordsSettingsSelectDestinationDialog v-if="isSelectDestinationDialogOpen"
                                        :items="destinationItems"
                                        @close="onSelectDestinationClose">

</RecordsSettingsSelectDestinationDialog>
</template>

<style scoped>

</style>
