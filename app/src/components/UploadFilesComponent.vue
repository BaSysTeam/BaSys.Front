<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '60rem'}"
      :draggable="false"
      :header="headerText"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <!--      Files list-->
      <DataTable
        :value="filesList"
        :metaKeySelection="true"
        :style="dataTableStyle"
        filterDisplay="menu"
        selectionMode="single"
        dataKey="id"
        size="small"
        scrollable
        scrollHeight="flex"
      >
        <template #empty> No files found.</template>
        <Column header="Preview" bodyClass="text-left">
          <template #body="{ data }">
            <div>
              <Image :src="data.base64String"
                     alt="Image"
                     width="50"
                     v-if="data.base64String != ''"
                     preview
              />
            </div>
          </template>
        </Column>
        <Column header="File name" bodyClass="text-left">
          <template #body="{ data }">
            <div style="font-size: 0.9em">
              {{ data.fileName }}
            </div>
          </template>
        </Column>
        <Column header="Delete" bodyClass="center">
          <template #body="{ data }">
            <i class="pi pi-trash text-red-500"
               v-tooltip.left="'Delete file'"
               @mousedown="_ => onDeleteClick(data.uid)"
            ></i>
          </template>
        </Column>
        <Column header="Download" bodyClass="center">
          <template #body="{ data }">
            <i class="pi pi-download"
               v-tooltip.left="'Download file'"
               @mousedown="_ => onDownloadClick(data.uid, data.fileName)"
            ></i>
          </template>
        </Column>
        <Column header="Upload date" bodyClass="text-left">
          <template #body="{ data }">
            <div style="font-size: 0.9em">
              {{ formatDate(data.uploadDate) }}
            </div>
          </template>
        </Column>
      </DataTable>
      <!--      upload field-->
      <div>
        <label for="upload">
          <input
            type="file"
            id="upload"
            @change="onFileChanged($event)"
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
import { format } from 'date-fns';
import AttachedFilesProvider from '@/dataProviders/attachedFilesProvider';
import FileInfo from '@/models/fileInfo';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Image from 'primevue/image';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
    Checkbox,
    FileUpload,
    DataTable,
    Column,
    ColumnGroup,
    Row,
    Image,
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
  filesList: FileInfo[] = [];

  mounted(): void {
    this.update();
  }

  get dataTableStyle(): object {
    return {
      height: '250px',
    };
  }

  async update(): Promise<void> {
    const result = await this.provider.getFilesList(
      this.metaObjectKindUid,
      this.metaObjectUid,
      this.objectUid,
    );

    this.filesList = result.data;
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

  async onDeleteClick(fileUid: string): Promise<void> {
    console.log(`onDeleteClick: ${fileUid}`);
    const result = await this.provider.deleteFile(this.metaObjectKindUid, fileUid);
    if (result) {
      this.toastHelper.success('File deleted!');
      await this.update();
    } else {
      this.toastHelper.error('Error delete file');
    }
  }

  async onDownloadClick(fileUid: string, fileName: string): Promise<void> {
    await this.provider.downloadFile(this.metaObjectKindUid, fileUid, fileName);
  }

  formatDate(date: Date): string {
    return format(date, 'dd.MM.yyyy HH:mm');
  }

  onErrorImage(): void {
    console.log('onErrorImage');
  }
}
</script>
