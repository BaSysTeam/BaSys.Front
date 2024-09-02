<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Data types" :is-modified="false" :is-waiting="false" />
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2" />
    </div>
    <div class="grid">
      <div class="col-12">
        <div class="card m-1">
          <DataTable
            :value="dataTypes"
            :style="dataTableStyle"
            showGridlines
            size="small"
            scrollable
            scrollHeight="flex"
          >
            <template #empty> No items found. </template>
            <Column field="uid" header="Uid"></Column>
            <Column field="title" header="Title"></Column>
            <Column field="isPrimitive" header="IsPrimitive" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.isPrimitive" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
            <Column field="dbType" header="DbType">
              <template #body="{ data }">
                {{ formatDbType(data.dbType) }}
              </template>
            </Column>
            <Column field="objectKindUid" header="ObjectKindUid"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import DataType from '../../../shared/src/models/dataType';
import { DbType } from '../../../shared/src/enums/dbTypes';
import DataTypeProvider from '../dataProviders/dataTypeProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    DataTable,
    Column,
  },
})
export default class DataTypesComponent extends Vue {
  dataProvider = new DataTypeProvider();
  toastHelper = new ToastHelper(useToast());
  dataTypes:DataType[] = [];
  windowHeight = window.innerHeight;

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 120}px`,
      fontSize: '14px',
    };
  }

  async mounted(): Promise<void> {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });

    const response = await this.dataProvider.getDataTypes();
    if (response.isOK) {
      this.dataTypes = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  formatDbType(type: DbType): string {
    return DbType[type];
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
  }
}
</script>
