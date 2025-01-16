<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeMount,
  defineProps,
  defineEmits,
  watch,
  computed,
  PropType,
  onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Listbox from 'primevue/listbox';
import SplitButton from 'primevue/splitbutton';
import Badge from 'primevue/badge';
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
const selectedItem:any = ref(null);
const windowHeight = ref(window.innerHeight);
const addCommandItems = ref<any[]>([]);

function listStyle(): any {
  return {
    height: `${windowHeight.value - 200}px`,
  };
}

// Emits
const emit = defineEmits({ change: () => true });

// Methods

// Event handlers
function onAddClick(kind: string): void {
  console.log(`Add click: ${kind}`);
  props.settings.newStep(kind);
  emit('change');
}

function onCopyClick(): void {
  console.log('Copy click');
}

function onDeleteClick(): void {
  console.log('Delete click');
}

function onUpClick(): void {
  console.log('Up click');
}

function onDownClick(): void {
  console.log('Down click');
}

function onChange(): void {
  emit('change');
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

// Life cycle hooks
onBeforeMount(() => {
  addCommandItems.value = [
    {
      label: t('sleepStep'),
      command: () => onAddClick('sleep'),
    },
    {
      label: t('messageStep'),
      command: () => onAddClick('message'),
    },

  ];
});

onMounted(() => {
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
<div class="grid">
  <div class="col-6">
    <!--Steps command panel-->
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <SplitButton
          v-tooltip.top="$t('add')"
          icon = "pi pi-plus"
          severity="primary"
          size="small"
          class="ml-1"
          outlined
          :model="addCommandItems"
        />
        <Button icon="pi pi-copy"
                v-tooltip.top="$t('copy')"
                severity="primary"
                size="small"
                text
                @click="onCopyClick" />
        <Button icon="pi pi-times"
                v-tooltip.top="$t('delete')"
                severity="danger"
                size="small"
                text
                @click="onDeleteClick" />
        <Button class="ml-2"
                v-tooltip.top="$t('up')"
                icon="pi pi-arrow-up"
                severity="primary"
                size="small"
                text
                @click="onUpClick" />
        <Button icon="pi pi-arrow-down"
                v-tooltip.top="$t('down')"
                severity="primary"
                size="small"
                text
                @click="onDownClick" />
      </template>
    </Toolbar>

    <!--steps list-->
    <Listbox v-if="settings"
             v-model="selectedItem"
             :options="settings.steps"
             :list-style="listStyle()"
             option-label="title">
      <template #option="{option, index}">
        <div>
          <Badge :value="index+1" severity="info"></Badge>
          <span class="ml-2">{{option.title}}</span>
          <span class="pi pi-check ml-2" style="float:right" v-if="option.isActive"></span>
        </div>
      </template>
    </Listbox>
  </div>
</div>
</template>

<style scoped>

</style>
