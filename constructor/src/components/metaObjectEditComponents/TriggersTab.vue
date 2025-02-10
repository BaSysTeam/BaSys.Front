<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  metaObjectKindUid: { type: String, required: true },
  metaObjectUid: { type: String, required: true },
});

// Data

// Methods

// Event handlers

// Life cycle hooks
</script>

<template>
<div>Triggers</div>
</template>

<style scoped>

</style>
