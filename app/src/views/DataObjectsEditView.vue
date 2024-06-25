<script lang="ts">
import {
  Prop, Component, Vue, toNative,
} from 'vue-facing-decorator';
import { useRouter } from 'vue-router';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Component({
  components: {
    ViewTitleComponent,
    Divider,
    Button,
    ButtonGroup,
  },
})
class DataObjectEditView extends Vue {
  @Prop({ required: true, type: String })
  kind!: string;

  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ required: true, type: String })
  uid!: string;

  isWaiting = false;
  title = '';
  dataObjectsProvider = new DataObjectsProvider();
  model = new DataObjectWithMetadata(null);
  toastHelper = new ToastHelper(useToast());
  router = useRouter();

  onBackClick(): void {
    console.log('Back click');
    this.router.push({ name: 'data-objects', params: { kind: this.kind, name: this.name } });
  }

  onSaveCloseClick(): void {
    console.log('Save&close click');
  }

  onSaveClick(): void {
    console.log('Save click');
  }

  async init(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataObjectsProvider.getItem(this.kind, this.name, this.uid);

    if (response.isOK) {
      this.model = response.data;
      this.title = `${this.model.metaObjectKindSettings.title}.${this.model.metaObjectSettings.title}`;
      console.log('init', this.model);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  mounted():void {
    console.log('mounted');
    this.init();
  }
}
export default toNative(DataObjectEditView);
</script>

<template>
<div>
  <div class="grid">
    <div class="col">
      <ViewTitleComponent :title="title" :is-modified="false" :is-waiting="isWaiting"/>
    </div>
  </div>
  <div class="grid">
    <div class="col">
      <ButtonGroup>
        <Button
          label="Back"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-arrow-left"
          @click="onBackClick"
        />
        <Button
          label="Save & Close"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveCloseClick"
        />
        <Button
          label="Save"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveClick"
        />
      </ButtonGroup>

    </div>
  </div>
  <div class="grid">
    <Divider class="m-2"/>
  </div>
</div>
</template>

<style scoped>

</style>
