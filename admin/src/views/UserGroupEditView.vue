<template>
  <div class="col">
    <ViewTitleComponent title="User group" :is-modified="false" :is-waiting="isWaiting"/>
  </div>

  <div class="grid">
    <div class="col-6">
      <Button
        label="Save"
        severity="primary"
        size="small"
        outlined
        icon="pi pi-save"
        @click="onSaveClick"
      />
    </div>
  </div>

  <div class="grid">
    <Divider class="m-2"/>
  </div>

  <div class="grid">
    <div class="col-2">
      <div>
        <Menu :model="tabItems"/>
      </div>
    </div>

    <div class="col-7">
      <MainComponent v-if="selectedMenuItem == 0"
                     :model="model"/>

      <UsersComponent v-if="selectedMenuItem == 1"
                      :model="model"/>

      <RolesComponent v-if="selectedMenuItem == 2"
                      :model="model"/>

      <MetaObjectKindRightsComponent v-if="selectedMenuItem >= defaultTabItemsCount"
                                     :model="model"
                                     :meta-object-kind-uid="selectedMetaObjectKindUid" />
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
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
import Menu from 'primevue/menu';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import UserGroupProvider from '@/dataProviders/userGroupProvider';
import MainComponent
  from '@/components/UserGroupEditComponents/MainComponent.vue';
import UserGroup from '@/models/userGroup';
import UsersComponent from '@/components/UserGroupEditComponents/UsersComponent.vue';
import { useToast } from 'primevue/usetoast';
import RolesComponent from '@/components/UserGroupEditComponents/RolesComponent.vue';
import MetaObjectKindRightsComponent
  from '@/components/UserGroupEditComponents/MetaObjectKindRightsComponent.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    MetaObjectKindRightsComponent,
    RolesComponent,
    UsersComponent,
    MainComponent,
    ViewTitleComponent,
    Menu,
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
  selectedMenuItem = 0;
  selectedMetaObjectKindUid!: string;
  model: UserGroup = new UserGroup();
  userGroupUid!: string;
  route = useRoute();
  router = useRouter();
  isWaiting = false;
  dataProvider = new UserGroupProvider();
  toastHelper = new ToastHelper(useToast());
  defaultTabItemsCount!: number;
  tabItems: any = ref([
    {
      label: 'Main',
      items: [
        {
          label: 'User group',
          command: () => {
            this.onSelectMenuItem(0, '');
          },
        },
        {
          label: 'Users',
          command: () => {
            this.onSelectMenuItem(1, '');
          },
        },
        {
          label: 'Roles & rights',
          command: () => {
            this.onSelectMenuItem(2, '');
          },
        },
      ],
    },
  ]);

  mounted(): void {
    if (this.route.query.id) {
      this.userGroupUid = String(this.route.query.id);
    }

    this.initTabItems();
    if (this.userGroupUid) {
      this.update();
    }

    this.defaultTabItemsCount = this.tabItems[0].items.length;
  }

  async initTabItems(): Promise<void> {
    const metaObjectKindItems: any[] = [];
    const result = await this.dataProvider.getMetaObjectKindItems();
    result.data.forEach((item, index) => metaObjectKindItems.push(
      {
        label: item.title,
        command: () => {
          this.onSelectMenuItem(index + this.defaultTabItemsCount, item.uid);
        },
      },
    ));

    this.tabItems.push({
      label: 'Meta object kinds',
      items: metaObjectKindItems,
    });
  }

  async update(): Promise<void> {
    const result = await this.dataProvider.getUserGroup(this.userGroupUid);
    if (!result.isOK) {
      this.toastHelper.error(result.message);
      return;
    }

    this.model = result.data;
  }

  async onSaveClick(): Promise<void> {
    const result = await this.dataProvider.saveUserGroup(this.model);
    if (!result.isOK) {
      this.toastHelper.success('Save user group!');
    } else {
      this.toastHelper.error(result.message);
    }
  }

  onSelectMenuItem(item: number, metaObjectKindUid: string): void {
    this.selectedMenuItem = item;
    this.selectedMetaObjectKindUid = metaObjectKindUid;
  }
}
</script>
