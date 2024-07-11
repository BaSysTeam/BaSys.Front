<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { PropType } from 'vue';
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

  @Prop({ type: Object as PropType<any> })
  modelValue!: any;

  localValue: any = '';

  isWaiting = false;
  provider = new SelectItemsProvider();

  items: SelectItem[] = [];

  @Watch('modelValue')
  onPropsChanged(newValue: any): void {
    console.log('Dropdown props changed', newValue);
    // this.localValue = newValue;
    // this.getItem();
  }

  async onDropdownBeforeShow(): Promise<void> {
    this.isWaiting = true;

    if (this.shouldGetCollection()) {
      const response = await this.provider.getCollection(this.dataTypeUid);
      if (response.isOK) {
        this.items = response.data;
      } else {
        console.error(response.presentation);
      }
    }

    this.isWaiting = false;
  }

  onModelValueChanged(): void {
    this.$emit('update:modelValue', this.localValue);
  }

  shouldGetCollection(): boolean {
    return this.items.length <= 1;
  }

  shouldGetItem(): boolean {
    if (this.items.length === 0) {
      return true;
    }

    const item = this.items.find((x) => x.value === this.localValue);

    if (!item) {
      return true;
    }

    return false;
  }

  async getItem(): Promise<void> {
    if (!this.shouldGetItem()) {
      return;
    }

    this.isWaiting = true;
    const response = await this.provider.getItem(this.dataTypeUid, this.localValue);
    this.isWaiting = false;

    if (response.isOK) {
      this.items = [];
      this.items.push(response.data);
    } else {
      console.error(response.presentation);
    }
  }

  beforeMount(): void {
    this.localValue = this.modelValue;
    this.getItem();
  }
}
</script>

<template>
  <Dropdown :id="id"
            :editable="true"
            :show-clear="true"
            :loading="isWaiting"
            :options="items"
            v-model="localValue"
            size="small"
            option-label="text"
            option-value="value"
            class="w-full"
            @before-show="onDropdownBeforeShow"
            @update:model-value="onModelValueChanged"></Dropdown>
</template>

<style scoped>

</style>
