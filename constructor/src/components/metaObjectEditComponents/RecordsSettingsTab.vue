<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
});

// Data

// Emits
const emit = defineEmits({ change: () => true });

// Methods

// Event handlers

// Life cycle hooks
</script>

<template>
<div>Record settings</div>
</template>

<style scoped>

</style>
