<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Users" :is-modified="false" :is-waiting="false" />
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
            @click="addUser"
          />
          <Button
            label="Edit"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-pencil"
            :disabled="isSelectedRecordEmpty"
            @click="editUser"
          />
        </span>
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
            :value="users"
            :metaKeySelection="true"
            :style="dataTableStyle"
            @row-dblclick="editUser"
            showGridlines
            filterDisplay="menu"
            selectionMode="single"
            dataKey="id"
            size="small"
            scrollable
            scrollHeight="flex"
          >
            <template #empty> No items found. </template>
            <Column field="userName" header="User name">
              <template #body="{ data }">
                {{ data.userName }}
              </template>
              <template #filter="{ filterModel }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    placeholder="Search by User name"
                  />
              </template>
            </Column>
            <Column field="email" header="Email">
              <template #body="{ data }">
                {{ data.email }}
              </template>
              <template #filter="{ filterModel }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    placeholder="Search by Email"
                  />
              </template>
            </Column>
            <Column field="isActive" header="IsActive" dataType="boolean" bodyClass="text-center">
              <template #body="{ data }">
                <InputSwitch v-model="data.isActive" @change="isActiveChange(data)" />
              </template>
              <template #filter="{ filterModel }">
                <span for="isActive-filter" class="font-bold"> IsActive </span>
                <TriStateCheckbox v-model="filterModel.value" inputId="isActive-filter" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div class="col-3">
        <Card class="mt-1">
          <template #content>
            <div class="grid">
              <div class="col flex justify-content-between flex-wrap">
                <b>Total</b>
                <Badge :value="users.length" severity="primary"></Badge>
              </div>
            </div>
            <div class="grid">
              <div class="col flex justify-content-between flex-wrap">
                <b>Enabled</b>
                <Badge :value="usersEnabled" severity="success"></Badge>
              </div>
            </div>
            <div class="grid">
              <div class="col flex justify-content-between flex-wrap">
                <b>Disabled</b>
                <Badge :value="usersDisabled" severity="danger"></Badge>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <ConfirmationDialogComponent
      v-if="isDeleteRecordDialogVisible"
      confirmText="Are you sure you want to delete the selected item?"
      @noClick="isDeleteRecordDialogVisible = false"
      @yesClick="deleteUser"
    />

    <ChangePasswordComponent
      v-if="isChangePasswordDialogVisible"
      :user="currentUser"
      @close="isChangePasswordDialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import InputSwitch from 'primevue/inputswitch';
import Badge from 'primevue/badge';
import Card from 'primevue/card';
import User from '../models/user';
import ChangePasswordComponent from '../components/ChangePasswordComponent.vue';
import UserProvider from '../dataProviders/userProvider';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ConfirmationDialogComponent from '../../../shared/src/components/ConfirmationDialogComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    ConfirmationDialogComponent,
    ChangePasswordComponent,
    Divider,
    Button,
    SplitButton,
    DataTable,
    Column,
    InputText,
    TriStateCheckbox,
    InputSwitch,
    Badge,
    Card,
  },
})
export default class UserListView extends mixins(ResizeWindow) {
  isDeleteRecordDialogVisible = false;
  isChangePasswordDialogVisible = false;
  selectedRecord = {};
  filters = {};
  dataProvider = new UserProvider();
  users:User[] = [];
  currentUser:User = new User({});
  router = useRouter();
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
    { separator: true },
    {
      label: 'Delete',
      command: () => this.deleteDialogOpen(),
    },
    {
      label: 'Change Password',
      command: () => this.changePasswordDialogOpen(),
    },
  ];

  get isSelectedRecordEmpty(): boolean {
    return Object.keys(this.selectedRecord).length === 0;
  }

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  get usersEnabled(): number {
    return this.users.filter((x) => x.isActive).length;
  }

  get usersDisabled(): number {
    return this.users.filter((x) => !x.isActive).length;
  }

  beforeMount(): void {
    this.initFilters();
  }

  mounted(): void {
    this.actionUpdate();
  }

  async actionUpdate(): Promise<void> {
    const response = await this.dataProvider.getAllUsers();
    if (response.isOK) {
      this.users = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  initFilters(): void {
    this.filters = {
      userName:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      email:
      {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
    };
  }

  changePasswordDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.currentUser = new User(this.selectedRecord);
      this.isChangePasswordDialogVisible = true;
    }
  }

  addUser(): void {
    const user = new User({});
    this.router.push({ name: 'editUser', query: { id: user.id } });
  }

  editUser(): void {
    if (!this.isSelectedRecordEmpty) {
      const user = this.selectedRecord as User;
      this.router.push({ name: 'editUser', query: { id: user.id } });
    }
  }

  async deleteUser(): Promise<void> {
    if (!this.isSelectedRecordEmpty) {
      const deletedItem = this.selectedRecord as User;
      const response = await this.dataProvider.deleteUser(deletedItem.id);
      if (response.isOK) {
        this.actionUpdate();
        this.selectedRecord = {};
        this.toastHelper.success(response.message);
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    }

    this.isDeleteRecordDialogVisible = false;
  }

  deleteDialogOpen(): void {
    if (!this.isSelectedRecordEmpty) {
      this.isDeleteRecordDialogVisible = true;
    }
  }

  async isActiveChange(data: User): Promise<void> {
    let response = null;

    if (data.isActive) {
      response = await this.dataProvider.enableUser(data.id);
    } else {
      response = await this.dataProvider.disableUser(data.id);
    }

    if (response.isOK) {
      this.toastHelper.success(response.message);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
}
</script>
