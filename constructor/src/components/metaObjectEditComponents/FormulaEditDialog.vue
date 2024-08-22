<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

// @component
const name = 'FormulaEditDialog';

// Props
const props = defineProps({
  expression: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

// Data
const expressionValue = ref('');

// Emit
const emit = defineEmits(
  {
    close: () => true,
    save: (value: string) => true,
  },
);

function onCloseClick(): void {
  emit('close');
}

function onSaveClick(): void {
  emit('save', expressionValue.value);
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

// Lifecycle hooks
onBeforeMount(() => {
  expressionValue.value = props.expression;
});

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
  <Textarea v-model="expressionValue"
            rows="10"
            autocomplete="off"
            class="w-full"></Textarea>
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
      @click="onSaveClick"
    />
  </template>
</Dialog>
</template>

<style scoped>

</style>
