<script setup lang="ts">
import {
  defineProps, defineEmits, PropType,
} from 'vue';
import InputText from 'primevue/inputtext';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import StepEditBase from '@/components/metaObjectWorkflowEditComponents/StepEditBase.vue';
import SleepStepSettings from '../../../../shared/src/models/workflowModel/sleepStepSettings';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';

// Props
const props = defineProps({
  stepSettings: { type: Object as PropType<SleepStepSettings>, required: true },
  workflowSettings: { type: Object as PropType<WorkflowSettings>, required: true },
});

// Emits
const emit = defineEmits(
  {
    change: () => true,
  },
);

// Event handlers
function onChange(): void {
  emit('change');
}

// Life cycle hooks
</script>

<template>
  <StepEditBase :step-settings="props.stepSettings"
                :workflow-settings="props.workflowSettings"
                @change="onChange">
    <!--Delay-->
    <FieldGridComponent :title="$t('delay')+', ms'"
                        :required="true"
                        label-for="fld-delay">
      <InputText id="fld-delay"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="stepSettings.delay"
                 @change="onChange"></InputText>
    </FieldGridComponent>
  </StepEditBase>
</template>

<style scoped>

</style>
