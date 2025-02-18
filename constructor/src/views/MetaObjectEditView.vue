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
import DataTypeProvider from '@/dataProviders/dataTypeProvider';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import MetaObjectKindsProvider from '@/dataProviders/metaObjectKindsProvider';
import MainTab from '@/components/metaObjectEditComponents/MainTab.vue';
import RecordsSettingsTab from '@/components/metaObjectEditComponents/RecordsSettingsTab.vue';
import HeaderFieldsTab from '@/components/metaObjectEditComponents/HeaderFieldsTab.vue';
import TableSettingsTab from '@/components/metaObjectEditComponents/TableSettingsTab.vue';
import TriggersTab from '@/components/metaObjectEditComponents/TriggersTab.vue';
import JsonTab from '@/components/metaObjectEditComponents/JsonTab.vue';
import { Guid } from 'guid-typescript';
import CommandsTab from '@/components/metaObjectEditComponents/CommandsTab.vue';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Props
const props = defineProps({
  kind: { type: String, required: true },
  name: { type: String, required: true },
});

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const provider = new MetaObjectProvider();
const kindsProvider = new MetaObjectKindsProvider();
const router = useRouter();
const confirmVue = useConfirm();
const dataTypesProvider = new DataTypeProvider();
const toastHelper = new ToastHelper(useToast());

// Data
const isModified = ref(false);
const isWaiting = ref(true);

const settings = ref<MetaObjectStorableSettings>(new MetaObjectStorableSettings({}));
const kindSettings = ref<MetaObjectKindSettings>(new MetaObjectKindSettings({}));
const selectedTable = ref<MetaObjectTable>(new MetaObjectTable(null));
const dataTypes = ref<DataType[]>([]);

const metaObjectKindTitle = ref('');
const activeTab = ref('main');
const tableGroups = ref<any>({
  label: t('detailsTables'),
  items: [],
});

const actions = ref<any[]>([]);
const navMenuItems = ref<any[]>([]);

const formTitle = computed(() => `${metaObjectKindTitle.value}.${settings.value.title}`);

// Methods
// eslint-disable-next-line @typescript-eslint/no-empty-function
let initTableMenu = ():void => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function
let initNavMenu = ():void => {};

function registerError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

function isCopy(): boolean {
  return router.currentRoute.value.name === 'meta-objects-copy';
}

function isNew(): boolean {
  return router.currentRoute.value.name === 'meta-objects-add';
}

function downloadJson():void {
  const settingsJson = JSON.stringify(settings.value, null, 2);
  const blob = new Blob([settingsJson], { type: 'application/json' });
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

async function save(): Promise<boolean> {
  let result = false;
  isWaiting.value = true;

  if (settings.value.isNew) {
    const response = await provider.create(settings.value);
    isWaiting.value = false;

    if (response.isOK) {
      isModified.value = false;
      toastHelper.success(response.message);
      await router.push({ name: 'meta-objects-edit', params: { kind: props.kind, name: settings.value.name } });
      result = true;
    } else {
      registerError(response);
    }
  } else {
    const response = await provider.update(settings.value);
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

async function update(): Promise<void> {
  isWaiting.value = true;
  if (isCopy()) {
    isModified.value = true;
  }

  // Get datatypes
  if (!dataTypes.value.length) {
    const dataTypeResponse = await dataTypesProvider.getDataTypes();
    if (dataTypeResponse.isOK) {
      dataTypes.value = dataTypeResponse.data;
    } else {
      registerError(dataTypeResponse);
    }
  }

  const kindResponse = await kindsProvider.getSettingsItemByName(props.kind);
  if (!kindResponse.isOK) {
    registerError(kindResponse);
    return;
  }
  kindSettings.value = new MetaObjectKindSettings(kindResponse.data);
  initNavMenu();

  if (isNew()) {
    isWaiting.value = false;

    isModified.value = true;
    const headerTable = new MetaObjectTable({
      title: 'header',
      name: 'header',
      uid: Guid.create().toString(),
    });

    kindSettings.value.standardColumns.forEach((stColumn) => {
      const headerColumn = new MetaObjectTableColumn(null);
      headerColumn.fillByStandardColumn(stColumn);
      headerTable.columns.push(headerColumn);
    });

    settings.value = new MetaObjectStorableSettings({
      header: headerTable,
      metaObjectKindUid: kindSettings.value.uid,
    });
    metaObjectKindTitle.value = kindResponse.data.title;

    initTableMenu();
    return;
  }

  const response = await provider.getMetaObjectSettings(props.kind, props.name);
  isWaiting.value = false;

  if (response.isOK) {
    settings.value = new MetaObjectStorableSettings(response.data);
    if (isCopy()) {
      settings.value.name = '';
      settings.value.title = `Copy - ${settings.value.title}`;
      settings.value.uid = '';
    }
    initTableMenu();
    metaObjectKindTitle.value = response.data.metaObjectKindTitle;
    if (activeTab.value === 'table_settings') {
      activeTab.value = 'main';
    }
  } else {
    registerError(response);
  }
}

watch(() => props.kind, async () => {
  await update();
});

watch(() => props.name, async () => {
  await update();
});

// Event handlers
function onReturnClick(): void {
  router.push({
    name: 'meta-objects-list',
    params: { kind: props.kind },
    query: { current: settings.value.name },
  });
}

function onSaveClick():void {
  save();
}

function onRunClick(): void {
  const url = `app#/data-objects/${props.kind}/${props.name}`;
  window.open(url, '_blank');
}

function onTableTabClick(detailTableUid: string): void {
  const currentTable = settings.value.detailTables.find(
    (detailTable) => detailTable.uid === detailTableUid,
  );
  if (!currentTable) {
    return;
  }
  selectedTable.value = currentTable;
  activeTab.value = 'table_settings';
}

function onUpdateClick(): void {
  update();
}

function onNavTabClick(args: string): void {
  activeTab.value = args;
}

function addDetailsTable(): void {
  const pk = settings.value.header.getPrimaryKey();
  if (!pk) {
    return;
  }
  const newTable = settings.value.newDetailTable(pk.dataSettings.dataTypeUid);
  newTable.title = `New table ${settings.value.detailTables.length + 1}`;
  selectedTable.value = newTable;
  activeTab.value = 'table_settings';

  initTableMenu();
}

function onDetailsTableAdd(): void {
  confirmVue.require({
    message: t('addTableQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-success',
    rejectLabel: t('cancel'),
    acceptLabel: t('add'),
    accept: () => addDetailsTable(),
  });
}

function onSettingsChanged(): void {
  isModified.value = true;
}

function onTableCopy(uid: string): void {
  isModified.value = true;
  selectedTable.value = settings.value.copyDetailsTable(uid);
  initTableMenu();
}

function deleteTable(uid: string): void {
  isModified.value = true;
  settings.value.deleteDetailsTable(uid);
  initTableMenu();
  if (settings.value.detailTables.length) {
    activeTab.value = 'table_settings';
    // eslint-disable-next-line prefer-destructuring
    selectedTable.value = settings.value.detailTables[0];
  } else {
    activeTab.value = 'main';
  }
}

function onTableDelete(uid: string): void {
  confirmVue.require({
    message: t('deleteTableQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteTable(uid),
  });
}

function onJsonChanged(): void {
  isModified.value = true;
}

// Life cycle hooks
onBeforeMount(() => {
  initNavMenu = () => {
    navMenuItems.value = [];

    navMenuItems.value.push({
      label: t('main'),
      command: () => onNavTabClick('main'),
    });

    navMenuItems.value.push({
      label: t('columns'),
      command: () => onNavTabClick('fields'),
    });

    navMenuItems.value.push({
      label: t('commands'),
      command: () => onNavTabClick('commands'),
    });

    navMenuItems.value.push({
      label: t('triggers'),
      command: () => onNavTabClick('triggers'),
    });

    if (kindSettings.value.canCreateRecords) {
      navMenuItems.value.push({
        label: t('records'),
        command: () => onNavTabClick('records'),
      });
    }

    if (kindSettings.value.useDetailsTables) {
      navMenuItems.value.push(tableGroups.value);
    }

    const otherGroup = {
      label: t('other'),
      items: [{
        label: 'JSON',
        command: () => onNavTabClick('json'),
      }],
    };

    navMenuItems.value.push(otherGroup);
  };

  initNavMenu();

  actions.value = [
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

  initTableMenu = () => {
    tableGroups.value.items = [];
    tableGroups.value.items.push({
      label: t('add'),
      icon: 'pi pi-plus',
      command: () => onDetailsTableAdd(),
    });

    settings.value.detailTables.forEach((detailTable) => {
      const tableMenuItem = {
        label: detailTable.title,
        icon: 'pi pi-table',
        command: () => onTableTabClick(detailTable.uid),
      };

      tableGroups.value.items.push(tableMenuItem);
    });
  };
});

onMounted(() => {
  update();
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
          :model="actions"
        />
      </div>
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
        <div v-if="activeTab=='fields'">
          <HeaderFieldsTab :settings="settings"
                           :data-types="dataTypes"
                           @change="onSettingsChanged"></HeaderFieldsTab>
        </div>
        <div v-if="activeTab == 'commands'">
          <CommandsTab :settings="settings"
                       @change="onSettingsChanged"></CommandsTab>
        </div>
        <div v-if="activeTab == 'triggers'">
          <TriggersTab :meta-object-kind-uid="settings.metaObjectKindUid"
                       :meta-object-uid="settings.uid"></TriggersTab>
        </div>
        <div v-if="activeTab == 'records'">
          <RecordsSettingsTab :settings="settings"
                              :kind-settings="kindSettings"
                              @change="onSettingsChanged"></RecordsSettingsTab>
        </div>
        <div v-if="activeTab == 'json'">
          <JsonTab :settings="settings" @change="onJsonChanged"></JsonTab>
        </div>
        <div v-if="activeTab == 'table_settings'">
          <TableSettingsTab :table="selectedTable"
                            :data-types="dataTypes"
                            @change="onSettingsChanged"
                            @delete="onTableDelete"
                            @copy="onTableCopy"></TableSettingsTab>
        </div>
      </div>
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>

</style>
