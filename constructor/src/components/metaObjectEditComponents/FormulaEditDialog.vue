<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount, computed,
} from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { Codemirror } from 'vue-codemirror';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { githubLight } from '@ddietr/codemirror-themes/github-light';

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
const codemirrorExtensions = [jsLang(), githubLight];
const codemirrorEditor: any = ref(null);
const windowHeight = ref(window.innerHeight);
const codemirrorStyle = computed(() => ({
  minHeight: `${windowHeight.value - 500}px`,
  marginTop: '1rem',
  border: '1px solid #ececec',
}));

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

function onEditorInput(): void {
  console.log('editorInput');
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
  <codemirror
    ref="codemirrorEditor"
    v-model="expressionValue"
    placeholder="Code goes here..."
    :style="codemirrorStyle"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="codemirrorExtensions"
    @change="onEditorInput"
  />
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
