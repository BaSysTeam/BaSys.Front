<template>
    <div>
      <div class="grid">
        <div class="col">
          <ViewTitleComponent title="Db connections" :is-waiting="false" />
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
            v-tooltip.top="'Copy'"
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
              v-model:filters="filters"
              :value="dbInfoRecords"
              :metaKeySelection="true"
              :style="dataTableStyle"
              @row-dblclick="editDbInfoRecord"
              showGridlines
              filterDisplay="menu"
              selectionMode="single"
              dataKey="id"
              size="small"
              scrollable
              scrollHeight="flex"
            >
              <Column field="id" header="Id" dataType="numeric">
                <template #body="{ data }">
                    {{ data.id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="decimal" />
                </template>
              </Column>
              <Column field="appId" header="AppId">
                <template #body="{ data }">
                    {{ data.appId }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                      v-model="filterModel.value"
                      type="text"
                      class="p-column-filter"
                      placeholder="Search by AppId"
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
              <Column field="dbKind" header="DbKind">
                <template #body="{ data }">
                    {{ formatDbKind(data.dbKind) }}
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                      v-model="filterModel.value"
                      :options="dbKinds"
                      optionLabel="name"
                      optionValue="identifier"
                      placeholder="Select One"
                      class="p-column-filter"
                    >
                      <template #option="slotProps">
                          {{ slotProps.option.name }}
                      </template>
                    </Dropdown>
                </template>
              </Column>
              <Column field="connectionString" header="Connection string">
                <template #body="{ data }">
                    {{ data.connectionString }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                      v-model="filterModel.value"
                      type="text"
                      class="p-column-filter"
                      placeholder="Search by ConnectionString"
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
              <Column
                field="isDeleted"
                header="IsDeleted"
                dataType="boolean"
                bodyClass="text-center"
              >
                <template #body="{ data }">
                    <i v-if="data.isDeleted" class="pi pi-check-circle text-green-500"></i>
                </template>
                <template #filter="{ filterModel }">
                    <span for="isDeleted-filter" class="font-bold"> IsDeleted </span>
                    <TriStateCheckbox v-model="filterModel.value" inputId="isDeleted-filter" />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <DbInfoRecordsEditComponent
        v-if="isAddDialogVisible"
        :dbInfoRecord="dbInfoRecord"
        @cancel="isAddDialogVisible = false"
        @save="saveDbInfoRecord"
      />

      <ConfirmationDialogComponent
        v-if="isDeleteItemDialogVisible"
        confirmText="Are you sure you want to delete the selected item?"
        @noClick="isDeleteItemDialogVisible = false"
        @yesClick="deleteDbInfoRecord"
      />
    </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { DbKinds } from '@/enums/dbKinds';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import DbInfoRecordDataProvider from '@/dataProviders/dbInfoRecordDataProvider';
import ViewTitleComponent from '@/components/ViewTitleComponent.vue';
import DbInfoRecordsEditComponent from '@/components/DbInfoRecordsEditComponent.vue';
import ConfirmationDialogComponent from '@/components/ConfirmationDialogComponent.vue';
import DbInfoRecord from '@/models/dbInfoRecord';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Dropdown from 'primevue/dropdown';
import { ResizeWindow } from '@/mixins/resizeWindow';

@Options({
  components: {
    ViewTitleComponent,
    DbInfoRecordsEditComponent,
    ConfirmationDialogComponent,
    Button,
    SplitButton,
    DataTable,
    Column,
    Divider,
    Dialog,
    InputNumber,
    InputText,
    TriStateCheckbox,
    Dropdown,
  },
})
export default class DbInfoRecordsListView extends mixins(ResizeWindow) {
  dbInfoRecord = new DbInfoRecord({});

  dataService = new DbInfoRecordDataProvider();

  isAddDialogVisible = false;

  isDeleteItemDialogVisible = false;

  selectedRecord = {};

  filters = {};

  dbInfoRecords: DbInfoRecord[] = [];

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

  dbKinds = ([
    { name: DbKinds[DbKinds.Postgres], identifier: DbKinds.Postgres },
    { name: DbKinds[DbKinds.SqlServer], identifier: DbKinds.SqlServer },
  ]);

  beforeMount() {
    this.initFilters();
  }

  mounted() {
    this.actionUpdate();
  }

  get isSelectedRecordEmpty() {
    return Object.keys(this.selectedRecord).length === 0;
  }

  get dataTableStyle() {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  actionUpdate() {
    this.dataService.getDbInfoRecords().then((result) => {
      this.dbInfoRecords = result;
    });
  }

  initFilters() {
    this.filters = {
      id:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      appId:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      title:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      dbKind:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      connectionString:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      memo:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      isDeleted: { value: null, matchMode: FilterMatchMode.EQUALS },
    };
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
