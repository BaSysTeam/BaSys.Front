<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const modelJson = ref('');
const results = ref<ConsoleResultItem>([]);
const isWaiting = ref(false);
const logger = new InMemoryLogger(LogLevels.Trace);
const resultsReverse = computed(() => results.value.slice()
  .reverse());
const actionsButtonItems = ref([]);

const codemirrorJsonExtensions = [jsonLang(), githubLight];
const codemirrorJsonEditor: any = ref(null);
const codemirrorJavaScriptExtensions = [jsLang(), githubLight];
const codemirrorJavaScriptEditor: any = ref(null);
const windowHeight = ref(window.innerHeight);
const codemirrorEditorStyle = computed(() => ({
  minHeight: '180px',
  maxHeight: '180px',
  height: '180px',
  border: '1px solid #ececec',
  fontSize: '0.8rem',
}));

const consoleResultsWrapperStyle = computed(() => ({
  maxHeight: `${windowHeight.value - 400}px`,
  overflowY: 'auto',
  overflowX: 'hidden',
}));

// Methods
function defaultModel(): any {
  return {
    header: {},
    currentRow: {},
    tables: {},
  };
}

// Event handlers
async function onExecuteAsyncClick(): Promise<void> {
  const executionStart = performance.now();
  isWaiting.value = true;
  let model: any;

  if (modelJson.value) {
    try {
      model = JSON.parse(modelJson.value);
    } catch (e) {
      console.error(`Cannot parse model. ${e}`);
      model = defaultModel();
    }
  } else {
    model = defaultModel();
  }

  logger.logDebug('Execute expression');
  const evaluator = new ExpressionEvaluator(model, logger);
  console.log('Expression to evaluate', expression.value);
  results.value.forEach((item: ConsoleResultItem) => { item.isOpen = false; });

  let resultItem: ConsoleResultItem;
  const result = await evaluator.evaluateAsyncExpression(expression.value);

  if (!evaluator.isError) {
    resultItem = new ConsoleResultItem(expression.value, false, result);
    console.log('Expression evaluated', result);
  } else {
    resultItem = new ConsoleResultItem(expression.value, true, evaluator.error.message);
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
  modelJson.value = JSON.stringify(defaultModel(), null, 2);

  actionsButtonItems.value = [{
    label: 'Clear results',
    icon: 'pi pi-times',
    command: onClearResultsClick,
  }];
});

</script>

<template>
  <div class="bs-console-view-component">
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

        <TabView>
          <TabPanel :header="$t('script')">
            <codemirror
              ref="codemirrorJavaScriptEditor"
              v-model="expression"
              placeholder="script..."
              :style="codemirrorEditorStyle"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="codemirrorJavaScriptExtensions"
            />
          </TabPanel>
          <TabPanel :header="$t('model')">
            <codemirror
              ref="codemirrorJsonEditor"
              v-model="modelJson"
              placeholder="model..."
              :style="codemirrorEditorStyle"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="codemirrorJsonExtensions"
            />
          </TabPanel>
        </TabView>

      </div>
    </div>

    <div class="bs-console-results"
         :style="consoleResultsWrapperStyle"
         v-if="results.length">
      <div v-for="item in resultsReverse" :key="item.uid">
        <ConsoleResultItemComponent
          :item="item"
          @delete="onResultItemDeleteClick"></ConsoleResultItemComponent>

      </div>
    </div>

  </div>
</template>

<style>
.bs-console-view-component .p-tabview-header-action{
  padding: 0.5rem
}
</style>
