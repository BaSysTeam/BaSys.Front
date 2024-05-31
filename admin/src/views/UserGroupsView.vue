<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="User groups" :is-modified="false" :is-waiting="isWaiting" />
      </div>
    </div>

    <div class="grid">
      <div class="col-6">
        <ButtonGroup>
          <Button
            label="Add"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-plus"
            @click="createUserGroup"
          />
          <Button
            label="Edit"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-pencil"
            :disabled="isSelectedRecordEmpty"
            @click="editUserGroup"
          />
          <Button
            label="Delete"
            severity="danger"
            size="small"
            outlined
            icon="pi pi-times"
            :disabled="isSelectedRecordEmpty"
            @click="deleteUserGroup"
          />
        </ButtonGroup>
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
            :value="userGroups"
            :metaKeySelection="true"
            :style="dataTableStyle"
            showGridlines
            filterDisplay="menu"
            selectionMode="single"
            dataKey="uid"
            size="small"
            scrollable
            scrollHeight="flex"
          >
            <template #empty> No items found. </template>
            <Column field="name" header="User group name">
              <template #body="{ data }">
                {{ data.name }}
              </template>
            </Column>
            <Column field="memo" header="Memo">
              <template #body="{ data }">
                {{ data.memo }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { mixins, Options, Vue } from 'vue-class-component';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import InputSwitch from 'primevue/inputswitch';
import Badge from 'primevue/badge';
import Card from 'primevue/card';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';
import UserGroupProvider from '@/dataProviders/userGroupProvider';
import UserGroup from '@/models/userGroup';
import { useRouter } from 'vue-router';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    Button,
    ButtonGroup,
    SplitButton,
    DataTable,
    Column,
    InputText,
    TriStateCheckbox,
    InputSwitch,
    Badge,
    Card,
    ConfirmDialog,
  },
})
export default class UserGroupsView extends mixins(ResizeWindow) {
  toastHelper = new ToastHelper(useToast());
  dataProvider = new UserGroupProvider();
  userGroups: UserGroup[] = [];
  selectedRecord = {};
  isWaiting = false;
  router = useRouter();

  mounted(): void {
    this.update();
  }

  async update(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataProvider.getUserGroups();
    if (response.isOK) {
      this.userGroups = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async deleteUserGroup(): Promise<void> {
    this.isWaiting = true;

    const userGroup = this.selectedRecord as UserGroup;
    const response = await this.dataProvider.deleteUserGroup(userGroup.uid);
    if (response.isOK) {
      this.toastHelper.success('Success delete!');
      await this.update();
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  createUserGroup(): void {
    this.router.push({ name: 'editUserGroup' });
  }

  editUserGroup(): void {
    const userGroup = this.selectedRecord as UserGroup;
    this.router.push({ name: 'editUserGroup', query: { id: userGroup.uid } });
  }

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  get isSelectedRecordEmpty(): boolean {
    return Object.keys(this.selectedRecord).length === 0;
  }
}
</script>
