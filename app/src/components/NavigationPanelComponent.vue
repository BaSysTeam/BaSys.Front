<script setup lang="ts">
import {
  ref, onBeforeMount, onMounted, defineProps, defineEmits, PropType, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import MegaMenu from 'primevue/megamenu';
import MenusProvider from '@/dataProviders/menusProvider';

// Props
const props = defineProps({ isMinimized: { type: Boolean, default: false } });

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const provider = new MenusProvider();

// Data
const navMenuItems = ref<any[]>([]);
const isUserAdmin = ref<boolean>(true);

// Methods
function addStandardItemsToMenu(): void {
  navMenuItems.value.push({ separator: true, visible: true });
  navMenuItems.value.push({
    label: t('constructor'),
    icon: 'pi pi-wrench',
    url: '/constructor#',
  });

  if (isUserAdmin.value) {
    navMenuItems.value.push({
      label: t('manage'),
      icon: 'pi pi-users',
      url: '/admin#',
    });
  }
}

async function updateAsync(): Promise<void> {
  const response = await provider.getCollectionAsync();

  if (response.isOK) {
    navMenuItems.value = [];
    navMenuItems.value = response.data;
    addStandardItemsToMenu();
  } else {
    console.error(response.presentation);
  }
}

// Life cycle events
onBeforeMount(() => {
  addStandardItemsToMenu();
});

onMounted(async () => {
  await updateAsync();
});

</script>

<template>
<MegaMenu :model="navMenuItems" orientation="vertical"></MegaMenu>
</template>

<style scoped>

</style>
