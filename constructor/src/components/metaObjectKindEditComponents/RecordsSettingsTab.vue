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
import MetaObjectKindStandardColumn from '../../../../shared/src/models/metaObjectKindStandardColumn';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
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
const kindsSource = ref<any[]>([]);
const allSettings = ref<MetaObjectKindSettings[]>([]);
const destinationColumns = ref<MetaObjectKindStandardColumn[]>([]);

// Emits
const emit = defineEmits({ change: () => true });

// Methods
function initDestinationColumns(): void {
  destinationColumns.value = [];

  if (props.settings.recordsSettings.storageMetaObjectKindUid) {
    const kindSettings = allSettings.value.find(
      (x) => x.uid === props.settings.recordsSettings.storageMetaObjectKindUid,
    );
    if (kindSettings) {
      destinationColumns.value = kindSettings.standardColumns;
    }
  }
}

async function initAsync(): Promise<void> {
  const response = await provider.getSettingsCollection();

  if (response.isOK) {
    kindsSource.value = [];
    allSettings.value = [];
    response.data.forEach((item: MetaObjectKindSettings) => {
      allSettings.value.push(new MetaObjectKindSettings(item));
      if (item.uid !== props.settings.uid && !item.isStandard) {
        kindsSource.value.push({ uid: item.uid, title: item.title });
      }
    });

    initDestinationColumns();
  } else {
    console.error(response.presentation);
  }
}

// Event handlers
function onChange(): void {
  emit('change');
}

function onStorageChange(): void {
  initDestinationColumns();

  emit('change');
}

// Life cycle hooks
onBeforeMount(async () => {
  await initAsync();
});

</script>

<template>
  <div class="grid" :style="containerStyle">
    <div class="col-8">
      <Accordion :multiple="true" :active-index="[0, 1]">
        <AccordionTab :header="$t('source')">
          <div class="grid">
            <div class="col-12" v-if="settings">

              <!--Source.createRecords-->
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
            <div class="col-12" v-if="settings">

              <!--Meta object kind -->
              <FieldGridComponent :title="$t('metaObjectKind')"
                                  :required="true"
                                  label-for="fld-meta-object-kind">
                <Dropdown id="fld-meta-object-kind"
                          size="small"
                          class="w-full"
                          :options="kindsSource"
                          option-label="title"
                          option-value="uid"
                          v-model="settings.recordsSettings.storageMetaObjectKindUid"
                          @change="onStorageChange"></Dropdown>
              </FieldGridComponent>

              <!--Destination.period -->
              <FieldGridComponent :title="$t('columnPeriod')"
                                  :required="true"
                                  label-for="fld-column-period">
                <Dropdown id="fld-column-period"
                          size="small"
                          class="w-full"
                          :options="destinationColumns"
                          option-label="title"
                          option-value="uid"
                          v-model="settings.recordsSettings.storagePeriodColumnUid"
                          @change="onChange"></Dropdown>
              </FieldGridComponent>

              <!--Destination.kind -->
              <FieldGridComponent :title="$t('columnMetaObjectKind')"
                                  :required="true"
                                  label-for="fld-column-kind">
                <Dropdown id="fld-column-kind"
                          size="small"
                          class="w-full"
                          :options="destinationColumns"
                          option-label="title"
                          option-value="uid"
                          v-model="settings.recordsSettings.storageKindColumnUid"
                          @change="onChange"></Dropdown>
              </FieldGridComponent>

              <!--Destination.object -->
              <FieldGridComponent :title="$t('columnObjectId')"
                                  :required="true"
                                  label-for="fld-column-object">
                <Dropdown id="fld-column-object"
                          size="small"
                          class="w-full"
                          :options="destinationColumns"
                          option-label="title"
                          option-value="uid"
                          v-model="settings.recordsSettings.storageObjectColumnUid"
                          @change="onChange"></Dropdown>
              </FieldGridComponent>

              <!--Destination.row -->
              <FieldGridComponent :title="$t('columnRow')"
                                  :required="true"
                                  label-for="fld-column-row">
                <Dropdown id="fld-column-row"
                          size="small"
                          class="w-full"
                          :options="destinationColumns"
                          option-label="title"
                          option-value="uid"
                          v-model="settings.recordsSettings.storageRowColumnUid"
                          @change="onChange"></Dropdown>
              </FieldGridComponent>

            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  </div>

</template>

<style scoped>

</style>
