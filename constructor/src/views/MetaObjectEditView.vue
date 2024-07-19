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
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import { useToast } from 'primevue/usetoast';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';

@Options({
  components: {
    ViewTitleComponent,
    Button,
    ButtonGroup,
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

  settingsJson = '';
  provider = new MetaObjectProvider();
  settings = new MetaObjectStorableSettings({});
  toastHelper = new ToastHelper(useToast());
  formTitle = '';

  codemirrorExtensions = [jsonLang(), githubLight];
  codemirrorEditor: any = null;

  actions = [
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
    {
      label: 'update',
      icon: 'pi pi-sync',
      command: () => this.onUpdateClick(),
    },

  ];

  get codemirrorStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
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
    const blob = new Blob([this.settingsJson], { type: 'application/json' });
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
    this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  addRenderSettingsColumn(): void {
    this.isModified = true;
    this.settings.header.newRenderSettingsColumn();
    this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  addDetailTable(): void {
    this.isModified = true;

    const pk = this.settings.header.getPrimaryKey();
    if (!pk) {
      return;
    }

    this.settings.newDetailTable(pk.dataTypeUid);

    this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  onUpdateClick(): void {
    this.update();
  }

  async save(): Promise<boolean> {
    let result = false;
    this.isWaiting = true;

    this.settings = new MetaObjectStorableSettings(JSON.parse(this.settingsJson));

    console.log('save object', this.settingsJson);
    console.log('settings', this.settings);
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
    const response = await this.provider.getMetaObjectSettings(this.kind, this.name);
    this.isWaiting = false;

    if (response.isOK) {
      this.settings = new MetaObjectStorableSettings(response.data);
      this.formTitle = `${response.data.metaObjectKindTitle}.${this.settings.title}`;
      this.settingsJson = JSON.stringify(this.settings, null, 2);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    console.log('update', response);
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
            label="Save"
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
          label="Actions"
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
      <div class="col-12">
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
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
