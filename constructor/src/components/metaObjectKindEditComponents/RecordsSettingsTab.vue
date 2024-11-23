<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import Dropdown from 'primevue/dropdown';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import MetaObjectKindsProvider from '../../dataProviders/metaObjectKindsProvider';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const provider = new MetaObjectKindsProvider();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectKindSettings>,
    required: true,
  },
  windowHeight: {
    type: Number,
    required: true,
  },
});

// Data
const containerStyle = computed(() => ({
  height: `${props.windowHeight - 180}px`,
  overflowY: 'auto',
}));

// Emits
const emit = defineEmits({ change: () => true });

// Methods

// Event handlers
function onChange(): void {
  emit('change');
}

// Life cycle hooks
</script>

<template>
  <div class="grid" :style="containerStyle">
    <div class="col-8">
      <Accordion :multiple="true" :active-index="[0, 1]">
        <AccordionTab :header="$t('source')">
          <div class="grid">
            <div class="col-12" v-if="settings">

              <!--Create records column-->
              <FieldGridComponent :title="$t('columnCreateRecords')"
                                  :required="true"
                                  label-for="fld-data-types">
                <Dropdown id="fld-data-types"
                          size="small"
                          class="w-full"
                          :options="settings.standardColumns"
                          option-label="title"
                          option-value="uid"
                          v-model="settings.recordsSettings.sourceCreateRecordsColumnUid"
                          @change="onChange"></Dropdown>
              </FieldGridComponent>

            </div>
          </div>
        </AccordionTab>
        <AccordionTab :header="$t('destination')">
          <div class="grid">
            <div class="col-12" v-if="settings"></div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  </div>

</template>

<style scoped>

</style>
