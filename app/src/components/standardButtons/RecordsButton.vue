<script setup lang="ts">
import {
  defineProps, defineEmits,
} from 'vue';
import Button from 'primevue/button';

// Props
const props = defineProps({ buttonClass: { type: String, default: 'ml-1', required: false } });

// Emits
const emit = defineEmits({ click: () => true });

// Event handlers
function onClick(): void {
  emit('click');
}
</script>

<template>
  <Button :class="buttonClass"
          v-tooltip="$t('records')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-list"
          @click="onClick"
  />
</template>

<style scoped>

</style>
