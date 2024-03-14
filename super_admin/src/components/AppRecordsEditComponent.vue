<template>
    <div>
        <Dialog
        :visible="true"
        :style="{width: '25rem'}"
        :draggable="false"
        :header="headerText"
        class="pb-0"
        modal
        @update:visible="updateVisible"
      >
        <div>
          <div class="grid">
            <div class="col">
              <span id="appRecordId">Id</span>
              <InputText
                v-model="appRecord.id"
                size="small"
                aria-labelledby="appRecordId"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="appRecordTitle">Title</span>
              <InputText
                v-model="appRecord.title"
                size="small"
                aria-labelledby="appRecordTitle"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="appRecordMemo">Memo</span>
              <Textarea
                v-model="appRecord.memo"
                rows="5"
                aria-labelledby="appRecordMemo"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <div class="flex justify-content-end gap-2">
                <Button
                  label="Cancel"
                  severity="secondary"
                  size="small"
                  outlined
                  @click="cancelClick"
                />
                <Button label="Save" size="small" @click="saveClick" />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AppRecord from '@/models/appRecord';

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
  },
  props: {
    appRecord: {
      type: AppRecord,
      required: true,
    },
  },
  emits: {
    cancel: null,
    save: null,
  },
})
export default class AppRecordsEditView extends Vue {
  appRecord!: AppRecord;
  headerText = 'AppRecord';

  mounted(): void {
    if (!this.appRecord.id) {
      this.headerText += ' (New)';
    }
  }

  cancelClick(): void {
    this.$emit('cancel');
  }

  saveClick(): void {
    this.$emit('save', this.appRecord);
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>

</style>
