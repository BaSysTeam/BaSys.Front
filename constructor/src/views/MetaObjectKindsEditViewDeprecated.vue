<template>
  <div>
<!--View title-->
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Meta object kind"
         :is-modified="isModified"
         :is-waiting="isWaiting" />
      </div>
    </div>
<!--Buttons-->
    <div class="col-12">
      <ButtonGroup>
        <Button
          label="Back"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-arrow-left"
          @click="onBackClick"
        />
        <Button
          label="Save & Close"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveCloseClick"
        />
        <Button
          label="Save"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveClick"
        />
      </ButtonGroup>
      <SplitButton
            label="Actions"
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

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import Textarea from 'primevue/textarea';
import EventEmitter from '@/utils/eventEmitter';
import MetaObjectKindSettings from '../../../shared/src/models/metaObjectKindSettings';
import MetaObjectKindsProvider from '../dataProviders/metaObjectKindsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';

@Options({
  props: {
    name: { type: String, require: true },
  },
  components: {
    ViewTitleComponent,
    Divider,
    Button,
    ButtonGroup,
    SplitButton,
    Textarea,
    Codemirror,
  },
})
export default class MetadataKindsEditView extends mixins(ResizeWindow) {
  name!:string;
  settings = new MetaObjectKindSettings();
  router = useRouter();
  provider = new MetaObjectKindsProvider();
  toastHelper = new ToastHelper(useToast());

  settingsJson = '';
  isWaiting = false;
  isModified = false;

  codemirrorExtensions = [jsonLang(), githubLight];
  codemirrorEditor: any = null;

  actions = [
    {
      label: 'json',
      icon: 'pi pi-download',
      command: () => this.downloadJson(),
    },
    {
      label: 'Standard column',
      icon: 'pi pi-plus',
      command: () => this.addStandardColumn(),
    },

  ];

  get codemirrorStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  onBackClick(): void {
    this.navigateToList();
  }

  async onSaveCloseClick(): Promise<void> {
    const saveResult = await this.save();
    if (saveResult) {
      this.navigateToList();
    }
  }

  onSaveClick():void {
    this.save();
  }

  onSettingsInput(): void {
    this.isModified = true;
    // this.settings = new MetaObjectKindSettings(JSON.parse(this.settingsJson));
    // this.settings.onNameChanged();
    // this.settingsJson = this.toJSON(this.settings);
  }

  downloadJson(): void {
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

  addStandardColumn(): void {
    this.isModified = true;
    this.settings = new MetaObjectKindSettings(JSON.parse(this.settingsJson));
    this.settings.newStandardColumn(null);

    this.settingsJson = JSON.stringify(this.settings, null, 2);
  }

  async save(): Promise<boolean> {
    let result = false;
    this.isWaiting = true;
    this.settings = new MetaObjectKindSettings(JSON.parse(this.settingsJson));

    if (this.settings.isNew()) {
      const responseInsert = await this.provider.insert(this.settings);
      if (responseInsert.isOK) {
        this.isModified = false;
        this.toastHelper.success(responseInsert.message);
        result = true;
        this.settings = responseInsert.data;
        this.settingsJson = JSON.stringify(this.settings, null, 2);
      } else {
        this.toastHelper.error(responseInsert.message);
        console.error(responseInsert.presentation);
      }
    } else {
      const responseUpdate = await this.provider.update(this.settings);
      if (responseUpdate.isOK) {
        this.isModified = false;
        this.toastHelper.success(responseUpdate.message);
        result = true;
      } else {
        this.toastHelper.error(responseUpdate.message);
        console.error(responseUpdate.presentation);
      }
    }
    this.isWaiting = false;

    if (result) {
      EventEmitter.emit('metadata-kinds-changed');
    }

    return result;
  }

  async update(): Promise<void> {
    if (this.name === '_new') {
      this.settings = new MetaObjectKindSettings();
      this.settingsJson = this.toJSON(this.settings);
      return;
    }

    this.isWaiting = true;
    const response = await this.provider.getSettingsItemByName(this.name);
    this.isWaiting = false;

    if (response.isOK) {
      this.settings = response.data;
      this.settingsJson = JSON.stringify(this.settings, null, 2);
      console.log('Settings loaded', this.settings);
      console.log(this.settingsJson);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  navigateToList(): void {
    this.router.push('/metadata-kinds');
  }

  toJSON(object:any): string {
    const replacer = (key: string, value: any): any => {
      const excludedKeys = ['_name']; // Add any internal/private properties to exclude
      if (excludedKeys.includes(key)) {
        return undefined;
      }
      return value;
    };

    return JSON.stringify(object, replacer, 2);
  }

  mounted(): void {
    console.log('mounted', this.name);
    this.$nextTick(() => { console.log('nextTick, name', this.name); this.update(); });

    if (this.codemirrorEditor) {
      console.log('Codemirror instance:', this.codemirrorEditor);
    }
  }
}

</script>
