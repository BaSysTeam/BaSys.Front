<script lang="ts">
import {
  Vue, Component, toNative, Prop,
} from 'vue-facing-decorator';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataObjectEditComponent from '@/components/DataObjectEditComponent.vue';

@Component({
  components: {
    Dialog,
    Button,
    DataObjectEditComponent,
  },
})
class DataObjectEditDialog extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  kind!: string;

  @Prop({
    required: true,
    type: String,
  })
  name!: string;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  uid!: string;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  copyUid!: string;

  header = 'Data object edit';

  onCloseClick(): void {
    this.$emit('close');
  }

  onSaveCloseClick(): void {
    this.$emit('close');
  }

  onSaveClick(): void {
    this.$emit('close');
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }
}

export default toNative(DataObjectEditDialog);
</script>

<template>
  <div>
    <Dialog
      modal
      class="pb-0"
      position="top"
      :header="header"
      :visible="true"
      :draggable="false"
      :style="{width: '50rem'}"
      @update:visible="updateVisible"
    >

      <div>
        <DataObjectEditComponent></DataObjectEditComponent>
      </div>
      <template #footer>
        <div>
          <Button
            class="mr-1"
            :label="$t('close')"
            severity="secondary"
            size="small"
            outlined
            icon="pi pi-times"
            @click="onCloseClick"
          />
          <Button
            class="mr-1"
            :label="$t('saveAndClose')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveCloseClick"
          />
          <Button
            :label="$t('save')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveClick"
          />
        </div>
      </template>
    </Dialog>
  </div>

</template>

<style scoped>

</style>
