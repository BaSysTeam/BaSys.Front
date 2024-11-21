<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { useToast } from 'primevue/usetoast';
import Sidebar from 'primevue/sidebar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataObjectViewModel from '@/models/dataObjectViewModel';
import DataObject from '@/models/dataObject';
import DataObjectHeaderEdit from '@/components/DataObjectHeaderEdit.vue';
import DataObjectDetailTableEdit from '@/components/DataObjectDetailTableEdit.vue';
import ObjectEvaluator from '@/evalEngine/objectEvaluator';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';

@Options({
  components: {
    Sidebar,
    TabView,
    TabPanel,
    DataObjectHeaderEdit,
    DataObjectDetailTableEdit,
  },
})
export default class DataObjectEditComponent extends Vue {
  // Regime of editing: edit | copy | add.
  @Prop({
    required: true,
    type: String,
    default: 'edit',
  })
  regime!: string;

  // Name of metadata object kind.
  @Prop({
    required: true,
    type: String,
  })
  kind!: string;

  // Name of metadata object.
  @Prop({
    required: true,
    type: String,
  })
  name!: string;

  // Identifier of editing item.
  @Prop({
    required: false,
    type: String,
    default: '',
  })
  uid!: string;

  // Identifier of source item (item which was copied).
  @Prop({
    required: false,
    type: String,
    default: '',
  })
  copyUid!: string;

  // Specify where component is used. In item edit page or item edit dialog.
  @Prop({ required: true, type: String, default: 'page' })
  renderPlace!: string;

  // Calculation logger.
  @Prop({ required: true, type: InMemoryLogger })
  logger!: InMemoryLogger;

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
  model = new DataObjectViewModel(null);
  toastHelper = new ToastHelper(useToast());
  windowHeight = window.innerHeight;

  get requestUid(): string {
    const uid = this.isCopy() ? this.copyUid : this.uid;
    return uid;
  }

  async save(): Promise<void> {
    this.isWaitingChanged(true);
    const objectToSave = new DataObject(null);
    objectToSave.init(this.model.item, true);
    objectToSave.convertDatesToIso();

    if (this.model.isNew) {
      // Insert new item.
      const response = await this.dataObjectsProvider.createItem(
        this.model.metaObjectKindSettings.uid,
        this.model.metaObjectSettings.uid,
        objectToSave,
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
        objectToSave,
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
    const response = await this.dataObjectsProvider.getItem(this.kind, this.name, this.requestUid);

    if (response.isOK) {
      this.setupModel(response.data);
    } else {
      this.handleError(response);
    }
  }

  private setupModel(data: any): void {
    this.model = new DataObjectViewModel(data);
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

  private async recalculate(): Promise<void> {
    this.isWaitingChanged(true);
    const objectEvaluator = new ObjectEvaluator(
      this.logger,
      this.model.metaObjectSettings,
      this.model.item,
    );

    await objectEvaluator.onObjectRecalculateAsync();
    this.toastHelper.success('Object recalculated');
    this.isWaitingChanged(false);
    this.isModifiedChanged(true);
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
  }

  onIsModifiedChanged(args: boolean): void {
    this.isModifiedChanged(args);
  }

  onIsWaitingChanged(args: boolean): void {
    this.isWaitingChanged(args);
  }

  onSaveTriggered(): void {
    this.save();
  }

  async onRefreshTriggered(): Promise<void> {
    await this.init();
  }

  onCloseTriggered(): void {
    this.closeTrigger();
  }

  public triggerSaveClick(): void {
    this.save();
  }

  public triggerRecalculateClick(): void {
    this.recalculate();
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

  @Emit('closeTrigger')
  closeTrigger(): void {
    console.log('Close trigger');
  }

  onTableIsModifiedChanged(args: boolean): void {
    this.isModifiedChanged(args);
  }
}
</script>

<template>
  <div class="grid" v-if="model.tabs.length > 0">
    <div class="col-12">
      <div class="bs-tabview-bottom">
        <TabView :lazy="false">
          <!--Header tab-->
          <TabPanel key="header" :header="$t('mainTab')">

            <DataObjectHeaderEdit :model="model"
                                  :logger="logger"
                                  :is-primary-key-enabled="isPrimaryKeyEnabled"
                                  :render-place="renderPlace"
                                  @is-modified-changed="onIsModifiedChanged"
                                  @is-waiting-changed="onIsWaitingChanged"
                                  @save-trigger="onSaveTriggered"
                                  @refresh-trigger="onRefreshTriggered"
                                  @close-trigger="onCloseTriggered">
            </DataObjectHeaderEdit>

          </TabPanel>
          <!--Detail tables tabs-->
          <TabPanel v-for="table in model.item.detailsTables"
                    :key="table.uid"
                    :header="table.title">
            <DataObjectDetailTableEdit :table ="table"
                                       :logger="logger"
                                       :kind="kind"
                                       :object-uid="requestUid"
                                       :data-object="model.item"
                                       :meta-object-settings="model.metaObjectSettings"
                                       :data-types="model.dataTypes"
                                       @is-modified-changed="onTableIsModifiedChanged"
                                       @is-waiting-changed="onIsWaitingChanged"
                                       @save-trigger="onSaveTriggered"
                                       @refresh-trigger="onRefreshTriggered"
                                       @close-trigger="onCloseTriggered">
            </DataObjectDetailTableEdit>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>

  <!--Edit header fields-->
    <DataObjectHeaderEdit v-if="model.tabs.length === 0"
                          :model="model"
                          :logger="logger"
                          :is-primary-key-enabled="isPrimaryKeyEnabled"
                          :render-place="renderPlace"
                          @is-modified-changed="onIsModifiedChanged"
                          @is-waiting-changed="onIsWaitingChanged"
                          @save-trigger="onSaveTriggered"
                          @refresh-trigger="onRefreshTriggered"
                          @close-trigger="onCloseTriggered"></DataObjectHeaderEdit>

</template>

<style scoped>

</style>
