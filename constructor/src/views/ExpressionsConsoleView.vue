<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount, computed,
} from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
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
  minHeight: '200px',
  border: '1px solid #ececec',
}));
const dataTableStyle = computed(() => ({
  minWidth: '50rem',
  maxHeight: '200px',
  marginBottom: '3px',
}));
const consoleWrapperStyle = computed(() => ({
  maxHeight: `${windowHeight.value - 350}px`,
  overflowY: 'auto',
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

function onResultItemDeleteClick(item: ConsoleResultItem): void {
  const ind = results.value.indexOf(item);
  if (ind > -1) {
    results.value.splice(ind, 1);
  }
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
      </div>
    </div>

    <div class="grid">
      <div class="col-12">
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
              <div class="bs-console-results" :style="consoleWrapperStyle">
                <Card v-for="item in resultsReverse" :key="item.uid">
                  <template #header>
                    <Button icon="pi pi-times"
                            class="mr-1"
                            severity="danger"
                            size="small"
                            text
                            @click="onResultItemDeleteClick(item)"></Button>
                    <span style="font-size: 0.8rem">{{item.expression}}</span>
                  </template>
                  <template #content>
                    <div v-if="item.isTable">
                      <DataTable :value="item.table._rows"
                                 size="small"
                                 show-gridlines
                                 scrollable
                                 scroll-height="150px"
                                 :tableStyle="dataTableStyle">
                        <Column v-for="column of item.table._columns"
                                :key="column.name"
                                :field="column.name"
                                :header="column.name"></Column>
                      </DataTable>
                    </div>
                    <div v-else>
                      {{ item.resultDisplay }}
                    </div>
                  </template>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.bs-console-results .p-card-header{
  line-height: 30px;
  background: #ececec;
}
</style>
