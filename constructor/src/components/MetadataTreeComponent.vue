<template>
  <div :style="{'display': isMenuMinimized ? 'none' : ''}">
    <div class="grid">
      <div class="col flex justify-content-center flex-wrap">
        <span class="p-buttonset mt-3">
          <Button
            icon="pi pi-plus"
            size="small"
            severity="primary"
            outlined
            label="M"
            v-tooltip="'Add metadata object'"
            @click="addMetadataObject"
          />
          <Button
            icon="pi pi-plus"
            size="small"
            severity="primary"
            outlined
            label="G"
            v-tooltip="'Add metadata group'"
            :disabled="isAddGroupBtnDisabled"
            @click="isGroupCreateDialogVisible = true"
          />
          <Button
            icon="pi pi-times"
            size="small"
            severity="danger"
            outlined
            v-tooltip="'Delete'"
            :disabled="isDeleteBtnDisabled"
            @click="showDeleteConfirm"
          />
        </span>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <Tree
          v-model:selectionKeys="selectedKey"
          :value="treeNodes"
          :metaKeySelection="false"
          selectionMode="single"
          @nodeSelect="onNodeSelect"
          @node-expand="onNodeExpand"
          loadingMode="icon"
          class="p-0"
          style="max-width: 199px;"
        >
        </Tree>
      </div>
    </div>
  </div>
  <ConfirmDialog :draggable="false"></ConfirmDialog>
  <MetadataTreeNodeCreateComponent
    v-if="isGroupCreateDialogVisible"
    :parentKey="selectedNode.key"
    @cancel="isGroupCreateDialogVisible = false"
    @groupAdded="onGroupAdded"
  />
</template>

<script lang="ts">
import { ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Tree from 'primevue/tree';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import MetadataTreeNode from '@/models/metadataTreeNode';
import MetadataTreeNodeCreateComponent from '@/components/MetadataTreeNodeCreateComponent.vue';
import MetadataTreeNodesProvider from '@/dataProviders/metadataTreeNodesProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    MetadataTreeNodeCreateComponent,
    Tree,
    Button,
    ConfirmDialog,
  },
  props: {
    isMenuMinimized: Boolean,
  },
})
export default class MetadataTreeComponent extends Vue {
  isMenuMinimized!:boolean;
  isGroupCreateDialogVisible = false;
  dataProvider = new MetadataTreeNodesProvider();
  toastHelper = new ToastHelper(useToast());
  treeNodes:MetadataTreeNode[] = [];
  selectedKey = ref(null);
  selectedNode:MetadataTreeNode = {};
  router = useRouter();
  confirm = useConfirm();

  get isSelectedNodeEmpty(): boolean {
    return !this.selectedNode || Object.keys(this.selectedNode).length === 0;
  }

  get isDeleteBtnDisabled(): boolean {
    if (this.isSelectedNodeEmpty || this.selectedNode.isStandard || !this.selectedNode.leaf) {
      return true;
    }

    return false;
  }

  get isAddGroupBtnDisabled(): boolean {
    if (this.isSelectedNodeEmpty
    || (this.selectedNode.label?.toLowerCase() !== 'metadata' && this.selectedNode.isStandard)) {
      return true;
    }

    return false;
  }

  async mounted(): Promise<void> {
    const response = await this.dataProvider.getStandard();
    if (response.isOK) {
      this.treeNodes = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  onNodeSelect(node: MetadataTreeNode): void {
    this.selectedNode = node;

    if (!node.isGroup) {
      if (node.label?.toLocaleLowerCase() === 'datatypes') {
        this.router.push({ name: 'datatypes' });
        return;
      }
      if (node.label?.toLocaleLowerCase() === 'metadatakinds') {
        this.router.push({ name: 'metadata-kinds' });
      }
    }
  }

  async onNodeExpand(node: MetadataTreeNode): Promise<void> {
    if (!node.children || node.children.length === 0) {
      node.loading = true;
      await this.getChildren(node);
    }
  }

  async getChildren(node: MetadataTreeNode): Promise<void> {
    if (!node.key) {
      return;
    }

    const response = await this.dataProvider.getChildren(node.key);
    if (response.isOK) {
      node.children = response.data;
      node.loading = false;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  addMetadataObject(): void {
    console.log('addMetadataObject');
  }

  async onGroupAdded(): Promise<void> {
    this.isGroupCreateDialogVisible = false;
    await this.getChildren(this.selectedNode);
  }

  async delete(): Promise<void> {
    if (!this.selectedNode.key) {
      return;
    }

    const response = await this.dataProvider.delete(this.selectedNode.key);
    if (response.isOK) {
      const parentNode = this.findParentNode(this.treeNodes, this.selectedNode.key);
      if (parentNode === null) {
        return;
      }
      if (!parentNode.children) {
        return;
      }

      const index = parentNode.children?.indexOf(this.selectedNode);
      if (index > -1) {
        parentNode.children?.splice(index, 1);
        if (parentNode.children.length === 0) {
          parentNode.leaf = true;
        }
      }

      this.selectedNode = {};
      this.toastHelper.success(response.message);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  showDeleteConfirm(): void {
    if (!this.selectedNode) {
      return;
    }

    this.confirm.require({
      message: 'Are you sure you want to delete selected item?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      acceptClass: 'p-button-danger',
      accept: () => {
        this.delete();
      },
    });
  }

  findParentNode(nodes: MetadataTreeNode[], key: string): MetadataTreeNode | null {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nodes.length; i++) {
      const { children } = nodes[i];
      if (children) {
        const result = children.find((x) => x.key === key);
        if (result) {
          return nodes[i];
        }

        const parentNode = this.findParentNode(children, key);
        if (parentNode) {
          return parentNode;
        }
      }
    }

    return null;
  }
}
</script>
