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
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectsProvider from '@/dataProviders/dataObjectsProvider';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DropdownEditor from '@/components/editors/DropdownEditor.vue';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';

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

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 250}px`,
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
    return newValue;
  }

  initColumns(): void {
    this.columns = [];
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
      if (column.name === 'uid' || column.name === 'object_uid') {
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
      columnViewModel.setDefaultWidth();

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
      console.log('current table', this.table);
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

  mounted(): void {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
    this.initColumns();
    this.loadData();
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
  }

  onCellEditInit(event: any): void {
    console.log('onCellEditInit', event);
    if (event.field === 'row_number') {
      console.log('start row number edit');
    }
  }

  onCellEditComplete(event: any): void {
    console.log('onCellEditComplete', event);
    const {
      data,
      newValue,
      field,
    } = event;
    data[field] = newValue;
    this.isModifiedChanged(true);
  }
}
</script>

<template>
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
    @cell-edit-init="onCellEditInit"
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
    <Column
      v-for="col of columns"
      :key="col.name"
      :field="col.name"
      :header="col.title"
      :style="col.style"
    >
      <template #body="{ data, field }">
        {{ data[field] }}
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
                         :input-style="{width: '100%',
                       fontSize: '14px',
                       borderRadius:0,
                       padding: '5px'}"
                         autocomplete="off"
                         size="small"
                         autofocus/>
          </template>
          <template v-else-if="getColumn(field).isNumber">
            <InputNumber v-model="data[field]"
                         :min-fraction-digits="getColumn(field).numberDigits"
                         :max-fraction-digits="getColumn(field).numberDigits"
                         :input-style="{width: '100%',
                       fontSize: '14px',
                       borderRadius:0,
                       padding:'5px'}"
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
                      :input-style="{width: '100%',
                       fontSize: '14px',
                       borderRadius:0,
                       padding: '5px'}"
                      iconDisplay="input"
                      date-format="dd.mm.yy"
                      class="w-full"
                      v-model="data[field]"></Calendar>
          </template>
          <template v-else-if="getColumn(field).isDateTimeInput">
            <Calendar :show-time="true"
                      :show-icon="true"
                      :show-button-bar="true"
                      :input-style="{width: '100%',
                       fontSize: '14px',
                       borderRadius:0,
                       padding: '5px'}"
                      iconDisplay="input"
                      date-format="dd.mm.yy"
                      class="w-full"
                      v-model="data[field]"></Calendar>
          </template>
          <template v-else-if="getColumn(field).isDropdown">
            <DropdownEditor class="border-noround"
                            :data-type-uid="getColumn(field).dataTypeUid"
                            :input-style="{width: '100%',
                       fontSize: '14px',
                       borderRadius:0,
                       padding: '5px'}"
                            v-model="data[field]"></DropdownEditor>
          </template>
          <template v-else>
            {{ data[field] }}
          </template>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>

</style>
