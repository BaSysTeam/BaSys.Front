<template>
  <div class="grid">
<!--    Roles-->
    <div class="col-12">
      <Card>
        <template #content>
          <h3>
            Roles:
          </h3>
          <div v-for="role of roles" :key="role.roleUid" class="flex align-items-center">
            <Checkbox v-model="selectedRoles"
                      name="role"
                      :value="role.roleUid"
                      @change="onRoleChanged"
                      class="m-2"/>
            <div>{{ role.name }}</div>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-12">
      <Card>
        <template #content>
          <h3>
            Global rights:
          </h3>
          <div v-for="right of globalRights" :key="right.rightUid" class="flex align-items-center">
            <Checkbox v-model="selectedGlobalRights"
                      name="role"
                      :value="right.rightUid"
                      @change="onRightChanged"
                      class="m-2"/>
            <div>{{ right.name }}</div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Textarea from 'primevue/textarea';
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
import PickList from 'primevue/picklist';
import UserGroup from '@/models/userGroup';
import UserGroupRole from '@/models/userGroupRole';
import UserGroupRight from '@/models/userGroupRight';
import Checkbox from 'primevue/checkbox';

@Options({
  components: {
    PickList,
    Checkbox,
    Textarea,
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
  props: {
    model: {
      type: UserGroup,
      required: true,
    },
  },
})
export default class RolesComponent extends Vue {
  roles: UserGroupRole[] = [];
  selectedRoles: string[] = [];
  globalRights: UserGroupRight[] = [];
  selectedGlobalRights: string[] = [];
  model!: UserGroup;

  mounted(): void {
    this.roles = this.model.roles;
    this.globalRights = this.model.globalRights;

    this.selectedRoles = this.model.roles
      .filter((x) => x.isChecked)
      .map((x) => x.roleUid);
    this.selectedGlobalRights = this.model.globalRights
      .filter((x) => x.isChecked)
      .map((x) => x.rightUid);
  }

  onRoleChanged(): void {
    this.model.roles.forEach((role) => { role.isChecked = false; });
    this.selectedRoles.forEach((role) => {
      const current = this.model.roles.find((x) => x.roleUid === role);
      if (current) {
        current.isChecked = true;
      }
    });
  }

  onRightChanged(): void {
    this.model.globalRights.forEach((right) => { right.isChecked = false; });
    this.selectedGlobalRights.forEach((right) => {
      const current = this.model.globalRights.find((x) => x.rightUid === right);
      if (current) {
        current.isChecked = true;
      }
    });
  }
}
</script>
