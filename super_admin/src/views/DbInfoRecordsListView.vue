<template>
    <div>
      <div class="grid">
        <div class="col">
          <ViewTitle title="Db connections" :is-waiting="false" />
        </div>
      </div>
      <div class="grid">
        <div class="col-6">
          <span class="p-buttonset">
            <Button
              label="Add"
              severity="primary"
              size="small"
              outlined
              icon="pi pi-plus"
              @click="addDbInfoRecord"
            />
            <Button
              label="Edit"
              severity="primary"
              size="small"
              outlined
              icon="pi pi-pencil"
              :disabled="isSelectedRecordEmpty"
              @click="editDbInfoRecord"
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
            severity="primary"
            size="small"
            class="ml-1"
            outlined
            icon="pi pi-copy"
            :disabled="isSelectedRecordEmpty"
            @click="copyDbInfoRecord"
          />
          <SplitButton
            label="Actions"
            severity="primary"
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
        <div class="col-12">
          <div class="card m-1">
            <DataTable
              v-model:selection="selectedRecord"
              :value="dbInfoRecords"
              :metaKeySelection="true"
              showGridlines
              selectionMode="single"
              dataKey="id"
              size="small"
            >
              <Column field="id" header="Id"></Column>
              <Column field="appId" header="AppId"></Column>
              <Column field="title" header="Title"></Column>
              <Column field="dbKind" header="DbKind">
                <template #body="slotProps">
                  {{ formatDbKind(slotProps.data.dbKind) }}
                </template>
              </Column>
              <Column field="connectionString" header="Connection string"></Column>
              <Column field="memo" header="Memo"></Column>
              <Column field="isDeleted" header="IsDeleted"></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <DbInfoRecordsEditView
        v-if="isAddDialogVisible"
        :dbInfoRecord="dbInfoRecord"
        @cancel="isAddDialogVisible = false"
        @save="saveDbInfoRecord"
      />

      <ConfirmationDialog
        v-if="isDeleteItemDialogVisible"
        @noClick="isDeleteItemDialogVisible = false"
        @yesClick="deleteDbInfoRecord"
      />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { DbKinds } from '@/enums/dbKinds';
import DbInfoRecordDataProvider from '@/dataProviders/dbInfoRecordDataProvider';
import ViewTitle from '@/components/ViewTitle.vue';
import DbInfoRecordsEditView from '@/components/DbInfoRecordsEditView.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import DbInfoRecord from '@/models/dbInfoRecord';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';

@Options({
  components: {
    ViewTitle,
    DbInfoRecordsEditView,
    ConfirmationDialog,
    Button,
    SplitButton,
    DataTable,
    Column,
    Divider,
    Dialog,
  },
})
export default class DbInfoRecordsListView extends Vue {
  dbInfoRecord = new DbInfoRecord({});

  dataService = new DbInfoRecordDataProvider();

  isAddDialogVisible = false;

  isDeleteItemDialogVisible = false;

  selectedRecord = {};

  dbInfoRecords: DbInfoRecord[] = [];

  actions = [
    {
      label: 'Update',
      command: () => this.actionUpdate(),
    },
  ];

  mounted() {
    this.actionUpdate();
  }

  get isSelectedRecordEmpty() {
    return Object.keys(this.selectedRecord).length === 0;
  }

  actionUpdate() {
    this.dataService.getDbInfoRecords().then((result) => {
      this.dbInfoRecords = result;
    });
  }

  addDbInfoRecord() {
    this.dbInfoRecord = new DbInfoRecord({});
    this.isAddDialogVisible = true;
  }

  editDbInfoRecord() {
    if (!this.isSelectedRecordEmpty) {
      this.dbInfoRecord = new DbInfoRecord(this.selectedRecord);
      this.isAddDialogVisible = true;
    }
  }

  deleteDbInfoRecord() {
    if (!this.isSelectedRecordEmpty) {
      this.dataService.deleteDbInfoRecord(new DbInfoRecord(this.selectedRecord))
        .then((result) => {
          if (result === true) {
            this.actionUpdate();
            this.selectedRecord = {};
          }
        });
    }

    this.isDeleteItemDialogVisible = false;
  }

  copyDbInfoRecord() {
    if (!this.isSelectedRecordEmpty) {
      const copiedItem = new DbInfoRecord(this.selectedRecord);
      this.dataService.addDbInfoRecord(copiedItem).then((result) => {
        if (result === true) {
          this.actionUpdate();
        }
      });
    }
  }

  saveDbInfoRecord(args: DbInfoRecord) {
    this.isAddDialogVisible = false;

    if (args.id === undefined) {
      this.dataService.addDbInfoRecord(args).then((result) => {
        if (result === true) {
          this.actionUpdate();
        }
      });
    } else {
      const item = this.dbInfoRecords.find((x) => x.id === args.id);
      if (item) {
        this.dataService.updateDbInfoRecord(args).then((result) => {
          if (result === true) {
            this.actionUpdate();
          }
        });
      }
    }
  }

  formatDbKind(kind: DbKinds) {
    return DbKinds[kind];
  }

  deleteDialogOpen() {
    if (!this.isSelectedRecordEmpty) {
      this.isDeleteItemDialogVisible = true;
    }
  }
}
</script>
