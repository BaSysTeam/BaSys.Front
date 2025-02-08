<script setup lang="ts">
import {
  ref, onMounted, defineProps, defineEmits, PropType,
} from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import WorkflowScheduleRecord from '@/models/workflowScheduleRecord';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import { Guid } from 'guid-typescript';
import * as CronParser from 'cron-parser';
import ViewTitleComponent from '../../../../shared/src/components/ViewTitleComponent.vue';

// Props
const props = defineProps({
  record: { type: Object as PropType<WorkflowScheduleRecord>, required: true },
  regime: { type: String, required: true },
});

// Data
const isModified = ref(false);
const record = ref<WorkflowScheduleRecord>(new WorkflowScheduleRecord(null));
const nextExecutions = ref<string[]>([]);
const cronParseError = ref<string>('');

// Emit
const emit = defineEmits(
  {
    close: (data:any) => true,
  },
);

// Methods
function calcNextExecutions(): void {
  const intervalCount = 5;
  const options = { utc: true };

  try {
    const interval = CronParser.parseExpression(record.value.cronExpression, options);
    nextExecutions.value = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < intervalCount; i++) {
      nextExecutions.value.push(`${interval.next().toISOString().substring(0, 19)} UTC`);
    }
    cronParseError.value = '';
  } catch (err: any) {
    cronParseError.value = err.toString();
    console.error(err);
  }
}

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

function onCronChange(): void {
  isModified.value = true;
  calcNextExecutions();
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

  calcNextExecutions();
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
                   @change="onCronChange"></InputText>
      </FieldGridComponent>

      <div class="grid">
        <div class="col-4"></div>
        <div class="col-8" v-if="cronParseError">
          <span class="text-red-500">{{cronParseError}}</span>
        </div>
        <div class="col-8" v-else>
          <ul style="margin: 0">
            <li v-for="item in nextExecutions"
                :key="item"
                class="text-primary"
                style="list-style-type: none; margin-bottom: 10px;">{{item}}</li>
          </ul>
        </div>
      </div>

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
      <a href="https://crontab.guru/"
         target="_blank"
         class="text-primary"
         style="margin: 5px auto 5px 0;">{{$t('cronExpressionBuilder')}}</a>
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
