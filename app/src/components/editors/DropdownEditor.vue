<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import SelectItem from '@/models/selectItem';
import Dropdown from 'primevue/dropdown';
import SelectItemsProvider from '@/dataProviders/selectItemsProvider';

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
  provider = new SelectItemsProvider();

  items: SelectItem[] = [];

  async onDropdownBeforeShow(): Promise<void> {
    console.log('dropdownBeforeShow');
    this.isWaiting = true;

    if (this.items.length === 0) {
      const response = await this.provider.getCollection(this.dataTypeUid);
      console.log('select items result', response);
      if (response.isOK) {
        this.items = response.data;
      } else {
        console.error(response.presentation);
      }
    }

    this.isWaiting = false;
  }
}
</script>

<template>
  <Dropdown :id="id"
            :editable="true"
            :show-clear="true"
            :loading="isWaiting"
            :options="items"
            size="small"
            option-label="text"
            option-value="value"
            class="w-full"
            @before-show="onDropdownBeforeShow"></Dropdown>
</template>

<style scoped>

</style>
