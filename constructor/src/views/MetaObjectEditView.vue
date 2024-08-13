<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import {
  Vue, Prop, Watch,
} from 'vue-property-decorator';
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
import MainTab from '@/components/metaObjectEditComponents/mainTab.vue';
import HeaderFieldsTab from '@/components/metaObjectEditComponents/headerFieldsTab.vue';
import JsonTab from '@/components/metaObjectEditComponents/jsonTab.vue';
import { useToast } from 'primevue/usetoast';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';

@Options({
  components: {
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
  dataTypesProvider = new DataTypeProvider();
  settings = new MetaObjectStorableSettings({});
  dataTypes: DataType[] = [];
  toastHelper = new ToastHelper(useToast());
  metaObjectKindTitle = '';
  activeTab = 'main';

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
    {
      label: 'header column',
      icon: 'pi pi-plus',
      command: () => this.addHeaderColumn(),
    },
    {
      label: 'render settings column',
      icon: 'pi pi-plus',
      command: () => this.addRenderSettingsColumn(),
    },
    {
      label: 'detail table',
      icon: 'pi pi-plus',
      command: () => this.addDetailTable(),
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

  @Watch('kind')
  @Watch('name')
  onPropChange(newVal: string, oldVal: string): void {
    console.log(`Prop changed from ${oldVal} to ${newVal}`);
    this.update();
  }

  onSaveClick():void {
    console.log('Save click');
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

  addHeaderColumn(): void {
    this.isModified = true;
    this.settings.header.newColumn();
    // this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  addRenderSettingsColumn(): void {
    this.isModified = true;
    this.settings.header.newRenderSettingsColumn();
    // this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  addDetailTable(): void {
    this.isModified = true;

    const pk = this.settings.header.getPrimaryKey();
    if (!pk) {
      return;
    }

    this.settings.newDetailTable(pk.dataTypeUid);

    // this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  onAddDetailTableColumn(detailTableUid: string): void {
    const currentTable = this.settings.detailTables.find(
      (detailTable) => detailTable.uid === detailTableUid,
    );
    if (!currentTable) {
      return;
    }
    this.isModified = true;
    currentTable.newColumn();
    // this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  onUpdateClick(): void {
    this.update();
  }

  onNavTabClick(args: string): void {
    console.log(args, 'Tab click');
    this.activeTab = args;
  }

  onDetailsTableAdd(): void {
    console.log('Add details table');
  }

  onSettingsChanged(): void {
    this.isModified = true;
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

    return result;
  }

  async update(): Promise<void> {
    console.log('meta-object-update', this.kind, this.name);
    this.isWaiting = true;

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

    const response = await this.provider.getMetaObjectSettings(this.kind, this.name);
    this.isWaiting = false;

    if (response.isOK) {
      this.settings = new MetaObjectStorableSettings(response.data);
      this.settings.detailTables.forEach((detailTable) => {
        console.log('detailTable', detailTable);
        const newAction = {
          icon: 'pi pi-plus',
          label: `${detailTable.title} table column`,
          command: () => this.onAddDetailTableColumn(detailTable.uid),
        };
        this.actions.push(newAction);
      });
      this.metaObjectKindTitle = response.data.metaObjectKindTitle;
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

    const tablesGroup = {
      label: 'Details tables',
      items: [{
        label: 'Add',
        icon: 'pi pi-plus',
        command: () => this.onDetailsTableAdd(),
      }],
    };

    this.navMenuItems.push(tablesGroup);

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
          <MainTab :settings="settings" @change="onSettingsChanged"></MainTab>
        </div>
        <div v-if="activeTab=='fields'">
          <HeaderFieldsTab :settings="settings"
                           :data-types="dataTypes"></HeaderFieldsTab>
        </div>
        <div v-if="activeTab == 'json'">
          <JsonTab :settings="settings" @change="onJsonChanged"></JsonTab>
          <!--
        <codemirror
          ref="codemirrorEditor"
          v-model="settingsJson"
          placeholder="Code goes here..."
          :style="codemirrorStyle"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="codemirrorExtensions"
          @change="onSettingsInput"
        />
        -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
