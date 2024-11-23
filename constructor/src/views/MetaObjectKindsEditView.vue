<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed, onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import Menu from 'primevue/menu';
import MainTab from '@/components/metaObjectKindEditComponents/MainTab.vue';
import JsonViewComponent from '@/components/JsonViewComponent.vue';
import StandardFieldsTab from '@/components/metaObjectKindEditComponents/StandardColumnsTab.vue';
import DataTypeProvider from '@/dataProviders/dataTypeProvider';
import RecordsSettingsTab from '@/components/metaObjectKindEditComponents/RecordsSettingsTab.vue';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectKindsProvider from '../dataProviders/metaObjectKindsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import DataType from '../../../shared/src/models/dataType';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const provider = new MetaObjectKindsProvider();
const dataTypesProvider = new DataTypeProvider();
const toastHelper = new ToastHelper(useToast());
let buildNavigationMenu: any;

// Props
const props = defineProps({
  name: { type: String, required: true },
});

// Data
const isModified = ref(false);
const isWaiting = ref(true);
const settings = ref<MetaObjectKindSettings>(new MetaObjectKindSettings());
const jsonSettings = ref<string>('');
const activeTab = ref('main');
const dataTypes = ref<DataType[]>([]);

const formTitle = computed(() => `${t('metaObjectKind')}: ${settings.value.title}`);

const actions = ref<any[]>([]);
const navMenuItems = ref<any[]>([]);
const windowHeight = ref(window.innerHeight);

// Methods
function registerError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

async function updateAsync(): Promise<void> {
  // Get datatypes
  if (!dataTypes.value.length) {
    const dataTypeResponse = await dataTypesProvider.getDataTypes();
    if (dataTypeResponse.isOK) {
      dataTypes.value = dataTypeResponse.data;
    } else {
      registerError(dataTypeResponse);
    }
  }

  if (props.name === '_new') {
    isWaiting.value = false;
    settings.value = new MetaObjectKindSettings();
    return;
  }

  isWaiting.value = true;
  const response = await provider.getSettingsItemByName(props.name);
  isWaiting.value = false;

  if (response.isOK) {
    settings.value = new MetaObjectKindSettings(response.data);
    buildNavigationMenu();
    console.log('Settings loaded', settings.value);
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

async function saveAsync(): Promise<boolean> {
  let result = false;
  isWaiting.value = true;

  if (settings.value.isNew()) {
    const responseInsert = await provider.insert(settings.value);
    if (responseInsert.isOK) {
      isModified.value = false;
      toastHelper.success(responseInsert.message);
      result = true;
      settings.value = responseInsert.data;
    } else {
      toastHelper.error(responseInsert.message);
      console.error(responseInsert.presentation);
    }
  } else {
    const responseUpdate = await provider.update(settings.value);
    if (responseUpdate.isOK) {
      isModified.value = false;
      toastHelper.success(responseUpdate.message);
      result = true;
    } else {
      toastHelper.error(responseUpdate.message);
      console.error(responseUpdate.presentation);
    }
  }
  isWaiting.value = false;

  return result;
}

function downloadJson(): void {
  jsonSettings.value = JSON.stringify(settings.value, null, 2);

  const blob = new Blob([jsonSettings.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create a link and trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${settings.value.title}.json`; // Name of the file to be downloaded
  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link and revoking the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function navigateToList(): void {
  router.push('/metadata-kinds');
}

// Event handlers
watch(
  () => props.name,
  async () => {
    await updateAsync();
  },
);

function onBackClick(): void {
  navigateToList();
}

async function onSaveCloseClick(): Promise<void> {
  const saveResult = await saveAsync();
  if (saveResult) {
    navigateToList();
  }
}

function onSaveClick(): void {
  saveAsync();
}

function onSettingsChanged(): void {
  isModified.value = true;
}

function onNavTabClick(tabName: string): void {
  if (tabName === 'json') {
    jsonSettings.value = JSON.stringify(settings.value, null, 2);
  }
  activeTab.value = tabName;
}

function onDownloadJson(): void {
  downloadJson();
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

function onCanCreateRecordsChange(): void {
  isModified.value = true;
  buildNavigationMenu();
}

// Life cycle hooks
onBeforeMount(() => {
  buildNavigationMenu = () => {
    navMenuItems.value = [];

    navMenuItems.value.push({
      label: t('main'),
      command: () => onNavTabClick('main'),
    });

    navMenuItems.value.push({
      label: t('standardColumns'),
      command: () => onNavTabClick('standard_columns'),
    });

    if (settings.value.canCreateRecords) {
      navMenuItems.value.push({
        label: t('records'),
        command: () => onNavTabClick('records'),
      });
    }

    navMenuItems.value.push({
      label: 'JSON',
      command: () => onNavTabClick('json'),
    });
  };

  buildNavigationMenu();

  actions.value = [
    {
      label: 'JSON',
      icon: 'pi pi-download',
      command: () => onDownloadJson(),
    },
  ];
});

onMounted(async () => {
  await updateAsync();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
  <div>
    <!--View title-->
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="formTitle"
                            :is-modified="isModified"
                            :is-waiting="isWaiting" />
      </div>
    </div>
    <!--Buttons-->
    <div class="col-12">
      <ButtonGroup>
        <Button
          :label="$t('back')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-arrow-left"
          @click="onBackClick"
        />
        <Button
          :label="$t('saveAndClose')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveCloseClick"
        />
        <Button
          :label="$t('save')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveClick"
        />
      </ButtonGroup>
      <SplitButton
        :label="$t('actions')"
        severity="primary"
        size="small"
        class="ml-1"
        outlined
        :model="actions"
      />
    </div>

    <div class="grid">
      <Divider class="m-2" />
    </div>
    <!--Settings edit-->
    <div class="grid">
      <div class="col-fixed bs-nav-panel h-screen" style="width: 220px;">
        <Menu :model="navMenuItems"></Menu>
      </div>
      <div class="col">
        <div v-if="activeTab=='main'">
          <MainTab :settings="settings"
                   :window-height="windowHeight"
                   @change="onSettingsChanged"
                   @canCreateRecordsChange="onCanCreateRecordsChange"></MainTab>
        </div>
        <div v-if="activeTab == 'standard_columns'">
          <StandardFieldsTab :settings="settings"
                             :window-height="windowHeight"
                             :data-types="dataTypes"
                             @change="onSettingsChanged"></StandardFieldsTab>
        </div>
        <div v-if="activeTab == 'records'">
          <RecordsSettingsTab :settings="settings"
                              :window-height="windowHeight"
                              @change="onSettingsChanged"></RecordsSettingsTab>
        </div>
        <div v-if="activeTab == 'json'">
          <JsonViewComponent :json="jsonSettings"></JsonViewComponent>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
