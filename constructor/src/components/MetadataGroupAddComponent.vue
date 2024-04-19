<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '25rem'}"
      :draggable="false"
      header="Add group"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <div class="grid">
          <div class="col">
            <span id="metadataGroupTitle">Title</span>
            <InputText
              v-model="model.title"
              size="small"
              aria-labelledby="metadataGroupTitle"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span id="metadataGroupIconClass">Icon class</span>
            <InputText
              v-model="model.iconClass"
              size="small"
              aria-labelledby="metadataGroupIconClass"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span id="metadataGroupMemo">Memo</span>
            <Textarea
              v-model="model.memo"
              rows="5"
              aria-labelledby="metadataGroupMemo"
              class="w-full"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          size="small"
          outlined
          @click="$emit('cancel')"
        />
        <Button label="Add" size="small" @click="add" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import MetadataGroup from '@/models/metadataGroup';
import MetadataTreeProvider from '@/dataProviders/metadataTreeProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  props: {
    parentUid: {
      type: String,
      required: true,
    },
  },
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
  },
  emits: {
    cancel: null,
    groupAdded: null,
  },
})
export default class MetadataGroupAddComponent extends Vue {
  parentUid!: string;
  model = new MetadataGroup();
  dataProvider = new MetadataTreeProvider();
  toastHelper = new ToastHelper(useToast());

  mounted(): void {
    this.model.parentUid = this.parentUid;
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  async add(): Promise<void> {
    const response = await this.dataProvider.addMetadataGroup(this.model);
    if (response.isOK) {
      this.$emit('groupAdded');
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
}
</script>
