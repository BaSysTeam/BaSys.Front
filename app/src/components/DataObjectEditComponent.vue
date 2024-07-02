<script lang="ts">
import {
  Component, Emit, Prop, toNative, Vue,
} from 'vue-facing-decorator';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Component({
  components: {
    InputText,
  },
})
class DataObjectEditComponent extends Vue {
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
    required: false,
    type: String,
    default: '',
  })
  uid!: string;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  copyUid!: string;

  isCopy = false;
  isAdd = false;
  isPrimaryKeyEnabled = false;
  isWaiting = false;
  isModified = false;
  title = '';
  dataObjectsProvider = new DataObjectsProvider();
  model = new DataObjectWithMetadata(null);
  toastHelper = new ToastHelper(useToast());

  public getIsModified(): boolean {
    return this.isModified;
  }

  public getIsWaiting(): boolean {
    return this.isWaiting;
  }

  async save(): Promise<void> {
    this.isWaitingChanged(true);

    if (this.model.isNew) {
      // Insert new item.
      const response = await this.dataObjectsProvider.createItem(
        this.model.metaObjectKindSettings.uid,
        this.model.metaObjectSettings.uid,
        this.model.item,
      );

      this.isWaitingChanged(false);

      if (response.isOK) {
        this.isModifiedChanged(false);
        this.model.setPrimaryKey(response.data);
        this.toastHelper.success(response.message);
        this.saved(response.data);
      } else {
        this.handleError(response);
        this.saved('');
      }
    }
    // Update existing item.
    const response = await this.dataObjectsProvider.updateItem(
      this.model.metaObjectKindSettings.uid,
      this.model.metaObjectSettings.uid,
      this.model.item,
    );

    this.isWaitingChanged(false);

    if (response.isOK) {
      this.isModifiedChanged(false);
      this.toastHelper.success(response.message);
      this.saved(this.model.getUid());
    } else {
      this.handleError(response);
      this.saved('');
    }
  }

  async init(): Promise<void> {
    this.isWaitingChanged(true);

    try {
      await this.loadDataObject();
    } catch (error) {
      console.error('Error loading data object:', error);
      this.toastHelper.error('An error occurred while loading the data object.');
    }

    this.isWaitingChanged(false);
  }

  private async loadDataObject(): Promise<void> {
    const uid = this.isCopy ? this.copyUid : this.uid;
    const response = await this.dataObjectsProvider.getItem(this.kind, this.name, uid);

    if (response.isOK) {
      this.setupModel(response.data);
      console.log('init', this.model);
    } else {
      this.handleError(response);
    }
  }

  private setupModel(data: any): void {
    this.model = new DataObjectWithMetadata(data);
    if (this.isCopy) {
      this.model.setPrimaryKey('');
      this.model.isNew = true;
      this.model.addCopyMessage('title');
    }
    this.title = `${this.model.metaObjectKindSettings.title}.${this.model.metaObjectSettings.title}`;

    if (this.isAdd || this.isCopy) {
      this.isModifiedChanged(true);
    }
  }

  private handleError(response: any): void {
    this.toastHelper.error(response.message);
    console.error(response.presentation);
  }

  mounted(): void {
    this.init();
  }

  onHeaderFieldChange(): void {
    this.isModifiedChanged(true);
    console.log('header field changed');
  }

  public triggerSaveClick(): void {
    this.save();
  }

  @Emit('isModifiedChanged')
  isModifiedChanged(newValue: boolean): boolean {
    this.isModified = newValue;
    return this.isModified;
  }

  @Emit('isWaitingChanged')
  isWaitingChanged(newValue: boolean): boolean {
    this.isWaiting = newValue;
    return this.isWaiting;
  }

  @Emit('saved')
  saved(result: string): string {
    return result;
  }
}
export default toNative(DataObjectEditComponent);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="field grid" v-for="column in model.metaObjectSettings.header.columns"
           :key="column.uid">
        <label :for="column.uid"
               :class="{ 'bs-required': column.required }"
               class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>
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
</template>

<style scoped>
.bs-required:after {
  content: "*";
  color: red;
  font-size: 12pt;
}
</style>
