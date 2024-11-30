<script setup lang="ts">
import {
  defineProps, defineEmits,
} from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';

// Props
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

// Data

// Emit
const emit = defineEmits(
  {
    close: (value: string | null) => true,
  },
);

// Methods

// Event handlers
function onCloseClick(): void {
  emit('close', null);
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close', null);
  }
}

function onListItemChange(evt: any): void {
  emit('close', evt.value);
}

// Life cycle hooks
</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    :header="$t('selectObject')"
    :visible="true"
    :draggable="false"
    :style="{width: '20rem'}"
    @update:visible="updateVisible">
    <div>
     <Listbox :options="items"
              option-label="title"
              option-value="uid"
              class="w-full"
              @change="onListItemChange">
       <template #option="{option}">
         <div>
           <span class="ml-2">{{option.title}}</span>
         </div>
       </template>
     </Listbox>
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
    </template>
  </Dialog>
</template>

<style scoped>

</style>
