<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import ConfirmDialog from 'primevue/confirmdialog';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import DataTypeProvider from '@/dataProviders/dataTypeProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Props
const props = defineProps({
  name: { type: String, required: true },
});

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const dataTypesProvider = new DataTypeProvider();

// Data
const kind = 'menu';
const isModified = ref(false);
const isWaiting = ref(true);
const formTitle = computed(() => 'Menu');
const actionItems = ref<any[]>([]);
const navMenuItems = ref<any[]>([]);

// Methods
function isCopy(): boolean {
  return router.currentRoute.value.name === 'meta-objects-copy';
}

function isNew(): boolean {
  return router.currentRoute.value.name === 'meta-objects-add';
}

// Event handlers
function onReturnClick(): void {
  console.log('Return clicked');
  router.push({
    name: 'meta-objects-list',
    params: { kind },
    query: { current: '' },
  });
}

function onSaveClick(): void {
  console.log('Save clicked');
}

function onRunClick(): void {
  console.log('Run clicked');
}

function onUpdateClick(): void {
  console.log('Update clicked');
}

function downloadJson(): void {
  console.log('Download json');
}

// Life cycle hooks
onBeforeMount(() => {
  actionItems.value = [
    {
      label: t('update'),
      icon: 'pi pi-sync',
      command: () => onUpdateClick(),
    },
    {
      label: 'JSON',
      icon: 'pi pi-download',
      command: () => downloadJson(),
    },
  ];
});

</script>

<template>
<div>
  <!--View title-->
  <div class="grid">
    <div class="col">
      <ViewTitleComponent :title="formTitle"
                          :is-modified="isModified"
                          :is-waiting="isWaiting"/>
    </div>
  </div>

  <!--Buttons-->
  <div class="grid">
    <div class="col-12">
      <ButtonGroup>
        <Button
          :label="$t('back')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-arrow-left"
          @click="onReturnClick"
        />
        <Button
          :label="$t('save')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-save"
          @click="onSaveClick"
        />
      </ButtonGroup>
      <Button
        class="ml-1"
        severity="success"
        size="small"
        icon="pi pi-play"
        @click="onRunClick"
      />
      <SplitButton
        :label="$t('actions')"
        severity="primary"
        size="small"
        class="ml-1"
        outlined
        :model="actionItems"
      />
    </div>
  </div>

  <div class="grid">
    <Divider class="m-2" />
  </div>

</div>
</template>

<style scoped>

</style>
