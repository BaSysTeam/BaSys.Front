<script setup lang="ts">
import {
  ref, onMounted, onBeforeUnmount, computed,
  defineProps, defineEmits, watch, PropType,
} from 'vue';
import { useToast } from 'primevue/usetoast';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Toolbar from 'primevue/toolbar';
import DataObjectViewModel from '@/models/dataObjectViewModel';
import DataObjectHeaderFieldEditComponent
  from '@/components/DataObjectHeaderFieldEditComponent.vue';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import ObjectEvaluator from '../evalEngine/objectEvaluator';
import CommandProcessor from '../../../shared/src/evalEngine/commandProcessor';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import MetaObjectCommand from '../../../shared/src/models/metaObjectCommand';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
let objectEvaluator: ObjectEvaluator;
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({
  model: { type: Object as PropType<DataObjectViewModel>, required: true },
  logger: { type: Object as PropType<InMemoryLogger>, required: true },
  isPrimaryKeyEnabled: { type: Boolean, default: false },
  renderPlace: { type: String, default: 'page' },
});

// Data
const searchString = ref<string>('');
const sortKind = ref<number>(1);
const windowHeight = ref<number>(window.innerHeight);
const headerCommands = ref<any[]>([]);
const headerCommandsExists = computed(() => headerCommands.value.length > 0);

// Emit
const emit = defineEmits<{(event: 'isModifiedChanged', newValue: boolean): void;
  (event: 'isWaitingChanged', newValue: boolean): void;
  (event: 'saveTrigger'): void;
  (event: 'refreshTrigger'): void;
  (event: 'closeTrigger'): void;
}>();

// Methods
function fieldsContainerStyle(): any {
  if (props.renderPlace === 'page') {
    return {
      height: `${windowHeight.value - 200}px`,
      fontSize: '14px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
    };
  }

  return { width: '100%' };
}

function headerColumnsFiltered(): MetaObjectColumnViewModel[] {
  let result: MetaObjectColumnViewModel[];

  // Filter columns by name.
  if (!searchString.value) {
    result = props.model.headerColumns;
  } else {
    result = props.model.headerColumns.filter(
      (x) => x.title.toLowerCase()
        .includes(searchString.value.toLowerCase()),
    );
  }

  // Sort columns.
  switch (sortKind.value) {
    case 1:
      // Initial sort.
      return result;
    case 2:
      // Reverse.
      return result.slice()
        .reverse();
    case 3:
      // Sort by title.
      return result.slice()
        .sort((a, b) => a.title.localeCompare(b.title));
    case 4:
      // Sort by title DESC.
      return result.slice()
        .sort((a, b) => b.title.localeCompare(a.title));
    default:
      return result;
  }
}

async function recalculate(): Promise<void> {
  await objectEvaluator.onObjectRecalculateAsync();
}

function isModifiedChanged(newValue: boolean): void {
  emit('isModifiedChanged', newValue);
}

function isWaitingChanged(newValue: boolean): void {
  emit('isWaitingChanged', newValue);
}

function saveTrigger(): void {
  emit('saveTrigger');
}

function refreshTrigger(): void {
  emit('refreshTrigger');
}

function closeTrigger(): void {
  emit('closeTrigger');
}

async function executeCommandAsync(command: MetaObjectCommand): Promise<void> {
  console.log(`Executed ${command.title}`);
  const additionalFunctions = {
    isModified: isModifiedChanged,
    isWaiting: isWaitingChanged,
    recalculate,
    save: saveTrigger,
    refresh: refreshTrigger,
    close: closeTrigger,
  };

  const commandProcessor = new CommandProcessor(
    props.model.item,
    additionalFunctions,
    props.logger,
  );
  await commandProcessor.executeAsync(command.expression);

  if (commandProcessor.error) {
    const message = `Command "${command.title}" error: ${commandProcessor.error}`;
    toastHelper.error(message);
  }
}

// Event handlers
watch(
  () => props.model,
  (newValue) => {
    objectEvaluator = new ObjectEvaluator(
      props.logger,
      newValue.metaObjectSettings,
      newValue.item,
    );

    headerCommands.value = [];
    newValue.metaObjectSettings.commands.forEach((command) => {
      if (command.isActive && command.tableUid === newValue.metaObjectSettings.header.uid) {
        headerCommands.value.push({
          label: command.title,
          command: () => executeCommandAsync(command),
        });
      }
    });
  },
  { immediate: true },
);

async function onHeaderFieldChange(columnName: string): Promise<void> {
  await objectEvaluator.onHeaderFieldChangedAsync(columnName);
  isModifiedChanged(true);
}

function onFieldsSortChangeClick(args: number): void {
  sortKind.value = args;
}

function onClearSearchClick(): void {
  searchString.value = '';
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

// Life cycle hooks
onMounted(() => {
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
  <div class="grid">
    <div :class="{'col-6': renderPlace == 'page', 'col-12': renderPlace == 'dialog'}">
      <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
        <template #start>
          <a href="#"
             class="mr-2 ml-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(1)">
                      <span class="pi pi-sort-numeric-down"
                            :class="{'text-primary': sortKind == 1}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(2)">
                      <span class="pi pi-sort-numeric-up"
                            :class="{'text-primary': sortKind == 2}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(3)">
                      <span class="pi pi-sort-alpha-down"
                            :class="{'text-primary': sortKind == 3}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(4)">
                      <span class="pi pi-sort-alpha-up"
                            :class="{'text-primary': sortKind == 4}"></span>
          </a>

          <SplitButton v-if="headerCommandsExists"
            :label="$t('actions')"
            severity="primary"
            size="small"
            class="ml-1"
            outlined
            :model="headerCommands"
          />

        </template>

        <template #end>
          <InputGroup>
            <InputText v-model="searchString"
                       :placeholder="$t('search')"
                       size="small"/>
            <Button icon="pi pi-times"
                    severity="secondary"
                    @click="onClearSearchClick"
                    outlined></Button>
          </InputGroup>

        </template>
      </Toolbar>
    </div>
  </div>

  <div class="grid" :style="fieldsContainerStyle()">
    <div :class="{'col-6': renderPlace == 'page', 'col-12': renderPlace == 'dialog'}">
      <div class="field grid" v-for="column in headerColumnsFiltered()"
           :key="column.uid">

        <DataObjectHeaderFieldEditComponent :key="column.uid"
                                            :column="column"
                                            :is-primary-key-enabled="isPrimaryKeyEnabled"
                                            :item="model.item"
                                            @change="onHeaderFieldChange">
        </DataObjectHeaderFieldEditComponent>

      </div>
    </div>

  </div>
</template>

<style scoped>
.field.grid {
  margin-bottom: 0.5rem;
}
</style>
