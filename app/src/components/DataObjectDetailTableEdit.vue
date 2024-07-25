<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DataObject from '@/models/dataObject';
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectsProvider from '@/dataProviders/dataObjectsProvider';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components:
    {
      DataTable,
      Column,
    },
})
export default class DataObjectDetailTableEdit extends Vue {
  // Name of metaobject kind.
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

  // Identifier of detail table.
  @Prop({
    required: false,
    type: String,
    default: '',
  })
  tableUid!: string;

  // Metadata object.
  @Prop({ type: Object as PropType<MetaObjectStorableSettings>, required: true })
  metaObjectSettings!: MetaObjectStorableSettings;

  // Data object.
  @Prop({ type: Object as PropType<DataObject>, required: true })
  item!: DataObject;

  isWaiting = false;
  tableName = '';
  columns:any[] = [];
  selectedRecord:any = {};
  windowHeight = window.innerHeight;
  provider = new DataObjectsProvider();
  toastHelper = new ToastHelper(useToast());

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 250}px`,
    };
  }

  get currentTable(): DataObjectDetailsTable {
    const currentTable = this.item.detailsTables.find((x) => x.uid === this.tableUid);

    if (currentTable) {
      return currentTable;
    }

    const newTable = new DataObjectDetailsTable({ uid: this.tableUid });
    this.item.updateTable(newTable);
    return newTable;
  }

  @Watch('tableUid')
  @Watch('metaObjectSettings')
  onPropChange(): void {
    this.initColumns();
    this.loadData();
  }

  initColumns(): void {
    this.columns = [];
    if (!this.metaObjectSettings) {
      return;
    }

    // Get current table.
    const tableSettings = this.metaObjectSettings.detailTables.find((x) => x.uid === this.tableUid);
    if (!tableSettings) {
      return;
    }

    this.tableName = tableSettings.name;

    // eslint-disable-next-line no-restricted-syntax
    tableSettings.columns.forEach((column) => {
      if (column.name === 'uid' || column.name === 'object_uid') {
        return;
      }

      const newColumn = {
        field: column.name,
        header: column.title,
      };
      this.columns.push(newColumn);
    });
  }

  async loadData(): Promise<void> {
    this.isWaiting = true;
    const response = await this.provider.getDetailsTable(
      this.kind,
      this.metaObjectSettings.name,
      this.objectUid,
      this.tableName,
    );
    if (response.isOK) {
      this.item.updateTable(response.data);
      console.log('current table', this.currentTable);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    this.isWaiting = false;
  }

  mounted():void {
    this.initColumns();
    this.loadData();
  }
}
</script>

<template>
  <DataTable
    v-model:selection="selectedRecord"
    :style="dataTableStyle"
    :value="currentTable.rows"
    :metaKeySelection="true"
    :rows="15"
    showGridlines
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
    </Column>
  </DataTable>
</template>

<style scoped>

</style>
