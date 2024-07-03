<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import { DbType } from '../../../shared/src/enums/DbTypes';

@Options({
  components: {
    InputText,
    InputNumber,
  },
})
export default class DataObjectEditComponent extends Vue {
  // Regime of editing: edit | copy | add.
  @Prop({ required: true, type: String, default: 'edit' })
  regime!: string;

  // Name of metadata object kind.
  @Prop({ required: true, type: String })
  kind!: string;

  // Name of metadata object.
  @Prop({ required: true, type: String })
  name!: string;

  // Identifier of editing item.
  @Prop({ required: false, type: String, default: '' })
  uid!: string;

  // Identifier of source item (item which was copied).
  @Prop({ required: false, type: String, default: '' })
  copyUid!: string;

  regimeValue = 'edit';

  isAdd(): boolean {
    return this.regimeValue === 'add';
  }

  isCopy(): boolean {
    return this.regimeValue === 'copy';
  }

  isPrimaryKeyEnabled = false;
  isWaiting = false;
  isModified = false;
  title = '';
  dataObjectsProvider = new DataObjectsProvider();
  model = new DataObjectWithMetadata(null);
  toastHelper = new ToastHelper(useToast());

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
    } else {
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
    const uid = this.isCopy() ? this.copyUid : this.uid;
    const response = await this.dataObjectsProvider.getItem(this.kind, this.name, uid);

    if (response.isOK) {
      this.setupModel(response.data);
      console.log('init', this.model);
    } else {
      this.handleError(response);
    }
  }

  private setupModel(data: any): void {
    console.log('setupModel', data);
    this.model = new DataObjectWithMetadata(data);
    if (this.isCopy()) {
      this.model.setPrimaryKey('');
      this.model.isNew = true;
      this.model.addCopyMessage('title');
    }
    this.title = `${this.model.metaObjectKindSettings.title}.${this.model.metaObjectSettings.title}`;
    this.isPrimaryKeyEnabled = this.model.isPrimaryKeyEditable && this.model.isNew;
    this.titleChanged(this.title);

    if (this.isAdd() || this.isCopy()) {
      this.isModifiedChanged(true);
    }
  }

  private handleError(response: any): void {
    this.toastHelper.error(response.message);
    console.error(response.presentation);
  }

  mounted(): void {
    console.log('DataObjectEditComponent initialized', this.regime, this.copyUid);
    this.regimeValue = this.regime;
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

  @Emit('titleChanged')
  titleChanged(title: string): string {
    return this.title;
  }

  @Emit('saved')
  saved(result: string): string {
    return result;
  }

  shouldRenderStringInput(dataTypeUid: string): boolean {
    const dataType = this.model.dataTypes.find((x) => x.uid === dataTypeUid);
    if (!dataType) {
      return false;
    }

    if (dataType.dbType === DbType.String && dataType.isPrimitive) {
      return true;
    }

    return false;
  }

  shouldRenderIntInput(dataTypeUid: string): boolean {
    const dataType = this.model.dataTypes.find((x) => x.uid === dataTypeUid);
    if (!dataType) {
      return false;
    }

    if (dataType.dbType === DbType.Int32 && dataType.isPrimitive) {
      return true;
    }

    return false;
  }

  shouldRenderNumberInput(dataTypeUid: string): boolean {
    const dataType = this.model.dataTypes.find((x) => x.uid === dataTypeUid);
    if (!dataType) {
      return false;
    }

    if (dataType.dbType === DbType.Decimal && dataType.isPrimitive) {
      return true;
    }

    return false;
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="field grid" v-for="column in model.metaObjectSettings.header.columns"
           :key="column.uid">
        <label :for="column.uid"
               :class="{ 'bs-required': column.required }"
               class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>
        <div class="col-12 md:col-8" v-if="column.primaryKey">
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
        <div class="col-12 md:col-8" v-if="!column.primaryKey">
          <!--String input-->
          <InputText v-if="shouldRenderStringInput(column.dataTypeUid)"
            :id="column.uid"
            v-model="model.item.header[column.name]"
            autocomplete="off"
            size="small"
            class="w-full"
            @change="onHeaderFieldChange"
          />
          <!--Integer input-->
          <InputNumber v-if="shouldRenderIntInput(column.dataTypeUid)"
            :id="column.uid"
            v-model="model.item.header[column.name]"
            autocomplete="off"
            size="small"
            class="w-full text-right"
            @change="onHeaderFieldChange"
          />
          <!--Number input-->
          <InputNumber v-if="shouldRenderNumberInput(column.dataTypeUid)"
            :id="column.uid"
            v-model="model.item.header[column.name]"
            :min-fraction-digits="column.numberDigits"
            :max-fraction-digits="column.numberDigits"
            autocomplete="off"
            size="small"
            class="w-full text-right"
            @change="onHeaderFieldChange"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
