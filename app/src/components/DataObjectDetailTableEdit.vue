<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
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
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectsProvider from '@/dataProviders/dataObjectsProvider';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DropdownEditor from '@/components/editors/DropdownEditor.vue';
import SelectItem from '@/models/selectItem';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';

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

  // DetailsTable.
  @Prop({
    type: Object as PropType<DataObjectDetailsTable>,
    required: true,
  })
  table!: DataObjectDetailsTable;

  isWaiting = false;
  columns: MetaObjectColumnViewModel[] = [];
  selectedRecord: any = {};
  windowHeight = window.innerHeight;
  provider = new DataObjectsProvider();
  toastHelper = new ToastHelper(useToast());
  inputStyle = {
    width: '100%',
    fontSize: '14px',
    borderRadius: 0,
    padding: '5px',
  };

  menuItems: any[] = [];

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 275}px`,
      fontSize: '14px',
    };
  }

  @Watch('tableUid')
  @Watch('metaObjectSettings')
  onPropChange(): void {
    this.initColumns();
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
        tableSettings.columnRenderSettings,
      );

      columnViewModel.name = columnName;
      columnViewModel.setDefaultStyle();

      if (columnViewModel.name === 'row_number') {
        columnViewModel.setWidth('30px');
        columnViewModel.title = '#';
        columnViewModel.isInt = false;
        columnViewModel.isNumber = false;
        columnViewModel.readonly = true;
      }

      this.columns.push(columnViewModel);
    });
  }

  async loadData(): Promise<void> {
    this.isWaiting = true;
    const response = await this.provider.getDetailsTable(
      this.kind,
      this.metaObjectSettings.name,
      this.objectUid,
      this.table.name,
    );
    if (response.isOK) {
      this.table.rows = response.data.rows;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    this.isWaiting = false;
  }

  getColumn(name: string): MetaObjectColumnViewModel {
    const column = this.columns.find((x) => x.name === name);
    if (!column) {
      return new MetaObjectColumnViewModel(null, this.dataTypes, []);
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

  mounted(): void {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
    this.initColumns();
    this.menuItems.push({
      icon: 'pi pi-plus',
      class: 'text-primary',
      command: () => this.onAddClick(),

    });
    this.loadData();
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
  }

  onCellEditComplete(event: any): void {
    const row = event.data;
    const columnName: string = event.field as string;
    const newRow = event.newData;

    const names = this.parseDisplayName(columnName);
    row[columnName] = newRow[columnName];
    if (names.valueName) {
      row[names.valueName] = newRow[names.valueName];
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

  onAddClick(): void {
    const tableSettings = this.metaObjectSettings.detailTables.find(
      (x) => x.uid === this.table.uid,
    );
    if (!tableSettings) {
      return;
    }

    const newRow: any = {};
    tableSettings.columns.forEach((column) => {
      const dataType = this.dataTypes.find((x) => x.uid === column.dataTypeUid);
      if (dataType) {
        let currentValue: any = '';
        if (dataType.uid === DataTypeDefaults.Int.uid
          || dataType.uid === DataTypeDefaults.Long.uid
          || dataType.uid === DataTypeDefaults.Decimal.uid) {
          currentValue = 0;
        } else if (dataType.uid === DataTypeDefaults.Bool.uid) {
          currentValue = false;
        }
        newRow[column.name] = currentValue;
        if (!dataType.isPrimitive) {
          newRow[`${column.name}_display`] = '';
        }
      } else {
        newRow[column.name] = '';
      }
    });
    newRow.object_uid = this.objectUid;
    newRow.row_number = this.table.rows.length + 1;
    this.table.rows.push(newRow);

    this.isModifiedChanged(true);
  }

  onRowDeleteClick(row: any): void {
    const ind = this.table.rows.indexOf(row);
    if (ind > -1) {
      this.table.rows.splice(ind, 1);
      this.isModifiedChanged(true);
    }
  }

  onRowCopyClick(row: any): void {
    const newRow: any = {};
    Object.entries(row).forEach(([key, value]) => {
      newRow[key] = value;
    });
    newRow.row_number = this.table.rows.length + 1;
    this.table.rows.push(newRow);
    this.isModifiedChanged(true);
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
}
</script>

<template>
  <Menubar :model="menuItems" style="margin-bottom: 3px; padding: 0; font-size: 14px;"></Menubar>
  <DataTable
    v-model:selection="selectedRecord"
    :style="dataTableStyle"
    :value="table.rows"
    :metaKeySelection="true"
    :rows="15"
    showGridlines
    selectionMode="single"
    scrollable
    scrollHeight="flex"
    filterDisplay="menu"
    size="small"
    edit-mode="cell"
    @cell-edit-complete="onCellEditComplete"
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
    <Column header="#" style="max-width:40px; min-width:40px; width: 40px;">
      <template #body="{index}">
        {{ index + 1 }}
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
           class="bs-row-action"
           tabindex="-1"
           @click.prevent="onRowDownClick(data)">
          <span class="pi pi-arrow-down text-primary"></span>
        </a>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.bs-row-action span{
  font-size: 12px!important;
}
</style>
