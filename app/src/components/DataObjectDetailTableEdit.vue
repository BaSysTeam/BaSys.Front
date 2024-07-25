<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';

@Options({
  components:
    {
      DataTable,
      Column,
    },
})
export default class DataObjectDetailTableEdit extends Vue {
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

  columns:any[] = [];
  dataTableItems:any[] = [];
  selectedRecord:any = {};
  windowHeight = window.innerHeight;

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  @Watch('tableUid')
  @Watch('metaObjectSettings')
  onPropChange(): void {
    console.log('Detail table watch');
    this.initColumns();
  }

  initColumns(): void {
    console.log('Detail table init');
    this.columns = [];
    if (!this.metaObjectSettings) {
      return;
    }

    console.log('Detail table settings', this.metaObjectSettings);
    // Get current table.
    const tableSettings = this.metaObjectSettings.detailTables.find((x) => x.uid === this.tableUid);
    if (!tableSettings) {
      return;
    }

    console.log('Detail table tableSettings', tableSettings);
    // eslint-disable-next-line no-restricted-syntax
    tableSettings.columns.forEach((column) => {
      const isPrimitive = DataTypeDefaults.IsPrimitiveType(column.dataTypeUid);

      const columnName = isPrimitive ? column.name : `${column.name}_display`;

      const newColumn = {
        field: columnName,
        header: column.title,
      };
      this.columns.push(newColumn);
    });
  }

  mounted():void {
    this.initColumns();
    console.log('DetailTableColumns', this.columns);
  }
}
</script>

<template>
  <DataTable
    v-model:selection="selectedRecord"
    :style="dataTableStyle"
    :value="dataTableItems"
    :metaKeySelection="true"
    :rows="15"
    paginator
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
