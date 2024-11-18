<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, ref, watch, onBeforeMount,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import FormulaEditDialog from '@/components/metaObjectEditComponents/FormulaEditDialog.vue';
import MetaObjectCommand from '../../../../shared/src/models/metaObjectCommand';
import CommandExpressionBuilder from '../../../../shared/src/evalEngine/commandExpressionBuilder';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import { MetaObjectCommandParameterNames as ParamNames } from '../../../../shared/src/models/metaObjectCommandParameterNames';

// Infrastructure
const confirmVue = useConfirm();
const { t } = useI18n({ useScope: 'global' });

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
  command: {
    type: Object as PropType<MetaObjectCommand>,
    required: true,
  },
});

// Data
const isExpressionDialogOpen = ref<boolean>(false);
const commandKinds = ref<any[]>([]);
const dataSource = ref<string>('');
const fillClearFlag = ref(false);
const formulaEditName = ref<string>();
const formulaEditExpression = ref<string>('');
const formulaEditTitle = ref<string>('');

// Emits
const emit = defineEmits({ change: () => true });

// Methods
function init(command: MetaObjectCommand): void {
  switch (command.kind) {
    case 1:
      dataSource.value = command.getParameterValue(ParamNames.DATA_SOURCE);
      fillClearFlag.value = command.getParameterValue(ParamNames.CLEAR) === 'true';
      break;
    case 2:
      dataSource.value = command.getParameterValue(ParamNames.DATA_SOURCE);
      break;
    default:
      break;
  }
}

// Event handlers
watch(
  () => props.command,
  (newValue) => { init(newValue); },
);

function onChange(): void {
  emit('change');
}

function onExpressionEditClick(): void {
  isExpressionDialogOpen.value = true;
  formulaEditExpression.value = props.command.expression;
  formulaEditTitle.value = props.command.title;
  formulaEditName.value = 'expression';
}

function onExpressionDialogClose(): void {
  isExpressionDialogOpen.value = false;
}

function onDataSourceEditClick(): void {
  isExpressionDialogOpen.value = true;
  formulaEditExpression.value = dataSource.value;
  formulaEditTitle.value = t('dataSource');
  formulaEditName.value = 'dataSource';
}

function onConvertToCodeClick(): void {
  const table = props.settings.getTable(props.command.tableUid);
  if (!table) {
    console.error(`ConvertToCode.Cannot find table by uid: ${props.command.tableUid}`);
    return;
  }

  switch (props.command.kind) {
    case 1:
      props.command.kind = 0;
      props.command.expression = CommandExpressionBuilder.BuildFillCommandExpression(
        dataSource.value,
        table.name,
        fillClearFlag.value,
      );
      emit('change');
      break;
    case 2:
      props.command.kind = 0;
      props.command.expression = CommandExpressionBuilder.BuildPickUpCommandExpression(
        dataSource.value,
        table.name,
      );
      emit('change');
      break;
    default:
      break;
  }
}

function onDataSourceChange(): void {
  props.command.setParameterValue(ParamNames.DATA_SOURCE, dataSource.value);
  emit('change');
}

function onExpressionDialogSave(expression: string, fieldName: string): void {
  isExpressionDialogOpen.value = false;

  switch (fieldName) {
    case 'expression':
      props.command.expression = expression;
      break;
    case 'dataSource':
      dataSource.value = expression;
      onDataSourceChange();
      break;
    default:
      break;
  }

  emit('change');
}

function onClearFlagChange(): void {
  props.command.setParameterValue(ParamNames.CLEAR, fillClearFlag.value.toString());
  emit('change');
}

// Life cycle hooks
onBeforeMount(() => {
  commandKinds.value.push({ value: 0, title: t('customCommand') });
  commandKinds.value.push({ value: 1, title: t('fill') });
  commandKinds.value.push({ value: 2, title: t('pickUp') });

  init(props.command);
});

</script>

<template>
  <Accordion :multiple="true" :active-index="[0, 1]" v-if="command">
    <AccordionTab :header="$t('command')">
      <div class="grid">
        <div class="col-12">

          <!-- Kind -->
          <FieldGridComponent :title="$t('kind')"
                              label-for="command-table-kind"
                              :required="true">

            <Dropdown id="command-table-kind"
                      size="small"
                      class="w-full"
                      disabled
                      :options="commandKinds"
                      option-label="title"
                      option-value="value"
                      v-model="command.kind"
                      @change="onChange"></Dropdown>

          </FieldGridComponent>

          <!-- TableUid -->
          <FieldGridComponent :title="$t('for')"
                              label-for="command-table-uid"
                              :required="true">

            <Dropdown id="command-table-uid"
                      size="small"
                      class="w-full"
                      :options="settings.allTables"
                      option-label="title"
                      option-value="uid"
                      v-model="command.tableUid"
                      @change="onChange"></Dropdown>

          </FieldGridComponent>

          <!-- Title -->
          <FieldGridComponent :title="$t('title')"
                              label-for="command-title"
                              :required="true">
            <InputText id="command-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="command.title"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!-- Name -->
          <FieldGridComponent :title="$t('name')"
                              label-for="command-name"
                              :required="true">
            <InputText id="command-name"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="command.name"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!-- Memo -->
          <FieldGridComponent :title="$t('memo')"
                              label-for="command-memo">

              <Textarea id="command-memo"
                        size="small"
                        autocomplete="off"
                        class="w-full"
                        rows="2"
                        v-model="command.memo"
                        @change="onChange"></Textarea>

          </FieldGridComponent>

          <!-- Is active -->
          <FieldGridComponent :title="$t('isActive')"
                              label-for="command-is-active">
            <InputSwitch id="fld-is-active"
                         v-model="settings.isActive"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>

        </div>
      </div>
    </AccordionTab>
    <!-- Expression tab -->
    <AccordionTab :header="$t('expression')" v-if="command.kind == 0">
      <div class="grid">
        <div class="col-12">
          <Button :label="$t('edit')"
                  icon="pi pi-pencil" size="small"
                  outlined
                  @click="onExpressionEditClick"></Button>
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
           <Textarea id="command-expression"
                     size="small"
                     autocomplete="off"
                     class="w-full"
                     rows="5"
                     v-model="command.expression"
                     @change="onChange"></Textarea>
        </div>
      </div>
    </AccordionTab>
    <!-- Data source tab -->
    <AccordionTab :header="$t('dataSource')" v-if="command.kind == 1 || command.kind == 2">
      <div class="grid">
        <div class="col-12">
          <Button :label="$t('edit')"
                  icon="pi pi-pencil" size="small"
                  outlined
                  @click="onDataSourceEditClick"></Button>

          <Button :label="$t('convertToCode')"
                  class="ml-1"
                  icon="pi pi-code" size="small"
                  outlined
                  @click="onConvertToCodeClick"></Button>
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
           <Textarea id="command-expression"
                     size="small"
                     autocomplete="off"
                     class="w-full"
                     rows="5"
                     v-model="dataSource"
                     @change="onDataSourceChange"></Textarea>
        </div>
      </div>
      <div class="grid" v-if="command.kind == 1">
        <div class="col-12">
          <!-- Clear flag -->
          <FieldGridComponent :title="$t('clear')"
                              label-for="command-clear-flag">
            <InputSwitch id="command-clear-flag"
                         v-model="fillClearFlag"
                         @change="onClearFlagChange"></InputSwitch>
          </FieldGridComponent>
        </div>
      </div>
    </AccordionTab>
  </Accordion>

  <FormulaEditDialog :title="formulaEditTitle"
                     :expression="formulaEditExpression"
                     :name="formulaEditName"
                     v-if="isExpressionDialogOpen"
                     @close="onExpressionDialogClose"
                     @save="onExpressionDialogSave"></FormulaEditDialog>
</template>

<style scoped>
.field.grid {
  margin-bottom: 0.5rem;
}
</style>
