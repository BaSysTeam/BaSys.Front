<template>
  <div class="grid">
    <div class="col-8">
      <Card>
        <template #content>
          <!--User group name-->
          <div class="grid">
            <div class="col-3 flex align-items-center">
              <span class="bs-required">User group name</span>
            </div>
            <div class="col">
              <InputText
                v-model="model.name"
                type="text"
                size="small"
                class="w-full"
              />
            </div>
          </div>
          <!--User group comment-->
          <div class="grid">
            <div class="col-3 flex align-items-center">
              <span class="bs-required">Comments</span>
            </div>
            <div class="col">
                <Textarea
                  v-model="model.memo"
                  rows="3"
                  aria-labelledby="modelConnectionString"
                  class="w-full"
                  id="connectionStringInput"
                />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import Badge from 'primevue/badge';
import Card from 'primevue/card';
import ConfirmDialog from 'primevue/confirmdialog';
import UserGroup from '@/models/userGroup';

@Options({
  components: {
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
export default class MainComponent extends Vue {
  model!: UserGroup;
}

</script>
