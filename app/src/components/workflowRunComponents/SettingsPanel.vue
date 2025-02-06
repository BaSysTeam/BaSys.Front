<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Sidebar from 'primevue/sidebar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ParametersTab from '@/components/workflowRunComponents/ParametersTab.vue';
import WorkflowParameter from '../../../../shared/src/models/workflowModel/workflowParameter';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  parameters: {
    type: Object as PropType<WorkflowParameter>,
    required: true,
  },
});

// Data
const isVisible = ref(false);

// Methods

// Watch
watch(() => props.visible, (visible) => {
  isVisible.value = visible;
});

// Emit
const emit = defineEmits({ hide: () => true });

// Event handlers
function onHide(): void {
  isVisible.value = false;
  emit('hide');
}

// Life cycle hooks
onBeforeMount(() => {
  isVisible.value = props.visible;
});

</script>

<template>
  <Sidebar v-model:visible="isVisible"
           style="width: 50rem;"
           :header="$t('settings')"
           position="right"
           @hide="onHide">
    <TabView>
      <TabPanel :header="$t('parameters')">
        <ParametersTab :parameters="props.parameters"></ParametersTab>
      </TabPanel>
    </TabView>
  </Sidebar>
</template>

<style scoped>

</style>
