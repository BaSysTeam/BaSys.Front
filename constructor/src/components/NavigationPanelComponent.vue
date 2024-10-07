<script setup lang="ts">
import {
  ref, onBeforeMount, onMounted, defineProps, defineEmits, PropType, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import MetaObjectKindsProvider from '@/dataProviders/metaObjectKindsProvider';
import { useI18n } from 'vue-i18n';

// @component
const name = 'NavigationPanelComponent';
const { t } = useI18n({ useScope: 'global' });

const metadataGroup = ref<any>({ label: t('metadata'), items: [] });
const navMenuItems = ref<any[]>([]);
const router = useRouter();
const provider = new MetaObjectKindsProvider();

// Props
const props = defineProps({ isMinimized: { type: Boolean, default: false } });

function onDataTypesClick(): void {
  router.push({ name: 'datatypes' });
}

function onMetadataKindsClick(): void {
  router.push({ name: 'metadata-kinds' });
}

function onMetadataKindClick(args): void {
  console.log('onMetadataKindClick', args);
  router.push({ name: 'meta-objects-list', params: { kind: args.item.name } });
}

function onConsoleClick(): void {
  router.push({ name: 'console' });
}

onBeforeMount(() => {
  navMenuItems.value.push(metadataGroup.value);

  const systemGroup = {
    label: t('systemMenuGroup'),
    items: [{
      label: t('dataTypes'),
      command: () => onDataTypesClick(),
    }, {
      label: t('metaObjectKinds'),
      command: () => onMetadataKindsClick(),
    }, {
      label: t('console'),
      command: () => onConsoleClick(),
    }],
  };

  navMenuItems.value.push(systemGroup);
});

onMounted(async () => {
  const result = await provider.getSettingsCollection();
  if (result.isOK) {
    result.data.forEach((item: any) => {
      metadataGroup.value.items.push({
        label: item.title,
        icon: item.iconClass,
        name: item.name,
        command: onMetadataKindClick,
      });
    });
  }
});

</script>

<template>
<Menu :model="navMenuItems" v-if="!props.isMinimized"></Menu>
</template>

<style scoped>

</style>
