<template>
  <div class="grid">
    <div class="col-12">
      <Card>
        <template #content>
          <PickList v-model="users"
                    :listStyle="getStyle"
                    dataKey="uid"
                    @selection-change="onChange"
                    breakpoint="1400px">
            <template #sourceheader> Available users </template>
            <template #targetheader> Users in group </template>
            <template #item="slotProps">
              <div class="font-bold">{{ slotProps.item.userName }}</div>
            </template>
          </PickList>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options, Vue } from 'vue-class-component';
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
import { ResizeWindow } from '../../../../shared/src/mixins/resizeWindow';

@Options({
  components: {
    PickList,
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
export default class UsersComponent extends mixins(ResizeWindow) {
  users: any[][] = [];
  model!: UserGroup;

  mounted(): void {
    const selectedUsers = this.model.users.filter((x) => x.isChecked);
    const availableUsers = this.model.users.filter((x) => !x.isChecked);
    this.users = [availableUsers, selectedUsers];
  }

  get getStyle(): object {
    return {
      height: `${this.windowHeight}px`,
    };
  }

  onChange(): void {
    this.model.users.forEach((user) => { user.isChecked = false; });
    this.users[1].forEach((user) => {
      const current = this.model.users.find((x) => x.userUid === user.userUid);
      if (current) {
        current.isChecked = true;
      }
    });
  }
}
</script>
