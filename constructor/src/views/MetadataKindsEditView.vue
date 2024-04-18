<template>
  <div>

    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Metadata kinds"
         :is-modified="isModified"
         :is-waiting="isWaiting" />
      </div>
    </div>

    <div class="col-12">
      <span class="p-buttonset">
        <Button
            label="Back"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-arrow-left"
            @click="router.push('/metadata-kinds')"
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

    <div class="grid">
      <div class="col-12">
        <Textarea v-model="settingsJson"
        rows="15"
        spellcheck="false"
        class="w-full"
        @input="onSettingsInput"></Textarea>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import Divider from 'primevue/divider';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Textarea from 'primevue/textarea';
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
  },
})
export default class MetadataKindsEditView extends Vue {
    name!:string;
    settings = new MetadataKindSettings();
    router = useRouter();
    provider = new MetadataKindsProvider();
    toastHelper = new ToastHelper(useToast());

    settingsJson = '';
    isWaiting = true;
    isModified = false;

    onSaveCloseClick():void {
      console.log('Save close click');
    }

    onSaveClick():void {
      console.log('Save click');
    }

    onSettingsInput(): void {
      console.log('settings input');
      this.isModified = true;
    }

    async update(): Promise<void> {
      console.log('Update', this.name);

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

    mounted(): void {
      console.log('mounted', this.name);
      this.$nextTick(() => { console.log('nextTick, name', this.name); this.update(); });
    }
}

</script>
