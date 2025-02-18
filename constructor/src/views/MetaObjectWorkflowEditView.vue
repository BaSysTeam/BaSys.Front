<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import MetaWorkflowsProvider from '@/dataProviders/metaWorkflowsProvider';
import MetaObjectKind from '@/models/metaObjectKind';
import ButtonGroup from 'primevue/buttongroup';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Divider from 'primevue/divider';
import JsonViewComponent from '@/components/JsonViewComponent.vue';
import Menu from 'primevue/menu';
import MainTab from '@/components/metaObjectWorkflowEditComponents/MainTab.vue';
import StepsTab from '@/components/metaObjectWorkflowEditComponents/StepsTab.vue';
import LogTab from '@/components/metaObjectWorkflowEditComponents/LogTab.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import ScheduleTab from '@/components/metaObjectWorkflowEditComponents/ScheduleTab.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import WorkflowSettings from '../../../shared/src/models/workflowModel/workflowSettings';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const workflowsProvider = new MetaWorkflowsProvider();

// Props
const props = defineProps({
  name: { type: String, required: false, default: '' },
});

// Data
const kind = 'workflow';
const activeTab = ref('main');
const settings = ref<WorkflowSettings>(new WorkflowSettings(null));
const jsonSettings = ref<string>('');
const isModified = ref(false);
const isWaiting = ref(true);
const formTitle = computed(() => `${t('workflow')}.${settings.value.title}`);
const actionItems = ref<any[]>([]);
const navMenuItems = ref<any[]>([]);

// Methods
function isCopyRoute(): boolean {
  return router.currentRoute.value.name === 'meta-workflows-copy';
}

function isNewRoute(): boolean {
  return router.currentRoute.value.name === 'meta-workflows-add';
}

function registerError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

async function saveAsync(): Promise<boolean> {
  let result = false;
  isWaiting.value = true;

  if (isNewRoute()) {
    const response = await workflowsProvider.create(settings.value);
    isWaiting.value = false;

    if (response.isOK) {
      isModified.value = false;
      toastHelper.success(response.message);
      await router.push({ name: 'meta-workflows-edit', params: { name: settings.value.name } });
      result = true;
    } else {
      registerError(response);
    }
  } else {
    const response = await workflowsProvider.update(settings.value);
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

  const response = await workflowsProvider.getItem(props.name);

  if (response.isOK) {
    settings.value = new WorkflowSettings(response.data);
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
  await saveAsync();
}

async function onUpdateClick(): Promise<void> {
  await updateAsync();
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

function onNavTabClick(tabName: string): void {
  if (tabName === 'json') {
    jsonSettings.value = JSON.stringify(settings.value, null, 2);
  }
  activeTab.value = tabName;
}

function onSettingsChanged(): void {
  isModified.value = true;
}

function onRunClick(): void {
  const url = `app#/workflows-run/${settings.value.name}`;
  window.open(url, '_blank');
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
    label: t('steps'),
    command: () => onNavTabClick('steps'),
  },
  {
    label: t('schedule'),
    command: () => onNavTabClick('schedule'),
  },
  {
    label: t('log'),
    command: () => onNavTabClick('log'),
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
      <div v-if="activeTab=='steps'">
        <StepsTab :settings="settings"
                  @change="onSettingsChanged"></StepsTab>

      </div>
      <div v-if="activeTab=='schedule'">
       <ScheduleTab :workflow-uid="settings.uid"></ScheduleTab>

      </div>
      <div v-if="activeTab=='log'">
        <LogTab :settings="settings"></LogTab>

      </div>
      <div v-if="activeTab == 'json'">
        <JsonViewComponent :json="jsonSettings"></JsonViewComponent>
      </div>

    </div>
  </div>

</div>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>

</style>
