<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '25rem'}"
      :draggable="false"
      :header="header"
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
        <Button label="Ok" size="small" @click="onOkClicked" />
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
    regime: {
      type: String,
      required: true,
    },
    node: {
      type: MetadataTreeNode,
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
    accept: null,
  },
})
export default class MetadataTreeNodeCreateComponent extends Vue {
  header = '';
  regime!: string;
  model = new MetadataTreeNode(null);
  node!: MetadataTreeNode;
  dataProvider = new MetadataTreeNodesProvider()
  toastHelper = new ToastHelper(useToast());

  mounted(): void {
    if (this.regime === 'create') {
      this.header = 'Add group';
      this.model.parentKey = this.node.isGroup ? this.node.key : this.node.parentKey;
      this.model.icon = 'pi pi-folder';
      this.model.isGroup = true;
    } else {
      this.header = 'Edit group';
      this.model = this.node;
    }
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  onOkClicked(): void {
    if (this.regime === 'create') {
      this.add();
    } else {
      this.edit();
    }
  }

  async add(): Promise<void> {
    const response = await this.dataProvider.create(this.model);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.$emit('accept');
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async edit(): Promise<void> {
    const response = await this.dataProvider.update(this.model);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.$emit('accept');
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
