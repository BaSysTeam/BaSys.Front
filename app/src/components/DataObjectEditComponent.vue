<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataObjectViewModel from '@/models/dataObjectViewModel';
import DataObject from '@/models/dataObject';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import DataObjectHeaderFieldEditComponent
  from '@/components/DataObjectHeaderFieldEditComponent.vue';
import DataObjectDetailTableEdit from '@/components/DataObjectDetailTableEdit.vue';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    InputText,
    InputNumber,
    Checkbox,
    Calendar,
    TabView,
    TabPanel,
    PrimaryKeyInput,
    DataObjectHeaderFieldEditComponent,
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

  async save(): Promise<void> {
    this.isWaitingChanged(true);
    console.log('before date convert', this.model.item);
    const objectToSave = new DataObject(this.model.item);
    objectToSave.convertDatesToIso();

    console.log('objectToSave', objectToSave);
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
    this.model = new DataObjectViewModel(data);
    console.log('tabs', this.model.tabs);
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
}
</script>

<template>
  <div class="grid" v-if="model.tabs.length > 0">
    <div class="col-12">
      <div class="bs-tabview-bottom">
        <TabView>
          <!--Header tab-->
          <TabPanel key="header" header="Header">
            <div class="grid" :style="{height: `${windowHeight - 250}px`}">
              <div class="col-6">
                <div class="field grid" v-for="column in model.headerColumns"
                     :key="column.uid">

                  <DataObjectHeaderFieldEditComponent :key="column.uid"
                                                      :column="column"
                                                      :is-primary-key-enabled="isPrimaryKeyEnabled"
                                                      :item="model.item"
                                                      @change="onHeaderFieldChange">
                  </DataObjectHeaderFieldEditComponent>

                </div>
              </div>
            </div>
          </TabPanel>
          <!--Detail tables tabs-->
          <TabPanel v-for="table in model.item.detailsTables"
                    :key="table.uid"
                    :header="table.title">
            <DataObjectDetailTableEdit :table ="table"
                                       :kind="kind"
                                       :object-uid="uid"
                                       :meta-object-settings="model.metaObjectSettings"
                                       :data-types="model.dataTypes">
            </DataObjectDetailTableEdit>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>

  <div class="grid" v-if="model.tabs.length === 0">
    <div class="col-6">
      <div class="field grid" v-for="column in model.headerColumns"
           :key="column.uid">

         <DataObjectHeaderFieldEditComponent :key="column.uid"
                                             :column="column"
                                             :is-primary-key-enabled="isPrimaryKeyEnabled"
                                             :item="model.item"
                                             @change="onHeaderFieldChange">
         </DataObjectHeaderFieldEditComponent>

      </div>
    </div>
  </div>
</template>

<style scoped>
.bs-tabview-bottom .p-tabview-nav {
  order: 2; /* Pushes the tabs to the bottom */
}

.bs-tabview-bottom .p-tabview-panels {
  order: 1; /* Keeps the content above the tabs */
}

.bs-tabview-bottom .p-tabview {
  display: flex;
  flex-direction: column-reverse; /* Reverses the order of children */
}

.bs-tabview-bottom .p-tabview /deep/ .p-tabview-nav {
  border-top: 1px solid #ececec !important;
}

</style>
