<template>
  <div :style="{'display': isMenuMinimized ? 'none' : ''}">
    <div class="grid">
      <div class="col flex justify-content-center flex-wrap">
        <div class="card mt-2">
          <Menubar :model="items">
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex align-items-center" v-bind="props.action">
                    <span :class="item.icon" v-tooltip="item['tooltipMsg']" />
                    <span class="ml-2">{{ item.label }}</span>
                    <i
                      v-if="hasSubmenu"
                      :class="[
                        'pi pi-angle-down',
                        { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"
                    ></i>
                </a>
            </template>
          </Menubar>
        </div>
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
  <MetaObjectCreateComponent
    v-if="isMetaObjectCreateDialogVisible"
    :metadata-kind-title="selectedMetadataKind.title"
    :metadata-kind-uid="selectedMetadataKind.uid"
    @cancel="isMetaObjectCreateDialogVisible = false"
    @create="onMetaObjectCreate"
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
import Menubar from 'primevue/menubar';
import EventEmitter from '@/utils/eventEmitter';
import MetadataTreeNode from '@/models/metadataTreeNode';
import MetadataTreeNodeCreateComponent from '@/components/MetadataTreeNodeCreateComponent.vue';
import MetadataTreeNodesProvider from '@/dataProviders/metadataTreeNodesProvider';
import MetadataKindsProvider from '@/dataProviders/metadataKindsProvider';
import MetadataKind from '@/models/metadataKind';
import MetaObject from '@/models/metaObject';
import MetaObjectCreateComponent from './MetaObjectCreateComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    MetadataTreeNodeCreateComponent,
    MetaObjectCreateComponent,
    Tree,
    Button,
    ConfirmDialog,
    Menubar,
  },
  props: {
    isMenuMinimized: Boolean,
  },
})
export default class MetadataTreeComponent extends Vue {
  isMenuMinimized!:boolean;
  isGroupCreateDialogVisible = false;
  isMetaObjectCreateDialogVisible = false;
  dataProvider = new MetadataTreeNodesProvider();
  metadataKindsProvider = new MetadataKindsProvider();
  toastHelper = new ToastHelper(useToast());
  treeNodes:MetadataTreeNode[] = [];
  selectedKey = ref(null);
  selectedNode:MetadataTreeNode = {};
  selectedMetadataKind:MetadataKind = new MetadataKind();
  router = useRouter();
  confirm = useConfirm();
  metadataKindMenuItems:object[] = [];

  items = [
    {
      label: 'Add metadata',
      items: this.metadataKindMenuItems,
    },
    {
      icon: 'pi pi-plus',
      command: () => this.showGroupCreateDialog(),
      tooltipMsg: 'Add metadata group',
    },
    {
      icon: 'pi pi-times',
      command: () => this.showDeleteConfirm(),
      tooltipMsg: 'Remove metadata item',
    },
  ]

  get isSelectedNodeEmpty(): boolean {
    return !this.selectedNode || Object.keys(this.selectedNode).length === 0;
  }

  get isUnavailableForDelete(): boolean {
    if (this.isSelectedNodeEmpty || this.selectedNode.isStandard || !this.selectedNode.leaf) {
      return true;
    }

    return false;
  }

  get isUnavailableForAddGroup(): boolean {
    if (this.isSelectedNodeEmpty
    || (this.selectedNode.label?.toLowerCase() !== 'metadata' && this.selectedNode.isStandard)) {
      return true;
    }

    return false;
  }

  async mounted(): Promise<void> {
    await this.updateTreeNodes();
    await this.updateMetadataKindsMenuItems();

    EventEmitter.on('metadata-kinds-changed', this.onMetadataKindsChanged);
  }

  unmounted(): void {
    EventEmitter.off('metadata-kinds-changed', this.onMetadataKindsChanged);
  }

  onMetadataKindsChanged(): void {
    this.updateMetadataKindsMenuItems();
  }

  async updateTreeNodes(): Promise<void> {
    const response = await this.dataProvider.getStandard();
    if (response.isOK) {
      this.treeNodes = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async updateMetadataKindsMenuItems(): Promise<void> {
    const response = await this.metadataKindsProvider.getCollection();
    if (response.isOK) {
      this.metadataKindMenuItems = response.data.map((x) => (
        {
          label: x.title,
          // command: () => this.router.push({ name: 'metadata-instance' }),
          command: () => this.onMetadataKindMenuItemClick(x),
        }));

      this.items[0].items = this.metadataKindMenuItems;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  onMetadataKindMenuItemClick(arg: MetadataKind): void {
    this.selectedMetadataKind = arg;
    this.isMetaObjectCreateDialogVisible = true;
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

  onMetaObjectCreate(args: MetaObject):void {
    this.isMetaObjectCreateDialogVisible = false;
    console.log('onMetaObjectCreate', args);
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

  showGroupCreateDialog(): void {
    if (this.isUnavailableForAddGroup) {
      return;
    }

    this.isGroupCreateDialogVisible = true;
  }

  showDeleteConfirm(): void {
    if (this.isUnavailableForDelete) {
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
