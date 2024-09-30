<script setup lang="ts">
import {
  ref, onBeforeMount, defineProps, defineEmits, PropType, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';

// @component
const name = 'NavigationPanelComponent';

const navMenuItems = ref<any[]>([]);
const router = useRouter();

function onDataTypesClick(): void {
  router.push({ name: 'datatypes' });
}

function onMetadataKindsClick(): void {
  router.push({ name: 'metadata-kinds' });
}

function onConsoleClick(): void {
  router.push({ name: 'console' });
}

onBeforeMount(() => {
  const metadataGroup = {
    label: 'Metadata',
    icon: 'pi pi-folder',
    items: [],
  };

  navMenuItems.value.push(metadataGroup);
  const systemGroup = {
    label: 'System',
    icon: 'pi pi-cog',
    items: [{
      label: 'Data types',
      command: () => onDataTypesClick(),
    }, {
      label: 'Metadata kinds',
      command: () => onMetadataKindsClick(),
    }, {
      label: 'Console',
      command: () => onConsoleClick(),
    }],
  };

  navMenuItems.value.push(systemGroup);
});

</script>

<template>
<Menu :model="navMenuItems"></Menu>
</template>

<style scoped>

</style>
