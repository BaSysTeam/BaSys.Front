<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '450px'}"
      :draggable="false"
      header="Confirm"
      modal
      @update:visible="updateVisible"
    >
      <div class="w-full gap-3 border-bottom-1 surface-border">
        <div class="grid">
          <div class="col flex align-items-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>A new database Uid will be generated</span>
          </div>
        </div>
        <div class="grid">
          <div class="col-1">
            <Checkbox v-model="checked" :binary="true" />
          </div>
          <div class="col">
            <b>{{ $t('generateUidConfirm') }}</b>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          size="small"
          severity="secondary"
          @click="$emit('reject')"
          outlined
        />
        <Button
          label="Generate"
          size="small"
          :disabled="!checked"
          @click="$emit('accept')"
        />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';

@Options({
  components: {
    Dialog,
    Button,
    Checkbox,
  },
  emits: {
    reject: null,
    accept: null,
  },
})
export default class GenerateUidDialogComponent extends Vue {
  checked = false;

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('reject');
    }
  }
}
</script>
