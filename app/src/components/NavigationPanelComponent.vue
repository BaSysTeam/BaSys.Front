<script setup lang="ts">
import {
  ref, onBeforeMount, onMounted, defineProps, defineEmits, PropType, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import MenusProvider from '@/dataProviders/menusProvider';

// Props
const props = defineProps({ isMinimized: { type: Boolean, default: false } });

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const provider = new MenusProvider();

// Data
const megaMenuItems = ref<any[]>([]);
const menuItems = ref<any[]>([]);
const isUserAdmin = ref<boolean>(true);
const isUserDesigner = ref<boolean>(true);

// Methods
function addStandardItemsToMenu(): void {
  if (isUserDesigner.value) {
    menuItems.value.push({
      label: t('constructor'),
      icon: 'pi pi-wrench',
      url: '/constructor#',
    });
  }

  if (isUserAdmin.value) {
    menuItems.value.push({
      label: t('manage'),
      icon: 'pi pi-users',
      url: '/admin#',
    });
  }
}

async function updateAsync(): Promise<void> {
  const response = await provider.getCollectionAsync();

  if (response.isOK) {
    megaMenuItems.value = [];
    megaMenuItems.value = response.data;
    // addStandardItemsToMenu();
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
  <MegaMenu :model="megaMenuItems" orientation="vertical"></MegaMenu>
  <Menu :model="menuItems"></Menu>
</template>

<style scoped>

</style>
