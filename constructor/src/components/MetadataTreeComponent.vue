<template>
  <div :style="{'display': isMenuMinimized ? 'none' : ''}">
    <div class="grid">
      <div class="col flex justify-content-center flex-wrap">
        <div class="card mt-1">
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
        >
        </Tree>
      </div>
    </div>
  </div>
  <ConfirmDialog :draggable="false"></ConfirmDialog>
  <MetadataTreeNodeCreateComponent
    v-if="isGroupCreateDialogVisible"
    :parentKey="selectedNode.isGroup ? selectedNode.key : selectedNode.parentKey"
    @cancel="isGroupCreateDialogVisible = false"
    @groupAdded="onGroupAdded"
  />
  <MetaObjectCreateComponent
    v-if="isMetaObjectCreateDialogVisible"
    :metadata-kind-title="selectedMetadataKindSettings.title"
    :metadata-kind-uid="selectedMetadataKindSettings.uid"
    @cancel="isMetaObjectCreateDialogVisible = false"
    @create="onMetaObjectCreateDialogClosed"
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
import MetaObjectCreateDto from '@/models/metaObjectCreateDto';
import MetadataTreeNodeCreateComponent from '@/components/MetadataTreeNodeCreateComponent.vue';
import MetadataTreeNodesProvider from '@/dataProviders/metadataTreeNodesProvider';
import MetadataKindsProvider from '@/dataProviders/metadataKindsProvider';
import MetaObject from '@/models/metaObject';
import MetadataKindSettings from '@/models/metadataKindSettings';
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
  selectedMetadataKindSettings:MetadataKindSettings = new MetadataKindSettings();
  router = useRouter();
  confirm = useConfirm();
  metadataKindMenuItems:object[] = [];

  items = [
    {
      label: 'item',
      icon: 'pi pi-plus',
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

  get isUnavailableForAddItem(): boolean {
    if (this.isSelectedNodeEmpty
      || (this.selectedNode.key !== '60738680-dafd-42c0-8923-585fc7985176' && this.selectedNode.isStandard)) {
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
    const response = await this.metadataKindsProvider.getSettingsCollection();
    if (response.isOK) {
      this.metadataKindMenuItems = response.data.map((x) => (
        {
          label: x.title,
          icon: x.iconClass,
          command: () => this.showElementCreateDialog(x),
        }));

      this.items[0].items = this.metadataKindMenuItems;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  onNodeSelect(node: MetadataTreeNode): void {
    this.selectedNode = node;

    if (!node.isGroup) {
      if (node.key === '416c4b6c-48f7-426c-aa5a-774717c9984e') {
        this.router.push({ name: 'datatypes' });
        return;
      }
      if (node.key === 'cb930422-e50a-4c14-942f-b45df8c23de0') {
        this.router.push({ name: 'metadata-kinds' });
        return;
      }
      if (node.metaObjectKindName && node.metaObjectName) {
        this.router.push({
          name: 'meta-object-edit',
          params: {
            kind: node.metaObjectKindName,
            name: node.metaObjectName,
          },
        });
      }
    }
  }

  async onNodeExpand(node: MetadataTreeNode): Promise<void> {
    if (!node.children || node.children.length === 0) {
      await this.getChildren(node);
    }
  }

  async getChildren(arg: MetadataTreeNode): Promise<void> {
    let node = arg;
    if (!node.key) {
      return;
    }

    if (!node.isGroup) {
      const parentNode = this.findParentNode(this.treeNodes, node.key);
      if (parentNode) {
        node = parentNode;
      }
    }

    node.loading = true;
    if (!node.key) {
      return;
    }
    const response = await this.dataProvider.getChildren(node.key);
    if (response.isOK) {
      node.children = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    node.loading = false;
  }

  async onMetaObjectCreateDialogClosed(args: MetaObject): Promise<void> {
    this.isMetaObjectCreateDialogVisible = false;
    const dto = new MetaObjectCreateDto(args);

    if (this.isSelectedNodeEmpty) {
      const firstNode = this.treeNodes[0];
      dto.parentUid = firstNode.key;
    } else if (this.selectedNode.isGroup) {
      dto.parentUid = this.selectedNode.key;
    } else {
      dto.parentUid = this.selectedNode.parentKey;
    }
    console.log('MetaObjectCreateDto', dto);

    const response = await this.dataProvider.createMetaObject(dto);
    if (response.isOK) {
      await this.getChildren(this.selectedNode);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async onGroupAdded(): Promise<void> {
    this.isGroupCreateDialogVisible = false;
    await this.getChildren(this.selectedNode);
  }

  async delete(): Promise<void> {
    if (!this.selectedNode.key) {
      return;
    }

    const response = await this.dataProvider.delete(this.selectedNode);
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

  showElementCreateDialog(arg: MetadataKindSettings): void {
    if (this.isUnavailableForAddItem) {
      return;
    }

    this.selectedMetadataKindSettings = arg;
    this.isMetaObjectCreateDialogVisible = true;
  }

  showGroupCreateDialog(): void {
    if (this.isUnavailableForAddItem) {
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
