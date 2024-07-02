<script lang="ts">
import {
  Vue, Component, toNative, Prop,
} from 'vue-facing-decorator';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataObjectEditComponent from '@/components/DataObjectEditComponent.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Component({
  components: {
    Dialog,
    Button,
    DataObjectEditComponent,
    ViewTitleComponent,
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

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  title = '';

  isModified = false;
  isWaiting = false;
  closeAfterSave = false;

  onCloseClick(): void {
    this.$emit('close');
  }

  async onSaveCloseClick(): Promise<void> {
    console.log('onSaveCloseClick');
    // eslint-disable-next-line max-len
    const editComponent = this.$refs.editComponentRef as InstanceType<typeof DataObjectEditComponent>;
    if (editComponent) {
      console.log('It is edit component');
      editComponent.triggerSaveClick();
    }
  }

  onSaveClick(): void {
    console.log('onSaveClick');
    // eslint-disable-next-line max-len
    const editComponent = this.$refs.editComponentRef as InstanceType<typeof DataObjectEditComponent>;
    if (editComponent) {
      console.log('It is edit component');
      editComponent.triggerSaveClick();
    }
  }

  onIsModifiedChanged(args: boolean): void {
    this.isModified = args;
  }

  onIsWaitingChanged(args: boolean): void {
    this.isWaiting = args;
  }

  onSaved(args: boolean): void {
    console.log('saved', args);
    if (args && this.closeAfterSave) {
      console.log('need close');
    }
    this.closeAfterSave = false;
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
      :visible="true"
      :draggable="false"
      :style="{width: '50rem'}"
      @update:visible="updateVisible"
    >
      <template #header>
        <div>
          <ViewTitleComponent :title="title" :is-modified="isModified" :is-waiting="isWaiting"/>
        </div>
      </template>

      <div>
        <DataObjectEditComponent ref="editComponentRef"
                                 :kind="kind"
                                 :name="name"
                                 :uid="uid"
                                 @isModifiedChanged="onIsModifiedChanged"
                                 @isWaitingChanged="onIsWaitingChanged"
                                 @saved="onSaved"></DataObjectEditComponent>
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
