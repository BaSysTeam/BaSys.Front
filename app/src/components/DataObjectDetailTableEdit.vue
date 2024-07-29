<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectsProvider from '@/dataProviders/dataObjectsProvider';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';

@Options({
  components:
    {
      DataTable,
      Column,
      InputText,
    },
})
export default class DataObjectDetailTableEdit extends Vue {
  // Name of metadata object kind.
  @Prop({ required: true, type: String, default: '' })
  kind!: string;

  // Identifier of the object.
  @Prop({ required: true, type: String, default: '' })
  objectUid!: string;

  // Metadata object.
  @Prop({ type: Object as PropType<MetaObjectStorableSettings>, required: true })
  metaObjectSettings!: MetaObjectStorableSettings;

  // Data types.
  @Prop({ type: Object as PropType<DataType[]>, required: true })
  dataTypes!: DataType[];

  // DetailsTable.
  @Prop({ type: Object as PropType<DataObjectDetailsTable>, required: true })
  table!: DataObjectDetailsTable;

  isWaiting = false;
  columns:MetaObjectColumnViewModel[] = [];
  selectedRecord:any = {};
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

  mounted():void {
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

  onCellEditComplete(event: any): void {
    console.log('onCellEditComplete', event);
    const { data, newValue, field } = event;
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
    :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }:any) => ({
                        class: [{ 'pt-0 pb-0': state['d_editing'] }]
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
      <template #editor="{ data, field }">
        <template v-if="getColumn(field).isTextInput">
          <InputText v-model="data[field]"
                     class="w-full"
                     size="small"
                     autocomplete="off"
                     autofocus="true" />
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
