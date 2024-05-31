<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="false" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>
    <div class="grid">
      <div class="col">
        <div class="card m-1">
          <DataTable
            v-model:filters="filters"
            :style="dataTableStyle"
            :value="dataTableItems"
            :rows="15"
            paginator
            showGridlines
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
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
  isWaiting = false;
  title = 'App:';
  toastHelper = new ToastHelper(useToast());
  dataObjectsProvider = new DataObjectsProvider();
  dataObjectList = new DataObjectList(null);
  dataTableItems:any[] = [];
  columns:any[] = [];
  filters:any = {};

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  mounted(): void {
    this.init();
  }

  async init(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataObjectsProvider.getCollection(this.kind, this.name);
    if (response.isOK) {
      this.dataObjectList = response.data;
      this.dataTableItems = this.dataObjectList.items.map((x) => x.header);
      this.title += `${this.dataObjectList.metaObjectKindSettings.title}.${this.dataObjectList.metaObjectSettings.title}`;
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
