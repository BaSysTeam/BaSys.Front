<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '25rem'}"
      :draggable="false"
      header="Move to group"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <TreeSelect v-model="selectedValue" :options="nodes" class="w-full"/>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          size="small"
          outlined
          @click="$emit('cancel')"
        />
        <Button label="Move" size="small" @click="onMoveClick" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import TreeSelect from 'primevue/treeselect';
import MetadataTreeNode from '@/models/metadataTreeNode';
import MetadataTreeNodesProvider from '@/dataProviders/metadataTreeNodesProvider';
import { useToast } from 'primevue/usetoast';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Dialog,
    Button,
    TreeSelect,
  },
  emits: {
    cancel: null,
    nodeMoved: null,
  },
  props: {
    movedNode: {
      type: MetadataTreeNode,
      required: true,
    },
  },
})
export default class MoveToGroupComponent extends Vue {
  movedNode!: MetadataTreeNode;
  dataProvider = new MetadataTreeNodesProvider();
  toastHelper = new ToastHelper(useToast());
  nodes:MetadataTreeNode[] = [];
  selectedValue:any = null;

  async mounted(): Promise<void> {
    await this.updateNodes();

    const key = this.movedNode.parentKey;
    if (key) {
      this.selectedValue = { ...this.selectedValue, [key]: true };
    }
  }

  async updateNodes(): Promise<void> {
    const response = await this.dataProvider.getGroups();
    if (response.isOK) {
      this.nodes = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  async onMoveClick(): Promise<void> {
    const value = Object.keys(this.selectedValue)[0];
    if (this.movedNode.parentKey === value) {
      this.$emit('cancel');
    } else if (this.movedNode.key === value) {
      this.$emit('cancel');
    } else {
      this.movedNode.parentKey = value;
      const response = await this.dataProvider.update(this.movedNode);
      if (response.isOK) {
        this.toastHelper.success(response.message);
        this.$emit('nodeMoved', this.movedNode);
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    }
  }
}
</script>
