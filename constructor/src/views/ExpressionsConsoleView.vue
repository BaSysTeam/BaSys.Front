<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount, computed,
} from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import ConsoleResultItem from '@/models/consoleResultItem';
import { Codemirror } from 'vue-codemirror';
import { javascript as jsLang } from '@codemirror/lang-javascript';
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

const codemirrorExtensions = [jsLang(), githubLight];
const codemirrorEditor: any = ref(null);
const windowHeight = ref(window.innerHeight);
const codemirrorStyle = computed(() => ({
  minHeight: `${windowHeight.value - 150}px`,
  border: '1px solid #ececec',
}));
const splitterStyle = computed(() => ({
  minHeight: `${windowHeight.value - 150}px`,
  border: 'none',
  padding: '0',
}));

// Event handlers
async function onExecuteAsyncClick(): Promise<void> {
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
  try {
    const result = await evaluator.evaluateAsyncExpression(expression.value);
    console.log('Expression evaluated', result);
    const resultItem = new ConsoleResultItem(expression.value, 0, result);
    results.value.push(resultItem);
  } catch (e) {
    console.error(`Cannot eval expression: ${expression.value}. Error: ${e}`);
    const resultItem = new ConsoleResultItem(expression.value, 0, e);
    results.value.push(resultItem);
  }
  console.log('Calculations log:');
  logger.messages.forEach((message) => {
    console.log(message.toString());
  });

  isWaiting.value = false;
}

function onClearResultsClick(): void {
  results.value = [];
}

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

      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>

    <Splitter :style="splitterStyle">
      <SplitterPanel :size="30" :min-size="10">
        <codemirror
          ref="codemirrorEditor"
          v-model="expression"
          placeholder="Code goes here..."
          :style="codemirrorStyle"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="codemirrorExtensions"
        />
      </SplitterPanel>
      <SplitterPanel :size="70">
        <div v-if="results.length">
          <div class="grid">
            <div class="col-12">
              <Button
                :label="$t('clearAll')"
                severity="danger"
                size="small"
                text
                icon="pi pi-times"
                class="mr-1"
                @click="onClearResultsClick"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col-12">
              <div style="border: 1px solid #ececec">
                <Accordion :active-index="0">
                  <AccordionTab v-for="item in resultsReverse"
                                :key="item.uid"
                                :header="item.expression">
                    <div v-if="item.isTable">
                      <DataTable :value="item.table._rows"
                                 size="small"
                                 show-gridlines
                                 scrollable
                                 scroll-height="150px"
                                 tableStyle="min-width: 50rem; max-height: 150px;">
                        <Column v-for="column of item.table._columns"
                                :key="column.name"
                                :field="column.name"
                                :header="column.name"></Column>
                      </DataTable>
                    </div>
                    <div v-else>
                      {{ item.resultDisplay }}
                    </div>
                  </AccordionTab>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </SplitterPanel>
    </Splitter>

  </div>
</template>

<style scoped>

</style>
