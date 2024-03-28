<template>
  <div>
    <Tree
      v-model:selectionKeys="selectedKey"
      :value="treeNodes"
      :metaKeySelection="false"
      selectionMode="single"
      @nodeSelect="onNodeSelect"
    >
    </Tree>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import Tree from 'primevue/tree';
import { useToast } from 'primevue/usetoast';
import MetadataTreeProvider from '@/dataProviders/metadataTreeProvider';
import MetadataTreeNode from '@/models/metadataTreeNode';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Tree,
  },
})
export default class MetadataTreeComponent extends Vue {
  dataProvider = new MetadataTreeProvider();
  toastHelper = new ToastHelper(useToast());
  treeNodes:MetadataTreeNode[] = [];
  selectedKey = ref(null);
  router = useRouter();

  async mounted(): Promise<void> {
    const response = await this.dataProvider.getMetadataTree();
    if (response.isOK) {
      this.treeNodes = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  onNodeSelect(node: MetadataTreeNode): void {
    if (node.label === 'DataTypes') {
      this.router.push({ name: 'datatypes' });
    }
  }
}
</script>
