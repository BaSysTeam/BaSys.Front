<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import ConfirmDialog from 'primevue/confirmdialog';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import MainTab from '@/components/metaObjectMenuEditComponents/MainTab.vue';
import MenuSettingsTab from '@/components/metaObjectMenuEditComponents/MenuSettingsTab.vue';
import JsonViewComponent from '@/components/JsonViewComponent.vue';
import MetaMenusProvider from '@/dataProviders/metaMenusProvider';
import DataTypeProvider from '@/dataProviders/dataTypeProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import MenuSettings from '../../../shared/src/models/menuModel/menuSettings';

// Props
const props = defineProps({
  name: { type: String, required: false, default: '' },
});

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const dataTypesProvider = new DataTypeProvider();
const menuProvider = new MetaMenusProvider();

// Data
const kind = 'menu';
const activeTab = ref('main');
const settings = ref<MenuSettings>(new MenuSettings(null));
const jsonSettings = ref<string>('');
const isModified = ref(false);
const isWaiting = ref(true);
const formTitle = computed(() => `Menu.${settings.value.title}`);
const actionItems = ref<any[]>([]);
const navMenuItems = ref<any[]>([]);

// Methods
function isCopyRoute(): boolean {
  return router.currentRoute.value.name === 'meta-objects-menu-copy';
}

function isNewRoute(): boolean {
  return router.currentRoute.value.name === 'meta-objects-menu-add';
}

function registerError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

async function saveAsync(): Promise<boolean> {
  let result = false;
  isWaiting.value = true;

  if (isNewRoute()) {
    const response = await menuProvider.create(settings.value);
    isWaiting.value = false;

    if (response.isOK) {
      isModified.value = false;
      toastHelper.success(response.message);
      await router.push({ name: 'meta-objects-menu-edit', params: { name: settings.value.name } });
      result = true;
    } else {
      registerError(response);
    }
  } else {
    const response = await menuProvider.update(settings.value);
    isWaiting.value = false;

    if (response.isOK) {
      isModified.value = false;
      toastHelper.success(response.message);
      result = true;
    } else {
      registerError(response);
    }
  }

  return result;
}

async function updateAsync(): Promise<void> {
  isWaiting.value = false;

  if (isNewRoute()) {
    return;
  }

  const response = await menuProvider.getItem(props.name);

  if (response.isOK) {
    settings.value = new MenuSettings(response.data);
  } else {
    registerError(response);
  }
}

watch(() => props.name, async () => {
  await updateAsync();
});

// Event handlers
function onReturnClick(): void {
  console.log('Return clicked');
  router.push({
    name: 'meta-objects-list',
    params: { kind },
    query: { current: '' },
  });
}

async function onSaveClick(): Promise<void> {
  console.log('Save clicked');
  await saveAsync();
}

function onRunClick(): void {
  console.log('Run clicked');
}

function onUpdateClick(): void {
  console.log('Update clicked');
}

function downloadJson(): void {
  console.log('Download json');
}

function onNavTabClick(tabName: string): void {
  console.log('tab clicked', tabName);
  if (tabName === 'json') {
    jsonSettings.value = JSON.stringify(settings.value, null, 2);
  }
  activeTab.value = tabName;
}

function onSettingsChanged(): void {
  isModified.value = true;
}

// Life cycle hooks
onBeforeMount(() => {
  actionItems.value = [
    {
      label: t('update'),
      icon: 'pi pi-sync',
      command: () => onUpdateClick(),
    },
    {
      label: 'JSON',
      icon: 'pi pi-download',
      command: () => downloadJson(),
    },
  ];

  navMenuItems.value = [{
    label: t('main'),
    command: () => onNavTabClick('main'),
  },
  {
    label: t('menuSettings'),
    command: () => onNavTabClick('settings'),
  },
  {
    label: 'JSON',
    command: () => onNavTabClick('json'),
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
                          :is-waiting="isWaiting"/>
    </div>
  </div>

  <!--Buttons-->
  <div class="grid">
    <div class="col-12">
      <ButtonGroup>
        <Button
          :label="$t('back')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-arrow-left"
          @click="onReturnClick"
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
      <Button
        class="ml-1"
        severity="success"
        size="small"
        icon="pi pi-play"
        @click="onRunClick"
      />
      <SplitButton
        :label="$t('actions')"
        severity="primary"
        size="small"
        class="ml-1"
        outlined
        :model="actionItems"
      />
    </div>
  </div>

  <!--Divider-->
  <div class="grid">
    <Divider class="m-2" />
  </div>

  <!--Settings-->
  <div class="grid">
    <div class="col-fixed bs-nav-panel h-screen" style="width: 220px;">
      <Menu :model="navMenuItems"></Menu>
    </div>
    <div class="col">
      <div v-if="activeTab=='main'">
        <MainTab :settings="settings"
                 @change="onSettingsChanged"></MainTab>
      </div>
      <div v-if="activeTab=='settings'">
        <MenuSettingsTab :settings="settings"
                         @change="onSettingsChanged"></MenuSettingsTab>
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
