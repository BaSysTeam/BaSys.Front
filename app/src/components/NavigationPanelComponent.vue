<script setup lang="ts">
import {
  ref, onBeforeMount, onMounted, defineProps, defineEmits, PropType, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import MegaMenu from 'primevue/megamenu';

// Props
const props = defineProps({ isMinimized: { type: Boolean, default: false } });

// Infrastructure
const { t } = useI18n({ useScope: 'global' });

// Data
const menuItems = ref<any[]>([]);

// Life cycle events
onBeforeMount(() => {
  menuItems.value = [{
    label: t('constructor'),
    icon: 'pi pi-cog',
    url: '/constructor#',
  }];
});

</script>

<template>
<MegaMenu :model="menuItems" orientation="vertical"></MegaMenu>
</template>

<style scoped>

</style>
