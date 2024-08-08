<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { useToast } from 'primevue/usetoast';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toolbar from 'primevue/toolbar';
import DataObjectViewModel from '@/models/dataObjectViewModel';
import DataObject from '@/models/dataObject';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import DataObjectHeaderFieldEditComponent
  from '@/components/DataObjectHeaderFieldEditComponent.vue';
import DataObjectDetailTableEdit from '@/components/DataObjectDetailTableEdit.vue';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Button,
    ButtonGroup,
    InputGroup,
    InputGroupAddon,
    InputText,
    InputNumber,
    InputIcon,
    IconField,
    Checkbox,
    Calendar,
    TabView,
    TabPanel,
    Toolbar,
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

  // Specify where component is used. In item edit page or item edit dialog.
  @Prop({ required: true, type: String, default: 'page' })
  renderPlace!: string;

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
  searchString = '';
  sortKind = 1;

  get requestUid(): string {
    const uid = this.isCopy() ? this.copyUid : this.uid;
    return uid;
  }

  get headerColumnFiltered(): MetaObjectColumnViewModel[] {
    let result: MetaObjectColumnViewModel[] = [];

    // Filter columns by name.
    if (!this.searchString) {
      result = this.model.headerColumns;
    } else {
      result = this.model.headerColumns.filter(
        (x) => x.title.toLowerCase().includes(this.searchString.toLowerCase()),
      );
    }

    // Sort columns.
    switch (this.sortKind) {
      case 1:
        // Initial sort.
        return result;
      case 2:
        // Reverse.
        return result.slice().reverse();
      case 3:
        // Sort by title.
        return result.slice().sort((a, b) => a.title.localeCompare(b.title));
      case 4:
        // Sort by title DESC.
        return result.slice().sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }

  async save(): Promise<void> {
    this.isWaitingChanged(true);
    const objectToSave = new DataObject(null);
    objectToSave.init(this.model.item, true);
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

  onTableIsModifiedChanged(args: boolean): void {
    this.isModifiedChanged(args);
  }

  onFieldsSortChangeClick(args: number): void {
    this.sortKind = args;
  }

  onClearSearchClick(): void {
    this.searchString = '';
  }
}
</script>

<template>
  <div class="grid" v-if="model.tabs.length > 0">
    <div class="col-12">
      <div class="bs-tabview-bottom">
        <TabView :lazy="false">
          <!--Header tab-->
          <TabPanel key="header" header="Header">
            <div class="grid" :style="{height: `${windowHeight - 250}px`}">
              <div :class="{'col-6': renderPlace == 'page', 'col-12': renderPlace == 'dialog'}">
                <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
                  <template #start>
                    <a href="#"
                       class="mr-2 ml-2 bs-toolbar-action"
                       tabindex="-1"
                       @click.prevent="onFieldsSortChangeClick(1)">
                      <span class="pi pi-sort-numeric-down"
                            :class="{'text-primary': sortKind == 1}" ></span>
                    </a>
                    <a href="#"
                       class="mr-2 bs-toolbar-action"
                       tabindex="-1"
                       @click.prevent="onFieldsSortChangeClick(2)">
                      <span class="pi pi-sort-numeric-up"
                            :class="{'text-primary': sortKind == 2}"></span>
                    </a>
                    <a href="#"
                       class="mr-2 bs-toolbar-action"
                       tabindex="-1"
                       @click.prevent="onFieldsSortChangeClick(3)">
                      <span class="pi pi-sort-alpha-down"
                            :class="{'text-primary': sortKind == 3}"></span>
                    </a>
                    <a href="#"
                       class="mr-2 bs-toolbar-action"
                       tabindex="-1"
                       @click.prevent="onFieldsSortChangeClick(4)">
                      <span class="pi pi-sort-alpha-up"
                            :class="{'text-primary': sortKind == 4}"></span>
                    </a>
                  </template>

                  <template #end>
                    <InputGroup>
                      <InputText v-model="searchString"
                                 :placeholder="$t('search')"
                                 size="small" />
                      <Button icon="pi pi-times"
                              severity="secondary"
                              @click="onClearSearchClick"
                              outlined></Button>
                    </InputGroup>

                  </template>
                </Toolbar>
                <div class="field grid" v-for="column in headerColumnFiltered"
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
                                       :object-uid="requestUid"
                                       :meta-object-settings="model.metaObjectSettings"
                                       :data-types="model.dataTypes"
                                       @is-modified-changed="onTableIsModifiedChanged">
            </DataObjectDetailTableEdit>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>

  <!--Edit header fields-->
  <div class="grid" v-if="model.tabs.length === 0">
    <div :class="{'col-6': renderPlace == 'page', 'col-12': renderPlace == 'dialog'}">
      <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
        <template #start>
          <a href="#"
             class="mr-2 ml-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(1)">
                      <span class="pi pi-sort-numeric-down"
                            :class="{'text-primary': sortKind == 1}" ></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(2)">
                      <span class="pi pi-sort-numeric-up"
                            :class="{'text-primary': sortKind == 2}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(3)">
                      <span class="pi pi-sort-alpha-down"
                            :class="{'text-primary': sortKind == 3}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(4)">
                      <span class="pi pi-sort-alpha-up"
                            :class="{'text-primary': sortKind == 4}"></span>
          </a>
        </template>

        <template #end>
          <InputGroup>
            <InputText v-model="searchString"
                       :placeholder="$t('search')"
                       size="small" />
            <Button icon="pi pi-times"
                    severity="secondary"
                    @click="onClearSearchClick"
                    outlined></Button>
          </InputGroup>

        </template>
      </Toolbar>
      <div class="field grid" v-for="column in headerColumnFiltered"
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
/*
.bs-tabview-bottom .p-tabview-nav {
  order: 2;
}

.bs-tabview-bottom .p-tabview-panels {
  order: 1;
}

.bs-tabview-bottom .p-tabview {
  display: flex;
  flex-direction: column-reverse;
}

.bs-tabview-bottom .p-tabview /deep/ .p-tabview-nav {
  border-top: 1px solid #ececec !important;
}
*/
</style>
