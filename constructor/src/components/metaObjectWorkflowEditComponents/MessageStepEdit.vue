<script setup lang="ts">
import {
  defineProps, defineEmits, PropType,
} from 'vue';
import InputText from 'primevue/inputtext';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import StepEditBase from '@/components/metaObjectWorkflowEditComponents/StepEditBase.vue';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';

// Props
const props = defineProps({
  stepSettings: { type: Object as PropType<any>, required: true },
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
    <!--Message-->
    <FieldGridComponent :title="$t('message')"
                        :required="true"
                        label-for="fld-message">
      <InputText id="fld-message"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="stepSettings.message"
                 @change="onChange"></InputText>
    </FieldGridComponent>
  </StepEditBase>

</template>

<style scoped>

</style>
