<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onBeforeMount, computed,
} from 'vue';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Sidebar from 'primevue/sidebar';
import Toolbar from 'primevue/toolbar';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';

// @component
const name = 'LogPanel';

// Props
const props = defineProps({
  logger: {
    type: Object as PropType<InMemoryLogger>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: false,
    default: 'Log',
  },
});

// Data
const isVisible = ref(false);
const messages = computed(() => props.logger.messages);

// Watch
watch(() => props.visible, (visible) => {
  isVisible.value = visible;
});

// Emit
const emit = defineEmits({ hide: () => true });

// Event handlers
function onHide(): void {
  isVisible.value = false;
  emit('hide');
}

function onClearClick(): void {
  props.logger.clear();
}

// Lifecycle hooks
onBeforeMount(() => {
  isVisible.value = props.visible;
});

</script>

<template>
  <Sidebar v-model:visible="isVisible"
           class="w-full md:w-20rem lg:w-30rem"
           :header="title"
           position="right"
           @hide="onHide">
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <Button :label="$t('clear')"
                icon="pi pi-times"
                severity="danger"
                size="small"
                text
                @click="onClearClick"></Button>
      </template>
    </Toolbar>
    <DataView :value="messages">
      <template #empty>
        <div class="grid mt-1">
          <div class="col-12 text-center">
            {{$t('noItemsFound')}}
          </div>
        </div>
      </template>
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
            <div style="border: 1px solid #ececec; font-size: 0.8rem; padding: 0.5rem">
              {{ item.toString() }}</div>
          </div>
        </div>
      </template>
    </DataView>
  </Sidebar>
</template>

<style scoped>

</style>
