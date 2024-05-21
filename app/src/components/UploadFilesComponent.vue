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
        <Column header="File name" bodyClass="text-left">
          <template #body="{ data }">
            <div style="font-size: 0.9em">
              {{ data.fileName }}
            </div>
          </template>
        </Column>
        <Column header="Upload date" bodyClass="text-left" style="width: 180px">
          <template #body="{ data }">
            <div style="font-size: 0.9em">
              {{ formatDate(data.uploadDate) }}
            </div>
          </template>
        </Column>
        <Column header="Actions" bodyClass="text-right" style="width: 180px">
          <template #body="{ data }">
            <div class="grid">
              <div class="col-3">
                <Button icon="pi pi-eye"
                        v-if="data.isImage === true"
                        severity="secondary"
                        text
                        rounded
                        tooltip="'View file'"
                        @click="_ => onViewClick(data.uid)" />
              </div>
              <div class="col-3">
                <Button icon="pi pi-download"
                        severity="secondary"
                        text
                        rounded
                        tooltip="'Download file'"
                        @click="_ => onDownloadClick(data.uid, data.fileName)" />
              </div>
              <div class="col-3">
                <Button icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        tooltip="'Delete file'"
                        @click="_ => onDeleteClick(data.uid)" />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <!--      upload field-->
      <div>
        <FileUpload mode="basic"
                    name="demo[]"
                    url="/api/v1/AttachedFiles/Upload"
                    :auto="true"
                    multiple
                    @before-send="beforeFileSend"
                    @upload="onUpload"
        />
      </div>

      <ShowImageComponent v-if="isShowImage"
                          :image-base64="selectedImageBase64"
                          @close="isShowImage = false"
      />

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
import FileUpload, { FileUploadBeforeSendEvent, FileUploadUploadEvent } from 'primevue/fileupload';
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
import ShowImageComponent from '@/components/ShowImageComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ShowImageComponent,
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
  isShowImage = false;
  selectedImageBase64!: string;

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

  beforeFileSend(event: FileUploadBeforeSendEvent): void {
    event.formData.set('metaObjectKindUid', this.metaObjectKindUid);
    event.formData.set('metaObjectUid', this.metaObjectUid);
    event.formData.set('objectUid', this.objectUid);
  }

  async onUpload(event: FileUploadUploadEvent): Promise<void> {
    this.toastHelper.success('Success upload!');
    await this.update();
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

  async onViewClick(fileUid: string): Promise<void> {
    this.selectedImageBase64 = await this.provider.getImageBase64(fileUid);
    this.isShowImage = true;
  }

  async onDownloadClick(fileUid: string, fileName: string): Promise<void> {
    await this.provider.downloadFile(this.metaObjectKindUid, fileUid, fileName);
  }

  formatDate(date: Date): string {
    return format(date, 'dd.MM.yyyy HH:mm');
  }
}
</script>
