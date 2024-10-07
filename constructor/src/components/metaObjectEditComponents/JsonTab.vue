<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onMounted, onBeforeMount, computed,
} from 'vue';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import { EditorView } from '@codemirror/view';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// @component
const name = 'JsonTab';

// Data
const settingsJson = ref('');
const codemirrorExtensions = [jsonLang(),
  githubLight, EditorView.editable.of(false)];
const codemirrorEditor: any = ref(null);
const windowHeight = ref(window.innerHeight);
const codemirrorStyle = computed(() => ({
  height: `${windowHeight.value - 150}px`,
}));

// Methods
function stringifySettings(settings: MetaObjectStorableSettings): string {
  return JSON.stringify(settings, null, 2);
}

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
});

// Watch
watch(() => props.settings, (newVal, oldVal) => {
  // settingsJson.value = stringifySettings(newVal);
  console.log('settings changed', settingsJson.value);
});

// Emits
const emit = defineEmits({ change: (value: string) => true });

function onSettingsInput(): void {
  console.log('Settings input', settingsJson.value);
  emit('change', settingsJson.value);
}

onBeforeMount(() => {
  settingsJson.value = stringifySettings(props.settings);
  console.log('beforeMount', settingsJson.value);
});

</script>

<template>
  <codemirror
    ref="codemirrorEditor"
    v-model="settingsJson"
    placeholder="Code goes here..."
    :style="codemirrorStyle"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="codemirrorExtensions"
    @change="onSettingsInput"
  />
</template>

<style scoped>

</style>
