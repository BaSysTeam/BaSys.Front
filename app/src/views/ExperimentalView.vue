<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AutoComplete from 'primevue/autocomplete';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import DataObject from '@/models/dataObject';
import SelectItem from '@/models/selectItem';

@Options({
  components: {
    AutoComplete,
    Divider,
    Dropdown,
  },
})
export default class ExperimentalView extends Vue {
  dataItem = new DataObject({
    header: {
      amount: 100,
      info: 'Experimental',
      productGroup: 3,
    },
  });

  selectedGroup = new SelectItem({
    value: 15,
    text: 'Product group 15',
  });

  autoCompleteValue = new SelectItem({
    value: 3,
    text: 'Product group 3',
  });

  productGroupItems: SelectItem[] = [];
  productGroupItemsFiltered: SelectItem[] = [];

  onProductGroupChange(evt: any): void {
    console.log('product group change', evt, this.selectedGroup);
    console.log('dataItem', this.dataItem);
  }

  onProductGroupUpdated(evt: any): void {
    console.log('product group updated', evt, this.selectedGroup);
    console.log('dataItem', this.dataItem);
  }

  onAutoCompleteSearch(evt: any): void {
    console.log('search', evt);

    if (!evt.query.trim().length) {
      this.productGroupItemsFiltered = this.productGroupItems;
    } else {
      this.productGroupItemsFiltered = this.productGroupItems.filter(
        (item) => item.text.toLowerCase().startsWith(evt.query.toLowerCase()),
      );
    }
  }

  onAutCompleteUpdate(evt: any): void {
    console.log('update', evt, this.autoCompleteValue);
  }

  mounted(): void {
    const itemsCount = 100;
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < itemsCount; i++) {
      const newItem = new SelectItem({
        value: i,
        text: `Product group ${i}`,
      });
      this.productGroupItems.push(newItem);
    }
  }
}
</script>

<template>
  <div>
    <h3>Experimental</h3>
  </div>
  <div>
    <Divider></Divider>
  </div>
  <!--Dropdown-->
  <div class="grid">
    <div class="col-1">
      <label for="product-group-dropdown">Dropdown</label>
    </div>
    <div class="col-3">
        <Dropdown id="product-group-dropdown"
                  v-model="selectedGroup"
                  :options="productGroupItems"
                  :editable="true"
                  :show-clear="true"
                  filter
                  size="small"
                  option-label="text"
                  class="w-full"
                  @change="onProductGroupChange"
                  @update:model-value="onProductGroupUpdated"></Dropdown>

    </div>
  </div>
  <!--AutoComplete-->
  <div class="grid">
    <div class="col-1">
      <label>AutoComplete</label>
    </div>
    <div class="col-3">
        <AutoComplete class="w-full"
                      v-model="autoCompleteValue"
                      :suggestions="productGroupItemsFiltered"
                      option-label="text"
                      dropdown
                      size="small"
                      @complete="onAutoCompleteSearch"
                      @update:model-value="onAutCompleteUpdate"></AutoComplete>
      </div>
  </div>
</template>

<style scoped>

</style>
