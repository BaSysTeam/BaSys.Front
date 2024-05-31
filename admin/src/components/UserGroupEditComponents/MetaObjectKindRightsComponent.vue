<template>
  <div class="grid">
    <div class="col-12">
      <Card>
        <template #content>
          MetaObjectKindRightsComponent
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
    metaObjectKindUid: {
      type: String,
      required: true,
    },
  },
})
export default class MetaObjectKindRightsComponent extends Vue {
}
</script>
