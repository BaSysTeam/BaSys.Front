<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  Prop, Watch, Emit, Ref,
} from 'vue-property-decorator';
import { PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import DataObject from '@/models/dataObject';
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectsProvider from '@/dataProviders/dataObjectsProvider';
import SelectItemsProvider from '@/dataProviders/selectItemsProvider';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DropdownEditor from '@/components/editors/DropdownEditor.vue';
import SelectItem from '@/models/selectItem';
import { Guid } from 'guid-typescript';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import ObjectEvaluator from '../evalEngine/objectEvaluator';

@Options({
  components:
    {
      DropdownEditor,
      DataTable,
      Column,
      InputText,
      InputNumber,
      Checkbox,
      InputSwitch,
      Calendar,
      Menubar,
      Button,
      Badge,
    },
})
export default class DataObjectDetailTableEdit extends Vue {
  // Name of metadata object kind.
  @Prop({
    required: true,
    type: String,
    default: '',
  })
  kind!: string;

  // Identifier of the object.
  @Prop({
    required: true,
    type: String,
    default: '',
  })
  objectUid!: string;

  // Metadata object.
  @Prop({
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  })
  metaObjectSettings!: MetaObjectStorableSettings;

  // Data types.
  @Prop({
    type: Object as PropType<DataType[]>,
    required: true,
  })
  dataTypes!: DataType[];

  // DataObject.
  @Prop({
    type: Object as PropType<DataObject>,
    required: true,
  })
  dataObject!: DataObject;

  // DetailsTable.
  @Prop({
    type: Object as PropType<DataObjectDetailsTable>,
    required: true,
  })
  table!: DataObjectDetailsTable;

  // Logger.
  @Prop({
    type: Object as PropType<InMemoryLogger>,
    required: true,
  })
  logger!: InMemoryLogger;

  @Ref()
  dataTableRef!:any;

  get tableRows(): any[] {
    if (this.table != null) {
      return this.table.rows;
    }
    return [];
  }

  tableKey = 0;
  isWaiting = false;
  columns: MetaObjectColumnViewModel[] = [];
  filters:any = {};
  selectedRecord: any = {};
  windowHeight = window.innerHeight;
  provider = new DataObjectsProvider();
  objectEvaluator: ObjectEvaluator = new ObjectEvaluator(
    this.logger,
    this.metaObjectSettings,
    this.dataObject,
  );

  selectItemProvider = new SelectItemsProvider();
  toastHelper = new ToastHelper(useToast());
  inputStyle = {
    width: '100%',
    fontSize: '14px',
    borderRadius: 0,
    padding: '5px',
  };

  virtualScrollerOptions = {
    itemSize: 30,
    delay: 0,
    disabled: false,
    numToleratedItems: 20,
  };

  menuItems: any[] = [];
  vScroll: any;

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 420}px`,
      fontSize: '14px',
    };
  }

  get dataTableScrollHeight(): string {
    return `${this.windowHeight - 320}px`;
  }

  @Watch('tableUid')
  @Watch('metaObjectSettings')
  onPropChange(): void {
    this.initColumns();
    this.initFilters();
    this.loadData();
  }

  @Emit('isModifiedChanged')
  isModifiedChanged(newValue: boolean): boolean {
    this.table.isModified = newValue;
    return newValue;
  }

  initColumns(): void {
    this.columns = [];
    console.log('MetaObjectSettings', this.metaObjectSettings);
    if (!this.metaObjectSettings) {
      return;
    }

    // Get current table.
    const tableSettings = this.metaObjectSettings.detailTables.find(
      (x) => x.uid === this.table.uid,
    );
    if (!tableSettings) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    tableSettings.columns.forEach((column) => {
      if (column.name === 'id'
        || column.name === 'object_uid'
        || column.name === 'row_number') {
        return;
      }
      const isPrimitive = DataTypeDefaults.IsPrimitiveType(column.dataTypeUid);

      const columnName = isPrimitive ? column.name : `${column.name}_display`;

      const columnViewModel = new MetaObjectColumnViewModel(
        column,
        this.dataTypes,
      );

      columnViewModel.name = columnName;
      columnViewModel.setDefaultStyle();

      if (columnViewModel.name === 'row_number') {
        columnViewModel.setWidth('50px');
        columnViewModel.title = '#';
        columnViewModel.isInt = false;
        columnViewModel.isNumber = false;
        columnViewModel.readonly = true;
      }

      this.columns.push(columnViewModel);
    });
  }

  async loadData(): Promise<void> {
    if (this.table.rows.length > 0) {
      return;
    }
    this.isWaiting = true;
    const response = await this.provider.getDetailsTable(
      this.kind,
      this.metaObjectSettings.name,
      this.objectUid,
      this.table.name,
    );
    if (response.isOK) {
      this.table.rows = response.data.rows;
      this.initFilters();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    this.$nextTick(() => {
      if (this.table.rows.length) {
        // eslint-disable-next-line prefer-destructuring
        this.selectedRecord = this.table.rows[0];
      }
    });
    this.isWaiting = false;
  }

  getColumn(name: string): MetaObjectColumnViewModel {
    const column = this.columns.find((x) => x.name === name);
    if (!column) {
      return new MetaObjectColumnViewModel(null, this.dataTypes);
    }
    return column;
  }

  parseDisplayName(displayName: string): { valueName: string, displayName: string } {
    const names = {
      valueName: '',
      displayName,
    };
    const ind = displayName.lastIndexOf('_display');
    if (ind > -1) {
      names.valueName = displayName.substring(0, ind);
    }
    return names;
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

  initFilters(): void {
    if (this.tableRows.length > 0) {
      const first = this.tableRows[0];

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

  mounted(): void {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
    this.initColumns();
    this.initFilters();
    this.menuItems.push({
      icon: 'pi pi-plus',
      class: 'text-primary',
      command: () => this.onAddClick(),
    }, {
      label: 'Filters',
      icon: 'pi pi-filter-slash',
      class: 'text-primary',
      command: () => this.onClearFiltersClick(),
    });
    this.loadData();
    this.$nextTick(() => {
      if (this.table.rows.length) {
        // eslint-disable-next-line prefer-destructuring
        this.selectedRecord = this.table.rows[0];
      }
    });

    this.objectEvaluator = new ObjectEvaluator(
      this.logger,
      this.metaObjectSettings,
      this.dataObject,
    );
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
  }

  async onCellEditComplete(event: any): Promise<void> {
    const row = event.data;
    const columnName: string = event.field as string;
    const newRow = event.newData;

    const names = this.parseDisplayName(columnName);
    row[columnName] = newRow[columnName];
    if (names.valueName) {
      row[names.valueName] = newRow[names.valueName];
      await this.objectEvaluator.onRowFieldChangedAsync(names.valueName, this.table.uid, row);
    } else {
      await this.objectEvaluator.onRowFieldChangedAsync(columnName, this.table.uid, row);
    }

    this.isModifiedChanged(true);
  }

  onDropDownSelected(row: any, field: string, selectItem: SelectItem): void {
    const names = this.parseDisplayName(field);
    if (names.valueName) {
      row[names.valueName] = selectItem.value;
    }
    row[names.displayName] = selectItem.text;
  }

  async onAddClick(): Promise<void> {
    const tableSettings = this.metaObjectSettings.detailTables.find(
      (x) => x.uid === this.table.uid,
    );
    if (!tableSettings) {
      return;
    }

    const ind = this.table.rows.indexOf(this.selectedRecord);
    const newRow = this.table.newRow(tableSettings, this.dataTypes, this.objectUid, ind);
    if (ind === -1) {
      this.tableKey += 1;
    }

    this.selectedRecord = newRow;
    await this.objectEvaluator.onTableChangedAsync(this.table.name, this.table.uid);

    this.isModifiedChanged(true);
  }

  onClearFiltersClick(): void {
    this.initFilters();
  }

  async onRowDeleteClick(row: any): Promise<void> {
    const ind = this.table.rows.indexOf(row);
    if (ind > -1) {
      this.table.rows.splice(ind, 1);
      this.isModifiedChanged(true);
    }
    await this.objectEvaluator.onTableChangedAsync(this.table.name, this.table.uid);
  }

  async onRowCopyClick(row: any): Promise<void> {
    const newRow: any = {};
    Object.entries(row).forEach(([key, value]) => {
      newRow[key] = value;
    });
    newRow.row_number = this.table.rows.length + 1;
    newRow.id = Guid.create();

    const ind = this.table.rows.indexOf(row);
    if (ind > -1) {
      this.table.rows.splice(ind + 1, 0, newRow);
    }

    this.selectedRecord = newRow;
    this.isModifiedChanged(true);
    await this.objectEvaluator.onTableChangedAsync(this.table.name, this.table.uid);
  }

  onRowUpClick(row: any): void {
    const ind = this.table.rows.indexOf(row);
    if (ind > 0) {
      const nextInd = ind - 1;
      const rowNext = this.table.rows[nextInd];

      this.table.rows[nextInd] = row;
      this.table.rows[ind] = rowNext;
      this.isModifiedChanged(true);
    }
  }

  onRowDownClick(row: any): void {
    const ind = this.table.rows.indexOf(row);
    const nextInd = ind + 1;
    if (nextInd > 0 && nextInd <= this.table.rows.length - 1) {
      const rowNext = this.table.rows[nextInd];

      this.table.rows[nextInd] = row;
      this.table.rows[ind] = rowNext;
      this.isModifiedChanged(true);
    }
  }

  onRowRecalculateClick(row: any): void {
    this.isWaiting = true;
    this.objectEvaluator.onRowRecalculateAsync(this.table.name, this.table.uid, row);
    this.isWaiting = false;
    this.isModifiedChanged(true);
  }

  onPageChanged(args: any): void {
    console.log('Page changed', args);
    if (this.table.rows.length > args.first) {
      this.selectedRecord = this.table.rows[args.first];
    }
  }
}
</script>

<template>
  <Menubar :model="menuItems" style="margin-bottom: 3px; padding: 0; font-size: 14px;">
    <template #end>
      <Badge class="mr-1" :value="table.rows.length" />
    </template>
  </Menubar>
  <DataTable
    v-model:selection="selectedRecord"
    v-model:filters="filters"
    :style="dataTableStyle"
    :scroll-height="dataTableScrollHeight"
    :value="tableRows"
    :metaKeySelection="true"
    :rows="100"
    :rowsPerPageOptions="[10, 20, 50, 100, 500]"
    :key="tableKey"
    ref="dataTableRef"
    data-key="id"
    showGridlines
    selectionMode="single"
    paginator
    scrollable
    filterDisplay="menu"
    size="small"
    edit-mode="cell"
    @cell-edit-complete="onCellEditComplete"
    @page="onPageChanged"
    :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }:any) => ({
                        class: [{ 'p-0': state['d_editing'] }]
                    })
                }
            }"
  >
    <template #empty>{{ $t('noItemsFound') }}</template>
    <Column header="#" style="max-width:50px; min-width:50px; width: 50px;">
      <template #body="{data}">
        {{ table.rows.indexOf(data) + 1 }}
      </template>
    </Column>
    <Column
      v-for="col of columns"
      :key="col.name"
      :field="col.name"
      :header="col.title"
      :style="col.style"
    >
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
      <template v-if="!col.readonly" #editor="{ data, field }">
        <template v-if="getColumn(field).isTextInput || getColumn(field).isTextArea">
          <InputText v-model="data[field]"
                     class="w-full border-noround"
                     style="padding: 5px"
                     size="small"
                     autocomplete="off"
                     autofocus="true"/>
        </template>
        <template v-else-if="getColumn(field).isInt">
          <InputNumber v-model="data[field]"
                       :input-style="inputStyle"
                       autocomplete="off"
                       size="small"
                       autofocus/>
        </template>
        <template v-else-if="getColumn(field).isNumber">
          <InputNumber v-model="data[field]"
                       :min-fraction-digits="getColumn(field).numberDigits"
                       :max-fraction-digits="getColumn(field).numberDigits"
                       :input-style="inputStyle"
                       autocomplete="off"
                       size="small"
                       variant="filled"
                       autofocus
          />
        </template>
        <template v-else-if="getColumn(field).isCheckbox">
          <Checkbox :binary="true"
                    v-model="data[field]">
          </Checkbox>
        </template>
        <template v-else-if="getColumn(field).isSwitch">
          <InputSwitch v-model="data[field]">
          </InputSwitch>
        </template>
        <template v-else-if="getColumn(field).isDateInput">
          <Calendar :show-time="false"
                    :show-icon="true"
                    :show-button-bar="true"
                    :input-style="inputStyle"
                    iconDisplay="input"
                    date-format="dd.mm.yy"
                    class="w-full"
                    v-model="data[field]"></Calendar>
        </template>
        <template v-else-if="getColumn(field).isDateTimeInput">
          <Calendar :show-time="true"
                    :show-icon="true"
                    :show-button-bar="true"
                    :input-style="inputStyle"
                    iconDisplay="input"
                    date-format="dd.mm.yy"
                    class="w-full"
                    v-model="data[field]"></Calendar>
        </template>
        <template v-else-if="getColumn(field).isDropdown">
          <DropdownEditor class="border-noround"
                          :data-type-uid="getColumn(field).dataTypeUid"
                          :provider="selectItemProvider"
                          :input-style="inputStyle"
                          v-model="data[parseDisplayName(field).valueName]"
                          @selected="(args:any):any => onDropDownSelected(data, field, args)">

          </DropdownEditor>
        </template>
        <template v-else>
          {{ data[field] }}
        </template>
      </template>
    </Column>
    <Column :header="$t('actions')"
            style="max-width:200px; min-width:200px; width: 200px;">
      <template #body="{ data }">

        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowDeleteClick(data)">
          <span class="pi pi-times text-red-500"></span>
        </a>
        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowCopyClick(data)">
          <span class="pi pi-clone text-primary"></span>
        </a>
        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowUpClick(data)">
          <span class="pi pi-arrow-up text-primary"></span>
        </a>
        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowDownClick(data)">
          <span class="pi pi-arrow-down text-primary"></span>
        </a>
        <a href="#"
           class="bs-row-action"
           tabindex="-1"
           v-tooltip="$t('recalculate')"
           @click.prevent="onRowRecalculateClick(data)">
          <span class="pi pi-replay text-primary"></span>
        </a>
      </template>
    </Column>
  </DataTable>
</template>

<style >
.bs-row-action span{
  font-size: 12px!important;
}

.p-tabview-nav-link  {
  padding: 0.5rem!important;
}
</style>
