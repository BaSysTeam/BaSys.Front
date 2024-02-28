<template>
    <div>
        <Dialog
        :visible="true"
        :style="{width: '25rem'}"
        :closable="false"
        :draggable="false"
        header="AppRecord"
        class="pb-0"
        modal
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
                <Button label="Save" size="small" outlined @click="saveClick" />
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

    cancelClick() {
      this.$emit('cancel');
    }

    saveClick() {
      this.$emit('save', this.appRecord);
    }
}
</script>

<style scoped>

</style>
