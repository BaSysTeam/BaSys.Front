<script setup lang="ts">
import { ref } from 'vue';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';

const selectedItem = ref();
const items = ref(Array.from({ length: 100000 }));
const loading = ref(false);
const loadLazyTimeout = ref();

const onLazyLoad = (event: any):void => {
  loading.value = true;

  if (loadLazyTimeout.value) {
    clearTimeout(loadLazyTimeout.value);
  }

  // imitate delay of a backend call
  loadLazyTimeout.value = setTimeout(() => {
    const { first, last } = event;
    // eslint-disable-next-line no-underscore-dangle
    const _items = [...items.value];

    // eslint-disable-next-line no-plusplus
    for (let i = first; i < last; i++) {
      _items[i] = { label: `Item #${i}`, value: i };
    }

    items.value = _items;
    loading.value = false;
  }, Math.random() * 1000 + 250);
};

</script>

<template>
  <div>
    <h3>Experimental lazy loading</h3>
  </div>
  <div>
    <Divider></Divider>
  </div>
  <div>
    <div class="card flex justify-content-center">
      <Dropdown v-model="selectedItem"
                :options="items"
                :editable="true"
                optionLabel="label"
                optionValue="value"
                class="w-full md:w-14rem"
                :virtualScrollerOptions="{ lazy: true,
                onLazyLoad: onLazyLoad,
                itemSize: 38, showLoader: true, loading: loading, delay: 250 }"
                placeholder="Select Item" />
    </div>
  </div>
</template>

<style scoped>

</style>
