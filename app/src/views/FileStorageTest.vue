<template>
  <div>File storage test</div>
  <UploadFilesComponent
    @close="closeUploadFiles"
    meta-object-kind-uid="e601e899-5aaa-4699-a6bd-7f3d684e29a3"
    meta-object-uid="4730C14E-12C3-4512-90E1-68D325859172"
    object-uid="1"
  >

  </UploadFilesComponent>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import UploadFilesComponent from '@/components/UploadFilesComponent.vue';

@Options({
  components: {
    UploadFilesComponent,
  },
})
export default class FileStorageTest extends Vue {
  async closeUploadFiles(): Promise<void> {
    console.log('closeUploadFiles');
  }
}
</script>
