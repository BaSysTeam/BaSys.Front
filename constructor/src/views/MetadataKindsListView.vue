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
            :value="metadataKinds"
            showGridlines
            size="small"
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
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import MetadataKind from '../models/metadataKind';
import MetadataKindProvider from '../dataProviders/metadataKindProvider';
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
  dataProvider = new MetadataKindProvider();
  toastHelper = new ToastHelper(useToast());
  metadataKinds:MetadataKind[] = [];
  isWaiting = true;

  onAddClicked():void {
    console.log('Add clicked');
  }

  onEditClicked():void {
    console.log('Edit clicked');
  }

  onDeleteClicked():void {
    console.log('Delete clicked');
  }

  async mounted(): Promise<void> {
    this.isWaiting = true;
    const response = await this.dataProvider.getCollection();
    if (response.isOK) {
      this.metadataKinds = response.data;
      console.log('Metadata kinds');
      console.log(response);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    this.isWaiting = false;
  }
}
</script>
