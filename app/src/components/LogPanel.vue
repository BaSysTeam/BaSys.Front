<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onBeforeMount,
} from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import SelectButton from 'primevue/selectbutton';
import Sidebar from 'primevue/sidebar';
import Toolbar from 'primevue/toolbar';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });

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
const logLevel = ref(LogLevels.Error);
const logLevelItems = ref([
  { value: LogLevels.Error, text: t('errors') },
  { value: LogLevels.Trace, text: t('all') },
]);
const dataViewKey = ref(1);

// Watch
watch(() => props.visible, (visible) => {
  isVisible.value = visible;
});

// Emit
const emit = defineEmits({ hide: () => true });

// Methods
function getMessages(): any[] {
  return props.logger.messages;
}

// Event handlers
function onHide(): void {
  isVisible.value = false;
  emit('hide');
}

function onClearClick(): void {
  props.logger.clear();
  dataViewKey.value += 1;
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

    <DataView :value="getMessages()" :key="dataViewKey">
      <template #empty>
        <div class="grid mt-1">
          <div class="col-12 text-center">
            {{$t('noItemsFound')}}
          </div>
        </div>
      </template>
      <template #header>
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
                <label for="fld-log-level" class="mr-1">{{$t('logLevel')}}</label>
                <SelectButton v-model="logLevel"
                              :options="logLevelItems"
                              option-label="text"
                              option-value="value"
                              @change="onLogLevelChanged"></SelectButton>
              </template>
            </Toolbar>
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
