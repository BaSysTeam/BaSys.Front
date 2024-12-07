<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="false" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <ButtonGroup>
          <Button
            :label="$t('add')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-plus"
            @click="onAddClick"
          />
          <Button
            :label="$t('edit')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-pencil"
            @click="onEditClick"
          />
          <Button
            :label="$t('delete')"
            severity="danger"
            size="small"
            outlined
            icon="pi pi-times"
            @click="onDeleteClick"
          />
        </ButtonGroup>
        <RecordsButton v-if="canCreateRecords"
                       @click="onRecordsClick">
        </RecordsButton>
        <Button
          class="ml-1"
          v-tooltip="$t('copy')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-clone"
          @click="onCopyClick"
        />
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>
    <div class="grid">
      <div class="col">
        <div class="card m-1">
          <DataTable
            v-model:selection="selectedRecord"
            v-model:filters="filters"
            :style="dataTableStyle"
            :value="dataTableItems"
            :metaKeySelection="true"
            :rows="15"
            paginator
            showGridlines
            @row-dblclick="onRowDblClick"
            selectionMode="single"
            scrollable
            scrollHeight="flex"
            filterDisplay="menu"
            size="small"
          >
            <template #empty>{{ $t('noItemsFound') }}</template>
            <Column
              v-for="col of columns"
              :key="col.name"
              :field="col.name"
              :header="col.title">
              <template #body="{ data, field }">
                <template v-if="getColumn(field).isCheckbox">
                  <span v-if="data[field]" class="pi pi-check text-primary"></span>
                </template>
                <template v-else>
                  {{ formatValue(data, field) }}
                </template>

              </template>
              <template #filter="{ filterModel }">
                <template v-if="isColumnDataTypeNumber(filterModel)">
                  <InputNumber v-model="filterModel.value" mode="decimal" />
                </template>
                <template v-if="isColumnDataTypeString(filterModel)">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    :placeholder="`Search by ${col.title}`"
                  />
                </template>
                <template v-if="isColumnDataTypeBoolean(filterModel)">
                  <span for="isBoolean-filter" class="font-bold"> {{ col.title }} </span>
                  <TriStateCheckbox v-model="filterModel.value" inputId="isBoolean-filter" />
                </template>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
    <DataObjectEditDialog v-if="isEditDialogOpen"
                          :title="title"
                          :kind="kind"
                          :name="name"
                          :uid="selectedUid"
                          :copyUid="copyUid"
                          :regime="editRegime"
                          @close="onEditDialogClose"
                          @saved="onItemInDialogSaved"></DataObjectEditDialog>

    <DataObjectRecordsDialog v-if="isRecordsDialogOpen"
                             @close="onRecordsDialogClose"></DataObjectRecordsDialog>
    <ConfirmDialog :draggable="false"></ConfirmDialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import ConfirmDialog from 'primevue/confirmdialog';
import DataObjectEditDialog from '@/components/DataObjectEditDialog.vue';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import RecordsButton from '@/components/standardButtons/RecordsButton.vue';
import DataObjectRecordsDialog from '@/components/DataObjectRecordsDialog.vue';
import DataObjectList from '../models/dataObjectList';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import MetaObjectKindStandardColumn from '../../../shared/src/models/metaObjectKindStandardColumn';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';

@Options({
  components: {
    DataObjectRecordsDialog,
    RecordsButton,
    ViewTitleComponent,
    DataTable,
    Column,
    Divider,
    InputNumber,
    InputText,
    Button,
    ButtonGroup,
    TriStateCheckbox,
    ConfirmDialog,
    DataObjectEditDialog,
  },
})
export default class DataObjectsListView extends Vue {
  // Name of metadata object kind.
  @Prop({ required: true, type: String })
  kind!: string;

  // Name of metadata object.
  @Prop({ required: true, type: String })
  name!: string;

  router = useRouter();
  isWaiting = false;
  title = '';
  toastHelper = new ToastHelper(useToast());
  dataObjectsProvider = new DataObjectsProvider();
  dataObjectList = new DataObjectList(null);
  dataTableItems:any[] = [];
  columns:MetaObjectColumnViewModel[] = [];
  filters:any = {};
  selectedRecord:any = {};
  selectedUid = '';
  copyUid = '';
  confirm = useConfirm();
  windowHeight = window.innerHeight;
  isEditDialogOpen = false;
  isRecordsDialogOpen = false;
  editRegime = 'edit';

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  get canCreateRecords(): boolean {
    return this.dataObjectList.metaObjectKindSettings.canCreateRecords;
  }

  get isSelectedRecordEmpty(): boolean {
    return Object.keys(this.selectedRecord).length === 0;
  }

  @Watch('kind')
  @Watch('name')
  onPropChange(): void {
    this.init();
  }

  onAddClick(): void {
    this.startAdd();
  }

  onEditClick(): void {
    if (this.isSelectedRecordEmpty) {
      return;
    }
    this.startEdit();
  }

  onDeleteClick(): void {
    if (this.isSelectedRecordEmpty) {
      return;
    }

    this.confirm.require({
      message: 'Delete item?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      accept: () => this.deleteItem(),
    });
  }

  onCopyClick(): void {
    this.startCopy();
  }

  onRecordsClick(): void {
    this.isRecordsDialogOpen = true;
  }

  onRowDblClick():void {
    this.startEdit();
  }

  onEditDialogClose():void {
    this.isEditDialogOpen = false;
  }

  onItemInDialogSaved(savedUid: string): void {
    this.handleItemSaved(savedUid);
  }

  onRecordsDialogClose(): void {
    this.isRecordsDialogOpen = false;
  }

  async handleItemSaved(savedUid: string): Promise<void> {
    if (!savedUid) {
      return;
    }
    this.isWaiting = true;
    const response = await this.dataObjectsProvider.getItem(this.kind, this.name, savedUid);
    this.isWaiting = false;

    if (response.isOK) {
      const resultData = new DataObjectWithMetadata(response.data);
      const primaryKey = this.getPrimaryKey();
      if (!primaryKey) {
        return;
      }
      const uid = resultData.getUid();

      const index = this.dataTableItems.findIndex((item) => item[primaryKey.name] === uid);
      if (index === -1) {
        this.dataTableItems.unshift(resultData.item.header);
        // eslint-disable-next-line prefer-destructuring
        this.selectedRecord = this.dataTableItems[0];
      } else {
        this.dataTableItems.splice(index, 1, resultData.item.header);
        this.selectedRecord = this.dataTableItems[index];
      }
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  mounted(): void {
    window.addEventListener('resize', this.onResize);
    document.title = 'BaSYS';
    this.windowHeight = window.innerHeight;
    this.init();
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
  }

  getPrimaryKey(): MetaObjectKindStandardColumn | null {
    const filterResult = this.dataObjectList.metaObjectKindSettings.standardColumns
      .filter((x) => x.isPrimaryKey);

    if (!filterResult.length) return null;

    return filterResult[0];
  }

  getCurrentUid(): string {
    const primaryKey = this.getPrimaryKey();
    if (!primaryKey) return '';

    return this.selectedRecord[primaryKey.name];
  }

  startAdd(): void {
    if (this.dataObjectList.metaObjectSettings.editMethod === 1) {
      this.selectedUid = '';
      this.editRegime = 'add';
      this.isEditDialogOpen = true;
    } else {
      this.navigateToAdd();
    }
  }

  startCopy(): void {
    if (this.isSelectedRecordEmpty) {
      return;
    }
    if (this.dataObjectList.metaObjectSettings.editMethod === 1) {
      this.selectedUid = '';
      this.copyUid = this.getCurrentUid();
      this.editRegime = 'copy';
      this.isEditDialogOpen = true;
    } else {
      this.navigateToCopy();
    }
  }

  startEdit(): void {
    console.log('start edit, title', this.title);
    if (this.isSelectedRecordEmpty) {
      return;
    }
    if (this.dataObjectList.metaObjectSettings.editMethod === 1) {
      this.selectedUid = this.getCurrentUid();
      this.editRegime = 'edit';
      this.isEditDialogOpen = true;
    } else {
      this.navigateToEdit();
    }
  }

  navigateToEdit(): void {
    const kindName = this.dataObjectList.metaObjectKindSettings.name;
    const objectName = this.dataObjectList.metaObjectSettings.name;

    const filterResult = this.dataObjectList.metaObjectKindSettings.standardColumns
      .filter((x) => x.isPrimaryKey);

    if (!filterResult.length) return;

    const primaryKey = filterResult[0];
    const uid = this.selectedRecord[primaryKey.name];

    this.router.push({ name: 'data-objects-edit', params: { kind: kindName, name: objectName, uid } });
  }

  navigateToCopy(): void {
    const kindName = this.dataObjectList.metaObjectKindSettings.name;
    const objectName = this.dataObjectList.metaObjectSettings.name;

    const primaryKey = this.getPrimaryKey();
    if (!primaryKey) {
      return;
    }
    const uid = this.selectedRecord[primaryKey.name];

    this.router.push({ name: 'data-objects-copy', params: { kind: kindName, name: objectName, copyUid: uid } });
  }

  navigateToAdd(): void {
    const kindName = this.dataObjectList.metaObjectKindSettings.name;
    const objectName = this.dataObjectList.metaObjectSettings.name;

    this.router.push({ name: 'data-objects-add', params: { kind: kindName, name: objectName } });
  }

  async deleteItem(): Promise<void> {
    if (this.isSelectedRecordEmpty) {
      return;
    }
    const primaryKey = this.getPrimaryKey();
    if (!primaryKey) {
      return;
    }

    // Make delete request.
    this.isWaiting = true;
    const uid = this.selectedRecord[primaryKey.name];
    const response = await this.dataObjectsProvider.deleteItem(this.kind, this.name, uid);
    this.isWaiting = false;

    if (response.isOK) {
      // Delete item from list to avoid one more backed call.
      const index = this.dataTableItems.findIndex((item) => item[primaryKey.name] === uid);
      if (index !== -1) {
        this.dataTableItems.splice(index, 1);
      }
      this.toastHelper.success(response.message);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async init(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataObjectsProvider.getCollection(this.kind, this.name);
    if (response.isOK) {
      this.dataObjectList = response.data;
      this.dataTableItems = this.dataObjectList.items.map((x) => x.header);
      console.log('list response', response.data);
      console.log('items', this.dataTableItems);
      if (this.dataTableItems.length) {
        // eslint-disable-next-line prefer-destructuring
        this.selectedRecord = this.dataTableItems[0];
      }
      this.title = `${this.dataObjectList.metaObjectKindSettings.title}.${this.dataObjectList.metaObjectSettings.title}`;
      document.title = `${this.title} - BaSYS`;
      this.initColumns();
      this.initFilters();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  getColumn(name: string): MetaObjectColumnViewModel {
    const column = this.columns.find((x) => x.name === name);
    if (!column) {
      return new MetaObjectColumnViewModel(null, this.dataObjectList.dataTypes);
    }
    return column;
  }

  formatValue(row: any, field: string): string {
    const column = this.getColumn(field);

    const value = row[field];
    if (column.isInt) {
      return ValuesFormatter.formatNumber(value, 0);
    }
    if (column.isNumber) {
      return ValuesFormatter.formatNumber(value, column.numberDigits);
    }
    if (column.isDateInput) {
      return ValuesFormatter.formatDate(value);
    }
    if (column.isDateTimeInput) {
      return ValuesFormatter.formatDateTime(value);
    }

    return value;
  }

  initColumns(): void {
    this.columns = [];
    // eslint-disable-next-line no-restricted-syntax
    this.dataObjectList.metaObjectSettings.header.columns.forEach((column) => {
      const isPrimitive = DataTypeDefaults.IsPrimitiveType(column.dataTypeUid);

      const columnName = isPrimitive ? column.name : `${column.name}_display`;

      const columnViewModel = new MetaObjectColumnViewModel(
        column,
        this.dataObjectList.dataTypes,
      );
      columnViewModel.name = columnName;

      this.columns.push(columnViewModel);
    });
    console.log('init columns list', this.columns);
  }

  initFilters(): void {
    if (this.dataTableItems.length > 0) {
      const first = this.dataTableItems[0];

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(first)) {
        if (typeof value === 'number') {
          this.filters[key] = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS, columnDataType: 'number' }],
          };
        }
        if (typeof value === 'string') {
          this.filters[key] = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH, columnDataType: 'string' }],
          };
        }
        if (typeof value === 'boolean') {
          this.filters[key] = { value: null, matchMode: FilterMatchMode.NOT_EQUALS, columnDataType: 'boolean' };
        }
      }
    }
  }

  isColumnDataTypeNumber(param: any): boolean {
    return param.columnDataType === 'number';
  }

  isColumnDataTypeString(param: any): boolean {
    return param.columnDataType === 'string';
  }

  isColumnDataTypeBoolean(param: any): boolean {
    return param.columnDataType === 'boolean';
  }
}
</script>

<style scoped>

</style>
