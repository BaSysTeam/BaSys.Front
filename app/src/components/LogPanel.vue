<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onBeforeMount, computed,
} from 'vue';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import Sidebar from 'primevue/sidebar';
import Toolbar from 'primevue/toolbar';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

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
const logLevel = ref(LogLevels.Erorr);
const logLevelItems = ref([
  { value: LogLevels.Trace, text: 'Trace' },
  { value: LogLevels.Debug, text: 'Debug' },
  { value: LogLevels.Information, text: 'Information' },
  { value: LogLevels.Warning, text: 'Warning' },
  { value: LogLevels.Error, text: 'Error' },
  { value: LogLevels.Critical, text: 'Critical' },
]);

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

function onLogLevelChanged(): void {
  props.logger.setLevel(logLevel.value);
  console.log('Current log level', props.logger.minimumLevel);
}

// Lifecycle hooks
onBeforeMount(() => {
  isVisible.value = props.visible;
  logLevel.value = props.logger.minimumLevel;
});

</script>

<template>
  <Sidebar v-model:visible="isVisible"
           class="w-full md:w-20rem lg:w-30rem"
           :header="title"
           position="right"
           @hide="onHide">
    <template #header>
      <div class="grid w-full" style="margin: 0 1rem 0 0">
        <div class="col-12 p-0 pl-1">

          <div class="grid">
            <div class="col-12 p-0">
              <h3>{{title}}</h3>
            </div>
          </div>

          <div class="grid">
            <div class="col-12 p-0">
              <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem; font-size:0.8rem;">
                <template #start>
                  <Button :label="$t('clear')"
                          icon="pi pi-times"
                          severity="danger"
                          size="small"
                          text
                          @click="onClearClick"></Button>
                </template>
                <template #end>
                  <label for="fld-log-level">{{$t('logLevel')}}</label>
                  <Dropdown id="fld-log-level"
                            class="ml-1"
                            :options="logLevelItems"
                            option-value="value"
                            option-label="text"
                            v-model="logLevel"
                            size="small"
                            @update:model-value="onLogLevelChanged"></Dropdown>
                </template>
              </Toolbar>
            </div>
          </div>
        </div>
      </div>

    </template>
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
              <span class="pi pi-exclamation-circle text-red-600"
                    v-if="item.level == 4 || item.level == 5"></span>
              <span class="pi pi-info-circle text-primary" v-else></span>
              <span class="ml-1">{{ item.toString() }}</span>
              </div>
          </div>
        </div>
      </template>
    </DataView>
  </Sidebar>
</template>

<style scoped>

</style>
