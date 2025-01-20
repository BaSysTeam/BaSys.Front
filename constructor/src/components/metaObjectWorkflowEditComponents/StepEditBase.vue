<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, computed,
} from 'vue';
import InputText from 'primevue/inputtext';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import NameHelper from '../../../../shared/src/helpers/nameHelper';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';

// Props
const props = defineProps({
  stepSettings: { type: Object as PropType<any>, required: true },
  workflowSettings: { type: Object as PropType<WorkflowSettings>, required: true },
});

// Data
const otherSteps = computed(() => props.workflowSettings.steps.filter(
  (step) => step.uid !== props.stepSettings.uid,
));

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

function onTitleChange(): void {
  if (!props.stepSettings.name) {
    props.stepSettings.name = NameHelper.prepareName(props.stepSettings.title, true, 0);
  }

  emit('change');
}

</script>

<template>
  <div class="grid">
    <div class="col-12">

      <!-- Previous step -->
      <FieldGridComponent :title="$t('previousStep')"
                          label-for="fld-previous-step">

        <Dropdown id="fld-previous-step"
                  size="small"
                  class="w-full"
                  :options="otherSteps"
                  option-label="title"
                  option-value="uid"
                  :show-clear="true"
                  v-model="stepSettings.previousStepUid"
                  @change="onChange"></Dropdown>

      </FieldGridComponent>

      <!--Title-->
      <FieldGridComponent :title="$t('title')"
                          :required="true"
                          label-for="fld-title">
        <InputText id="fld-title"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="stepSettings.title"
                   @change="onTitleChange"></InputText>
      </FieldGridComponent>

      <!--Name-->
      <FieldGridComponent :title="$t('name')"
                          :required="true"
                          label-for="fld-name">
        <InputText id="fld-name"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="stepSettings.name"
                   @change="onChange"></InputText>
      </FieldGridComponent>

      <!--Custom fields-->
      <slot></slot>

      <!--Memo-->
      <FieldGridComponent :title="$t('memo')"
                          label-for="fld-memo">
      <Textarea id="fld-memo"
                size="small"
                autocomplete="off"
                class="w-full"
                rows="5"
                v-model="stepSettings.memo"
                @change="onChange"></Textarea>
      </FieldGridComponent>

      <!--Is active-->
      <FieldGridComponent :title="$t('isActive')"
                          label-for="fld-is-active">
        <InputSwitch id="fld-is-active"
                     v-model="stepSettings.isActive"
                     @change="onChange"></InputSwitch>
      </FieldGridComponent>

    </div>
  </div>
</template>

<style scoped>

</style>
