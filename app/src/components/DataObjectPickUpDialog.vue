<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({});

// Emit
const emit = defineEmits(
  {
    close: () => true,
    save: (value: string) => true,
  },
);

// Data
const formTitle = ref<string>('Pick up');

// Methods
function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

// Event handlers
function onCloseClick(): void {
  emit('close');
}

// Life cycle hooks
</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    maximizable
    :header="formTitle"
    :visible="true"
    :draggable="false"
    :style="{width: '50rem'}"
    @update:visible="updateVisible">
    <div>
     Pick up
    </div>
    <template #footer>
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
        :label="$t('save')"
        severity="primary"
        size="small"
        outlined
        icon="pi pi-save"
        @click="onCloseClick"
      />
    </template>
  </Dialog>
</template>

<style scoped>

</style>
