<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Textarea from 'primevue/textarea';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';
import ExpressionEvaluator from '../../../shared/src/evalEngine/expressionEvaluator';

// @component
const name = 'ExpressionConsoleView';

// Data
const expression = ref('');
const logger = new InMemoryLogger(LogLevels.Trace);

// Event handlers
async function onExecuteAsyncClick(): Promise<void> {
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
  } catch (e) {
    console.error(`Cannot eval expression: ${expression.value}. Error: ${e}`);
  }
  console.log('Calculations log:');
  logger.messages.forEach((message) => {
    console.log(message.toString());
  });
}

</script>

<template>
<div>
  <div class="grid">
    <div class="col-12">
      <ViewTitleComponent title="Expressions console" :is-modified="false" :is-waiting="false" />
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
    <Divider class="m-2" />
  </div>

  <div class="grid">
    <div class="col-12">
      <Textarea v-model="expression"
                class="w-full"
                rows="10"
                autocomplete="off"></Textarea>

    </div>
  </div>
</div>
</template>

<style scoped>

</style>
