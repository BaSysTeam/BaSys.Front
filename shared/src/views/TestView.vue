<template>
    <div>
      <h1>TestView</h1>
    </div>
    <div>
      <Button label="Show Toast" @click="onShowToastClick"/>
    </div>
  <div class="mt-3">
    <MegaMenu :model="items" orientation="vertical" />
  </div>
</template>

<script lang="ts">
import Button from 'primevue/button';
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import MegaMenu from 'primevue/megamenu';
import TestProvider from '@/dataProviders/testProvider';
import MegaMenuItem from '@/models/megaMenuItem';
import ToastHelper from '../helpers/toastHelper';

@Options({
  components: {
    Button,
    MegaMenu,
  },
})
export default class TestView extends Vue {
  toastHelper = new ToastHelper(useToast());
  dataProvider = new TestProvider();
  items: MegaMenuItem[] = [];

  async mounted(): Promise<void> {
    await this.getMegaMenuItems();
  }

  async getMegaMenuItems(): Promise<void> {
    const response = await this.dataProvider.getMegaMenuItems();
    if (response.isOK) {
      console.log('response.data', response.data);
      this.items = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  onShowToastClick(): void {
    this.toastHelper.info('Toast info from TestView');
  }
}
</script>

<style scoped>

</style>../services/bsToastService
