<template>
    <div>
      <h1>TestView</h1>
    </div>
    <div>
      <Button label="Show Toast" @click="onShowToastClick"/>
    </div>
</template>

<script lang="ts">
import Button from 'primevue/button';
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import ToastHelper from '../helpers/toastHelper';

@Options({
  components: {
    Button,
  },
})
export default class TestView extends Vue {
  toastHelper = new ToastHelper(useToast());

  onShowToastClick(): void {
    this.toastHelper.info('Toast info from TestView');
  }
}
</script>

<style scoped>

</style>../services/bsToastService
