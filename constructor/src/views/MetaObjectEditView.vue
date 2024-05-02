<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Divider from 'primevue/divider';
import MetaObjectSettings from '@/models/metaObjectSettings';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import { useToast } from 'primevue/usetoast';
import MetadataKindSettings from '@/models/metadataKindSettings';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Button,
    SplitButton,
    Divider,
    Codemirror,
  },
  props: {
    kind: { type: String },
    name: { type: String },
  },
})
export default class MetaObjectEditView extends Vue {
  isModified = false;
  isWaiting = true;
  name!: string;
  kind!: string;
  settingsJson = '';
  provider = new MetaObjectProvider();
  settings = new MetaObjectSettings({});
  toastHelper = new ToastHelper(useToast());
  formTitle = '';

  codemirrorExtensions = [jsonLang(), githubLight];
  codemirrorEditor: any = null;

  onSaveClick():void {
    console.log('Save click');
    this.save();
  }

  onSettingsInput():void {
    this.isModified = true;
  }

  async save(): Promise<boolean> {
    let result = false;
    this.isWaiting = true;

    this.settings = new MetaObjectSettings(JSON.parse(this.settingsJson));
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
    this.isWaiting = true;
    const response = await this.provider.getMetaObjectSettings(this.kind, this.name);
    this.isWaiting = false;

    if (response.isOK) {
      this.settings = new MetaObjectSettings(response.data);
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
        <span class="p-buttonset">
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

<style scoped>

</style>
