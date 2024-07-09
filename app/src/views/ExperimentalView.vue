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
  isWaiting = false;
  productGroupItems: SelectItem[] = [];
  productGroupFilteredItems: SelectItem[] = [];

  virtualScrollerOptions = {
    lazy: true,
    onLazyLoad: (evt: any) => this.onLazyLoad(evt),
    itemSize: 38,
    showLoader: true,
    loading: this.isWaiting,
    delay: 250,
  };

  dataItem = new DataObject({
    header: {
      amount: 100,
      info: 'Experimental',
      productGroup: 3,
    },
  });

  selectedGroup = 15;

  onProductGroupChange(evt: any): void {
    console.log('product group change', evt, this.selectedGroup);
    console.log('dataItem', this.dataItem);

    if (!evt.value) {
      return;
    }

    const searchValue = evt.value.toString();

    if (searchValue) {
      this.isWaiting = true;
      this.productGroupFilteredItems = [];
      this.productGroupFilteredItems = this.productGroupItems.filter(
        (item) => item.text.toLowerCase().includes(searchValue.toLowerCase()),
      ).slice(0, 100);
      this.isWaiting = false;
    }

    console.log('searchValue', searchValue);
  }

  onDropDownBeforeShow(): void {
    const filterResult = this.productGroupItems.filter((x) => x.value === this.selectedGroup);
    if (filterResult.length) {
      this.getTopItems(filterResult[0]);
    } else {
      this.getTopItems(new SelectItem(null));
    }
  }

  onProductGroupUpdated(evt: any): void {
    console.log('product group updated', evt, this.selectedGroup);
    console.log('dataItem', this.dataItem);
  }

  onDropDownFilter(evt: any): void {
    console.log('dropDown filter', evt);
  }

  onLazyLoad(evt: any): void {
    this.isWaiting = true;
    console.log('lazyLoad', evt, this.productGroupItems);

    // eslint-disable-next-line no-plusplus
    for (let i = evt.first; i < evt.first + 50; i++) {
      const newItem = new SelectItem({
        value: i,
        text: `Product group ${i}`,
      });

      this.productGroupItems.push(newItem);
    }
    this.isWaiting = false;
  }

  beforeMount(): void {
    console.log('onBeforeMount');
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 100000; i++) {
      const newItem = new SelectItem({
        value: i,
        text: `Product group ${i}`,
      });

      this.productGroupItems.push(newItem);
    }

    const filterResult = this.productGroupItems.filter((x) => x.value === this.selectedGroup);
    filterResult.forEach((x) => { this.productGroupFilteredItems.push(x); });

    this.getTopItems(filterResult[0]);
    // const ind = this.productGroupItems.indexOf(filterResult[0]);
    // eslint-disable-next-line no-plusplus
    // for (let i = ind + 1; i < ind + 20; i++) {
    //  this.productGroupFilteredItems.push(this.productGroupItems[i]);
    // }

    console.log('Product group items', this.productGroupItems);
  }

  getTopItems(item: SelectItem): void {
    let ind = this.productGroupItems.indexOf(item);

    if (ind < 0) {
      ind = 0;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = ind + 1; i < ind + 20; i++) {
      this.productGroupFilteredItems.push(this.productGroupItems[i]);
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
                  :options="productGroupFilteredItems"
                  :editable="true"
                  :show-clear="true"
                  :loading="isWaiting"
                  size="small"
                  option-label="text"
                  option-value="value"
                  class="w-full"
                  @filter="onDropDownFilter"
                  @before-show="onDropDownBeforeShow"
                  @change="onProductGroupChange"
                  @update:model-value="onProductGroupUpdated"></Dropdown>

    </div>
  </div>

</template>

<style scoped>

</style>
