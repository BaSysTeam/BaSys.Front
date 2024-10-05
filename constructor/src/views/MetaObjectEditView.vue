<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import {
  Vue, Prop, Watch,
} from 'vue-property-decorator';
import { useRouter } from 'vue-router';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import DataTypeProvider from '@/dataProviders/dataTypeProvider';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import MetaObjectKindsProvider from '@/dataProviders/metaObjectKindsProvider';
import MainTab from '@/components/metaObjectEditComponents/mainTab.vue';
import HeaderFieldsTab from '@/components/metaObjectEditComponents/headerFieldsTab.vue';
import TableSettingsTab from '@/components/metaObjectEditComponents/TableSettingsTab.vue';
import JsonTab from '@/components/metaObjectEditComponents/jsonTab.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { Guid } from 'guid-typescript';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';

@Options({
  components: {
    TableSettingsTab,
    JsonTab,
    ViewTitleComponent,
    Button,
    ButtonGroup,
    MainTab,
    HeaderFieldsTab,
    Menu,
    SplitButton,
    Divider,
    Codemirror,
  },
})
export default class MetaObjectEditView extends mixins(ResizeWindow) {
  @Prop({ type: String }) name!: string;
  @Prop({ type: String }) kind!: string;
  isModified = false;
  isWaiting = true;

  // settingsJson = '';
  provider = new MetaObjectProvider();
  kindsProvider = new MetaObjectKindsProvider();
  router = useRouter();
  confirm = useConfirm();
  dataTypesProvider = new DataTypeProvider();
  settings = new MetaObjectStorableSettings({});
  selectedTable = new MetaObjectTable(null);
  dataTypes: DataType[] = [];
  toastHelper = new ToastHelper(useToast());
  metaObjectKindTitle = '';
  activeTab = 'main';
  tableGroups: any = {
    label: 'Details tables',
    items: [],
  };

  codemirrorExtensions = [jsonLang(), githubLight];
  codemirrorEditor: any = null;

  actions = [
    {
      label: 'update',
      icon: 'pi pi-sync',
      command: () => this.onUpdateClick(),
    },
    {
      label: 'json',
      icon: 'pi pi-download',
      command: () => this.downloadJson(),
    },
  ];

  navMenuItems:any[] = [];

  get codemirrorStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  get formTitle(): string {
    return `${this.metaObjectKindTitle}.${this.settings.title}`;
  }

  get isCopy(): boolean {
    return this.$route.name === 'meta-objects-copy';
  }

  get isNew(): boolean {
    return this.$route.name === 'meta-objects-add';
  }

  initTableMenu(): void {
    this.tableGroups.items = [];
    this.tableGroups.items.push({
      label: 'Add',
      icon: 'pi pi-plus',
      command: () => this.onDetailsTableAdd(),
    });

    this.settings.detailTables.forEach((detailTable) => {
      console.log('detailTable', detailTable);

      const tableMenuItem = {
        label: detailTable.title,
        icon: 'pi pi-table',
        command: () => this.onTableTabClick(detailTable.uid),
      };

      this.tableGroups.items.push(tableMenuItem);
    });
  }

  @Watch('kind')
  @Watch('name')
  onPropChange(newVal: string, oldVal: string): void {
    console.log(`Prop changed from ${oldVal} to ${newVal}`);
    this.update();
  }

  onReturnClick(): void {
    this.router.push({
      name: 'meta-objects-list',
      params: { kind: this.kind },
      query: { current: this.settings.name },
    });
  }

  onSaveClick():void {
    this.save();
  }

  onRunClick(): void {
    const url = `app#/data-objects/${this.kind}/${this.name}`;
    window.open(url, '_blank');
  }

  onSettingsInput():void {
    this.isModified = true;
  }

  downloadJson():void {
    const settingsJson = JSON.stringify(this.settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.settings.title}.json`; // Name of the file to be downloaded
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  deleteTable(uid: string): void {
    this.isModified = true;
    this.settings.deleteDetailsTable(uid);
    this.initTableMenu();
    if (this.settings.detailTables.length) {
      this.activeTab = 'table_settings';
      // eslint-disable-next-line prefer-destructuring
      this.selectedTable = this.settings.detailTables[0];
    } else {
      this.activeTab = 'main';
    }
  }

  onAddDetailTableColumn(detailTableUid: string): void {
    const currentTable = this.settings.detailTables.find(
      (detailTable) => detailTable.uid === detailTableUid,
    );
    if (!currentTable) {
      return;
    }
    this.isModified = true;
    currentTable.newColumn(null);
    // this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  onTableTabClick(detailTableUid: string): void {
    console.log('Table tab click', detailTableUid);
    const currentTable = this.settings.detailTables.find(
      (detailTable) => detailTable.uid === detailTableUid,
    );
    if (!currentTable) {
      return;
    }
    this.selectedTable = currentTable;
    this.activeTab = 'table_settings';
  }

  onUpdateClick(): void {
    this.update();
  }

  onNavTabClick(args: string): void {
    console.log(args, 'Tab click');
    this.activeTab = args;
  }

  onDetailsTableAdd(): void {
    const pk = this.settings.header.getPrimaryKey();
    if (!pk) {
      return;
    }
    const newTable = this.settings.newDetailTable(pk.dataTypeUid);
    newTable.title = `New table ${this.settings.detailTables.length + 1}`;
    this.selectedTable = newTable;
    this.activeTab = 'table_settings';

    this.initTableMenu();
  }

  onSettingsChanged(): void {
    this.isModified = true;
  }

  onTableDelete(uid: string): void {
    this.confirm.require({
      message: 'Delete table?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      accept: () => this.deleteTable(uid),
    });
  }

  onTableCopy(uid: string): void {
    this.isModified = true;
    this.selectedTable = this.settings.copyDetailsTable(uid);
    this.initTableMenu();
  }

  onJsonChanged(args: string): void {
    this.isModified = true;
    console.log('JSON text changed', args);
    const settingsTmp = new MetaObjectStorableSettings(JSON.parse(args));
  }

  async save(): Promise<boolean> {
    let result = false;
    this.isWaiting = true;

    // this.settings = new MetaObjectStorableSettings(JSON.parse(this.settingsJson));

    console.log('save settings', this.settings);
    if (this.settings.isNew) {
      const response = await this.provider.create(this.settings);
      this.isWaiting = false;

      if (response.isOK) {
        this.isModified = false;
        this.toastHelper.success(response.message);
        await this.router.push({ name: 'meta-objects-edit', params: { kind: this.kind, name: this.settings.name } });
        result = true;
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    } else {
      const response = await this.provider.update(this.settings);
      this.isWaiting = false;

      if (response.isOK) {
        this.isModified = false;
        this.toastHelper.success(response.message);
        result = true;
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    }

    return result;
  }

  async update(): Promise<void> {
    console.log('meta-object-update', this.kind, this.name);
    console.log('meta-object isCopy', this.isCopy);
    this.isWaiting = true;
    if (this.isCopy) {
      this.isModified = true;
    }

    // Get datatypes
    if (!this.dataTypes.length) {
      const dataTypeResponse = await this.dataTypesProvider.getDataTypes();
      if (dataTypeResponse.isOK) {
        this.dataTypes = dataTypeResponse.data;
      } else {
        this.toastHelper.error(dataTypeResponse.message);
        console.error(dataTypeResponse.presentation);
      }
    }

    if (this.isNew) {
      const kindResponse = await this.kindsProvider.getSettingsItemByName(this.kind);
      console.log('kind response', kindResponse);

      this.isWaiting = false;
      if (!kindResponse.isOK) {
        this.toastHelper.error(kindResponse.message);
        console.error(kindResponse.presentation);
        return;
      }

      const kindSettings = new MetaObjectKindSettings(kindResponse.data);

      this.isModified = true;
      const headerTable = new MetaObjectTable({
        title: 'header',
        name: 'header',
        uid: Guid.create().toString(),
      });

      kindSettings.standardColumns.forEach((stColumn) => {
        const headerColumn = new MetaObjectTableColumn(null);
        headerColumn.fillByStandardColumn(stColumn);
        headerTable.columns.push(headerColumn);
      });

      this.settings = new MetaObjectStorableSettings({
        header: headerTable,
        metaObjectKindUid: kindSettings.uid,
      });
      this.metaObjectKindTitle = kindResponse.data.title;

      this.initTableMenu();
      return;
    }

    const response = await this.provider.getMetaObjectSettings(this.kind, this.name);
    this.isWaiting = false;

    if (response.isOK) {
      console.log('GetMetaObject response', response.data);
      this.settings = new MetaObjectStorableSettings(response.data);
      if (this.isCopy) {
        this.settings.name = '';
        this.settings.title = `Copy - ${this.settings.title}`;
      }
      this.initTableMenu();
      this.metaObjectKindTitle = response.data.metaObjectKindTitle;
      if (this.activeTab === 'table_settings') {
        this.activeTab = 'main';
      }
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    console.log('update', response);
  }

  beforeMount():void {
    this.navMenuItems.push({
      label: 'Main',
      command: () => this.onNavTabClick('main'),
    });

    this.navMenuItems.push({
      label: 'Fields',
      command: () => this.onNavTabClick('fields'),
    });

    this.navMenuItems.push(this.tableGroups);

    const otherGroup = {
      label: 'Other',
      items: [{
        label: 'JSON',
        command: () => this.onNavTabClick('json'),
      }],
    };

    this.navMenuItems.push(otherGroup);
  }

  mounted(): void {
    console.log('mounted');
    this.update();
  }
}
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
</template>

<style scoped>

</style>
