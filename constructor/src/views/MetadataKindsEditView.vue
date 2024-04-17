<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Metadata kinds" :is-modified="false" :is-waiting="false" />
      </div>
    </div>
    <div class="col-12">
      <span class="p-buttonset">
        <Button
            label="Back"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-arrow-left"
            @click="router.push('/metadata-kinds')"
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
      </span>
    </div>
    <div class="grid">
      <Divider class="m-2" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import MetadataKind from '../models/metadataKind';
import MetadataKindProvider from '../dataProviders/metadataKindProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  props: {
    name: String,
  },
  components: {
    ViewTitleComponent,
    Divider,
    DataTable,
    Column,
    Button,
    SplitButton,
  },
})
export default class MetadataKindsEditView extends Vue {
    name!:string;
    router = useRouter();

    onSaveCloseClick():void {
      console.log('Save close click');
    }

    onSaveClick():void {
      console.log('Save click');
    }
}

</script>
