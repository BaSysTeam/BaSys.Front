<template>
    <div>
        <Dialog
            :visible="true"
            :style="{width: '450px'}"
            :closable="false"
            :draggable="false"
            header="Confirm"
            class="pb-0"
            modal
        >
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>{{ confirmText }}</span>
            </div>
            <template #footer>
                <Button
                  label="No"
                  icon="pi pi-times"
                  size="small"
                  severity="secondary"
                  @click="$emit('noClick')"
                  outlined
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  size="small"
                  @click="$emit('yesClick')"
                />
            </template>
      </Dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

@Options({
  components: {
    Dialog,
    Button,
  },
  props: {
    confirmText: String,
  },
  emits: {
    noClick: null,
    yesClick: null,
  },
})
export default class ConfirmationDialog extends Vue {
  confirmText!: string;
}
</script>

<style scoped>

</style>
