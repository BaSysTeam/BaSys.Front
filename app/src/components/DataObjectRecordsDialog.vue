<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({});

// Data
const title = ref<string>(t('records'));

// Emit
const emit = defineEmits(
  {
    close: () => true,
  },
);

// Methods
function onCloseClick(): void {
  emit('close');
}

// Event handlers
function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

// Life cycle hooks
</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    maximizable
    :header="title"
    :visible="true"
    :draggable="false"
    :style="{width: '50rem'}"
    @update:visible="updateVisible">
    <div>
      Data object records
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

    </template>
  </Dialog>
</template>

<style scoped>

</style>
