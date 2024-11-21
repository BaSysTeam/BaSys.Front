<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
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
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectKindsProvider from '../dataProviders/metaObjectKindsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const provider = new MetaObjectKindsProvider();
const toastHelper = new ToastHelper(useToast());

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

const formTitle = computed(() => `${t('metaObjectKind')}: ${settings.value.title}`);

const actions = ref<any[]>([]);
const navMenuItems = ref<any[]>([]);

// Methods
async function updateAsync(): Promise<void> {
  if (props.name === '_new') {
    settings.value = new MetaObjectKindSettings();
    return;
  }

  isWaiting.value = true;
  const response = await provider.getSettingsItemByName(props.name);
  isWaiting.value = false;

  if (response.isOK) {
    settings.value = new MetaObjectKindSettings(response.data);
    console.log('Settings loaded', settings.value);
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
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

function onSaveCloseClick(): void {
  console.log('Save close click');
}

function onSaveClick(): void {
  console.log('Save click');
}

function onSettingsChanged(): void {
  isWaiting.value = true;
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

// Life cycle hooks
onBeforeMount(() => {
  navMenuItems.value.push({
    label: t('main'),
    command: () => onNavTabClick('main'),
  });

  navMenuItems.value.push({
    label: 'JSON',
    command: () => onNavTabClick('json'),
  });

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
                   @change="onSettingsChanged"></MainTab>
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
