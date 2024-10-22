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
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

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

// Emits
const emit = defineEmits({ change: () => true });

// Event handlers
function onChange(): void {
  emit('change');
}

function onExpressionEditClick(): void {
  isExpressionDialogOpen.value = true;
}

function onExpressionDialogClose(): void {
  isExpressionDialogOpen.value = false;
}

function onExpressionDialogSave(expression: string): void {
  isExpressionDialogOpen.value = false;
  props.command.expression = expression;
  emit('change');
}

</script>

<template>
  <Accordion :multiple="true" :active-index="[0, 1]" v-if="command">
    <AccordionTab :header="$t('command')">
      <div class="grid">
        <div class="col-12">

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
    <AccordionTab :header="$t('expression')">
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
  </Accordion>

  <FormulaEditDialog :title="command.title"
                     :expression="command.expression"
                     v-if="isExpressionDialogOpen"
                     @close="onExpressionDialogClose"
                     @save="onExpressionDialogSave"></FormulaEditDialog>
</template>

<style scoped>

</style>
