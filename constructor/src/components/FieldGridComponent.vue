<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import Button from 'primevue/button';

// Props
const props = defineProps({
  title: { type: String, required: true },
  labelFor: { type: String, required: true },
  required: { type: Boolean, default: false },
  isHelp: { type: Boolean, default: false },
  helpKey: { type: String, required: false },
});

// Emit
const emit = defineEmits({
  helpClick: (evt: any, key: string | undefined) => true,
});

// Event handlers
function onHelpClick(evt: any): void {
  emit('helpClick', evt, props.helpKey);
}

</script>

<template>

  <div class="field grid">
    <label :for="labelFor"
           :class="{'bs-required': required}"
           class="col-4 bs-label">{{title}}</label>
    <div class="col">
      <slot></slot>
    </div>
    <div class="col-fixed" v-if="isHelp">
      <Button size="small"
              style="width:5px;"
              icon="pi pi-question"
              severity="info"
              text
              @click="onHelpClick"></Button>
    </div>

  </div>

</template>

<style scoped>

</style>
