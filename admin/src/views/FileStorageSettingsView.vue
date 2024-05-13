<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent
          title="Settings: File storage"
          :is-modified="false"
          :is-waiting="isWaiting"
        />
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>

    <div class="grid">
      <div class="col-6">
        <Card>
          <template #content>
            <!--                IsEnabled-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span>Is enabled</span>
              </div>
              <div class="col">
                <InputSwitch v-model="model.isEnabled"
                             @change="save"/>
              </div>
            </div>
            <!--                StorageKind-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Storage kind</span>
              </div>
              <div class="col">
                <Dropdown
                  v-model="model.storageKind"
                  :options="storageKinds"
                  @change="save"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select storage kind"
                  class="w-full md:w-14rem"
                />
              </div>
            </div>
            <!--                S3ConnectionString-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Connection string</span>
              </div>
              <div class="col">
                  <Textarea
                    v-model="model.s3ConnectionString"
                    @keyup.enter="save"
                    @focusout="save"
                    rows="5"
                    aria-labelledby="modelConnectionString"
                    class="w-full"
                    id="connectionStringInput"
                  />
              </div>
            </div>
            <!--                MaxFileSizeMb-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Max file size (Mb)</span>
              </div>
              <div class="col">
                <InputNumber
                  v-model="model.maxFileSizeMb"
                  @keyup.enter="save"
                  @focusout="save"
                  size="small"
                  class="w-full"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import FileStorageProvider from '@/dataProviders/fileStorageProvider';
import FileStorageConfig from '@/models/fileStorageConfig';
import StorageKind from '@/models/storageKind';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    Card,
    InputText,
    InputNumber,
    Dropdown,
    InputSwitch,
    Textarea,
  },
})
export default class FileStorageSettingsView extends Vue {
  isWaiting = false;
  dataProvider = new FileStorageProvider();
  model = new FileStorageConfig();
  modelCached = new FileStorageConfig();
  toastHelper = new ToastHelper(useToast());
  storageKinds: StorageKind[] = [];

  async mounted(): Promise<void> {
    await this.getStorageKinds();
    await this.update();
  }

  async update(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataProvider.getFileStorageConfig();
    if (response.isOK) {
      this.model = response.data;
      this.modelCached = { ...response.data };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async getStorageKinds(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataProvider.getStorageKinds();
    if (response.isOK) {
      this.storageKinds = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async save(): Promise<boolean> {
    let result = false;

    this.isWaiting = true;

    if (JSON.stringify(this.model) === JSON.stringify(this.modelCached)) {
      return false;
    }

    const response = await this.dataProvider.updateFileStorageConfig(this.model);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.modelCached = { ...this.model };
      result = true;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;

    return result;
  }
}
</script>
