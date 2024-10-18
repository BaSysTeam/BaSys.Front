<script setup lang="ts">
import { defineProps } from 'vue';

// Props
const props = defineProps({
  title: { type: String, required: true },
  labelFor: { type: String, required: true },
  required: { type: Boolean, default: false },
});
</script>

<template>

  <div class="field grid">
    <label :for="labelFor"
           :class="{'bs-required': required}"
           class="col-4 bs-label">{{title}}</label>
    <div class="col-8">
      <slot></slot>
    </div>
  </div>

</template>

<style scoped>

</style>
