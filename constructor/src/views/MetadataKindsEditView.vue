<template>
  <div>
<!--View title-->
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Metadata kinds"
         :is-modified="isModified"
         :is-waiting="isWaiting" />
      </div>
    </div>
<!--Buttons-->
    <div class="col-12">
      <span class="p-buttonset">
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
      </span>
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
         :style="{ height: '500px' }"
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
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Textarea from 'primevue/textarea';
import EventEmitter from '@/utils/eventEmitter';
import MetadataKindSettings from '../models/metadataKindSettings';
import MetadataKindsProvider from '../dataProviders/metadataKindsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  props: {
    name: { type: String, require: true },
  },
  components: {
    ViewTitleComponent,
    Divider,
    Button,
    SplitButton,
    Textarea,
    Codemirror,
  },
})
export default class MetadataKindsEditView extends Vue {
  name!:string;
  settings = new MetadataKindSettings();
  router = useRouter();
  provider = new MetadataKindsProvider();
  toastHelper = new ToastHelper(useToast());

  settingsJson = '';
  isWaiting = false;
  isModified = false;

  codemirrorExtensions = [jsonLang(), githubLight];
  codemirrorEditor: any = null;

  onBackClick(): void {
    this.navigateToList();
  }

  async onSaveCloseClick(): Promise<void> {
    console.log('Save close click');
    const saveResult = await this.save();
    if (saveResult) {
      this.navigateToList();
    }
  }

  onSaveClick():void {
    console.log('Save click');
    this.save();
  }

  onSettingsInput(): void {
    console.log('settings input');
    this.isModified = true;
  }

  async save(): Promise<boolean> {
    console.log('save');
    let result = false;
    this.isWaiting = true;
    this.settings = new MetadataKindSettings(JSON.parse(this.settingsJson));

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
    console.log('Update', this.name);

    if (this.name === '_new') {
      this.settings = new MetadataKindSettings();
      this.settingsJson = JSON.stringify(this.settings, null, 2);
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

  mounted(): void {
    console.log('mounted', this.name);
    this.$nextTick(() => { console.log('nextTick, name', this.name); this.update(); });

    if (this.codemirrorEditor) {
      console.log('Codemirror instance:', this.codemirrorEditor);
    }
  }
}

</script>

<style>
.codemirror-wrapper {
  /* Styling for your editor */
  height: 500px;
}
</style>
