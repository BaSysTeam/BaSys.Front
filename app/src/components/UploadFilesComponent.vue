<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '45rem'}"
      :draggable="false"
      :header="headerText"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <FileUpload name="files[]"
                    :url=getUrl()
                    :multiple="true"
                    @upload="onAdvancedUpload($event)"
        >
          <template #empty>
            <p>Drag and drop files to here to upload.</p>
          </template>
        </FileUpload>
      </div>
      <template #footer>
        <Button
          label="Close"
          severity="secondary"
          size="small"
          outlined
          @click="_ => updateVisible(false)"
        />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import FileUpload, { FileUploadUploadEvent } from 'primevue/fileupload';
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
    Checkbox,
    FileUpload,
  },
  emits: {
    close: null,
  },
  props: {
    metaObjectKindUid: {
      type: String,
      required: true,
    },
    metaObjectUid: {
      type: String,
      required: true,
    },
    objectUid: {
      type: String,
      required: true,
    },
  },
})
export default class UploadFilesComponent extends Vue {
  metaObjectKindUid!: string;
  metaObjectUid!: string;
  objectUid!: string;
  headerText = 'Upload files';
  toastHelper = new ToastHelper(useToast());

  // mounted(): void {
  // }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }

  onAdvancedUpload(event: FileUploadUploadEvent): void {
    console.log('onAdvancedUpload');
  }

  getUrl(): string {
    return `/api/v1/AttachedFiles/Upload?metaObjectKindUid=${this.metaObjectKindUid}&metaObjectUid=${this.metaObjectUid}&objectUid=${this.objectUid}`;
  }
}

</script>
