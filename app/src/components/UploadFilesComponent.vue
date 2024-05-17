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
        <!--        <FileUpload name="files[]"-->
        <!--                    :url=getUrl()-->
        <!--                    :multiple="true"-->
        <!--                    @upload="onAdvancedUpload($event)"-->
        <!--        >-->
        <!--          <template #empty>-->
        <!--            <p>Drag and drop files to here to upload.</p>-->
        <!--          </template>-->
        <!--        </FileUpload>-->
        <label for="upload">
          <input
            type="file"
            id="upload"
            @change="onFileChanged($event)"
            capture
            multiple
          />
        </label>
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
import axios from 'axios';
import AttachedFilesProvider from '@/dataProviders/attachedFilesProvider';
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
  provider = new AttachedFilesProvider();

  mounted(): void {
    this.update();
  }

  async update(): Promise<void> {
    await this.provider.getFilesList(this.metaObjectKindUid, this.metaObjectUid, this.objectUid);
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }

  async onFileChanged($event: Event): Promise<void> {
    const target = $event.target as HTMLInputElement;
    if (target.files == null) {
      return;
    }

    const result = await this.provider.uploadFiles(
      target.files,
      this.metaObjectKindUid,
      this.metaObjectUid,
      this.objectUid,
    );

    if (result) {
      target.files = null;
      this.toastHelper.success('Success upload!');
      await this.update();
    } else {
      this.toastHelper.error('Error uploading files');
    }
  }
}
</script>
