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
        <div class="col-6">
          <div class="card m-1">
            <DataTable
              v-model:selection="selectedRecord"
              v-model:filters="filters"
              :value="appRecords"
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
import { useToast } from 'primevue/usetoast';
import AppRecordProvider from '@/dataProviders/appRecordProvider';
import AppRecordsEditComponent from '@/components/AppRecordsEditComponent.vue';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import AppRecord from '@/models/appRecord';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ConfirmationDialogComponent from '../../../shared/src/components/ConfirmationDialogComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

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
  isModelActionEdit = false;
  appRecord = new AppRecord({});
  selectedRecord = {};
  isDeleteItemDialogVisible = false;
  dataProvider = new AppRecordProvider();
  filters = {};
  toastHelper = new ToastHelper(useToast());

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

  async actionUpdate(): Promise<void> {
    const response = await this.dataProvider.getAppRecords();
    if (response.isOK) {
      this.appRecords = response.data;
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

  async deleteAppRecord(): Promise<void> {
    if (!this.isSelectedRecordEmpty) {
      const deletedItem = new AppRecord(this.selectedRecord);
      const response = await this.dataProvider.deleteAppRecord(deletedItem.id);
      if (response.isOK) {
        this.actionUpdate();
        this.selectedRecord = {};
        this.toastHelper.success(response.message);
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    }

    this.isDeleteItemDialogVisible = false;
  }

  async saveAppRecord(args: AppRecord): Promise<void> {
    this.isAddDialogVisible = false;
    let response = null;

    if (this.isModelActionEdit) {
      response = await this.dataProvider.updateAppRecord(args);
    } else {
      response = await this.dataProvider.addAppRecord(args);
    }

    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.actionUpdate();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  addDialogOpen(): void {
    this.appRecord = new AppRecord({});
    this.isAddDialogVisible = true;
    this.isModelActionEdit = false;
  }

  editDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.appRecord = new AppRecord(this.selectedRecord);
      this.isAddDialogVisible = true;
      this.isModelActionEdit = true;
    }
  }

  copyDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.appRecord = new AppRecord(this.selectedRecord);
      this.appRecord.id = '';
      this.appRecord.title += ' - COPY';
      this.isAddDialogVisible = true;
      this.isModelActionEdit = false;
    }
  }

  deleteDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.isDeleteItemDialogVisible = true;
    }
  }
}
</script>
