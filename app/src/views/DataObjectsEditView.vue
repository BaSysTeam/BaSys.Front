<script lang="ts">
import {
  Prop, Component, Vue, toNative,
} from 'vue-facing-decorator';
import { useRouter } from 'vue-router';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import InputText from 'primevue/inputtext';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Component({
  components: {
    ViewTitleComponent,
    Divider,
    Button,
    ButtonGroup,
    InputText,
  },
})
class DataObjectEditView extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  kind!: string;

  @Prop({
    required: true,
    type: String,
  })
  name!: string;

  @Prop({
    required: true,
    type: String,
  })
  uid!: string;

  isWaiting = false;
  isModified = false;
  isNew = false;
  isPrimaryKeyEditable = false;
  title = '';
  dataObjectsProvider = new DataObjectsProvider();
  model = new DataObjectWithMetadata(null);
  toastHelper = new ToastHelper(useToast());
  router = useRouter();

  get isPrimaryKeyEnabled(): boolean {
    return this.isNew && this.isPrimaryKeyEditable;
  }

  onBackClick(): void {
    console.log('Back click');
    this.returnToList();
  }

  async onSaveCloseClick(): Promise<void> {
    console.log('Save&close click');
    const saved = await this.save();
    if (saved) this.returnToList();
  }

  onSaveClick(): void {
    console.log('Save click');
    this.save();
  }

  onHeaderFieldChange(): void {
    this.isModified = true;
  }

  returnToList(): void {
    this.router.push({
      name: 'data-objects',
      params: {
        kind: this.kind,
        name: this.name,
      },
    });
  }

  async save(): Promise<boolean> {
    this.isWaiting = true;

    if (this.isNew) {
      // Insert new item.
      console.log('Insert');
      const response = await this.dataObjectsProvider.createItem(
        this.model.metaObjectKindSettings.uid,
        this.model.metaObjectSettings.uid,
        this.model.item,
      );

      this.isWaiting = false;

      if (response.isOK) {
        this.isModified = false;
        this.isNew = false;
        this.model.setPrimaryKey(response.data);
        this.toastHelper.success(response.message);
        return true;
      }

      this.toastHelper.error(response.message);
      console.error(response.presentation);
      return false;
    }
    // Update existing item.
    console.log('Update');
    const response = await this.dataObjectsProvider.updateItem(
      this.model.metaObjectKindSettings.uid,
      this.model.metaObjectSettings.uid,
      this.model.item,
    );

    this.isWaiting = false;

    if (response.isOK) {
      this.isModified = false;
      this.toastHelper.success(response.message);
      return true;
    }

    this.toastHelper.error(response.message);
    console.error(response.presentation);
    return false;
  }

  async init(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataObjectsProvider.getItem(this.kind, this.name, this.uid);

    if (response.isOK) {
      this.model = new DataObjectWithMetadata(response.data);
      this.isNew = this.model.isNew();
      this.isPrimaryKeyEditable = this.model.isPrimaryKeyEditable();
      this.title = `${this.model.metaObjectKindSettings.title}.${this.model.metaObjectSettings.title}`;
      console.log('init', this.model);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  mounted(): void {
    console.log('mounted');
    this.init();
  }
}

export default toNative(DataObjectEditView);
</script>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="isModified" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <div class="col">
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

      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>
    <div class="grid">
      <div class="col-6">
        <div class="field grid" v-for="column in model.metaObjectSettings.header.columns"
             :key="column.uid">
          <label :for="column.uid" class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>
          <div class="col-12 md:col-8">
            <InputText
              :disabled="column.primaryKey && !isPrimaryKeyEnabled"
              :id="column.uid"
              v-model="model.item.header[column.name]"
              autocomplete="off"
              size="small"
              class="w-full"
              @change="onHeaderFieldChange"
            />

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
