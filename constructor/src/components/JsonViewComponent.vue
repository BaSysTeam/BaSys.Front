<script setup lang="ts">
import {
  ref, onMounted, defineProps, watch, computed,
} from 'vue';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import { EditorView } from '@codemirror/view';

// Props
const props = defineProps({ json: { type: String, required: true } });

const json = ref('');

watch(() => props.json, (newVal) => {
  json.value = newVal;
  console.log('json update', json.value);
});

// Data
const codemirrorExtensions = [jsonLang(),
  githubLight, EditorView.editable.of(false)];
const codemirrorEditor: any = ref(null);
const windowHeight = ref(window.innerHeight);
const codemirrorStyle = computed(() => ({
  height: `${windowHeight.value - 150}px`,
}));

// Life cycle hooks
onMounted(() => {
  json.value = props.json;
  console.log('json update', json.value);
});

</script>

<template>
  <codemirror
    ref="codemirrorEditor"
    v-model="json"
    placeholder="Code goes here..."
    :style="codemirrorStyle"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="codemirrorExtensions"
  />
</template>

<style scoped>

</style>
