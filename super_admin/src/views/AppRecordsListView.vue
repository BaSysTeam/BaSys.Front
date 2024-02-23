<template>
    <div>
      <div class="grid">
        <div class="col">
          <ViewTitle title="Applications" :is-modified="false" :is-waiting="false" />
        </div>
      </div>
      <div class="grid">
        <div class="col-6">
          <span class="p-buttonset">
            <Button
              label="Add"
              severity="info"
              size="small"
              outlined
              icon="pi pi-plus"
              @click="addAppRecord"
            />
            <Button
              label="Edit"
              severity="info"
              size="small"
              outlined
              icon="pi pi-pencil"
              :disabled="isSelectedRecordEmpty"
              @click="editAppRecord"
            />
            <Button
              label="Delete"
              severity="danger"
              size="small"
              outlined
              icon="pi pi-trash"
              :disabled="isSelectedRecordEmpty"
              @click="deleteDialogOpen"
            />
          </span>
          <Button
            label="Copy"
            severity="info"
            size="small"
            class="ml-1"
            outlined
            icon="pi pi-copy"
            :disabled="isSelectedRecordEmpty"
            @click="copyAppRecord"
          />
          <SplitButton
            label="Actions"
            severity="info"
            size="small"
            class="ml-1"
            outlined
            :model="actions"
          />
        </div>
      </div>
      <div class="grid">
        <Divider class="m-2" />
      </div>
      <div class="grid">
        <div class="col-6">
          <div class="card m-1">
            <DataTable
              v-model:selection="selectedRecord"
              :value="appRecords"
              :metaKeySelection="true"
              showGridlines
              selectionMode="single"
              dataKey="id"
              size="small"
            >
              <Column field="id" header="Id"></Column>
              <Column field="title" header="Title"></Column>
              <Column field="memo" header="Memo"></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <AppRecordsEditView v-if="isAddDialogVisible"
                          @cancel="isAddDialogVisible = false"
                          @save="saveAppRecord"
                          :appRecord="appRecord"/>

      <ConfirmationDialog
        v-if="isDeleteItemDialogVisible"
        @noClick="isDeleteItemDialogVisible = false"
        @yesClick="deleteAppRecord"
      />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppRecordDataProvider from '@/dataProviders/appRecordDataProvider';
import ViewTitle from '@/components/ViewTitle.vue';
import AppRecordsEditView from '@/components/AppRecordsEditView.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import AppRecord from '@/models/appRecord';

@Options({
  components: {
    ViewTitle,
    AppRecordsEditView,
    ConfirmationDialog,
    Button,
    SplitButton,
    DataTable,
    Column,
    Divider,
    Dialog,
  },
})
export default class AppRecordsListView extends Vue {
  isAddDialogVisible = false;

  appRecord = new AppRecord({});

  selectedRecord = {};

  isDeleteItemDialogVisible = false;

  dataService = new AppRecordDataProvider();

  actions = [
    {
      label: 'Update',
      command: () => this.actionUpdate(),
    },
  ];

  appRecords: AppRecord[] = [];

  mounted() {
    this.actionUpdate();
  }

  get isSelectedRecordEmpty() {
    return Object.keys(this.selectedRecord).length === 0;
  }

  actionUpdate() {
    this.dataService.getAppRecords().then((result) => {
      this.appRecords = result;
    });
  }

  addAppRecord() {
    this.appRecord = new AppRecord({});
    this.isAddDialogVisible = true;
  }

  editAppRecord() {
    if (!this.isSelectedRecordEmpty) {
      this.appRecord = new AppRecord(this.selectedRecord);
      this.isAddDialogVisible = true;
    }
  }

  deleteAppRecord() {
    if (!this.isSelectedRecordEmpty) {
      this.dataService.deleteAppRecord(new AppRecord(this.selectedRecord)).then((result) => {
        if (result === true) {
          this.actionUpdate();
          this.selectedRecord = {};
        }
      });
    }

    this.isDeleteItemDialogVisible = false;
  }

  copyAppRecord() {
    if (!this.isSelectedRecordEmpty) {
      const copiedItem = new AppRecord(this.selectedRecord);
      this.dataService.addAppRecord(copiedItem).then((result) => {
        if (result === true) {
          this.actionUpdate();
        }
      });
    }
  }

  saveAppRecord(args: AppRecord) {
    this.isAddDialogVisible = false;

    if (args.id === undefined) {
      this.dataService.addAppRecord(args).then((result) => {
        if (result === true) {
          this.actionUpdate();
        }
      });
    } else {
      const item = this.appRecords.find((x) => x.id === args.id);
      if (item) {
        this.dataService.updateAppRecord(args).then((result) => {
          if (result === true) {
            this.actionUpdate();
          }
        });
      }
    }
  }

  deleteDialogOpen() {
    if (!this.isSelectedRecordEmpty) {
      this.isDeleteItemDialogVisible = true;
    }
  }
}
</script>
