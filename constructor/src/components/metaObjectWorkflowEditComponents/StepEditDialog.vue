<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import SleepStepEdit from '@/components/metaObjectWorkflowEditComponents/SleepStepEdit.vue';
import MessageStepEdit from '@/components/metaObjectWorkflowEditComponents/MessageStepEdit.vue';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  stepSettings: { type: Object, required: true },
  workflowSettings: { type: Object as PropType<WorkflowSettings>, required: true },
});

// Data

// Emit
const emit = defineEmits(
  {
    close: (value: string | null) => true,
  },
);

// Methods

// Event handlers
function onCloseClick(): void {
  emit('close', null);
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close', null);
  }
}

// Life cycle hooks
</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    :header="stepSettings.title"
    :visible="true"
    :draggable="false"
    :maximizable="true"
    :style="{width: '50rem'}"
    @update:visible="updateVisible">
    <div>
     <SleepStepEdit v-if="stepSettings.kindName == 'sleep'"
                    :step-settings="stepSettings"
                    :workflow-settings="workflowSettings"></SleepStepEdit>
     <MessageStepEdit v-if="stepSettings.kindName == 'message'"
                      :step-settings="stepSettings"
                      :workflow-settings="workflowSettings"></MessageStepEdit>
    </div>
    <template #footer>
      <Button
        class="mr-1"
        label="OK"
        severity="primary"
        size="small"
        outlined
        @click="onCloseClick"
      />
    </template>
  </Dialog>
</template>

<style scoped>

</style>
