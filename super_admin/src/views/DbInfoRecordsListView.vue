<template>
    <div>
      <div class="grid">
        <div class="col">
          <ViewTitleComponent title="Db connections" :is-waiting="isWaiting" />
        </div>
      </div>
      <div class="grid">
        <div class="col-6">
          <ButtonGroup>
            <Button
              :label="$t('add')"
              severity="primary"
              size="small"
              outlined
              icon="pi pi-plus"
              @click="addDialogOpen"
            />
            <Button
              :label="$t('edit')"
              severity="primary"
              size="small"
              outlined
              icon="pi pi-pencil"
              :disabled="isSelectedRecordEmpty"
              @click="editDialogOpen"
            />
            <Button
              label="Delete"
              severity="danger"
              size="small"
              outlined
              icon="pi pi-trash"
              :disabled="isSelectedRecordEmpty"
              @click="showConfirmDialog"
            />
          </ButtonGroup>
          <Button
            severity="primary"
            size="small"
            class="ml-1"
            outlined
            icon="pi pi-copy"
            v-tooltip.top="'Copy'"
            :disabled="isSelectedRecordEmpty"
            @click="copyDialogOpen"
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
              @row-dblclick="editDialogOpen"
              showGridlines
              filterDisplay="menu"
              selectionMode="single"
              dataKey="id"
              size="small"
              scrollable
              scrollHeight="flex"
            >
              <template #empty> No items found. </template>
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
              <Column field="name" header="Name">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                      v-model="filterModel.value"
                      type="text"
                      class="p-column-filter"
                      placeholder="Search by Name"
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
                header="IsActive"
                dataType="boolean"
                bodyClass="text-center"
              >
                <template #body="{ data }">
                  <InputSwitch :modelValue="!data.isDeleted" @change="isActiveChange(data)" />
                </template>
                <template #filter="{ filterModel }">
                  <span for="isActive-filter" class="font-bold"> IsActive </span>
                  <TriStateCheckbox v-model="filterModel.value" inputId="isActive-filter" />
                </template>
              </Column>
              <Column header="Create" bodyClass="text-center">
                <template #body="{ data }">
                  <template v-if="data.isExists === true">
                    <i class="pi pi-check-circle text-green-500" v-tooltip.left="'Created'"></i>
                  </template>
                  <template v-else-if="data.isExists === false">
                    <Button
                      severity="primary"
                      size="small"
                      icon="pi pi-database"
                      v-tooltip.left="'Create DB'"
                      @click="createDbDialogOpen(data)"
                    />
                  </template>
                  <template v-else>
                    <span class="font-bold text-red-500">!</span>
                  </template>
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

      <ConfirmDialog :draggable="false"></ConfirmDialog>

      <DbCreateComponent
        v-if="isDbCreateDialogVisible"
        @close="isDbCreateDialogVisible = false"
        @create="onCreateDb"
      />
    </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { DbKinds } from '@/enums/dbKinds';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import DbInfoRecordProvider from '@/dataProviders/dbInfoRecordProvider';
import DbInfoRecordsEditComponent from '@/components/DbInfoRecordsEditComponent.vue';
import DbCreateComponent from '@/components/DbCreateComponent.vue';
import DbInfoRecord from '@/models/dbInfoRecord';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import ConfirmDialog from 'primevue/confirmdialog';
import InitDbRequestDto from '@/models/initDbRequestDto';
import WorkDbProvider from '@/dataProviders/workDbProvider';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    DbInfoRecordsEditComponent,
    DbCreateComponent,
    Button,
    ButtonGroup,
    SplitButton,
    DataTable,
    Column,
    Divider,
    Dialog,
    InputNumber,
    InputText,
    TriStateCheckbox,
    Dropdown,
    InputSwitch,
    ConfirmDialog,
  },
})
export default class DbInfoRecordsListView extends mixins(ResizeWindow) {
  dbInfoRecord = new DbInfoRecord({});
  dbInfoRecordProvider = new DbInfoRecordProvider();
  workDbProvider = new WorkDbProvider();
  toastHelper = new ToastHelper(useToast());
  confirm = useConfirm();
  isAddDialogVisible = false;
  isDbCreateDialogVisible = false;
  isModelActionEdit = false;
  isWaiting = false;
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

  async actionUpdate(): Promise<void> {
    const response = await this.dbInfoRecordProvider.getDbInfoRecords();
    if (response.isOK) {
      this.dbInfoRecords = response.data;
      this.checkDbExists();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async checkDbExists(): Promise<void> {
    const queryParams: string = this.dbInfoRecords.map((x) => `ids=${x.id}`).join('&');
    const response = await this.dbInfoRecordProvider.checkDbExists(queryParams);
    if (response.isOK) {
      response.data.forEach((item) => {
        const result = this.dbInfoRecords.find((x) => x.id === item.dbInfoRecordId);
        if (result) {
          result.isExists = item.isExists;
        }
      });
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  initFilters(): void {
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
      name:
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
      isDeleted: { value: null, matchMode: FilterMatchMode.NOT_EQUALS },
    };
  }

  async deleteDbInfoRecord(): Promise<void> {
    if (!this.isSelectedRecordEmpty) {
      const deletedItem = new DbInfoRecord(this.selectedRecord);
      const response = await this.dbInfoRecordProvider.deleteDbInfoRecord(deletedItem.id);
      if (response.isOK) {
        this.actionUpdate();
        this.selectedRecord = {};
        this.toastHelper.success(response.message);
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    }
  }

  async saveDbInfoRecord(args: DbInfoRecord): Promise<void> {
    this.isAddDialogVisible = false;
    let response = null;

    if (this.isModelActionEdit) {
      response = await this.dbInfoRecordProvider.updateDbInfoRecord(args);
    } else {
      response = await this.dbInfoRecordProvider.addDbInfoRecord(args);
    }

    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.actionUpdate();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  formatDbKind(kind: DbKinds): string {
    return DbKinds[kind];
  }

  addDialogOpen(): void {
    this.dbInfoRecord = new DbInfoRecord({});
    this.isAddDialogVisible = true;
    this.isModelActionEdit = false;
  }

  editDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.dbInfoRecord = new DbInfoRecord(this.selectedRecord);
      this.isAddDialogVisible = true;
      this.isModelActionEdit = true;
    }
  }

  showConfirmDialog(): void {
    this.confirm.require({
      message: 'Are you sure you want to delete the selected item?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      accept: () => this.deleteDbInfoRecord(),
    });
  }

  copyDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.dbInfoRecord = new DbInfoRecord(this.selectedRecord);
      this.dbInfoRecord.id = 0;
      this.dbInfoRecord.title += ' - COPY';
      this.dbInfoRecord.isExists = false;
      this.isAddDialogVisible = true;
      this.isModelActionEdit = false;
    }
  }

  createDbDialogOpen(data: DbInfoRecord): void {
    this.dbInfoRecord = new DbInfoRecord(data);
    this.isDbCreateDialogVisible = true;
  }

  async isActiveChange(data: DbInfoRecord): Promise<void> {
    const item = data;
    item.isDeleted = !item.isDeleted;

    const response = await this.dbInfoRecordProvider.switchActivity(item.id);

    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.actionUpdate();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async onCreateDb(model: InitDbRequestDto): Promise<void> {
    this.isWaiting = true;

    const response = await this.workDbProvider.initDb(this.dbInfoRecord.id, model);
    if (response.isOK) {
      this.checkDbExists();
      this.toastHelper.success(response.message);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }
}
</script>
