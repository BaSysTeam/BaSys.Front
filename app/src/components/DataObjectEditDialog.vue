<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Ref } from 'vue-property-decorator';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataObjectEditComponent from '@/components/DataObjectEditComponent.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Options({
  components: {
    Dialog,
    Button,
    DataObjectEditComponent,
    ViewTitleComponent,
  },
})
export default class DataObjectEditDialog extends Vue {
  // Regime of editing: edit | copy | add.
  @Prop({ required: true, type: String, default: 'edit' })
  regime!: string;

  // Name of metadata object kind.
  @Prop({ required: true, type: String })
  kind!: string;

  // Name of metadata object.
  @Prop({ required: true, type: String })
  name!: string;

  // Identifier of editing item.
  @Prop({ type: String, default: '' })
  uid!: string;

  // Identifier of source item (item which was copied).
  @Prop({ type: String, default: '' })
  copyUid!: string;

  // Title of the dialog.
  @Prop({ type: String, default: '' })
  title!: string;

  isModified = false;
  isWaiting = false;
  closeAfterSave = false;

  @Ref()
  editComponentRef!: any;

  onCloseClick(): void {
    this.$emit('close');
  }

  onSaveClick(): void {
    console.log('onSaveClick');
    if (this.editComponentRef) {
      console.log('It is edit component');
      this.editComponentRef.triggerSaveClick();
    }
  }

  onSaveAndCloseClick(): void {
    console.log('onSaveCloseClick');
    if (this.editComponentRef) {
      console.log('It is edit component');
      this.closeAfterSave = true;
      this.editComponentRef.triggerSaveClick();
    }
  }

  onIsModifiedChanged(args: boolean): void {
    this.isModified = args;
  }

  onIsWaitingChanged(args: boolean): void {
    this.isWaiting = args;
  }

  onSaved(args: string): void {
    console.log('saved', args);
    this.$emit('saved', args);
    if (args && this.closeAfterSave) {
      this.$emit('close');
    }
    this.closeAfterSave = false;
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }
}
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
                                 :copyUid="copyUid"
                                 :regime="regime"
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
            @click="onSaveAndCloseClick"
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
