<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Metadata kinds" :is-modified="false" :is-waiting="false" />
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <span class="p-buttonset">
         <Button
              label="Add"
              severity="primary"
              size="small"
              outlined
              icon="pi pi-plus"
              @click="onAddClicked"
            />
          <Button
            label="Edit"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-pencil"
            @click="onEditClicked"
            />
          <Button
            label="Delete"
            severity="danger"
            size="small"
            outlined
            icon="pi pi-trash"
            @click="onDeleteClicked"
            />
          </span>
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2" />
    </div>
    <div class="grid">
      <div class="col-12">
        <div class="card m-1">
          <DataTable
            v-model:selection="selectedRow"
            v-model:value="metadataKinds"
            :metaKeySelection="true"
            showGridlines
            size="small"
            selectionMode="single"
            dataKey="uid"
            @row-dblclick="onRowDblClick"
            @row-select="onRowSelect"
          >
            <template #empty> No items found. </template>
            <Column header="#" style="width: 50px">
              <template #body="currentRow">
                {{ currentRow.index + 1 }}
              </template>
            </Column>
            <Column field="uid" header="Uid"></Column>
            <Column field="title" header="Title"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="prefix" header="Prefix"></Column>
            <Column field="storeData" header="Store data" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.storeData" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
            <Column field="isReference" header="Is reference" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.isReference" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
            <Column field="isStandard" header="Standard" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.isStandard" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import MetadataKind from '../models/metadataKind';
import MetadataKindsProvider from '../dataProviders/metadataKindsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    DataTable,
    Column,
    Button,
    SplitButton,
  },
})
export default class MetadataKindsListView extends Vue {
  dataProvider = new MetadataKindsProvider();
  toastHelper = new ToastHelper(useToast());
  router = useRouter();
  selectedRow = {};
  metadataKinds:MetadataKind[] = [];
  isWaiting = true;

  get isSelectedRowEmpty(): boolean {
    return Object.keys(this.selectedRow).length === 0;
  }

  onAddClicked():void {
    console.log('Add clicked');
    this.navigateToAdd();
  }

  onEditClicked():void {
    console.log('Edit clicked');
    this.navigateToEdit();
  }

  onDeleteClicked():void {
    console.log('Delete clicked');
  }

  onRowDblClick(args:any):void {
    console.log('Row dbl click', args);
    console.log('isSelectedRowEmpty', this.isSelectedRowEmpty);
    this.navigateToEdit();
  }

  onRowSelect(args:any):void {
    console.log('Row select', args);
  }

  navigateToEdit():void {
    if (this.isSelectedRowEmpty) {
      return;
    }
    const selectedKind = this.selectedRow as MetadataKind;
    console.log('selected row', selectedKind);
    this.router.push({ name: 'metadata-kinds-edit', params: { name: selectedKind.name } });
  }

  navigateToAdd():void {
    this.router.push({ name: 'metadata-kinds-edit', params: { name: '_new' } });
  }

  async mounted(): Promise<void> {
    this.actionUpdate();
  }

  async actionUpdate(): Promise<void> {
    this.isWaiting = true;
    const response = await this.dataProvider.getCollection();
    if (response.isOK) {
      console.log('Get Metadata kinds', response);
      this.metadataKinds = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    this.isWaiting = false;
  }
}
</script>
