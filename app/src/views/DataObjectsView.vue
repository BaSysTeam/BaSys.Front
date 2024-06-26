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
            label="Add"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-plus"
            @click="onAddClick"
          />
          <Button
            label="Edit"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-pencil"
            @click="onEditClick"
          />
          <Button
            label="Delete"
            severity="danger"
            size="small"
            outlined
            icon="pi pi-times"
            @click="onDeleteClick"
          />
        </ButtonGroup>
        <Button
          class="ml-1"
          v-tooltip="'Copy'"
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
              :key="col.field"
              :field="col.field"
              :header="col.header">
              <template #filter="{ filterModel }">
                <template v-if="isColumnDataTypeNumber(filterModel)">
                  <InputNumber v-model="filterModel.value" mode="decimal" />
                </template>
                <template v-if="isColumnDataTypeString(filterModel)">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    :placeholder="`Search by ${col.header}`"
                  />
                </template>
                <template v-if="isColumnDataTypeBoolean(filterModel)">
                  <span for="isBoolean-filter" class="font-bold"> {{ col.header }} </span>
                  <TriStateCheckbox v-model="filterModel.value" inputId="isBoolean-filter" />
                </template>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import { useToast } from 'primevue/usetoast';
import DataObjectList from '../models/dataObjectList';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    DataTable,
    Column,
    Divider,
    InputNumber,
    InputText,
    Button,
    ButtonGroup,
    TriStateCheckbox,
  },
  props: {
    kind: String,
    name: String,
  },
})
export default class DataObjectsView extends mixins(ResizeWindow) {
  kind!: string;
  name!: string;
  router = useRouter();
  isWaiting = false;
  title = '';
  toastHelper = new ToastHelper(useToast());
  dataObjectsProvider = new DataObjectsProvider();
  dataObjectList = new DataObjectList(null);
  dataTableItems:any[] = [];
  columns:any[] = [];
  filters:any = {};
  selectedRecord:any = {};

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  get isSelectedRecordEmpty(): boolean {
    return Object.keys(this.selectedRecord).length === 0;
  }

  onAddClick(): void {
    console.log('Add clicked');
    this.navigateToAdd();
  }

  onEditClick(): void {
    console.log('Edit click');
    if (this.isSelectedRecordEmpty) {
      return;
    }
    this.navigateToEdit();
  }

  onDeleteClick(): void {
    console.log('Delete click');
  }

  onCopyClick(): void {
    console.log('Copy click');
  }

  onRowDblClick():void {
    console.log('Row dbl click', this.selectedRecord);
    console.log('list view model', this.dataObjectList);
    this.navigateToEdit();
  }

  mounted(): void {
    this.init();
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

  navigateToAdd(): void {
    const kindName = this.dataObjectList.metaObjectKindSettings.name;
    const objectName = this.dataObjectList.metaObjectSettings.name;

    this.router.push({ name: 'data-objects-edit', params: { kind: kindName, name: objectName, uid: '0' } });
  }

  async init(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataObjectsProvider.getCollection(this.kind, this.name);
    if (response.isOK) {
      this.dataObjectList = response.data;
      this.dataTableItems = this.dataObjectList.items.map((x) => x.header);
      if (this.dataTableItems.length) {
        // eslint-disable-next-line prefer-destructuring
        this.selectedRecord = this.dataTableItems[0];
      }
      this.title = `${this.dataObjectList.metaObjectKindSettings.title}.${this.dataObjectList.metaObjectSettings.title}`;
      this.initColumns();
      this.initFilters();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  initColumns(): void {
    if (this.dataTableItems.length > 0) {
      const first = this.dataTableItems[0];
      const keys = Object.keys(first);
      this.columns = keys.map((key) => (
        {
          field: key.toString(), header: this.capitalizeFirstLetter(key.toString()),
        }));
    }
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

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
</script>

<style scoped>

</style>
