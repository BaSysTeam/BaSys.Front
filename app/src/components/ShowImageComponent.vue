<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '60rem'}"
      :draggable="false"
      class="pb-0"
      header=" "
      modal
      @update:visible="updateVisible"
    >
      <div class="card flex justify-content-center" >
        <img :src="imageBase64" alt="Image" style="max-width: 850px" />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { Options, Vue } from 'vue-class-component';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import FileUpload from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Image from 'primevue/image';

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
    imageBase64: {
      type: String,
      required: true,
    },
  },
})

export default class ShowImageComponent extends Vue {
  imageBase64!: string;

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }
}
</script>
