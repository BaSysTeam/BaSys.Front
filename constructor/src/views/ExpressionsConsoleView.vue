<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onMounted, computed,
} from 'vue';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Divider from 'primevue/divider';
import ConsoleResultItem from '@/models/consoleResultItem';
import ConsoleResultItemComponent from '@/components/ConsoleResultItemComponent.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { Codemirror } from 'vue-codemirror';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';
import ExpressionEvaluator from '../../../shared/src/evalEngine/expressionEvaluator';

// @component
const name = 'ExpressionsConsoleView';

// Data
const expression = ref('');
const results = ref<ConsoleResultItem>([]);
const isWaiting = ref(false);
const logger = new InMemoryLogger(LogLevels.Trace);
const resultsReverse = computed(() => results.value.slice()
  .reverse());
const actionsButtonItems = ref([]);

const codemirrorExtensions = [jsLang(), githubLight];
const codemirrorEditor: any = ref(null);
const windowHeight = ref(window.innerHeight);
const codemirrorStyle = computed(() => ({
  minHeight: '200px',
  border: '1px solid #ececec',
}));

const consoleWrapperStyle = computed(() => ({
  maxHeight: `${windowHeight.value - 380}px`,
  overflowY: 'auto',
  overflowX: 'hidden',
}));

// Event handlers
async function onExecuteAsyncClick(): Promise<void> {
  const executionStart = performance.now();
  isWaiting.value = true;
  console.log('Execute async click');
  const context = {
    header: {},
    currentRow: {},
    tables: {},
  };
  logger.logDebug('Execute expression');
  const evaluator = new ExpressionEvaluator(context, logger);
  console.log('Expression to evaluate', expression.value);
  results.value.forEach((item: ConsoleResultItem) => { item.isOpen = false; });
  let resultItem: ConsoleResultItem;
  try {
    const result = await evaluator.evaluateAsyncExpression(expression.value);
    console.log('Expression evaluated', result);
    resultItem = new ConsoleResultItem(expression.value, 0, result);
  } catch (e) {
    console.error(`Cannot eval expression: ${expression.value}. Error: ${e}`);
    resultItem = new ConsoleResultItem(expression.value, 0, e);
  }

  const executionEnd = performance.now();
  resultItem.executionMilliseconds = (executionEnd - executionStart);

  results.value.push(resultItem);

  isWaiting.value = false;
}

function onClearResultsClick(): void {
  results.value = [];
}

function onResultItemDeleteClick(item: ConsoleResultItem): void {
  const ind = results.value.indexOf(item);
  if (ind > -1) {
    results.value.splice(ind, 1);
  }
}

onMounted(() => {
  actionsButtonItems.value = [{
    label: 'Clear results',
    icon: 'pi pi-times',
    command: onClearResultsClick,
  }];
});

</script>

<template>
  <div>
    <div class="grid">
      <div class="col-12">
        <ViewTitleComponent :title="$t('expressionsConsole')"
                            :is-modified="false"
                            :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <Button
          :label="$t('execute')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-caret-right"
          class="mr-1"
          @click="onExecuteAsyncClick"
        />
        <SplitButton
          class="ml-1"
          :label="$t('actions')"
          severity="primary"
          size="small"
          outlined
          :model="actionsButtonItems">
        </SplitButton>

      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>

    <div class="grid">
      <div class="col-12">

        <codemirror
          ref="codemirrorEditor"
          v-model="expression"
          placeholder="Code goes here..."
          :style="codemirrorStyle"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="codemirrorExtensions"
        />

        <!--
        <TabView>
          <TabPanel header="Script">

          </TabPanel>
          <TabPanel header="Model">
            <h3>Model</h3>
          </TabPanel>
        </TabView>
        -->

      </div>
    </div>

    <div class="bs-console-results"
         :style="consoleWrapperStyle"
         v-if="results.length">
      <div v-for="item in resultsReverse" :key="item.uid">
        <ConsoleResultItemComponent
          :item="item"
          @delete="onResultItemDeleteClick"></ConsoleResultItemComponent>

      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
