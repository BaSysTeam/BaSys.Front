<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import SelectItem from '@/models/selectItem';
import Dropdown from 'primevue/dropdown';

@Options({
  components: {
    Dropdown,
  },
})
export default class DropdownEditor extends Vue {
  @Prop({
    type: String,
    default: '',
  })
  id!: string;

  @Prop({
    required: true,
    type: String,
    default: '',
  })
  dataTypeUid!: string;

  @Prop({ type: Object })
  modelValue!: any;

  isWaiting = false;

  items: SelectItem[] = [];
}
</script>

<template>
  <Dropdown :id="id"
            :editable="true"
            :show-clear="true"
            :loading="isWaiting"
            size="small"
            option-label="text"
            option-value="value"
            class="w-full"></Dropdown>
</template>

<style scoped>

</style>
