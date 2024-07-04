<script setup lang="ts">
import {
  defineProps, defineEmits, ref, watch, onMounted,
} from 'vue';
import InputText from 'primevue/inputtext';

// @component
const name = 'PrimaryKeyInput';

// Props
const props = defineProps({
  modelValue: { type: String, required: true },
  id: { type: String, required: true },
  isDisabled: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits({
  'update:modelValue': (value: string) => true,
  change: () => true,
});

// Data
const inputValue = ref(props.modelValue);

// Watch
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
  console.log('PK input value updated', inputValue.value);
});

// Event handlers
function onChange(): void {
  emit('update:modelValue', inputValue.value);
  emit('change');
}

// Life cycle hooks
onMounted(() => {
  console.log('OnMounted');
  inputValue.value = props.modelValue;
  console.log('PK input', props.modelValue);
});
</script>

<template>
  <InputText :id="id"
             :disabled="isDisabled"
             v-model="inputValue"
             autocomplete="off"
             size="small"
             class="w-full"
             @change="onChange"></InputText>
</template>

<style scoped>

</style>
