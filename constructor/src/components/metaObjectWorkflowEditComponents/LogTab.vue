<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<WorkflowSettings>,
    required: true,
  },
});

// Data

// Methods

// Event handlers

// Life cycle hooks
</script>

<template>
<div>LOG</div>
</template>

<style scoped>

</style>
