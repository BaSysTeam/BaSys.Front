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
            <span id="metadataLabel" class="bs-required">Label</span>
            <InputText
              v-model="model.label"
              size="small"
              aria-labelledby="metadataLabel"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span id="metadataIcon">Icon class</span>
            <InputText
              v-model="model.icon"
              size="small"
              aria-labelledby="metadataIconClass"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span id="metadataMemo">Memo</span>
            <Textarea
              v-model="model.memo"
              rows="5"
              aria-labelledby="metadataMemo"
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
import MetadataTreeNode from '@/models/metadataTreeNode';
import MetadataTreeNodesProvider from '@/dataProviders/metadataTreeNodesProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  props: {
    parentKey: {
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
export default class MetadataTreeNodeCreateComponent extends Vue {
  parentKey!: string;
  model = new MetadataTreeNode();
  dataProvider = new MetadataTreeNodesProvider()
  toastHelper = new ToastHelper(useToast());

  mounted(): void {
    this.model.parentKey = this.parentKey;
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  async add(): Promise<void> {
    this.model.isGroup = true;

    const response = await this.dataProvider.create(this.model);
    if (response.isOK) {
      this.$emit('groupAdded');
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
}
</script>

<style>
  .bs-required:after {
    content: "*";
    color: red;
    font-size: 12pt;
}
</style>
