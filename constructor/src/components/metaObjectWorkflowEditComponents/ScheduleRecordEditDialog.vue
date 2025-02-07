<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import WorkflowScheduleRecord from '@/models/workflowScheduleRecord';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import { Guid } from 'guid-typescript';
import ViewTitleComponent from '../../../../shared/src/components/ViewTitleComponent.vue';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  record: { type: Object as PropType<WorkflowScheduleRecord>, required: true },
  regime: { type: String, required: true },
});

// Data
const isModified = ref(false);
const record = ref<WorkflowScheduleRecord>(new WorkflowScheduleRecord(null));

// Emit
const emit = defineEmits(
  {
    close: (data:any) => true,
  },
);

// Methods

// Event handlers
function onCloseClick(): void {
  emit('close', null);
}

function onSaveClick(): void {
  const payload = {
    regime: props.regime,
    isModified: isModified.value,
    record: record.value,
  };
  emit('close', payload);
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close', null);
  }
}

function onChange(): void {
  isModified.value = true;
}

// Life cycle hooks
onMounted(() => {
  switch (props.regime) {
    case 'edit':
      record.value = new WorkflowScheduleRecord(props.record);
      break;
    case 'copy':
      record.value = new WorkflowScheduleRecord(props.record);
      isModified.value = true;
      record.value.uid = Guid.create().toString();
      break;
    case 'add':
      record.value = new WorkflowScheduleRecord(null);
      isModified.value = true;
      break;
    default:
      break;
  }
});

</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    :header="$t('scheduleRecord')"
    :visible="true"
    :draggable="false"
    :style="{width: '40rem'}"
    @update:visible="updateVisible">
    <template #header>
      <ViewTitleComponent :title="$t('scheduleRecord')"
                          :is-modified="isModified"></ViewTitleComponent>

    </template>
    <div>
      <!--Is active-->
      <FieldGridComponent :title="$t('isActive')"
                          label-for="fld-is-active">
        <InputSwitch id="fld-is-active"
                     v-model="record.isActive"
                     @change="onChange"></InputSwitch>
      </FieldGridComponent>

      <!--CRON-->
      <FieldGridComponent title="CRON" label-for="fld-cron" :required="true">
        <InputText id="fld-cron"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="record.cronExpression"
                   @change="onChange"></InputText>
      </FieldGridComponent>

      <!--Memo-->
      <FieldGridComponent :title="$t('memo')" label-for="fld-memo">
        <InputText id="fld-memo"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="record.memo"
                   @change="onChange"></InputText>
      </FieldGridComponent>

    </div>
    <template #footer>
      <Button
        class="mr-1"
        :label="$t('cancel')"
        severity="secondary"
        size="small"
        outlined
        @click="onCloseClick"
      />
      <Button
        class="mr-1"
        :label="$t('save')"
        severity="primary"
        size="small"
        outlined
        @click="onSaveClick"
      />
    </template>
  </Dialog>
</template>

<style scoped>

</style>
