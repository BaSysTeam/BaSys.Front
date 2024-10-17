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
const navMenuItems = ref<any[]>([]);
const isUserAdmin = ref<boolean>(true);

// Life cycle events
onBeforeMount(() => {
  navMenuItems.value = [{
    label: t('constructor'),
    icon: 'pi pi-wrench',
    url: '/constructor#',
  }];

  if (isUserAdmin.value) {
    navMenuItems.value.push({
      label: t('manage'),
      icon: 'pi pi-users',
      url: '/admin##',
    });
  }
});

</script>

<template>
<MegaMenu :model="navMenuItems" orientation="vertical"></MegaMenu>
</template>

<style scoped>

</style>
