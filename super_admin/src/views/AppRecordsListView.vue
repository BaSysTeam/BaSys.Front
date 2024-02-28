<template>
    <div>
      <div class="grid">
        <div class="col">
          <ViewTitleComponent title="Applications" :is-modified="false" :is-waiting="false" />
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
              @click="addAppRecord"
            />
            <Button
              label="Edit"
              severity="primary"
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
            severity="primary"
            size="small"
            class="ml-1"
            outlined
            icon="pi pi-copy"
            v-tooltip.top="'Copy'"
            :disabled="isSelectedRecordEmpty"
            @click="copyAppRecord"
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
        <div class="col-6">
          <div class="card m-1">
            <DataTable
              v-model:selection="selectedRecord"
              v-model:filters="filters"
              :value="appRecords"
              :metaKeySelection="true"
              :style="dataTableStyle"
              @row-dblclick="editAppRecord"
              showGridlines
              filterDisplay="menu"
              selectionMode="single"
              dataKey="id"
              size="small"
              scrollable
              scrollHeight="flex"
            >
              <template #empty> No items found. </template>
              <Column field="id" header="Id">
                <template #body="{ data }">
                    {{ data.id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                      v-model="filterModel.value"
                      type="text"
                      class="p-column-filter"
                      placeholder="Search by Id"
                    />
                </template>
              </Column>
              <Column field="title" header="Title">
                <template #body="{ data }">
                    {{ data.title }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                      v-model="filterModel.value"
                      type="text"
                      class="p-column-filter"
                      placeholder="Search by Title"
                    />
                </template>
              </Column>
              <Column field="memo" header="Memo">
                <template #body="{ data }">
                    {{ data.memo }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                      v-model="filterModel.value"
                      type="text"
                      class="p-column-filter"
                      placeholder="Search by Memo"
                    />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <AppRecordsEditComponent v-if="isAddDialogVisible"
                          @cancel="isAddDialogVisible = false"
                          @save="saveAppRecord"
                          :appRecord="appRecord"/>

      <ConfirmationDialogComponent
        v-if="isDeleteItemDialogVisible"
        confirmText="Are you sure you want to delete the selected item?"
        @noClick="isDeleteItemDialogVisible = false"
        @yesClick="deleteAppRecord"
      />
    </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import AppRecordDataProvider from '@/dataProviders/appRecordDataProvider';
import ViewTitleComponent from '@/components/ViewTitleComponent.vue';
import AppRecordsEditComponent from '@/components/AppRecordsEditComponent.vue';
import ConfirmationDialogComponent from '@/components/ConfirmationDialogComponent.vue';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import AppRecord from '@/models/appRecord';
import { ResizeWindow } from '@/mixins/resizeWindow';

@Options({
  components: {
    ViewTitleComponent,
    AppRecordsEditComponent,
    ConfirmationDialogComponent,
    Button,
    SplitButton,
    DataTable,
    Column,
    Divider,
    Dialog,
    InputText,
  },
})
export default class AppRecordsListView extends mixins(ResizeWindow) {
  isAddDialogVisible = false;

  appRecord = new AppRecord({});

  selectedRecord = {};

  isDeleteItemDialogVisible = false;

  dataProvider = new AppRecordDataProvider();

  filters = {};

  actions = [
    {
      label: 'Update',
      command: () => this.actionUpdate(),
    },
    {
      label: 'Clear filters',
      command: () => this.initFilters(),
    },
  ];

  appRecords: AppRecord[] = [];

  beforeMount(): void {
    this.initFilters();
  }

  mounted(): void {
    this.actionUpdate();
  }

  get isSelectedRecordEmpty(): boolean {
    return Object.keys(this.selectedRecord).length === 0;
  }

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  actionUpdate(): void {
    this.dataProvider.getAppRecords().then((result) => {
      this.appRecords = result;
    });
  }

  initFilters(): void {
    this.filters = {
      id:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      title:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      memo:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    };
  }

  addAppRecord(): void {
    this.appRecord = new AppRecord({});
    this.isAddDialogVisible = true;
  }

  editAppRecord(): void {
    if (!this.isSelectedRecordEmpty) {
      this.appRecord = new AppRecord(this.selectedRecord);
      this.isAddDialogVisible = true;
    }
  }

  deleteAppRecord(): void {
    if (!this.isSelectedRecordEmpty) {
      this.dataProvider.deleteAppRecord(new AppRecord(this.selectedRecord)).then((result) => {
        if (result === true) {
          this.actionUpdate();
          this.selectedRecord = {};
        }
      });
    }

    this.isDeleteItemDialogVisible = false;
  }

  copyAppRecord(): void {
    if (!this.isSelectedRecordEmpty) {
      const copiedItem = new AppRecord(this.selectedRecord);
      this.dataProvider.addAppRecord(copiedItem).then((result) => {
        if (result === true) {
          this.actionUpdate();
        }
      });
    }
  }

  saveAppRecord(args: AppRecord): void {
    this.isAddDialogVisible = false;

    if (args.id === undefined) {
      this.dataProvider.addAppRecord(args).then((result) => {
        if (result === true) {
          this.actionUpdate();
        }
      });
    } else {
      const item = this.appRecords.find((x) => x.id === args.id);
      if (item) {
        this.dataProvider.updateAppRecord(args).then((result) => {
          if (result === true) {
            this.actionUpdate();
          }
        });
      }
    }
  }

  deleteDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.isDeleteItemDialogVisible = true;
    }
  }
}
</script>
